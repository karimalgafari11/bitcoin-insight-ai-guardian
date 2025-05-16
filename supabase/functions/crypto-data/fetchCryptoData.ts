
import { fetchFromBinance } from "./apis/binance.ts";
import { fetchFromCoinGecko } from "./apis/coinGecko.ts";
import { fetchFromPublicApis } from "./apis/publicApis.ts";
import { generateMockData } from "./utils/mockDataGenerator.ts";

/**
 * Main function to fetch and aggregate crypto data from multiple sources
 * Modified to always prioritize Binance as primary source
 */
export async function fetchCryptoData(coinId: string, days: string, currency: string) {
  console.log(`Fetching data for: ${coinId}, days: ${days}, currency: ${currency}`);
  
  // Always try Binance first as our primary and preferred data source
  try {
    console.log("Fetching from Binance as primary source");
    const binanceData = await fetchFromBinance(coinId, days, currency);
    return {
      ...binanceData,
      isMockData: false,
      dataSource: "binance",
      preferBinance: true
    };
  } catch (binanceError) {
    console.error("Binance fetch failed:", binanceError);
    
    // If Binance fails, try CoinGecko as fallback
    try {
      console.log("Attempting fallback to CoinGecko");
      const coinGeckoData = await fetchFromCoinGecko(coinId, days, currency);
      return {
        ...coinGeckoData,
        isMockData: false,
        dataSource: "coingecko",
        preferBinance: true  // Still indicate we prefer Binance for next refresh
      };
    } catch (coinGeckoError) {
      console.error("CoinGecko fetch failed:", coinGeckoError);
      
      // Try public APIs as our third option
      try {
        console.log("Attempting fallback to public APIs");
        const publicApiData = await fetchFromPublicApis(coinId, days, currency);
        return {
          ...publicApiData,
          isMockData: false,
          dataSource: "public-api",
          preferBinance: true  // Still indicate we prefer Binance for next refresh
        };
      } catch (publicApiError) {
        console.error("Public APIs fetch failed:", publicApiError);
      }
    }
  }
  
  // As a last resort, return mock data with a flag indicating it's mock
  console.log("All API sources failed, returning mock data");
  const mockData = generateMockData(coinId, days, currency);
  return {
    ...mockData,
    isMockData: true,
    dataSource: "mock",
    preferBinance: true  // Still indicate we prefer Binance for next refresh
  };
}
