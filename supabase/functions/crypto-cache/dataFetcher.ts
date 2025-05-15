
import { CryptoRequest } from "./cacheService.ts";
import { corsHeaders } from "./cors.ts";

export async function fetchCryptoData(supabase: any, request: CryptoRequest) {
  const { coinId, days, currency } = request;
  
  console.log("Fetching fresh data from crypto-data function");
  
  try {
    const { data: freshData, error: freshError } = await supabase.functions.invoke('crypto-data', {
      body: {
        coinId,
        days,
        currency
      }
    });

    if (freshError) {
      throw new Error(`Error fetching fresh data: ${freshError.message}`);
    }

    if (!freshData) {
      throw new Error('No data received from API');
    }
    
    return freshData;
  } catch (error) {
    console.error("Error in fetchCryptoData:", error);
    throw error;
  }
}
