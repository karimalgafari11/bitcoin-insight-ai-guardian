
// Cache service for cryptocurrency data
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.20.0";
import { corsHeaders } from "./cors.ts";

// Type definition for crypto requests
export interface CryptoRequest {
  coinId: string;
  days: string;
  currency: string;
  forceRefresh?: boolean;
}

// Cache TTL in seconds
const CACHE_TTL = 300; // 5 minutes
const CACHE_STALE_TTL = 3600; // 1 hour (time we consider cache stale but still usable)

/**
 * Get cached cryptocurrency data if available
 */
export async function getCachedData(supabase: any, request: CryptoRequest) {
  const { coinId, days, currency, forceRefresh } = request;
  
  try {
    // If force refresh is requested, skip cache lookup
    if (forceRefresh) {
      return null;
    }
    
    // Attempt to get data from cache table
    const now = new Date();
    const { data, error } = await supabase
      .from('crypto_data_cache')
      .select('data, created_at, coin_id, days, currency')
      .eq('coin_id', coinId)
      .eq('days', days)
      .eq('currency', currency)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();
    
    // Check if we got data and if there was an error
    if (error) {
      // If error is that the table doesn't exist, we'll create it later
      if (error.message.includes("relation") && error.message.includes("does not exist")) {
        console.log("Cache table doesn't exist yet, will create after first fetch");
        return null;
      }
      
      console.error("Error fetching from cache:", error);
      return null;
    }
    
    // If no data found in cache
    if (!data) {
      return null;
    }
    
    // Check if cache is fresh (within TTL)
    const cacheTime = new Date(data.created_at);
    const cacheAge = (now.getTime() - cacheTime.getTime()) / 1000; // in seconds
    
    const isFresh = cacheAge < CACHE_TTL;
    const isStale = cacheAge >= CACHE_TTL && cacheAge < CACHE_STALE_TTL;
    
    // If cache is still usable
    if (isFresh || isStale) {
      const cachedData = data.data;
      
      return {
        ...cachedData,
        fromCache: true,
        cacheTime: cacheTime.toISOString(),
        needsRefresh: isStale,
        fetchedAt: cacheTime.toISOString(),
        dataSource: cachedData.dataSource || "cache"
      };
    }
    
    // Cache is too old
    return null;
    
  } catch (error) {
    console.error("Error in getCachedData:", error);
    return null;
  }
}

/**
 * Save cryptocurrency data to cache
 */
export async function saveToCache(supabase: any, request: CryptoRequest, data: any) {
  const { coinId, days, currency } = request;
  
  try {
    console.log("Saving fresh data to cache");
    
    // First, try to create the table if it doesn't exist
    try {
      await supabase.rpc('create_crypto_cache_if_not_exists');
    } catch (tableError) {
      // Table might already exist or we don't have permissions to create it
      // We'll continue and try to insert anyway
      console.log("Note: Unable to create table automatically if it doesn't exist");
    }
    
    // Save the data to the cache table
    const { data: insertedData, error } = await supabase
      .from('crypto_data_cache')
      .insert({
        coin_id: coinId,
        days: days,
        currency: currency,
        data: data,
        created_at: new Date().toISOString()
      })
      .select();
      
    if (error) {
      console.error("Error saving to cache:", error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error("Error in saveToCache:", error);
    return false;
  }
}

/**
 * Broadcast cryptocurrency updates to all connected clients
 */
export async function broadcastUpdate(supabase: any, request: CryptoRequest, data: any) {
  const { coinId, days, currency } = request;
  const channelName = `crypto-${coinId}-${days}-${currency}`;
  
  try {
    // Broadcast update to the appropriate channel
    const broadcast = await supabase
      .from('realtime_broadcasts')
      .insert({
        channel: channelName,
        event: 'crypto-update',
        payload: {
          coinId,
          days,
          currency,
          data,
          updatedAt: new Date().toISOString()
        }
      });
    
    return true;
  } catch (error) {
    console.error("Error broadcasting update:", error);
    return false;
  }
}

/**
 * Clean up old cache entries
 */
export async function cleanupCache(supabase: any) {
  try {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - 1); // Remove entries older than 1 day
    
    const { error } = await supabase
      .from('crypto_data_cache')
      .delete()
      .lt('created_at', cutoffDate.toISOString());
    
    if (error) {
      console.error("Error cleaning up cache:", error);
    }
    
  } catch (error) {
    console.error("Error in cleanupCache:", error);
  }
}
