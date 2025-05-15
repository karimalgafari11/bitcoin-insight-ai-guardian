
/**
 * Market Data Edge Function
 * Fetches cryptocurrency market data from various sources
 */
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createHash, HmacSha256 } from "https://deno.land/std@0.167.0/hash/sha256.ts";
import { encodeToString } from "https://deno.land/std@0.167.0/encoding/hex.ts";

// Load API keys from localStorage when available in client (not available in edge functions)
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
    // Extract URL parameters
    const url = new URL(req.url);
    const symbol = url.searchParams.get('symbol') || 'BTC';
    const currency = url.searchParams.get('currency') || 'USD';

    // Attempt to fetch data from Binance
    try {
      console.log("Attempting to fetch data from Binance");
      
      // Format the symbol for Binance API
      const binanceSymbol = `${symbol}${currency}`;
      
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
        throw new Error(`Binance API error: ${await tickerResponse.text()}`);
      }
      
      const tickerData = await tickerResponse.json();
      
      // Get current price using ticker price endpoint for more accuracy
      const priceResponse = await fetch(
        `https://api.binance.com/api/v3/ticker/price?symbol=${binanceSymbol}`
      );
      
      if (!priceResponse.ok) {
        throw new Error(`Binance price API error: ${await priceResponse.text()}`);
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
        JSON.stringify({ ...marketData, source: "binance" }),
        { headers: { "Content-Type": "application/json" } },
      );
    } catch (binanceError) {
      console.error("Error fetching from Binance:", binanceError);
      // Fall back to mock data
    }
    
    // Use fallback mock data if Binance fails
    return new Response(
      JSON.stringify({
        price: 45000.00,  // Mock data
        volume24h: 24000000000,
        change24h: 1.5,
        marketCap: 850000000000,
        lastUpdate: new Date().toISOString(),
        source: "mock-data"
      }),
      { headers: { "Content-Type": "application/json" } }
    );
    
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message || "حدث خطأ أثناء جلب بيانات السوق" }),
      { headers: { "Content-Type": "application/json" }, status: 500 },
    )
  }
})
