
import { useState, useEffect, useRef } from 'react';
import { toast } from '@/components/ui/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';
import { CryptoMarketData, UseCryptoDataResult } from '@/types/crypto';
import { fetchCryptoData, preloadCommonCryptoData } from '@/utils/crypto/fetcher';

// Import our modularized hooks
import { useCryptoDataTimers } from './useCryptoDataTimers';
import { useCryptoDataRefresh } from './useCryptoDataRefresh';
import { useCryptoRealtimeUpdates } from './useCryptoRealtimeUpdates';
import { useCryptoPolling } from './useCryptoPolling';
import { useCryptoDataFetching } from './useCryptoDataFetching';
import { useInstanceTracking } from './useInstanceTracking';
import { setupRealtimeChannel, cleanupChannel } from '@/utils/crypto/cryptoRealtimeChannel';
import { cleanupStaleCache } from '@/utils/crypto/fetcher/cache';

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
  
  // Use our custom hook for mounting/unmounting tracking
  const { mountedRef, instanceId, trackInstance, cleanupInstance } = useInstanceTracking(coinId, days, currency);
  
  // Enhanced refs to better track component state and prevent memory leaks
  const lastFetchRef = useRef<number>(0);
  const paramsRef = useRef({ coinId, days, currency });
  const lastDataHashRef = useRef<string>('');
  const updateCountRef = useRef<number>(0);
  
  // Custom hooks for various functionality
  const { fetchTimerRef, realtimeChannelRef, abortControllerRef } = useCryptoDataTimers();
  const { pollingEnabled, setPollingEnabled, togglePolling } = useCryptoPolling(fetchTimerRef);
  
  // Import and use the data fetching logic with additional safeguards
  const { fetchCryptoDataCallback } = useCryptoDataFetching({
    coinId,
    days,
    currency,
    loading,
    mountedRef,
    paramsRef,
    abortControllerRef,
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
  
  // Hook for realtime updates
  const { handleRealtimeUpdate } = useCryptoRealtimeUpdates({
    mountedRef,
    data,
    lastFetchRef,
    lastDataHashRef,
    updateCountRef,
    setData,
    setIsRealtime,
    setDataSource,
    setLastUpdated,
    t
  });
  
  // Set up realtime updates and polling with improved stability
  useEffect(() => {
    // Mark component as mounted
    mountedRef.current = true;
    updateCountRef.current = 0;
    
    // Register this instance with reference counting
    trackInstance();
    
    // Track if the parameters have changed from what we had before
    const paramsChanged = 
      paramsRef.current.coinId !== coinId || 
      paramsRef.current.days !== days || 
      paramsRef.current.currency !== currency;
    
    // Update params ref
    paramsRef.current = { coinId, days, currency };
    
    // Always fetch data immediately on mount or when parameters change
    fetchCryptoDataCallback(paramsChanged);
    
    // Clean up any existing channel before setting up a new one
    if (realtimeChannelRef.current) {
      cleanupChannel(paramsRef.current.coinId, paramsRef.current.days, paramsRef.current.currency);
      realtimeChannelRef.current = null;
    }

    // Set up the realtime channel
    const channel = setupRealtimeChannel(coinId, days, currency, handleRealtimeUpdate);
    realtimeChannelRef.current = channel;
    
    // If this is the first load of this type, preload common data
    if (coinId === 'bitcoin' && days === '7') {
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
        // Cleanup on unmount
        mountedRef.current = false;
        clearTimeout(preloadTimerId);
        clearTimeout(cleanupTimerId);
        
        cleanupInstance();
        
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
      
      cleanupInstance();
      
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
  }, [coinId, days, currency, fetchCryptoDataCallback, handleRealtimeUpdate, 
      trackInstance, cleanupInstance, realtimeChannelRef, fetchTimerRef, abortControllerRef]);

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
