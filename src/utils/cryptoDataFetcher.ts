
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { CryptoMarketData } from '@/types/crypto';
import { useLanguage } from '@/contexts/LanguageContext';

// Cache for in-memory data retention between requests
const inMemoryCache: Record<string, { data: CryptoMarketData; timestamp: number }> = {};

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
    
    if (!force && cachedData && (now - cachedData.timestamp < 15000)) {
      console.log('Using in-memory cached data');
      return {
        data: cachedData.data,
        error: null,
        fromCache: true,
        dataSource: cachedData.data.dataSource || 'memory-cache'
      };
    }
    
    // Set up the request timeout with AbortController
    const timeoutMs = 15000; // 15-second timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
    
    // Use the crypto-cache function with custom timeout handling
    const functionPromise = supabase.functions.invoke('crypto-cache', {
      body: {
        coinId,
        days,
        currency,
        forceRefresh: force
      },
      signal: controller.signal,
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
    ]).finally(() => clearTimeout(timeoutId));

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
    
    // Store successful response in memory cache
    inMemoryCache[cacheKey] = {
      data: responseData as CryptoMarketData,
      timestamp: now
    };

    return {
      data: responseData as CryptoMarketData,
      error: null,
      fromCache: responseData.fromCache,
      cacheTime: responseData.cacheTime,
      dataSource: responseData.dataSource
    };
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
    await Promise.allSettled([
      fetchCryptoData('bitcoin', '7', 'usd', false),
      fetchCryptoData('ethereum', '7', 'usd', false)
    ]);
  } catch (error) {
    console.error('Error preloading common crypto data:', error);
    // Silently fail - this is just optimization
  }
}
