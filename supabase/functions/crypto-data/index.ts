
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { corsHeaders } from "./cors.ts";
import { fetchCryptoData } from "./fetchCryptoData.ts";

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    // Parse the request body with error handling
    let requestData;
    try {
      requestData = await req.json();
    } catch (parseError) {
      console.error("Error parsing request JSON:", parseError);
      return new Response(
        JSON.stringify({ error: "Invalid JSON in request body" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 }
      );
    }
    
    // Extract and validate parameters with defaults
    const { coinId = "bitcoin", days = "7", currency = "usd" } = requestData;
    
    // Input validation
    if (typeof coinId !== 'string' || typeof days !== 'string' || typeof currency !== 'string') {
      return new Response(
        JSON.stringify({ error: "Invalid parameter types" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 }
      );
    }
    
    console.log(`Fetching data for: ${coinId}, days: ${days}, currency: ${currency}`);
    
    // Implement request timeout handling
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error("Request timed out")), 29000); // Supabase has a 30s timeout
    });
    
    // Get the data from our handler function with timeout
    const dataPromise = fetchCryptoData(coinId, days, currency);
    
    // Race against timeout
    const data = await Promise.race([dataPromise, timeoutPromise]);
    
    // Return the formatted data
    return new Response(
      JSON.stringify(data),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error in crypto-data function:", error.message);
    console.error("Stack trace:", error.stack);
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
    );
  }
});
