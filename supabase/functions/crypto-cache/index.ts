
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
      try {
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
          // Use cache if it's less than 5 minutes old (or 1 minute for 1-day views)
          const maxCacheAge = days === '1' ? 60000 : 300000; // 1 or 5 minutes
          if (cacheAge < maxCacheAge) {
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
      } catch (cacheError) {
        // Log but continue if cache retrieval fails
        console.error("Error retrieving from cache:", cacheError);
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

    // Save the fresh data to our cache if it's not mock data
    if (freshData && !freshData.isMockData) {
      console.log("Saving fresh data to cache");
      
      try {
        // Use upsert to handle both insert and update cases
        const { error: upsertError } = await supabase
          .from('crypto_data_cache')
          .upsert({
            coin_id: coinId,
            days: days,
            currency: currency,
            data: freshData,
            data_source: freshData.dataSource,
            updated_at: new Date().toISOString()
          }, {
            onConflict: 'coin_id,days,currency',
            ignoreDuplicates: false
          });

        if (upsertError) {
          console.error("Error saving to cache:", upsertError);
        } else {
          console.log("Successfully saved to cache");
          
          // Broadcast an update to all connected clients
          try {
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
          } catch (broadcastError) {
            console.error("Failed to broadcast update:", broadcastError);
          }
        }
      } catch (saveError) {
        console.error("Exception during cache save:", saveError);
      }
    } else {
      console.log("Not caching mock data or invalid data");
    }

    // Run the cache cleanup function occasionally (1% of requests)
    if (Math.random() < 0.01) {
      try {
        await supabase.rpc('clean_crypto_cache');
        console.log("Ran cache cleanup function");
      } catch (cleanupError) {
        console.error("Error cleaning cache:", cleanupError);
      }
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
      JSON.stringify({ 
        error: error.message,
        isMockData: true,
        dataSource: "error-fallback",
        fetchedAt: new Date().toISOString()
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
    );
  }
});
