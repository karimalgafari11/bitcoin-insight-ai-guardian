
import { useCallback } from 'react';
import { fetchCryptoData } from '@/utils/crypto/fetcher';
import { CACHE_TTL } from '@/utils/crypto/constants';
import { CryptoMarketData } from '@/types/crypto';

interface UseCryptoDataFetchProps {
  coinId: string;
  days: string;
  currency: string;
  loading: boolean;
  mountedRef: React.MutableRefObject<boolean>;
  paramsRef: React.MutableRefObject<{ coinId: string; days: string; currency: string }>;
  abortControllerRef: React.MutableRefObject<AbortController | null>;
  instanceIdRef: React.MutableRefObject<string>;
  lastFetchRef: React.MutableRefObject<number>;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setError: React.Dispatch<React.SetStateAction<string | null>>;
  setData: React.Dispatch<React.SetStateAction<CryptoMarketData | null>>;
  setIsRealtime: React.Dispatch<React.SetStateAction<boolean>>;
  setDataSource: React.Dispatch<React.SetStateAction<string>>;
  setLastUpdated: React.Dispatch<React.SetStateAction<string | null>>;
  setLastRefresh: React.Dispatch<React.SetStateAction<Date>>;
  setPollingEnabled: React.Dispatch<React.SetStateAction<boolean>>;
}

export function useCryptoDataFetch({
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
}: UseCryptoDataFetchProps) {
  // Function to fetch data
  const fetchCryptoDataCallback = useCallback(async (force = false) => {
    // Don't fetch again if we're already loading, unless force=true
    if (loading && !force) return;
    
    const now = Date.now();
    // Rate limit our requests - only fetch again if it's been at least 30 seconds
    // unless params have changed or force=true
    const hasParamsChanged = 
      paramsRef.current.coinId !== coinId ||
      paramsRef.current.days !== days ||
      paramsRef.current.currency !== currency;
      
    if (!force && !hasParamsChanged && now - lastFetchRef.current < CACHE_TTL) {
      return;
    }
    
    // Update the params ref with the current values
    paramsRef.current = { coinId, days, currency };
    instanceIdRef.current = `${coinId}:${days}:${currency}`;
    
    // Cancel any existing request before making a new one
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    abortControllerRef.current = new AbortController();
    
    setLoading(true);
    setError(null);

    try {
      // Use any cached data we have while fetching to provide a smooth experience
      const result = await fetchCryptoData(coinId, days, currency, force);
      
      // Only update state if component is still mounted
      if (!mountedRef.current) return;
      
      if (result.data) {
        setData(result.data);
        
        // Always set isRealtime to true for fresh data that's not mock data
        const isRealtimeData = !result.data.isMockData && !result.fromCache;
        setIsRealtime(isRealtimeData);
        
        setDataSource(result.data.dataSource || "unknown");
        setLastUpdated(result.data.fetchedAt || new Date().toISOString());
        lastFetchRef.current = now;
        setLastRefresh(new Date());
        
        // If we're getting real data, make sure polling is enabled
        if (!result.data.isMockData) {
          setPollingEnabled(true);
        }
      } else if (result.error) {
        setError(result.error);
      }
    } catch (err) {
      // Only set error for non-abort errors and if component is still mounted
      if (!(err instanceof DOMException && err.name === 'AbortError') && mountedRef.current) {
        console.error('Error in fetch callback:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
      }
    } finally {
      // Only update loading state if component is still mounted
      if (mountedRef.current) {
        setLoading(false);
      }
    }
  }, [coinId, days, currency, loading, mountedRef, paramsRef, abortControllerRef, instanceIdRef, lastFetchRef, setLoading, setError, setData, setIsRealtime, setDataSource, setLastUpdated, setLastRefresh, setPollingEnabled]);

  return { fetchCryptoDataCallback };
}
