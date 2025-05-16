
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
  lastDataHashRef: React.MutableRefObject<string>;
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
  lastDataHashRef,
  setLoading,
  setError,
  setData,
  setIsRealtime,
  setDataSource,
  setLastUpdated,
  setLastRefresh,
  setPollingEnabled
}: UseCryptoDataFetchProps) {
  // Function to generate a simple hash for comparing data
  const generateDataHash = (cryptoData: CryptoMarketData | null): string => {
    if (!cryptoData || !cryptoData.prices || cryptoData.prices.length === 0) return '';
    const lastPrice = cryptoData.prices[cryptoData.prices.length - 1];
    // Use metadata.symbol or symbol or fallback to coinId
    const symbolToUse = cryptoData.metadata?.symbol || cryptoData.symbol || coinId;
    return `${symbolToUse}-${lastPrice?.[0]}-${lastPrice?.[1]}-${cryptoData.dataSource}`;
  };

  // Enhanced fetch function with better data change detection and error handling
  const fetchCryptoDataCallback = useCallback(async (force = false) => {
    // Don't fetch again if we're already loading, unless force=true
    if (loading && !force) return;
    
    const now = Date.now();
    // Rate limit our requests - only fetch again if it's been at least CACHE_TTL
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
    
    let shouldShowLoading = true; // Default to showing loading state
    let currentData: CryptoMarketData | null = null;
    
    try {
      // Get the current data to check if we need to show loading
      currentData = await new Promise(resolve => {
        setData(existingData => {
          resolve(existingData);
          return existingData;
        });
      });
      
      // Only show loading if we don't have any data yet
      shouldShowLoading = !currentData;
      
      if (shouldShowLoading) {
        setLoading(true);
      }
      setError(null);

      // Request data with force flag if specified
      const result = await fetchCryptoData(coinId, days, currency, force);
      
      // Only update state if component is still mounted
      if (!mountedRef.current) return;
      
      if (result.data) {
        // Check if the data has actually changed to prevent unnecessary re-renders
        const newDataHash = generateDataHash(result.data);
        const dataChanged = newDataHash !== lastDataHashRef.current;
        
        if (dataChanged || force) {
          console.log(`Data ${dataChanged ? 'changed' : 'force updated'}, updating state`);
          lastDataHashRef.current = newDataHash;
          
          setData(result.data);
          
          // Set isRealtime appropriately
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
        } else {
          console.log('Data has not changed, skipping state update');
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
      if (mountedRef.current && shouldShowLoading) {
        setLoading(false);
      }
    }
  }, [coinId, days, currency, loading, mountedRef, paramsRef, abortControllerRef, instanceIdRef, lastFetchRef, lastDataHashRef, setLoading, setError, setData, setIsRealtime, setDataSource, setLastUpdated, setLastRefresh, setPollingEnabled]);

  return { fetchCryptoDataCallback };
}
