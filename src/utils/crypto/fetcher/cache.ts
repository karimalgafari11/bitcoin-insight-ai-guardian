
import { CryptoMarketData } from '@/types/crypto';
import { MEMORY_CACHE_TTL, MEMORY_CACHE_STALE_TTL } from '../constants';

// Improved in-memory cache for data retention between requests
const inMemoryCache: Record<string, { 
  data: CryptoMarketData; 
  timestamp: number;
  hash: string; // Added hash to detect actual data changes
}> = {};

// Track active requests more efficiently to prevent duplicate concurrent requests
const pendingRequests = new Map<string, Promise<any>>();

/**
 * Simple hash function to detect real data changes
 */
function hashData(data: any): string {
  if (!data) return "empty";
  try {
    // Create a hash based on select critical data points
    const prices = data.prices || [];
    const lastPrice = prices.length > 0 ? prices[prices.length - 1][1] : 0;
    const metaHash = data.metadata ? 
      `${data.metadata.current_price}-${data.metadata.percent_change_24h}` : 
      'nometa';
    
    return `${lastPrice}-${prices.length}-${metaHash}-${data.isMockData ? 'mock' : 'real'}-${data.dataSource || 'unknown'}`;
  } catch (e) {
    return String(Date.now()); // Fallback
  }
}

/**
 * Get data from in-memory cache if available and not expired
 * With improved handling of cache freshness
 */
export function getFromCache(
  cacheKey: string, 
  force: boolean = false
): { data: CryptoMarketData; fromCache: boolean; dataSource: string } | null {
  const now = Date.now();
  const cachedData = inMemoryCache[cacheKey];
  
  if (!force && cachedData) {
    const cacheAge = now - cachedData.timestamp;
    
    if (cacheAge < MEMORY_CACHE_TTL) {
      console.log('Using fresh in-memory cached data');
      return {
        data: cachedData.data,
        fromCache: true,
        dataSource: cachedData.data.dataSource || 'memory-cache-fresh'
      };
    }
  }
  
  return null;
}

/**
 * Store data in memory cache with hash comparison to detect actual changes
 */
export function storeInCache(
  cacheKey: string,
  data: CryptoMarketData
): boolean {
  // Check if we already have this exact data cached (using hash comparison)
  const existingCache = inMemoryCache[cacheKey];
  const newDataHash = hashData(data);
  
  if (existingCache && existingCache.hash === newDataHash) {
    // Data hasn't actually changed, just update the timestamp
    inMemoryCache[cacheKey].timestamp = Date.now();
    return false; // Return false to indicate no actual data change
  }
  
  // Store new or updated data
  inMemoryCache[cacheKey] = {
    data,
    timestamp: Date.now(),
    hash: newDataHash
  };
  
  return true; // Return true to indicate data has changed
}

/**
 * Get fallback data from cache even if expired
 * With improved stale data handling
 */
export function getFallbackFromCache(cacheKey: string): { data: CryptoMarketData; fromCache: boolean; dataSource: string } | null {
  const cachedData = inMemoryCache[cacheKey];
  const now = Date.now();
  
  if (cachedData && (now - cachedData.timestamp) < MEMORY_CACHE_STALE_TTL) {
    console.log('Using stale in-memory cache as fallback');
    return {
      data: cachedData.data,
      fromCache: true,
      dataSource: 'stale-memory-cache'
    };
  }
  
  return null;
}

/**
 * Check if there's a pending request for this data
 */
export function hasPendingRequest(cacheKey: string): boolean {
  return pendingRequests.has(cacheKey);
}

/**
 * Get a pending request if one exists
 */
export function getPendingRequest(cacheKey: string): Promise<any> | undefined {
  return pendingRequests.get(cacheKey);
}

/**
 * Set a pending request 
 */
export function setPendingRequest(cacheKey: string, requestPromise: Promise<any>): void {
  pendingRequests.set(cacheKey, requestPromise);
}

/**
 * Remove a pending request when completed
 */
export function removePendingRequest(cacheKey: string): void {
  pendingRequests.delete(cacheKey);
}

/**
 * Clear stale entries from memory cache
 */
export function cleanupStaleCache(): void {
  const now = Date.now();
  
  Object.keys(inMemoryCache).forEach(key => {
    const cacheEntry = inMemoryCache[key];
    if (now - cacheEntry.timestamp > MEMORY_CACHE_STALE_TTL) {
      delete inMemoryCache[key];
    }
  });
}
