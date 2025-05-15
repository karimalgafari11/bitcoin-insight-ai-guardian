
import { useState, useEffect, useRef, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { fetchCryptoData, preloadCommonCryptoData } from '@/utils/cryptoDataFetcher';
import { setupRealtimeChannel, cleanupChannel } from '@/utils/cryptoRealtimeChannel';
import { CryptoMarketData, UseCryptoDataResult } from '@/types/crypto';
import { useLanguage } from '@/contexts/LanguageContext';

// Track mounted instances to optimize network requests
const mountedInstances = new Set<string>();

// Cache TTL in milliseconds
const CACHE_TTL = 30000; // 30 seconds
const POLL_INTERVAL_STANDARD = 300000; // 5 minutes
const POLL_INTERVAL_SHORT = 60000; // 1 minute

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
  
  // Use refs to store timers and channels
  const fetchTimerRef = useRef<number | null>(null);
  const realtimeChannelRef = useRef<any>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const lastFetchRef = useRef<number>(0);
  const paramsRef = useRef({ coinId, days, currency });
  const instanceIdRef = useRef<string>(`${coinId}:${days}:${currency}`);
  const mountedRef = useRef<boolean>(true); // Track if component is mounted
  
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
      const result = await fetchCryptoData(coinId, days, currency, force);
      
      // Only update state if component is still mounted
      if (!mountedRef.current) return;
      
      if (result.data) {
        setData(result.data);
        setIsRealtime(result.data.isRealtime || false);
        setDataSource(result.data.dataSource || "unknown");
        setLastUpdated(result.data.fetchedAt || new Date().toISOString());
        lastFetchRef.current = now;
        setLastRefresh(new Date());
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
  }, [coinId, days, currency, loading]);
  
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
    
    // Set up realtime channel for updates
    const onRealtimeUpdate = (payload: any) => {
      if (!payload.data || !mountedRef.current) return;
      
      const updatedData = payload.data;
      setData(updatedData);
      setIsRealtime(updatedData.isRealtime || false);
      setDataSource(updatedData.dataSource || "realtime-update");
      setLastUpdated(payload.updatedAt || new Date().toISOString());
      lastFetchRef.current = Date.now();
      setLastRefresh(new Date());
      
      // Only show toast for real data updates, not cache hits
      if (!updatedData.fromCache) {
        toast({
          title: t("تحديث البيانات", "Data Update"),
          description: t("تم تحديث بيانات العملة الرقمية", "Cryptocurrency data updated"),
        });
      }
    };

    // Clean up any existing channel before setting up a new one
    if (realtimeChannelRef.current) {
      cleanupChannel(paramsRef.current.coinId, paramsRef.current.days, paramsRef.current.currency);
    }

    const channel = setupRealtimeChannel(coinId, days, currency, onRealtimeUpdate);
    realtimeChannelRef.current = channel;
    
    // Set up polling interval (5 minutes for standard data, 1 minute for 1-day view)
    const intervalMs = days === '1' ? POLL_INTERVAL_SHORT : POLL_INTERVAL_STANDARD;
    
    // Clear any existing timer
    if (fetchTimerRef.current !== null) {
      window.clearInterval(fetchTimerRef.current);
    }
    
    // Set up new timer for polling
    fetchTimerRef.current = window.setInterval(() => {
      if (mountedRef.current) {
        fetchCryptoDataCallback();
      }
    }, intervalMs);
    
    // If this is the first load of this type, preload common data
    // This helps ensure other views load faster when navigated to
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
      
      if (fetchTimerRef.current !== null) {
        window.clearInterval(fetchTimerRef.current);
        fetchTimerRef.current = null;
      }
      
      if (realtimeChannelRef.current) {
        cleanupChannel(coinId, days, currency);
        realtimeChannelRef.current = null;
      }
      
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
        abortControllerRef.current = null;
      }
    };
  }, [coinId, days, currency, fetchCryptoDataCallback, t]);
  
  // Function to manually refresh data
  const refreshData = useCallback(() => {
    if (mountedRef.current) {
      fetchCryptoDataCallback(true);
      setLastRefresh(new Date());
      toast({
        title: t("جاري التحديث", "Refreshing"),
        description: t("يتم تحديث بيانات العملة الرقمية الآن", "Updating cryptocurrency data now"),
      });
    }
  }, [fetchCryptoDataCallback, t]);

  return { 
    data, 
    loading, 
    error, 
    refreshData, 
    isRealtime, 
    dataSource,
    lastUpdated,
    lastRefresh
  };
}

// Re-export the type for convenience
export type { CryptoMarketData } from '@/types/crypto';
