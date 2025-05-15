
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { CryptoMarketData } from '@/types/crypto';
import { enqueueRequest } from './apiQueue';
import { getFromCache, storeInCache, getFallbackFromCache, setPendingRequest, removePendingRequest, hasPendingRequest } from './cache';

/**
 * Main function to fetch cryptocurrency data
 */
export async function fetchCryptoData(
  coinId: string, 
  days: string, 
  currency: string, 
  force = false
): Promise<{
  data: CryptoMarketData | null;
  error: string | null;
  fromCache?: boolean;
  cacheTime?: string;
  dataSource?: string;
}> {
  try {
    console.log(`Fetching data for ${coinId}, days: ${days}, currency: ${currency}, force: ${force}`);
    
    // Create a cache key for this specific request
    const cacheKey = `${coinId}:${days}:${currency}`;
    
    // Check in-memory cache first
    const cachedResult = getFromCache(cacheKey, force);
    if (cachedResult) {
      return {
        data: cachedResult.data,
        error: null,
        fromCache: cachedResult.fromCache,
        dataSource: cachedResult.dataSource
      };
    }
    
    // Check if there's already a pending request for this data
    if (hasPendingRequest(cacheKey) && !force) {
      console.log('Using pending request for', cacheKey);
      try {
        // Wait for the existing request to complete
        const result = await getPendingRequest(cacheKey);
        return result;
      } catch (err) {
        // If the shared request fails, we'll proceed to make a new one
        console.error('Shared request failed, proceeding with new request', err);
      }
    }
    
    // Set up the request timeout with AbortController
    const timeoutMs = 15000; // 15-second timeout
    const abortController = new AbortController();
    
    // Set timeout to abort if it takes too long
    const timeoutId = setTimeout(() => {
      abortController.abort('Request timed out after 15 seconds');
    }, timeoutMs);
    
    // Create a new request promise
    const requestPromise = enqueueRequest(async () => {
      try {
        // Use the crypto-cache function
        const functionPromise = supabase.functions.invoke('crypto-cache', {
          body: {
            coinId,
            days,
            currency,
            forceRefresh: force
          }
        });
        
        // Race the function promise against a timeout
        const { data: responseData, error: responseError } = await Promise.race([
          functionPromise,
          new Promise<{data: null, error: {message: string}}>((_, reject) => 
            setTimeout(() => reject({
              data: null,
              error: { message: 'Request timed out after 15 seconds' }
            }), timeoutMs)
          )
        ]);

        if (responseError) {
          console.error('Supabase function error:', responseError);
          throw new Error(responseError.message);
        }

        if (!responseData) {
          throw new Error('No data received from API');
        }
        
        console.log('Received cryptocurrency data:', 
          responseData.fromCache ? 'from cache' : 'fresh data',
          responseData.dataSource);
        
        // Validate that the response has the required data structure
        if (!responseData.prices || !Array.isArray(responseData.prices)) {
          console.error('Invalid data format received:', responseData);
          throw new Error('Invalid data format received from API');
        }
        
        // Make sure isRealtime is properly set based on data source
        const enhancedData = {
          ...responseData,
          isRealtime: !responseData.fromCache && !responseData.isMockData
        };
        
        // Store successful response in memory cache
        storeInCache(cacheKey, enhancedData as CryptoMarketData);

        const result = {
          data: enhancedData as CryptoMarketData,
          error: null,
          fromCache: responseData.fromCache,
          cacheTime: responseData.cacheTime,
          dataSource: responseData.dataSource
        };
        
        return result;
      } finally {
        clearTimeout(timeoutId);
        // Remove this request from pending requests when done
        removePendingRequest(cacheKey);
      }
    });
    
    // Store the promise in the pending requests map
    setPendingRequest(cacheKey, requestPromise);
    
    return await requestPromise;
  } catch (err) {
    console.error('Error fetching crypto data:', err);
    const errorMessage = err instanceof Error ? err.message : 'خطأ في جلب بيانات العملة الرقمية';
    
    // Don't show toast for aborted requests - they're usually intentional
    if (!(err instanceof DOMException && err.name === 'AbortError')) {
      toast({
        title: "خطأ",
        description: errorMessage,
        variant: "destructive"
      });
    }
    
    // Check if we have stale data in memory cache we can use as fallback
    const cacheKey = `${coinId}:${days}:${currency}`;
    const fallbackResult = getFallbackFromCache(cacheKey);
    
    if (fallbackResult) {
      return {
        data: fallbackResult.data,
        error: null, // Don't report error if we have fallback data
        fromCache: true,
        dataSource: fallbackResult.dataSource
      };
    }
    
    return {
      data: null,
      error: errorMessage
    };
  }
}

