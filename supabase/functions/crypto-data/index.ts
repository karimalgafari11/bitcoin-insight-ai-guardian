
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
    // Parse request data
    const { coinId = "bitcoin", days = "7", currency = "usd" } = await req.json();
    
    console.log(`Fetching data for: ${coinId}, days: ${days}, currency: ${currency}`);
    
    // Get the Coingecko API key from Supabase secrets
    const coingeckoApiKey = Deno.env.get("Coingecko_api_key") || "";
    
    if (!coingeckoApiKey) {
      console.error("Coingecko API key not found");
      return new Response(
        JSON.stringify({ error: "Coingecko API key not found" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
      );
    }

    // Fetch market data from Coingecko
    const apiUrl = `https://pro-api.coingecko.com/api/v3/coins/${coinId}/market_chart?vs_currency=${currency}&days=${days}&x_cg_pro_api_key=${coingeckoApiKey}`;
    
    console.log(`Making request to: ${apiUrl}`);
    
    const response = await fetch(apiUrl);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Coingecko API error: ${response.status} - ${errorText}`);
      return new Response(
        JSON.stringify({ error: `Coingecko API error: ${response.status}`, details: errorText }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: response.status }
      );
    }
    
    const data = await response.json();
    console.log("Received data from Coingecko:", Object.keys(data));
    
    // Return the data
    return new Response(
      JSON.stringify(data),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error in crypto-data function:", error.message);
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
    );
  }
});
