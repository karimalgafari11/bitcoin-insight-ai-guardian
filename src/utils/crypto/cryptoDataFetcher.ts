
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { CryptoMarketData } from '@/types/crypto';

// Cache for in-memory data retention between requests
const inMemoryCache: Record<string, { data: CryptoMarketData; timestamp: number }> = {};
const MEMORY_CACHE_TTL = 15000; // 15 seconds 

// Track active requests to prevent duplicate concurrent requests
const pendingRequests = new Map<string, Promise<any>>();

// Queue system to limit API requests
const apiRequestQueue: Array<() => Promise<any>> = [];
let isProcessingQueue = false;

// Process the queue one request at a time
async function processQueue() {
  if (isProcessingQueue || apiRequestQueue.length === 0) return;
  
  isProcessingQueue = true;
  try {
    // Take the next request from queue and execute it
    const nextRequest = apiRequestQueue.shift();
    if (nextRequest) {
      await nextRequest();
    }
  } catch (error) {
    console.error("Error processing queue item:", error);
  } finally {
    isProcessingQueue = false;
    // Continue processing if there are more items
    if (apiRequestQueue.length > 0) {
      setTimeout(processQueue, 250); // Small delay between requests
    }
  }
}

// Add a request to the queue
function enqueueRequest(requestFn: () => Promise<any>): Promise<any> {
  return new Promise((resolve, reject) => {
    apiRequestQueue.push(async () => {
      try {
        const result = await requestFn();
        resolve(result);
      } catch (error) {
        reject(error);
      }
    });
    
    // Start processing if not already running
    if (!isProcessingQueue) {
      processQueue();
    }
  });
}

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
    
    // Check in-memory cache first (short TTL - 15 seconds)
    // This prevents multiple rapid-fire requests for the same data
    const now = Date.now();
    const cachedData = inMemoryCache[cacheKey];
    
    if (!force && cachedData && (now - cachedData.timestamp < MEMORY_CACHE_TTL)) {
      console.log('Using in-memory cached data');
      return {
        data: cachedData.data,
        error: null,
        fromCache: true,
        dataSource: cachedData.data.dataSource || 'memory-cache'
      };
    }
    
    // Check if there's already a pending request for this data
    if (pendingRequests.has(cacheKey) && !force) {
      console.log('Using pending request for', cacheKey);
      try {
        // Wait for the existing request to complete
        const result = await pendingRequests.get(cacheKey);
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
        inMemoryCache[cacheKey] = {
          data: enhancedData as CryptoMarketData,
          timestamp: now
        };

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
        pendingRequests.delete(cacheKey);
      }
    });
    
    // Store the promise in the pending requests map
    pendingRequests.set(cacheKey, requestPromise);
    
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
    const cachedData = inMemoryCache[cacheKey];
    
    if (cachedData) {
      console.log('Using stale in-memory cache as fallback');
      return {
        data: cachedData.data,
        error: null, // Don't report error if we have fallback data
        fromCache: true,
        dataSource: 'stale-memory-cache'
      };
    }
    
    return {
      data: null,
      error: errorMessage
    };
  }
}

// Utility function to preload commonly accessed data
export async function preloadCommonCryptoData(): Promise<void> {
  try {
    // Silently preload Bitcoin and Ethereum data in the background
    // Use Promise.allSettled to handle failures gracefully
    await Promise.allSettled([
      fetchCryptoData('bitcoin', '7', 'usd', false),
      fetchCryptoData('ethereum', '7', 'usd', false)
    ]);
  } catch (error) {
    console.error('Error preloading common crypto data:', error);
    // Silently fail - this is just optimization
  }
}
