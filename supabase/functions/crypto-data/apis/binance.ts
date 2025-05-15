
import { createHash } from "https://deno.land/std@0.208.0/crypto/mod.ts";

interface BinanceKline {
  openTime: number;
  open: string;
  high: string;
  low: string;
  close: string;
  volume: string;
  closeTime: number;
  quoteAssetVolume: string;
  trades: number;
  takerBuyBaseAssetVolume: string;
  takerBuyQuoteAssetVolume: string;
  ignore: string;
}

/**
 * Fetches cryptocurrency data from Binance API
 */
export async function fetchFromBinance(coinId: string, days: string, currency: string) {
  console.log(`Fetching from Binance: ${coinId}, days: ${days}, currency: ${currency}`);

  // Map coinId to Binance symbol - FIXED the symbol format for Binance
  const symbol = mapCoinIdToSymbol(coinId, currency);
  
  // Get the appropriate interval and limit based on days
  const { interval, limit } = getBinanceParams(days);
  
  try {
    // Define the Binance API endpoint
    const endpoint = `https://api.binance.com/api/v3/klines`;
    const params = new URLSearchParams({
      symbol: symbol,
      interval: interval,
      limit: limit.toString(),
    });

    console.log(`Binance request URL: ${endpoint}?${params}`);

    // Make the request
    const response = await fetch(`${endpoint}?${params}`);
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Binance API error (${response.status}): ${errorText}`);
    }

    const klines: any[][] = await response.json();
    
    // Parse and format the response
    return processKlinesData(klines, coinId, days, currency);
  } catch (error) {
    console.error("Detailed Binance fetch error:", error);
    throw error;
  }
}

/**
 * Maps a coin ID to its corresponding Binance symbol
 * FIXED: Using correct symbol format for Binance
 */
function mapCoinIdToSymbol(coinId: string, currency: string): string {
  // Map common coin IDs to Binance symbols
  const coinMap: Record<string, string> = {
    "bitcoin": "BTC",
    "ethereum": "ETH",
    "ripple": "XRP",
    "litecoin": "LTC",
    "bitcoin-cash": "BCH",
    "cardano": "ADA",
    "polkadot": "DOT",
    "binance-coin": "BNB",
    "solana": "SOL",
    "dogecoin": "DOGE",
  };
  
  const coin = coinMap[coinId.toLowerCase()] || coinId.toUpperCase();
  const curr = currency.toUpperCase();
  
  // FIXED: Correct symbol format for Binance (most pairs use BTCUSDT format, not BTCUSD)
  return `${coin}${curr}T`;
}

/**
 * Gets appropriate Binance API parameters based on requested days
 */
function getBinanceParams(days: string): { interval: string; limit: number } {
  // Choose appropriate interval based on days
  const daysNum = parseInt(days);
  
  if (daysNum <= 1) {
    // For 1 day or less, use 5-minute intervals (288 data points for a day)
    return { interval: "5m", limit: 288 };
  } else if (daysNum <= 7) {
    // For 1-7 days, use 1-hour intervals
    return { interval: "1h", limit: daysNum * 24 };
  } else if (daysNum <= 30) {
    // For 8-30 days, use 2-hour intervals
    return { interval: "2h", limit: (daysNum * 12) };
  } else if (daysNum <= 90) {
    // For 31-90 days, use 6-hour intervals
    return { interval: "6h", limit: (daysNum * 4) };
  } else {
    // For longer periods, use daily intervals with maximum allowed data points
    return { interval: "1d", limit: daysNum > 1000 ? 1000 : daysNum };
  }
}

/**
 * Processes and formats klines data from Binance
 */
function processKlinesData(klines: any[][], coinId: string, days: string, currency: string) {
  if (!klines || klines.length === 0) {
    throw new Error("No data returned from Binance API");
  }

  // Extract and format prices
  const prices = klines.map(kline => {
    const timestamp = kline[0]; // Open time
    const price = parseFloat(kline[4]); // Close price
    return [timestamp, price];
  });
  
  // Extract and format market caps (Binance doesn't provide this directly)
  // We'll use a placeholder based on price and volume
  const marketCaps = klines.map(kline => {
    const timestamp = kline[0]; // Open time
    const price = parseFloat(kline[4]); // Close price
    const volume = parseFloat(kline[5]); // Volume
    // This is just a placeholder, not actual market cap
    return [timestamp, price * volume / 1000];
  });
  
  // Extract and format volumes
  const totalVolumes = klines.map(kline => {
    const timestamp = kline[0]; // Open time
    const volume = parseFloat(kline[5]); // Volume
    return [timestamp, volume];
  });
  
  // Calculate some additional metadata
  const latestPrice = prices.length > 0 ? prices[prices.length - 1][1] : 0;
  const prevDayPrice = prices.length > 1 ? prices[0][1] : latestPrice;
  const percentChange24h = ((latestPrice - prevDayPrice) / prevDayPrice) * 100;
  const totalVolume24h = totalVolumes.reduce((sum, [_, vol]) => sum + vol, 0);
  
  // Prepare and return the formatted data
  return {
    id: coinId,
    symbol: mapCoinIdToSymbol(coinId, ""),
    name: coinId.charAt(0).toUpperCase() + coinId.slice(1),
    prices,
    market_caps: marketCaps,
    total_volumes: totalVolumes,
    metadata: {
      current_price: latestPrice,
      market_cap: latestPrice * totalVolume24h / 1000, // Rough estimation
      total_volume: totalVolume24h,
      percent_change_24h: percentChange24h,
      last_updated: new Date().toISOString(),
    },
    dataSource: "binance"
  };
}
