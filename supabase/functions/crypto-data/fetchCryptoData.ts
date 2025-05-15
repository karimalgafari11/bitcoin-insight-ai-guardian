
import { fetchFromBinance } from "./apis/binance.ts";
import { fetchFromCoinGecko } from "./apis/coinGecko.ts";
import { fetchFromPublicApis } from "./apis/publicApis.ts";
import { generateMockData } from "./utils/mockDataGenerator.ts";

/**
 * Main function to fetch and aggregate crypto data from multiple sources
 */
export async function fetchCryptoData(coinId: string, days: string, currency: string) {
  console.log(`Fetching data for: ${coinId}, days: ${days}, currency: ${currency}, realtime: ${false}`);
  
  // Check for Binance API keys in environment variables or passed as request headers
  const hasBinanceApiKey = Deno.env.get("BINANCE_API_KEY") || Deno.env.get("binance_api_key");
  const hasCoinGeckoApiKey = Deno.env.get("COINGECKO_API_KEY") || Deno.env.get("coingecko_api_key");
  const hasCoinMarketCapApiKey = Deno.env.get("CMC_API_KEY") || Deno.env.get("cmc_api_key");

  console.log(`Using API keys - CoinMarketCap available: ${!!hasCoinMarketCapApiKey} CoinGecko available: ${!!hasCoinGeckoApiKey}`);
  
  // Try Binance first if we have API keys
  try {
    console.log("Attempting to fetch from Binance");
    const binanceData = await fetchFromBinance(coinId, days, currency);
    return {
      ...binanceData,
      isMockData: false,
      dataSource: "binance"
    };
  } catch (binanceError) {
    console.error("Binance fetch failed:", binanceError);
    console.error("Detailed Binance fetch error:", binanceError);
  }

  // Try CoinGecko as our second source
  try {
    console.log("Attempting to fetch from CoinGecko");
    const coinGeckoData = await fetchFromCoinGecko(coinId, days, currency);
    return {
      ...coinGeckoData,
      isMockData: false,
      dataSource: "coingecko"
    };
  } catch (coinGeckoError) {
    console.error("CoinGecko fetch failed:", coinGeckoError);
    console.error("Detailed CoinGecko fetch error:", coinGeckoError);
  }
  
  // Try public APIs as our third source
  try {
    console.log("Attempting to fetch from public API");
    const publicApiData = await fetchFromPublicApis(coinId, days, currency);
    return {
      ...publicApiData,
      isMockData: false,
      dataSource: "public-api"
    };
  } catch (publicApiError) {
    console.error("Public API fetch failed:", publicApiError);
  }
  
  // As a last resort, return mock data
  console.log("All API sources failed, returning mock data");
  const mockData = generateMockData(coinId, days, currency);
  return {
    ...mockData,
    isMockData: true,
    dataSource: "mock"
  };
}
