
/**
 * Market Data Edge Function
 * Fetches cryptocurrency market data from multiple sources including Binance, CoinAPI, CoinDesk, CryptoCompare and LiveCoinWatch
 */
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { corsHeaders } from "./cors.ts";
import { parseRequestParams, errorResponse } from "./utils.ts";
import { fetchMarketData } from "./controller.ts";

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Parse URL parameters
    const url = new URL(req.url);
    const { symbol, currency, source } = parseRequestParams(url);
    
    // Fetch the market data
    return await fetchMarketData(symbol, currency, source);
  } catch (error) {
    return errorResponse(
      error instanceof Error ? error.message : "حدث خطأ أثناء جلب بيانات السوق"
    );
  }
});
