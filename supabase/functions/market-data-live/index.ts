
// Market Data Live Edge Function
// Provides real-time cryptocurrency market data from multiple sources
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

// API Keys for services - using the provided keys
const BINANCE_API_KEY = 'khxTWPTHtCMIa9JLD3PtZel206oXBvgiy8GWztOBJYmqFKk5XXuYnpjwQDXioCB3';
const BINANCE_SECRET_KEY = 'N1u5JTcJZBQlGOVkkLSDfxwTi6pehQbjt9L6LvnxDuLEA30ChKuTwkeHmaUmgPui';
const COINAPI_KEY = '52d3f36d-bdb3-4653-86c3-08284eeeed63';
const COINDESK_KEY = 'a1767cfd2957079cad70abd9850f473d0d033e55851bfe550c15b74bd83d8eaf';

serve(async (req) => {
  try {
    // Setup CORS headers
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    };

    // Handle CORS preflight requests
    if (req.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    // Extract URL parameters
    const url = new URL(req.url);
    const symbol = url.searchParams.get('symbol') || 'BTC';
    const currency = url.searchParams.get('currency') || 'USD';
    const dataSource = url.searchParams.get('source') || 'all'; // 'binance', 'coinapi', 'coindesk', or 'all'

    // Format the symbol for different APIs
    const binanceSymbol = `${symbol}${currency}T`;  // Note the 'T' suffix for most Binance pairs
    
    const responses = {
      binance: null,
      coinapi: null,
      coindesk: null
    };
    
    // Function to create HMAC signature for Binance API
    async function createHmacSignature(queryString: string): Promise<string> {
      const encoder = new TextEncoder();
      const key = encoder.encode(BINANCE_SECRET_KEY);
      const message = encoder.encode(queryString);
      
      const cryptoKey = await crypto.subtle.importKey(
        'raw',
        key,
        { name: 'HMAC', hash: 'SHA-256' },
        false,
        ['sign']
      );
      
      const signature = await crypto.subtle.sign('HMAC', cryptoKey, message);
      return Array.from(new Uint8Array(signature))
        .map(b => b.toString(16).padStart(2, '0'))
        .join('');
    }

    // Get data from Binance if requested or if using 'all'
    if (dataSource === 'binance' || dataSource === 'all') {
      try {
        const timestamp = Date.now().toString();
        const queryString = `symbol=${binanceSymbol}&timestamp=${timestamp}`;
        const signature = await createHmacSignature(queryString);
        
        // Ticker data from Binance
        const tickerResponse = await fetch(
          `https://api.binance.com/api/v3/ticker/24hr?${queryString}&signature=${signature}`,
          {
            headers: {
              'X-MBX-APIKEY': BINANCE_API_KEY
            }
          }
        );
        
        if (!tickerResponse.ok) {
          const errorText = await tickerResponse.text();
          console.error(`Binance API error (${tickerResponse.status}): ${errorText}`);
          throw new Error(`Binance API error: ${errorText}`);
        }
        
        const tickerData = await tickerResponse.json();
        
        // Get current price
        const priceResponse = await fetch(
          `https://api.binance.com/api/v3/ticker/price?symbol=${binanceSymbol}&timestamp=${timestamp}&signature=${signature}`,
          {
            headers: {
              'X-MBX-APIKEY': BINANCE_API_KEY
            }
          }
        );
        
        if (!priceResponse.ok) {
          throw new Error(`Binance price API error: ${priceResponse.status}`);
        }
        
        const priceData = await priceResponse.json();
        
        // WebSocket URL for real-time updates
        const wsEndpoint = `wss://stream.binance.com:9443/ws/${binanceSymbol.toLowerCase()}@ticker`;
        
        responses.binance = {
          price: parseFloat(priceData.price),
          volume24h: parseFloat(tickerData.volume),
          change24h: parseFloat(tickerData.priceChangePercent),
          high24h: parseFloat(tickerData.highPrice),
          low24h: parseFloat(tickerData.lowPrice),
          marketCap: parseFloat(tickerData.quoteVolume), // Using quote volume as a proxy
          lastUpdate: new Date().toISOString(),
          wsEndpoint: wsEndpoint
        };
      } catch (binanceError) {
        console.error('Error fetching from Binance:', binanceError);
        responses.binance = { error: binanceError.message };
        
        // Try with alternative symbol format (some pairs don't use the T suffix)
        try {
          const alternativeSymbol = `${symbol}${currency}`;
          const timestamp = Date.now().toString();
          const queryString = `symbol=${alternativeSymbol}&timestamp=${timestamp}`;
          const signature = await createHmacSignature(queryString);
          
          const retryResponse = await fetch(
            `https://api.binance.com/api/v3/ticker/24hr?${queryString}&signature=${signature}`,
            {
              headers: {
                'X-MBX-APIKEY': BINANCE_API_KEY
              }
            }
          );
          
          if (retryResponse.ok) {
            const tickerData = await retryResponse.json();
            responses.binance = {
              price: parseFloat(tickerData.lastPrice),
              volume24h: parseFloat(tickerData.volume),
              change24h: parseFloat(tickerData.priceChangePercent),
              high24h: parseFloat(tickerData.highPrice),
              low24h: parseFloat(tickerData.lowPrice),
              marketCap: parseFloat(tickerData.quoteVolume),
              lastUpdate: new Date().toISOString()
            };
          }
        } catch (retryError) {
          console.error('Retry with alternative symbol also failed:', retryError);
        }
      }
    }

    // Get data from CoinAPI if requested or if using 'all'
    if (dataSource === 'coinapi' || dataSource === 'all') {
      try {
        const coinApiResponse = await fetch(
          `https://rest.coinapi.io/v1/quotes/current?filter_symbol_id=BITSTAMP_SPOT_${symbol}_${currency}`,
          {
            headers: {
              'X-CoinAPI-Key': COINAPI_KEY
            }
          }
        );
        
        if (!coinApiResponse.ok) {
          throw new Error(`CoinAPI error: ${coinApiResponse.status}`);
        }
        
        const coinApiData = await coinApiResponse.json();
        
        if (coinApiData && coinApiData.length > 0) {
          responses.coinapi = {
            price: coinApiData[0].ask_price || coinApiData[0].bid_price,
            volume24h: null, // Not available in this endpoint
            lastUpdate: coinApiData[0].time_exchange || new Date().toISOString()
          };
          
          // Get additional data from exchange rates endpoint
          const exchangeRateResponse = await fetch(
            `https://rest.coinapi.io/v1/exchangerate/${symbol}/${currency}?time=${new Date().toISOString()}`,
            {
              headers: {
                'X-CoinAPI-Key': COINAPI_KEY
              }
            }
          );
          
          if (exchangeRateResponse.ok) {
            const exchangeRateData = await exchangeRateResponse.json();
            responses.coinapi.price = exchangeRateData.rate;
          }
        }
      } catch (coinApiError) {
        console.error('Error fetching from CoinAPI:', coinApiError);
        responses.coinapi = { error: coinApiError.message };
      }
    }

    // Get data from CoinDesk if requested or if using 'all'
    if (dataSource === 'coindesk' || dataSource === 'all') {
      try {
        // CoinDesk primarily supports BTC/USD
        if (symbol.toUpperCase() === 'BTC' && currency.toUpperCase() === 'USD') {
          const coindeskResponse = await fetch('https://api.coindesk.com/v1/bpi/currentprice.json');
          
          if (!coindeskResponse.ok) {
            throw new Error(`CoinDesk API error: ${coindeskResponse.status}`);
          }
          
          const coindeskData = await coindeskResponse.json();
          
          responses.coindesk = {
            price: parseFloat(coindeskData.bpi.USD.rate.replace(',', '')),
            lastUpdate: coindeskData.time.updatedISO,
            source: 'CoinDesk Bitcoin Price Index'
          };
        } else {
          responses.coindesk = { error: 'CoinDesk primarily supports BTC/USD only' };
        }
      } catch (coindeskError) {
        console.error('Error fetching from CoinDesk:', coindeskError);
        responses.coindesk = { error: coindeskError.message };
      }
    }

    // Determine the best available data source
    let primarySource = null;
    let combinedData = {};
    
    if (responses.binance && !responses.binance.error) {
      primarySource = 'binance';
      combinedData = { ...responses.binance, source: 'binance', isLive: true };
    } else if (responses.coinapi && !responses.coinapi.error) {
      primarySource = 'coinapi';
      combinedData = { ...responses.coinapi, source: 'coinapi', isLive: true };
    } else if (responses.coindesk && !responses.coindesk.error) {
      primarySource = 'coindesk';
      combinedData = { ...responses.coindesk, source: 'coindesk', isLive: true };
    } else {
      // If all sources failed
      return new Response(
        JSON.stringify({
          error: "Failed to fetch data from all specified sources",
          sources_tried: Object.keys(responses).filter(key => responses[key] !== null)
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
      );
    }

    // Return the combined data with metadata about all sources
    return new Response(
      JSON.stringify({
        ...combinedData,
        all_sources: responses,
        primary_source: primarySource
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error('Unhandled error:', error);
    
    return new Response(
      JSON.stringify({ 
        error: error.message || "حدث خطأ أثناء جلب بيانات السوق",
        source: "error",
        isLive: false
      }),
      { 
        headers: { 
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
          "Content-Type": "application/json" 
        }, 
        status: 500 
      }
    );
  }
});
