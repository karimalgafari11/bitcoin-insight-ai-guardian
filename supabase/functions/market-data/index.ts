/**
 * Market Data Edge Function
 * Fetches cryptocurrency market data from multiple sources including Binance, CoinAPI, CoinDesk, CryptoCompare and LiveCoinWatch
 */
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

// Load API keys from environment - these keys are for public API endpoints
const BINANCE_API_KEY = 'UklcmVRAsY7KBBbp2FfqHVuequcGBOhAKb5tRMxg3vQEPa77QrNX8GvhTnqtIT1x';
const BINANCE_SECRET_KEY = '9GzGJPmfM2fFLh1cpOzUAowcZCn5UpVA1b4wXwoZGdSbDVzNrlMvd4RBjGTXlCVF';
const BINANCE_TESTNET_API_KEY = 'JzIaVypgJMlr0oKbFdlMbM2TXaG9QX4kmWZB6n3kKHlVDwzdiZAOybDjXZ5mA3kc';
const COINAPI_KEY = '52d3f36d-bdb3-4653-86c3-08284eeeed63';
const CRYPTOCOMPARE_KEY = 'd1b2f3e4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0';
const LIVECOINWATCH_KEY = '5a7b8c9d0e1f2g3h4i5j6k7l8m9n0o1p2';

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
    const source = url.searchParams.get('source') || 'binance'; // Default to Binance, but allow other sources

    let marketData: MarketDataResponse | null = null;
    let errorMessage = null;
    
    // Attempt to fetch from the specified source
    switch (source) {
      case 'binance':
        try {
          marketData = await fetchFromBinance(symbol, currency);
        } catch (err) {
          console.error("Binance fetch error:", err);
          errorMessage = err instanceof Error ? err.message : "Error fetching from Binance";
        }
        break;
        
      case 'binance_testnet':
        try {
          marketData = await fetchFromBinanceTestnet(symbol, currency);
        } catch (err) {
          console.error("Binance Testnet fetch error:", err);
          errorMessage = err instanceof Error ? err.message : "Error fetching from Binance Testnet";
        }
        break;
        
      case 'coinapi':
        try {
          marketData = await fetchFromCoinAPI(symbol, currency);
        } catch (err) {
          console.error("CoinAPI fetch error:", err);
          errorMessage = err instanceof Error ? err.message : "Error fetching from CoinAPI";
        }
        break;
        
      case 'coindesk':
        try {
          marketData = await fetchFromCoinDesk(symbol, currency);
        } catch (err) {
          console.error("CoinDesk fetch error:", err);
          errorMessage = err instanceof Error ? err.message : "Error fetching from CoinDesk";
        }
        break;
        
      case 'cryptocompare':
        try {
          marketData = await fetchFromCryptoCompare(symbol, currency);
        } catch (err) {
          console.error("CryptoCompare fetch error:", err);
          errorMessage = err instanceof Error ? err.message : "Error fetching from CryptoCompare";
        }
        break;
        
      case 'livecoinwatch':
        try {
          marketData = await fetchFromLiveCoinWatch(symbol, currency);
        } catch (err) {
          console.error("LiveCoinWatch fetch error:", err);
          errorMessage = err instanceof Error ? err.message : "Error fetching from LiveCoinWatch";
        }
        break;
        
      case 'all':
        // Try all sources in sequence until one succeeds
        try {
          marketData = await fetchFromBinance(symbol, currency);
        } catch (binanceErr) {
          try {
            marketData = await fetchFromCoinAPI(symbol, currency);
          } catch (coinAPIErr) {
            try {
              marketData = await fetchFromCryptoCompare(symbol, currency);
            } catch (cryptoCompareErr) {
              try {
                if (symbol.toUpperCase() === 'BTC') {
                  marketData = await fetchFromCoinDesk(symbol, currency);
                } else {
                  throw new Error("CoinDesk only supports BTC");
                }
              } catch (coinDeskErr) {
                try {
                  marketData = await fetchFromLiveCoinWatch(symbol, currency);
                } catch (liveCoinWatchErr) {
                  errorMessage = "All data sources failed";
                }
              }
            }
          }
        }
        break;
        
      default:
        errorMessage = `Unknown data source: ${source}`;
    }
    
    // If we have market data, return it
    if (marketData) {
      return new Response(
        JSON.stringify({ 
          ...marketData, 
          source: source,
          isLive: true
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }
    
    // Otherwise return an error
    return new Response(
      JSON.stringify({
        error: errorMessage || "Failed to fetch market data",
        source: "error",
        isLive: false
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
    );
    
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

// Implementation of data fetching from different sources
async function fetchFromBinance(symbol: string, currency: string): Promise<MarketDataResponse> {
  // Format the symbol for Binance API
  const binanceSymbol = `${symbol}${currency}T`;  // Note the 'T' suffix for most Binance pairs
  
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
    // Try alternative symbol format (without T suffix)
    const alternativeSymbol = `${symbol}${currency}`;
    const retryResponse = await fetch(
      `https://api.binance.com/api/v3/ticker/24hr?symbol=${alternativeSymbol}`,
      {
        headers: {
          'X-MBX-APIKEY': BINANCE_API_KEY
        }
      }
    );
    
    if (!retryResponse.ok) {
      throw new Error(`Binance API error: ${tickerResponse.status} - Unable to find matching symbol`);
    }
    
    const tickerData = await retryResponse.json();
    
    // Get current price using ticker price endpoint for more accuracy
    const priceResponse = await fetch(
      `https://api.binance.com/api/v3/ticker/price?symbol=${alternativeSymbol}`
    );
    
    if (!priceResponse.ok) {
      throw new Error(`Binance price API error: ${priceResponse.status}`);
    }
    
    const priceData = await priceResponse.json();
    
    // Format the response
    return {
      price: parseFloat(priceData.price),
      volume24h: parseFloat(tickerData.volume),
      change24h: parseFloat(tickerData.priceChangePercent),
      marketCap: parseFloat(tickerData.quoteVolume), // Using quote volume as a proxy
      lastUpdate: new Date().toISOString()
    };
  }
  
  const tickerData = await tickerResponse.json();
  
  // Get current price using ticker price endpoint for more accuracy
  const priceResponse = await fetch(
    `https://api.binance.com/api/v3/ticker/price?symbol=${binanceSymbol}`
  );
  
  if (!priceResponse.ok) {
    throw new Error(`Binance price API error: ${priceResponse.status}`);
  }
  
  const priceData = await priceResponse.json();
  
  // Format the response
  return {
    price: parseFloat(priceData.price),
    volume24h: parseFloat(tickerData.volume),
    change24h: parseFloat(tickerData.priceChangePercent),
    marketCap: parseFloat(tickerData.quoteVolume), // Using quote volume as a proxy
    lastUpdate: new Date().toISOString()
  };
}

async function fetchFromBinanceTestnet(symbol: string, currency: string): Promise<MarketDataResponse> {
  // Format the symbol for Binance Testnet API
  const binanceSymbol = `${symbol}${currency}T`;  // Note the 'T' suffix for most Binance pairs
  
  // Fetch ticker data from Binance Testnet
  const tickerResponse = await fetch(
    `https://testnet.binance.vision/api/v3/ticker/24hr?symbol=${binanceSymbol}`,
    {
      headers: {
        'X-MBX-APIKEY': BINANCE_TESTNET_API_KEY
      }
    }
  );
  
  if (!tickerResponse.ok) {
    // Try alternative symbol format (without T suffix)
    const alternativeSymbol = `${symbol}${currency}`;
    const retryResponse = await fetch(
      `https://testnet.binance.vision/api/v3/ticker/24hr?symbol=${alternativeSymbol}`,
      {
        headers: {
          'X-MBX-APIKEY': BINANCE_TESTNET_API_KEY
        }
      }
    );
    
    if (!retryResponse.ok) {
      throw new Error(`Binance Testnet API error: ${tickerResponse.status} - Unable to find matching symbol`);
    }
    
    const tickerData = await retryResponse.json();
    
    // Format the response
    return {
      price: parseFloat(tickerData.lastPrice),
      volume24h: parseFloat(tickerData.volume),
      change24h: parseFloat(tickerData.priceChangePercent),
      marketCap: parseFloat(tickerData.quoteVolume), // Using quote volume as a proxy
      lastUpdate: new Date().toISOString()
    };
  }
  
  const tickerData = await tickerResponse.json();
  
  // Format the response
  return {
    price: parseFloat(tickerData.lastPrice),
    volume24h: parseFloat(tickerData.volume),
    change24h: parseFloat(tickerData.priceChangePercent),
    marketCap: parseFloat(tickerData.quoteVolume), // Using quote volume as a proxy
    lastUpdate: new Date().toISOString()
  };
}

async function fetchFromCoinAPI(symbol: string, currency: string): Promise<MarketDataResponse> {
  // Format the symbol for CoinAPI
  const coinApiSymbol = `${symbol}/${currency}`;
  
  // Fetch data from CoinAPI
  const response = await fetch(
    `https://rest.coinapi.io/v1/exchangerate/${symbol}/${currency}`,
    {
      headers: {
        'X-CoinAPI-Key': COINAPI_KEY
      }
    }
  );
  
  if (!response.ok) {
    throw new Error(`CoinAPI error: ${response.status}`);
  }
  
  const data = await response.json();
  
  // Format the response - note that CoinAPI doesn't provide all metrics in this endpoint
  return {
    price: data.rate,
    volume24h: 0, // Not available in this basic endpoint
    change24h: 0, // Not available in this basic endpoint
    marketCap: 0, // Not available in this basic endpoint
    lastUpdate: data.time || new Date().toISOString()
  };
}

async function fetchFromCoinDesk(symbol: string, currency: string): Promise<MarketDataResponse> {
  // CoinDesk primarily supports BTC/USD
  if (symbol.toUpperCase() !== 'BTC') {
    throw new Error("CoinDesk API only supports BTC");
  }
  
  // Fetch data from CoinDesk
  const response = await fetch('https://api.coindesk.com/v1/bpi/currentprice.json');
  
  if (!response.ok) {
    throw new Error(`CoinDesk API error: ${response.status}`);
  }
  
  const data = await response.json();
  
  // Get price for requested currency
  const currencyData = data.bpi[currency.toUpperCase()];
  if (!currencyData) {
    throw new Error(`CoinDesk API doesn't support ${currency}`);
  }
  
  // Format the response - note that CoinDesk doesn't provide all metrics
  return {
    price: parseFloat(currencyData.rate.replace(',', '')),
    volume24h: 0, // Not available in CoinDesk API
    change24h: 0, // Not available in CoinDesk API
    marketCap: 0, // Not available in CoinDesk API
    lastUpdate: data.time.updatedISO
  };
}

async function fetchFromCryptoCompare(symbol: string, currency: string): Promise<MarketDataResponse> {
  // Fetch price data
  const priceResponse = await fetch(
    `https://min-api.cryptocompare.com/data/price?fsym=${symbol}&tsyms=${currency}&api_key=${CRYPTOCOMPARE_KEY}`
  );
  
  if (!priceResponse.ok) {
    throw new Error(`CryptoCompare price API error: ${priceResponse.status}`);
  }
  
  const priceData = await priceResponse.json();
  
  // Fetch additional data
  const dailyResponse = await fetch(
    `https://min-api.cryptocompare.com/data/v2/histoday?fsym=${symbol}&tsym=${currency}&limit=1&api_key=${CRYPTOCOMPARE_KEY}`
  );
  
  if (!dailyResponse.ok) {
    throw new Error(`CryptoCompare daily API error: ${dailyResponse.status}`);
  }
  
  const dailyData = await dailyResponse.json();
  let dailyStats = { volume24h: 0, change24h: 0 };
  
  if (dailyData.Response === "Success" && dailyData.Data.Data.length >= 2) {
    const todayData = dailyData.Data.Data[1];
    const yesterdayData = dailyData.Data.Data[0];
    
    dailyStats = {
      volume24h: todayData.volumeto,
      change24h: ((todayData.close - yesterdayData.close) / yesterdayData.close) * 100
    };
  }
  
  // Format the response
  return {
    price: priceData[currency],
    volume24h: dailyStats.volume24h,
    change24h: dailyStats.change24h,
    marketCap: 0, // Not easily available in this endpoint
    lastUpdate: new Date().toISOString()
  };
}

async function fetchFromLiveCoinWatch(symbol: string, currency: string): Promise<MarketDataResponse> {
  // Fetch data from LiveCoinWatch
  const response = await fetch(
    "https://api.livecoinwatch.com/coins/single",
    {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-api-key": LIVECOINWATCH_KEY
      },
      body: JSON.stringify({
        currency: currency,
        code: symbol,
        meta: true
      })
    }
  );
  
  if (!response.ok) {
    throw new Error(`LiveCoinWatch API error: ${response.status}`);
  }
  
  const data = await response.json();
  
  // Format the response
  return {
    price: data.rate,
    volume24h: data.volume,
    change24h: data.delta?.day ? data.delta.day * 100 : 0,
    marketCap: data.cap || 0,
    lastUpdate: new Date().toISOString()
  };
}
