
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.20.0";
import { corsHeaders } from "./cors.ts";

export interface CryptoRequest {
  coinId: string;
  days: string;
  currency: string;
  forceRefresh?: boolean;
}

export async function getCachedData(
  supabase: any,
  { coinId, days, currency, forceRefresh = false }: CryptoRequest
) {
  // Skip cache check if force refresh is requested
  if (forceRefresh) {
    return null;
  }

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
        return {
          ...cachedData.data,
          fromCache: true,
          cacheTime: cachedData.updated_at,
          fetchedAt: new Date().toISOString()
        };
      }
    }
    return null;
  } catch (cacheError) {
    // Log but continue if cache retrieval fails
    console.error("Error retrieving from cache:", cacheError);
    return null;
  }
}

export async function saveToCache(
  supabase: any,
  { coinId, days, currency }: CryptoRequest,
  freshData: any
) {
  // Don't save mock data to cache
  if (!freshData || freshData.isMockData) {
    console.log("Not caching mock data or invalid data");
    return;
  }

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
      return false;
    }
    
    console.log("Successfully saved to cache");
    return true;
  } catch (saveError) {
    console.error("Exception during cache save:", saveError);
    return false;
  }
}

export async function broadcastUpdate(
  supabase: any,
  { coinId, days, currency }: CryptoRequest,
  freshData: any
) {
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
      return false;
    }
    
    console.log("Successfully broadcast update");
    return true;
  } catch (broadcastError) {
    console.error("Failed to broadcast update:", broadcastError);
    return false;
  }
}

export async function cleanupCache(supabase: any) {
  try {
    await supabase.rpc('clean_crypto_cache');
    console.log("Ran cache cleanup function");
    return true;
  } catch (cleanupError) {
    console.error("Error cleaning cache:", cleanupError);
    return false;
  }
}
