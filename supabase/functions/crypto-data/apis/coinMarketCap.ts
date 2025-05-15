
import { formatHistoricalData } from "../formatData.ts";
import { coinSymbolMap, intervalMap } from "../coinSymbolMap.ts";

/**
 * Fetches cryptocurrency data from CoinMarketCap API
 */
export async function fetchFromCoinMarketCap(coinId: string, days: string, currency: string, apiKey: string) {
  if (!apiKey) {
    throw new Error('CoinMarketCap API key is missing');
  }

  const symbol = coinSymbolMap[coinId] || coinId.toUpperCase();
  const interval = intervalMap[days] || '1d';
  
  console.log(`Fetching from CoinMarketCap for ${symbol} with ${interval} interval`);
  
  // Test API key validity with a simple request first
  try {
    const testUrl = "https://pro-api.coinmarketcap.com/v1/cryptocurrency/map?limit=1";
    const testResponse = await fetch(testUrl, {
      headers: {
        "X-CMC_PRO_API_KEY": apiKey,
        "Accept": "application/json",
      },
    });
    
    if (!testResponse.ok) {
      const errorText = await testResponse.text();
      throw new Error(`CoinMarketCap API key test failed: ${testResponse.status} - ${errorText}`);
    }
    
    // Proceed with the actual data fetching if test passed
    // Get current price data
    const quoteData = await fetchCurrentPriceData(symbol, currency, apiKey);
    
    // Get coin ID from symbol
    const cmcCoinId = await fetchCoinId(symbol, apiKey);
    
    // Get historical OHLCV data
    const historicalData = await fetchHistoricalData(cmcCoinId, interval, days, currency, apiKey);
    
    console.log("Successfully fetched CoinMarketCap data");
    
    // Format the data
    return formatHistoricalData(historicalData, quoteData, currency);
  } catch (error) {
    console.error(`CoinMarketCap API error: ${error.message}`);
    throw error;
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
