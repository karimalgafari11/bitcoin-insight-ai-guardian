
/**
 * Market Data Edge Function
 * Fetches cryptocurrency market data from various sources
 */
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

// Load API keys from environment
const BINANCE_API_KEY = 'UklcmVRAsY7KBBbp2FfqHVuequcGBOhAKb5tRMxg3vQEPa77QrNX8GvhTnqtIT1x';
const BINANCE_SECRET_KEY = '9GzGJPmfM2fFLh1cpOzUAowcZCn5UpVA1b4wXwoZGdSbDVzNrlMvd4RBjGTXlCVF';

interface MarketDataResponse {
  price: number;
  volume24h: number;
  change24h: number;
  marketCap: number;
  lastUpdate: string;
  error?: string;
}

serve(async (req) => {
  try {
    // Add CORS headers
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    };

    // Handle CORS preflight requests
    if (req.method === 'OPTIONS') {
      return new Response('ok', { headers: corsHeaders });
    }

    // Extract URL parameters
    const url = new URL(req.url);
    const symbol = url.searchParams.get('symbol') || 'BTC';
    const currency = url.searchParams.get('currency') || 'USD';

    // Format the symbol for Binance API
    const binanceSymbol = `${symbol}${currency}`;
    console.log(`Attempting to fetch data from Binance for symbol: ${binanceSymbol}`);
    
    try {
      // Fetch ticker data from Binance
      const tickerResponse = await fetch(
        `https://api.binance.com/api/v3/ticker/24hr?symbol=${binanceSymbol}`,
        {
          headers: {
            'X-MBX-APIKEY': BINANCE_API_KEY
          }
        }
      );
      
      if (!tickerResponse.ok) {
        const errorText = await tickerResponse.text();
        console.error(`Binance API ticker error (${tickerResponse.status}): ${errorText}`);
        throw new Error(`Binance API error: ${errorText}`);
      }
      
      const tickerData = await tickerResponse.json();
      
      // Get current price using ticker price endpoint for more accuracy
      const priceResponse = await fetch(
        `https://api.binance.com/api/v3/ticker/price?symbol=${binanceSymbol}`
      );
      
      if (!priceResponse.ok) {
        const errorText = await priceResponse.text();
        console.error(`Binance price API error (${priceResponse.status}): ${errorText}`);
        throw new Error(`Binance price API error: ${errorText}`);
      }
      
      const priceData = await priceResponse.json();
      
      // Format the response
      const marketData: MarketDataResponse = {
        price: parseFloat(priceData.price),
        volume24h: parseFloat(tickerData.volume),
        change24h: parseFloat(tickerData.priceChangePercent),
        marketCap: parseFloat(tickerData.quoteVolume), // Using quote volume as a proxy
        lastUpdate: new Date().toISOString()
      };
      
      return new Response(
        JSON.stringify({ 
          ...marketData, 
          source: "binance",
          isLive: true
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    } catch (binanceError) {
      console.error("Error fetching from Binance:", binanceError);
      
      // Try to provide more useful error information
      const errorMessage = binanceError instanceof Error 
        ? binanceError.message 
        : "Unknown error fetching market data";
      
      console.error("Detailed error:", errorMessage);
      
      // Fall back to mock data
      return new Response(
        JSON.stringify({
          price: 45000.00,  // Mock data
          volume24h: 24000000000,
          change24h: 1.5,
          marketCap: 850000000000,
          lastUpdate: new Date().toISOString(),
          source: "mock-data",
          isLive: false,
          error: errorMessage
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
  } catch (error) {
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    };
    
    return new Response(
      JSON.stringify({ 
        error: error.message || "حدث خطأ أثناء جلب بيانات السوق",
        source: "error",
        isLive: false
      }),
      { 
        headers: { ...corsHeaders, "Content-Type": "application/json" }, 
        status: 500 
      },
    )
  }
})
