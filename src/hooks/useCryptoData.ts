
import { useState, useEffect, useRef, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { fetchCryptoData } from '@/utils/cryptoDataFetcher';
import { setupRealtimeChannel } from '@/utils/cryptoRealtimeChannel';
import { CryptoMarketData, UseCryptoDataResult } from '@/types/crypto';

export function useCryptoData(
  coinId: string = 'bitcoin',
  days: string = '7',
  currency: string = 'usd'
): UseCryptoDataResult {
  const [data, setData] = useState<CryptoMarketData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isRealtime, setIsRealtime] = useState(false);
  const [dataSource, setDataSource] = useState<string>("loading");
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);
  
  // Use refs to store timers and channels
  const fetchTimerRef = useRef<number | null>(null);
  const realtimeChannelRef = useRef<any>(null);
  const lastFetchRef = useRef<number>(0);
  const paramsRef = useRef({ coinId, days, currency });
  
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
      
    if (!force && !hasParamsChanged && now - lastFetchRef.current < 30000) {
      return;
    }
    
    // Update the params ref with the current values
    paramsRef.current = { coinId, days, currency };
    
    setLoading(true);
    setError(null);

    const result = await fetchCryptoData(coinId, days, currency, force);
    
    if (result.data) {
      setData(result.data);
      setIsRealtime(result.data.isRealtime || false);
      setDataSource(result.data.dataSource || "unknown");
      setLastUpdated(result.data.fetchedAt || new Date().toISOString());
      lastFetchRef.current = now;
    } else if (result.error) {
      setError(result.error);
    }
    
    setLoading(false);
  }, [coinId, days, currency, loading]);
  
  // Set up realtime updates and polling
  useEffect(() => {
    // Always fetch data immediately on mount or when parameters change
    fetchCryptoDataCallback(true);
    
    // Set up realtime channel for updates
    const onRealtimeUpdate = (payload: any) => {
      const updatedData = payload.data;
      setData(updatedData);
      setIsRealtime(updatedData.isRealtime || false);
      setDataSource(updatedData.dataSource || "realtime-update");
      setLastUpdated(payload.updatedAt || new Date().toISOString());
      lastFetchRef.current = Date.now();
      
      toast({
        title: "تحديث البيانات",
        description: "تم تحديث بيانات العملة الرقمية",
      });
    };

    const channel = setupRealtimeChannel(coinId, days, currency, onRealtimeUpdate);
    realtimeChannelRef.current = channel;
    
    // Set up polling interval (5 minutes for standard data, 1 minute for 1-day view)
    const intervalMs = days === '1' ? 60000 : 300000;
    
    // Clear any existing timer
    if (fetchTimerRef.current !== null) {
      window.clearInterval(fetchTimerRef.current);
    }
    
    // Set up new timer for polling
    fetchTimerRef.current = window.setInterval(() => {
      fetchCryptoDataCallback();
    }, intervalMs);
    
    // Clean up on unmount
    return () => {
      if (fetchTimerRef.current !== null) {
        window.clearInterval(fetchTimerRef.current);
        fetchTimerRef.current = null;
      }
      if (realtimeChannelRef.current) {
        supabase.removeChannel(realtimeChannelRef.current);
        realtimeChannelRef.current = null;
      }
    };
  }, [coinId, days, currency, fetchCryptoDataCallback]);
  
  // Function to manually refresh data
  const refreshData = useCallback(() => {
    fetchCryptoDataCallback(true);
    toast({
      title: "جاري التحديث",
      description: "يتم تحديث بيانات العملة الرقمية الآن",
    });
  }, [fetchCryptoDataCallback]);

  return { 
    data, 
    loading, 
    error, 
    refreshData, 
    isRealtime, 
    dataSource,
    lastUpdated
  };
}

// Re-export the type for convenience
export type { CryptoMarketData } from '@/types/crypto';
