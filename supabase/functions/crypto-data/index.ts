
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    // Create a Supabase client with the Admin key
    const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Get the Coingecko API key from Supabase secrets
    const coingeckoApiKey = Deno.env.get("Coingecko_api_key") || "";
    
    if (!coingeckoApiKey) {
      return new Response(
        JSON.stringify({ error: "Coingecko API key not found" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
      );
    }

    // Parse request parameters
    const url = new URL(req.url);
    const coinId = url.searchParams.get("coinId") || "bitcoin";
    const currency = url.searchParams.get("currency") || "usd";
    const days = url.searchParams.get("days") || "7";

    // Fetch market data from Coingecko
    const apiUrl = `https://pro-api.coingecko.com/api/v3/coins/${coinId}/market_chart?vs_currency=${currency}&days=${days}&x_cg_pro_api_key=${coingeckoApiKey}`;
    
    const response = await fetch(apiUrl);
    const data = await response.json();

    // Return the data
    return new Response(
      JSON.stringify(data),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
    );
  }
});
