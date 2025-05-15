
import { useState, useEffect, useRef } from 'react';
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

// Track mounted instances to optimize network requests
const mountedInstances = new Set<string>();

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
  
  // Use refs to track component state
  const mountedRef = useRef<boolean>(true);
  const lastFetchRef = useRef<number>(0);
  const paramsRef = useRef({ coinId, days, currency });
  const instanceIdRef = useRef<string>(`${coinId}:${days}:${currency}`);
  
  // Custom hooks for various functionality
  const { fetchTimerRef, realtimeChannelRef, abortControllerRef } = useCryptoDataTimers();
  const { pollingEnabled, setPollingEnabled, togglePolling } = useCryptoPolling(fetchTimerRef);
  
  // Import and use the data fetching logic
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
  
  // Custom hook for realtime updates
  const { handleRealtimeUpdate } = useCryptoRealtimeChannel({
    mountedRef,
    setData,
    setIsRealtime,
    setDataSource,
    setLastUpdated,
    lastFetchRef,
    setLastRefresh,
    t
  });
  
  // Set up realtime updates and polling
  useEffect(() => {
    mountedRef.current = true;
    const instanceId = `${coinId}:${days}:${currency}`;
    const isFirstInstance = !mountedInstances.has(instanceId);
    
    // Register this instance
    mountedInstances.add(instanceId);
    
    // Always fetch data immediately on mount or when parameters change
    // but only force refresh if this is the first instance of this data request
    fetchCryptoDataCallback(isFirstInstance);
    
    // Clean up any existing channel before setting up a new one
    if (realtimeChannelRef.current) {
      cleanupChannel(paramsRef.current.coinId, paramsRef.current.days, paramsRef.current.currency);
    }

    // Set up the realtime channel
    const channel = setupRealtimeChannel(coinId, days, currency, handleRealtimeUpdate);
    realtimeChannelRef.current = channel;
    
    // If this is the first load of this type, preload common data
    if (isFirstInstance && coinId === 'bitcoin' && days === '7') {
      // Wait a bit to not compete with initial load
      setTimeout(() => {
        if (mountedRef.current) {
          preloadCommonCryptoData();
        }
      }, 5000);
    }
    
    // Clean up on unmount
    return () => {
      mountedRef.current = false;
      
      // Remove this instance from the registry
      mountedInstances.delete(instanceId);
      
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
