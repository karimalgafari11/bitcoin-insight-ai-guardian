
import { corsHeaders } from "./cors.ts";
import { coinSymbolMap, intervalMap } from "./coinSymbolMap.ts";
import { formatHistoricalData } from "./formatData.ts";
import { generateMockData } from "./mockData.ts";

/**
 * Fetches cryptocurrency data from CoinMarketCap API
 */
export async function fetchCryptoData(coinId: string, days: string, currency: string) {
  // Get the CoinMarketCap API key from Supabase secrets
  const coinmarketcapApiKey = Deno.env.get("Coinmarketcup_api_key") || "";
  
  if (!coinmarketcapApiKey) {
    console.error("CoinMarketCap API key not found, using mock data instead");
    // Return mock data when API key is not available
    return generateMockData(coinId, days, currency);
  }

  const symbol = coinSymbolMap[coinId] || coinId.toUpperCase();
  const interval = intervalMap[days] || '1d';
  
  try {
    console.log(`Fetching real data for ${symbol} with ${interval} interval`);
    
    // Get current price data
    const quoteData = await fetchCurrentPriceData(symbol, currency, coinmarketcapApiKey);
    
    // Get coin ID from symbol
    const cmcCoinId = await fetchCoinId(symbol, coinmarketcapApiKey);
    
    // Get historical OHLCV data
    const historicalData = await fetchHistoricalData(cmcCoinId, interval, days, currency, coinmarketcapApiKey);
    
    console.log("Successfully fetched CoinMarketCap data");
    
    // Format the data
    return formatHistoricalData(historicalData, quoteData, currency);
  } catch (error) {
    console.error(`Error fetching data from CoinMarketCap: ${error.message}`);
    console.error("Stack trace:", error.stack);
    
    // Try fallback data source if primary fails
    try {
      console.log("Attempting to fetch from fallback source");
      const fallbackData = await fetchFallbackData(coinId, days, currency);
      return fallbackData;
    } catch (fallbackError) {
      console.error(`Fallback source failed: ${fallbackError.message}`);
      
      // Return mock data as a last resort
      console.log("Using mock data as fallback");
      return generateMockData(coinId, days, currency);
    }
  }
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
 * Fallback data source using CoinGecko public API
 */
async function fetchFallbackData(coinId: string, days: string, currency: string) {
  // Check if we have a CoinGecko API key for higher rate limits
  const coingeckoApiKey = Deno.env.get("Coingecko_api_key");
  const baseUrl = "https://api.coingecko.com/api/v3";
  
  // Map coin IDs to CoinGecko format if needed
  const geckoId = mapToGeckoId(coinId);
  
  // Get current price data
  let pricesUrl = `${baseUrl}/coins/${geckoId}/market_chart?vs_currency=${currency}&days=${days}`;
  
  // Add API key if available
  if (coingeckoApiKey) {
    pricesUrl += `&x_cg_pro_api_key=${coingeckoApiKey}`;
  }
  
  console.log(`Fetching from CoinGecko: ${pricesUrl}`);
  
  const pricesResponse = await fetch(pricesUrl);
  
  if (!pricesResponse.ok) {
    throw new Error(`CoinGecko API error: ${pricesResponse.status}`);
  }
  
  const pricesData = await pricesResponse.json();
  
  // Get additional metadata
  let infoUrl = `${baseUrl}/coins/${geckoId}?localization=false&tickers=false&community_data=false&developer_data=false`;
  
  // Add API key if available
  if (coingeckoApiKey) {
    infoUrl += `&x_cg_pro_api_key=${coingeckoApiKey}`;
  }
  
  const infoResponse = await fetch(infoUrl);
  
  if (!infoResponse.ok) {
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
