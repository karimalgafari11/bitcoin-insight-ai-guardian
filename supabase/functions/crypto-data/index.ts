
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { corsHeaders } from "./cors.ts";
import { fetchCryptoData } from "./fetchCryptoData.ts";

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { coinId = "bitcoin", days = "7", currency = "usd" } = await req.json();
    
    console.log(`Fetching data for: ${coinId}, days: ${days}, currency: ${currency}`);
    
    // Get the data from our handler function
    const data = await fetchCryptoData(coinId, days, currency);
    
    // Return the formatted data
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
