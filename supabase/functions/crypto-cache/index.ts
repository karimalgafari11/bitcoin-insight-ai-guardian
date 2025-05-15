
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.20.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
};

serve(async (req: Request) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    // Create a Supabase client
    const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    let coinId, days, currency, forceRefresh;
    
    // Check if this is a scheduled cron job or manual request
    if (req.method === "GET") {
      // Scheduled cron job - update main crypto data
      coinId = "bitcoin";
      days = "7";
      currency = "usd";
      forceRefresh = true;
    } else {
      // Process request parameters
      try {
        const requestData = await req.json();
        coinId = requestData.coinId || "bitcoin";
        days = requestData.days || "7";
        currency = requestData.currency || "usd";
        forceRefresh = requestData.forceRefresh === true;
      } catch (parseError) {
        console.error("Error parsing request JSON:", parseError);
        return new Response(
          JSON.stringify({ error: "Invalid JSON in request body" }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 }
        );
      }
    }
    
    console.log(`Processing crypto data for: ${coinId}, days: ${days}, currency: ${currency}, force: ${forceRefresh}`);

    // Check if we have recent cached data unless force refresh is requested
    if (!forceRefresh) {
      const { data: cachedData, error: cachedError } = await supabase
        .from('crypto_data_cache')
        .select('*')
        .eq('coin_id', coinId)
        .eq('days', days)
        .eq('currency', currency)
        .order('updated_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (!cachedError && cachedData) {
        const cacheAge = Date.now() - new Date(cachedData.updated_at).getTime();
        // Use cache if it's less than 5 minutes old
        if (cacheAge < 5 * 60 * 1000) {
          console.log(`Using cached data from ${Math.round(cacheAge/1000)} seconds ago`);
          return new Response(
            JSON.stringify({ 
              ...cachedData.data,
              fromCache: true,
              cacheTime: cachedData.updated_at,
              fetchedAt: new Date().toISOString()
            }),
            { headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }
      }
    }

    // No valid cache, fetch fresh data from crypto-data function
    console.log("Fetching fresh data from crypto-data function");
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

    // Save the fresh data to our cache
    if (freshData && !freshData.isMockData) {
      console.log("Saving fresh data to cache");
      const { error: insertError } = await supabase
        .from('crypto_data_cache')
        .insert({
          coin_id: coinId,
          days: days,
          currency: currency,
          data: freshData,
          data_source: freshData.dataSource,
          updated_at: new Date().toISOString()
        });

      if (insertError) {
        console.error("Error saving to cache:", insertError);
      } else {
        console.log("Successfully saved to cache");
        
        // Broadcast an update to all connected clients
        const channel = 'crypto-' + coinId + '-' + days + '-' + currency;
        const event = 'crypto-update';
        console.log(`Broadcasting update to channel: ${channel}, event: ${event}`);
        
        const { error: broadcastError } = await supabase
          .from('broadcast_messages')
          .insert({
            channel,
            event,
            payload: {
              coinId,
              days, 
              currency,
              data: freshData,
              updatedAt: new Date().toISOString()
            }
          });
        
        if (broadcastError) {
          console.error("Error broadcasting update:", broadcastError);
        } else {
          console.log("Successfully broadcast update");
        }
      }
    } else {
      console.log("Not caching mock data");
    }

    // Return the fresh data
    return new Response(
      JSON.stringify({
        ...freshData,
        fromCache: false,
        fetchedAt: new Date().toISOString()
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error in crypto-cache function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
    );
  }
});
