
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.20.0";
import { corsHeaders } from "./cors.ts";
import { 
  getCachedData, 
  saveToCache, 
  broadcastUpdate, 
  cleanupCache,
  CryptoRequest 
} from "./cacheService.ts";
import { fetchCryptoData } from "./dataFetcher.ts";

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
    
    let request: CryptoRequest;
    
    // Check if this is a scheduled cron job or manual request
    if (req.method === "GET") {
      // Scheduled cron job - update main crypto data
      request = {
        coinId: "bitcoin",
        days: "7",
        currency: "usd",
        forceRefresh: true
      };
    } else {
      // Process request parameters
      try {
        const requestData = await req.json();
        request = {
          coinId: requestData.coinId || "bitcoin",
          days: requestData.days || "7",
          currency: requestData.currency || "usd",
          forceRefresh: requestData.forceRefresh === true
        };
      } catch (parseError) {
        console.error("Error parsing request JSON:", parseError);
        return new Response(
          JSON.stringify({ error: "Invalid JSON in request body" }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 }
        );
      }
    }
    
    console.log(`Processing crypto data for: ${request.coinId}, days: ${request.days}, currency: ${request.currency}, force: ${request.forceRefresh}`);

    // Check if we have recent cached data unless force refresh is requested
    const cachedData = await getCachedData(supabase, request);
    
    // Use the stale-while-revalidate pattern:
    // 1. If we have fresh cached data, return it immediately
    // 2. If we have stale data (needsRefresh), return it but also trigger a background refresh
    // 3. If we have no data, fetch fresh data
    
    if (cachedData && !cachedData.needsRefresh) {
      // Case 1: Fresh cache - return immediately
      return new Response(
        JSON.stringify(cachedData),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    
    // For stale cache or no cache, fetch fresh data
    // If stale cache, we'll still return it while fresh data is being fetched
    const freshDataPromise = fetchCryptoData(supabase, request);
    
    if (cachedData && cachedData.needsRefresh) {
      // Case 2: Stale cache - use background refresh pattern
      // We'll return cached data immediately while refreshing in background
      
      // Use waitUntil for background processing if available
      if (typeof EdgeRuntime !== 'undefined' && 'waitUntil' in EdgeRuntime) {
        EdgeRuntime.waitUntil((async () => {
          try {
            const freshData = await freshDataPromise;
            
            if (freshData && !freshData.isMockData) {
              const saved = await saveToCache(supabase, request, freshData);
              if (saved) {
                await broadcastUpdate(supabase, request, freshData);
              }
            }
          } catch (error) {
            console.error("Background refresh error:", error);
          }
        })());
      } else {
        // If waitUntil is not available, use a regular background promise
        // but don't await it so we can return response immediately
        (async () => {
          try {
            const freshData = await freshDataPromise;
            
            if (freshData && !freshData.isMockData) {
              const saved = await saveToCache(supabase, request, freshData);
              if (saved) {
                await broadcastUpdate(supabase, request, freshData);
              }
            }
          } catch (error) {
            console.error("Background refresh error:", error);
          }
        })();
      }
      
      // Return cached data immediately
      return new Response(
        JSON.stringify({
          ...cachedData,
          refreshing: true,
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    
    // Case 3: No valid cache, fetch fresh data synchronously
    const freshData = await freshDataPromise;

    // Save the fresh data to our cache if it's not mock data
    if (freshData && !freshData.isMockData) {
      const saved = await saveToCache(supabase, request, freshData);
      
      if (saved) {
        // Broadcast an update to all connected clients
        await broadcastUpdate(supabase, request, freshData);
      }
    }

    // Run the cache cleanup function occasionally (1% of requests)
    if (Math.random() < 0.01) {
      await cleanupCache(supabase);
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
