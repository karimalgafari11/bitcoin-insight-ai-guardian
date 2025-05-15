
import { CryptoMarketData } from '@/types/crypto';
import { MEMORY_CACHE_TTL } from '../constants';

// Cache for in-memory data retention between requests
const inMemoryCache: Record<string, { data: CryptoMarketData; timestamp: number }> = {};

// Track active requests to prevent duplicate concurrent requests
const pendingRequests = new Map<string, Promise<any>>();

/**
 * Get data from in-memory cache if available and not expired
 */
export function getFromCache(
  cacheKey: string, 
  force: boolean = false
): { data: CryptoMarketData; fromCache: boolean; dataSource: string } | null {
  const now = Date.now();
  const cachedData = inMemoryCache[cacheKey];
  
  if (!force && cachedData && (now - cachedData.timestamp < MEMORY_CACHE_TTL)) {
    console.log('Using in-memory cached data');
    return {
      data: cachedData.data,
      fromCache: true,
      dataSource: cachedData.data.dataSource || 'memory-cache'
    };
  }
  
  return null;
}

/**
 * Store data in memory cache
 */
export function storeInCache(
  cacheKey: string,
  data: CryptoMarketData
): void {
  inMemoryCache[cacheKey] = {
    data,
    timestamp: Date.now()
  };
}

/**
 * Get fallback data from cache even if expired
 */
export function getFallbackFromCache(cacheKey: string): { data: CryptoMarketData; fromCache: boolean; dataSource: string } | null {
  const cachedData = inMemoryCache[cacheKey];
  
  if (cachedData) {
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
 * Get a pending request if one exists
 */
export function getPendingRequest(cacheKey: string): Promise<any> | undefined {
  return pendingRequests.get(cacheKey);
}

/**
 * Has pending request
 */
export function hasPendingRequest(cacheKey: string): boolean {
  return pendingRequests.has(cacheKey);
}
