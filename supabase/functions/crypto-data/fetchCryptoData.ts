
import { corsHeaders } from "./cors.ts";
import { fetchFromCoinMarketCap } from "./apis/coinMarketCap.ts";
import { fetchFromCoinGecko } from "./apis/coinGecko.ts";
import { fetchFromPublicApi } from "./apis/publicApis.ts";
import { generateFallbackData } from "./utils/mockDataGenerator.ts";

/**
 * Fetches cryptocurrency data from multiple sources with fallback
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
    return generateFallbackData(coinId, days, currency);
    
  } catch (finalError) {
    console.error("All fetch attempts failed:", finalError.message);
    // Generate mock data as a last resort
    return generateFallbackData(coinId, days, currency, finalError.message);
  }
}
