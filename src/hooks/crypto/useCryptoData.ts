
import { useState, useEffect, useRef, useCallback } from 'react';
import { toast } from '@/components/ui/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';
import { CryptoMarketData, UseCryptoDataResult } from '@/types/crypto';
import { fetchCryptoData, preloadCommonCryptoData } from '@/utils/crypto/fetcher';
import { useCryptoDataTimers } from './useCryptoDataTimers';
import { useCryptoDataRefresh } from './useCryptoDataRefresh';
import { useCryptoRealtimeChannel } from './useCryptoRealtimeChannel';
import { useCryptoPolling } from './useCryptoPolling';
import { useCryptoDataFetch } from './useCryptoDataFetch';
import { setupRealtimeChannel, cleanupChannel } from '@/utils/crypto/cryptoRealtimeChannel';
import { cleanupStaleCache } from '@/utils/crypto/fetcher/cache';

// Track mounted instances to optimize network requests more efficiently
const mountedInstances = new Map<string, number>();

export function useCryptoData(
  coinId: string = 'bitcoin',
  days: string = '7',
  currency: string = 'usd'
): UseCryptoDataResult {
  const { t } = useLanguage();
  const [data, setData] = useState<CryptoMarketData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isRealtime, setIsRealtime] = useState(false);
  const [dataSource, setDataSource] = useState<string>("loading");
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());
  
  // Enhanced refs to better track component state and prevent memory leaks
  const mountedRef = useRef<boolean>(true);
  const lastFetchRef = useRef<number>(0);
  const paramsRef = useRef({ coinId, days, currency });
  const instanceIdRef = useRef<string>(`${coinId}:${days}:${currency}`);
  const lastDataHashRef = useRef<string>(''); // Track last data hash to prevent unnecessary updates
  const updateCountRef = useRef<number>(0); // Track number of updates to detect unusual activity
  
  // Custom hooks for various functionality
  const { fetchTimerRef, realtimeChannelRef, abortControllerRef } = useCryptoDataTimers();
  const { pollingEnabled, setPollingEnabled, togglePolling } = useCryptoPolling(fetchTimerRef);
  
  // Import and use the data fetching logic with additional safeguards
  const { fetchCryptoDataCallback } = useCryptoDataFetch({
    coinId,
    days,
    currency,
    loading,
    mountedRef,
    paramsRef,
    abortControllerRef,
    instanceIdRef,
    lastFetchRef,
    lastDataHashRef,
    setLoading,
    setError,
    setData,
    setIsRealtime,
    setDataSource,
    setLastUpdated,
    setLastRefresh,
    setPollingEnabled
  });
  
  // The custom hook for refresh functionality
  const { refreshData } = useCryptoDataRefresh({
    mountedRef,
    fetchCryptoDataCallback,
    setLastRefresh,
    t
  });
  
  // Improved handler for realtime updates
  const handleRealtimeUpdate = useCallback((payload: any) => {
    if (!mountedRef.current || !payload.data) return;
    
    const updatedData = payload.data;
    updateCountRef.current++;
    
    // Implement rate limiting for realtime updates - no more than 3 updates per minute
    const now = Date.now();
    if (updateCountRef.current > 3 && now - lastFetchRef.current < 60000) {
      console.log('Rate limiting realtime updates - too many too quickly');
      return;
    }
    
    // Update only if data is different from what we already have
    const currentHash = lastDataHashRef.current;
    const newHash = JSON.stringify(updatedData.prices?.[updatedData.prices.length - 1] || '');
    
    if (currentHash === newHash && data) {
      console.log('Skipping update - data has not changed');
      return;
    }
    
    lastDataHashRef.current = newHash;
    
    console.log('Processing realtime update');
    setData(updatedData);
    setIsRealtime(true);
    setDataSource(updatedData.dataSource || "realtime-update");
    setLastUpdated(payload.updatedAt || new Date().toISOString());
    lastFetchRef.current = now;
    
    // Only show toast for significant data updates, not small changes
    if (!updatedData.fromCache && updateCountRef.current <= 2) {
      toast({
        title: t("تحديث البيانات", "Data Update"),
        description: t("تم تحديث بيانات العملة الرقمية", "Cryptocurrency data updated"),
      });
    }
  }, [data, lastDataHashRef, lastFetchRef, mountedRef, t]);
  
  // Set up realtime updates and polling with improved stability
  useEffect(() => {
    mountedRef.current = true;
    updateCountRef.current = 0;
    const instanceId = `${coinId}:${days}:${currency}`;
    
    // Register this instance with reference counting
    const currentCount = mountedInstances.get(instanceId) || 0;
    mountedInstances.set(instanceId, currentCount + 1);
    
    // Track if the parameters have changed from what we had before
    const paramsChanged = 
      paramsRef.current.coinId !== coinId || 
      paramsRef.current.days !== days || 
      paramsRef.current.currency !== currency;
    
    // Update params ref
    paramsRef.current = { coinId, days, currency };
    instanceIdRef.current = instanceId;
    
    // Only force refresh if parameters changed or this is the first instance
    const forceRefresh = paramsChanged || currentCount === 0;
    
    // Always fetch data immediately on mount or when parameters change
    fetchCryptoDataCallback(forceRefresh);
    
    // Clean up any existing channel before setting up a new one
    if (realtimeChannelRef.current) {
      cleanupChannel(paramsRef.current.coinId, paramsRef.current.days, paramsRef.current.currency);
      realtimeChannelRef.current = null;
    }

    // Set up the realtime channel
    const channel = setupRealtimeChannel(coinId, days, currency, handleRealtimeUpdate);
    realtimeChannelRef.current = channel;
    
    // If this is the first load of this type, preload common data
    if (currentCount === 0 && coinId === 'bitcoin' && days === '7') {
      // Wait a bit to not compete with initial load
      const preloadTimerId = setTimeout(() => {
        if (mountedRef.current) {
          preloadCommonCryptoData();
        }
      }, 8000); // Increased from 5000 to avoid congestion
      
      // Clean stale cache entries occasionally
      const cleanupTimerId = setTimeout(() => {
        if (mountedRef.current) {
          cleanupStaleCache();
        }
      }, 30000);
      
      // Make sure to clear timers on cleanup
      return () => {
        mountedRef.current = false;
        clearTimeout(preloadTimerId);
        clearTimeout(cleanupTimerId);
        
        // Update instance reference counting
        const updatedCount = mountedInstances.get(instanceId) || 0;
        if (updatedCount <= 1) {
          mountedInstances.delete(instanceId);
        } else {
          mountedInstances.set(instanceId, updatedCount - 1);
        }
        
        // Clear polling timer
        if (fetchTimerRef.current !== null) {
          window.clearInterval(fetchTimerRef.current);
          fetchTimerRef.current = null;
        }
        
        // Clean up realtime channel
        if (realtimeChannelRef.current) {
          cleanupChannel(coinId, days, currency);
          realtimeChannelRef.current = null;
        }
        
        // Abort any in-flight requests
        if (abortControllerRef.current) {
          abortControllerRef.current.abort();
          abortControllerRef.current = null;
        }
      };
    }
    
    // Clean up on unmount
    return () => {
      mountedRef.current = false;
      
      // Update instance reference counting
      const updatedCount = mountedInstances.get(instanceId) || 0;
      if (updatedCount <= 1) {
        mountedInstances.delete(instanceId);
      } else {
        mountedInstances.set(instanceId, updatedCount - 1);
      }
      
      // Clear polling timer
      if (fetchTimerRef.current !== null) {
        window.clearInterval(fetchTimerRef.current);
        fetchTimerRef.current = null;
      }
      
      // Clean up realtime channel
      if (realtimeChannelRef.current) {
        cleanupChannel(coinId, days, currency);
        realtimeChannelRef.current = null;
      }
      
      // Abort any in-flight requests
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
        abortControllerRef.current = null;
      }
    };
  }, [coinId, days, currency, fetchCryptoDataCallback, handleRealtimeUpdate]);

  return { 
    data, 
    loading, 
    error, 
    refreshData, 
    isRealtime, 
    dataSource,
    lastUpdated,
    lastRefresh,
    pollingEnabled,
    togglePolling
  };
}

// Re-export the type for convenience
export type { CryptoMarketData } from '@/types/crypto';
