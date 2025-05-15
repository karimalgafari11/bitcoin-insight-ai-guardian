import { corsHeaders } from "./cors.ts";
import { coinSymbolMap, intervalMap } from "./coinSymbolMap.ts";
import { formatHistoricalData } from "./formatData.ts";
import { generateMockData } from "./mockData.ts";

/**
 * Fetches cryptocurrency data from CoinMarketCap API
 */
export async function fetchCryptoData(coinId: string, days: string, currency: string) {
  // Get the API keys with correct spelling
  const coinMarketCapApiKey = Deno.env.get("CoinMarketCap_api_key") || Deno.env.get("Coinmarketcup_api_key") || "";
  const coinGeckoApiKey = Deno.env.get("CoinGecko_api_key") || Deno.env.get("Coingecko_api_key") || "";
  
  console.log("Using API keys - CoinMarketCap available:", !!coinMarketCapApiKey, "CoinGecko available:", !!coinGeckoApiKey);
  
  // Try to fetch data from multiple sources
  try {
    // First try CoinMarketCap if we have an API key
    if (coinMarketCapApiKey) {
      try {
        console.log("Attempting to fetch from CoinMarketCap");
        const data = await fetchFromCoinMarketCap(coinId, days, currency, coinMarketCapApiKey);
        console.log("Successfully fetched data from CoinMarketCap!");
        return {
          ...data,
          isMockData: false,
          dataSource: "coinmarketcap"
        };
      } catch (error) {
        console.error("CoinMarketCap fetch failed:", error.message);
        // Continue to next source if this one fails
      }
    }
    
    // Next try CoinGecko
    try {
      console.log("Attempting to fetch from CoinGecko");
      const data = await fetchFromCoinGecko(coinId, days, currency, coinGeckoApiKey);
      console.log("Successfully fetched data from CoinGecko!");
      return {
        ...data,
        isMockData: false,
        dataSource: "coingecko"
      };
    } catch (error) {
      console.error("CoinGecko fetch failed:", error.message);
      // Continue to next source if this one fails
    }
    
    // Try public alternative APIs
    try {
      console.log("Attempting to fetch from public API");
      const data = await fetchFromPublicApi(coinId, days, currency);
      console.log("Successfully fetched data from public API!");
      return {
        ...data,
        isMockData: false,
        dataSource: "publicapi"
      };
    } catch (error) {
      console.error("Public API fetch failed:", error.message);
      // Fall back to mock data if all sources fail
    }
    
    // If all else fails, return mock data with a flag
    console.log("All API sources failed, returning mock data");
    const mockData = generateMockData(coinId, days, currency);
    return {
      ...mockData,
      isMockData: true,
      dataSource: "mock",
      fetchedAt: new Date().toISOString()
    };
  } catch (finalError) {
    console.error("All fetch attempts failed:", finalError.message);
    // Generate mock data as a last resort
    const mockData = generateMockData(coinId, days, currency);
    return {
      ...mockData,
      isMockData: true,
      dataSource: "mock",
      error: finalError.message,
      fetchedAt: new Date().toISOString()
    };
  }
}

/**
 * Fetches data from CoinMarketCap API
 */
async function fetchFromCoinMarketCap(coinId: string, days: string, currency: string, apiKey: string) {
  const symbol = coinSymbolMap[coinId] || coinId.toUpperCase();
  const interval = intervalMap[days] || '1d';
  
  console.log(`Fetching from CoinMarketCap for ${symbol} with ${interval} interval`);
  
  // Get current price data
  const quoteData = await fetchCurrentPriceData(symbol, currency, apiKey);
  
  // Get coin ID from symbol
  const cmcCoinId = await fetchCoinId(symbol, apiKey);
  
  // Get historical OHLCV data
  const historicalData = await fetchHistoricalData(cmcCoinId, interval, days, currency, apiKey);
  
  console.log("Successfully fetched CoinMarketCap data");
  
  // Format the data
  return formatHistoricalData(historicalData, quoteData, currency);
}

/**
 * Fetches current price data for a cryptocurrency
 */
async function fetchCurrentPriceData(symbol: string, currency: string, apiKey: string) {
  const quoteUrl = `https://pro-api.coinmarketcap.com/v2/cryptocurrency/quotes/latest?symbol=${symbol}&convert=${currency.toUpperCase()}`;
  console.log(`Making quote request to: ${quoteUrl}`);
  
  const quoteResponse = await fetch(quoteUrl, {
    headers: {
      "X-CMC_PRO_API_KEY": apiKey,
      "Accept": "application/json",
    },
  });
  
  if (!quoteResponse.ok) {
    const errorText = await quoteResponse.text();
    console.error(`CoinMarketCap Quote API error: ${quoteResponse.status} - ${errorText}`);
    throw new Error(`CoinMarketCap API error: ${quoteResponse.status}`);
  }
  
  return await quoteResponse.json();
}

/**
 * Fetches the CoinMarketCap ID for a coin symbol
 */
async function fetchCoinId(symbol: string, apiKey: string) {
  const idLookupUrl = `https://pro-api.coinmarketcap.com/v1/cryptocurrency/map?symbol=${symbol}`;
  console.log(`Looking up ID for ${symbol} at: ${idLookupUrl}`);
  
  const idLookupResponse = await fetch(idLookupUrl, {
    headers: {
      "X-CMC_PRO_API_KEY": apiKey,
      "Accept": "application/json",
    },
  });
  
  if (!idLookupResponse.ok) {
    const errorText = await idLookupResponse.text();
    console.error(`CoinMarketCap ID Lookup API error: ${idLookupResponse.status} - ${errorText}`);
    throw new Error(`CoinMarketCap ID Lookup API error: ${idLookupResponse.status}`);
  }
  
  const idLookupData = await idLookupResponse.json();
  
  if (!idLookupData.data || idLookupData.data.length === 0) {
    console.error(`No ID found for symbol: ${symbol}`);
    throw new Error(`No ID found for symbol: ${symbol}`);
  }
  
  return idLookupData.data[0].id;
}

/**
 * Fetches historical price data for a cryptocurrency
 */
async function fetchHistoricalData(coinId: number, interval: string, days: string, currency: string, apiKey: string) {
  const count = days === '1' ? 24 : days === '7' ? 42 : days === '30' ? 30 : 90;
  const historicalUrl = `https://pro-api.coinmarketcap.com/v2/cryptocurrency/ohlcv/historical?id=${coinId}&time_period=${interval}&count=${count}&convert=${currency.toUpperCase()}`;
  console.log(`Making historical request to: ${historicalUrl}`);
  
  const historicalResponse = await fetch(historicalUrl, {
    headers: {
      "X-CMC_PRO_API_KEY": apiKey,
      "Accept": "application/json",
    },
  });
  
  if (!historicalResponse.ok) {
    const errorText = await historicalResponse.text();
    console.error(`CoinMarketCap Historical API error: ${historicalResponse.status} - ${errorText}`);
    throw new Error(`CoinMarketCap Historical API error: ${historicalResponse.status}`);
  }
  
  return await historicalResponse.json();
}

/**
 * Fetches data from CoinGecko API
 */
async function fetchFromCoinGecko(coinId: string, days: string, currency: string, apiKey?: string) {
  // Map coin IDs to CoinGecko format if needed
  const geckoId = mapToGeckoId(coinId);
  
  try {
    // Build base URL
    let pricesUrl = `https://api.coingecko.com/api/v3/coins/${geckoId}/market_chart?vs_currency=${currency}&days=${days}`;
    
    // Add API key if available for higher rate limits
    if (apiKey) {
      pricesUrl += `&x_cg_pro_api_key=${apiKey}`;
    }
    
    console.log(`Fetching from CoinGecko: ${pricesUrl}`);
    
    const pricesResponse = await fetch(pricesUrl);
    
    if (!pricesResponse.ok) {
      const errorText = await pricesResponse.text();
      console.error(`CoinGecko Market Chart API error: ${pricesResponse.status} - ${errorText}`);
      throw new Error(`CoinGecko API error: ${pricesResponse.status}`);
    }
    
    const pricesData = await pricesResponse.json();
    
    // Get additional metadata
    let infoUrl = `https://api.coingecko.com/api/v3/coins/${geckoId}?localization=false&tickers=false&community_data=false&developer_data=false`;
    
    // Add API key if available
    if (apiKey) {
      infoUrl += `&x_cg_pro_api_key=${apiKey}`;
    }
    
    const infoResponse = await fetch(infoUrl);
    
    if (!infoResponse.ok) {
      const errorText = await infoResponse.text();
      console.error(`CoinGecko Info API error: ${infoResponse.status} - ${errorText}`);
      throw new Error(`CoinGecko Info API error: ${infoResponse.status}`);
    }
    
    const coinInfo = await infoResponse.json();
    
    // Format data to match our expected structure
    return {
      prices: pricesData.prices,
      market_caps: pricesData.market_caps,
      total_volumes: pricesData.total_volumes,
      metadata: {
        name: coinInfo.name,
        symbol: coinInfo.symbol.toUpperCase(),
        current_price: coinInfo.market_data.current_price[currency],
        market_cap: coinInfo.market_data.market_cap[currency],
        volume_24h: coinInfo.market_data.total_volume[currency],
        percent_change_24h: coinInfo.market_data.price_change_percentage_24h,
        percent_change_7d: coinInfo.market_data.price_change_percentage_7d,
        last_updated: coinInfo.market_data.last_updated,
      },
    };
  } catch (error) {
    console.error("Detailed CoinGecko fetch error:", error);
    throw error;
  }
}

/**
 * Fetch from available public APIs as fallback
 */
async function fetchFromPublicApi(coinId: string, days: string, currency: string) {
  // Try another public API endpoint (example)
  const publicApiUrl = `https://api.coincap.io/v2/assets/${coinId}/history?interval=h1&start=${getStartTime(days)}&end=${Date.now()}`;
  
  console.log(`Fetching from public API: ${publicApiUrl}`);
  
  const response = await fetch(publicApiUrl);
  
  if (!response.ok) {
    throw new Error(`Public API error: ${response.status}`);
  }
  
  const data = await response.json();
  
  // Get current price data
  const currentDataUrl = `https://api.coincap.io/v2/assets/${coinId}`;
  const currentResponse = await fetch(currentDataUrl);
  
  if (!currentResponse.ok) {
    throw new Error(`Public API current data error: ${currentResponse.status}`);
  }
  
  const currentData = await currentResponse.json();
  
  // Convert the data format to match our expected structure
  const prices: [number, number][] = data.data.map((item: any) => [
    parseInt(item.time),
    parseFloat(item.priceUsd)
  ]);
  
  // Create simplified market caps and volumes (if no data available)
  const market_caps: [number, number][] = prices.map(([time, price]) => [
    time,
    parseFloat(currentData.data.marketCapUsd) * (price / parseFloat(currentData.data.priceUsd))
  ]);
  
  const total_volumes: [number, number][] = prices.map(([time]) => [
    time,
    parseFloat(currentData.data.volumeUsd24Hr) / 24
  ]);
  
  return {
    prices,
    market_caps,
    total_volumes,
    metadata: {
      name: currentData.data.name,
      symbol: currentData.data.symbol,
      current_price: parseFloat(currentData.data.priceUsd),
      market_cap: parseFloat(currentData.data.marketCapUsd),
      volume_24h: parseFloat(currentData.data.volumeUsd24Hr),
      percent_change_24h: parseFloat(currentData.data.changePercent24Hr),
      percent_change_7d: 0, // Not available from this API
      last_updated: new Date().toISOString(),
    },
  };
}

/**
 * Map coin IDs to CoinGecko format
 */
function mapToGeckoId(coinId: string): string {
  const mapping: Record<string, string> = {
    'bitcoin': 'bitcoin',
    'ethereum': 'ethereum',
    'binancecoin': 'binancecoin',
    'ripple': 'ripple',
    'cardano': 'cardano',
    'solana': 'solana',
  };
  
  return mapping[coinId] || coinId;
}

/**
 * Calculate start time based on days
 */
function getStartTime(days: string): number {
  const now = Date.now();
  const daysInMs = parseInt(days) * 24 * 60 * 60 * 1000;
  return now - daysInMs;
}
