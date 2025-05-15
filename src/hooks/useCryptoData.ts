
import { useState, useEffect, useRef, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';

export interface CryptoMarketData {
  prices: [number, number][];
  market_caps: [number, number][];
  total_volumes: [number, number][];
  metadata?: {
    name: string;
    symbol: string;
    current_price: number;
    market_cap: number;
    volume_24h: number;
    percent_change_24h: number;
    percent_change_7d: number;
    last_updated: string;
  };
  isRealtime?: boolean;
  isMockData?: boolean;
  dataSource?: string;
  fromCache?: boolean;
  fetchedAt?: string;
  cacheTime?: string;
}

export function useCryptoData(coinId: string = 'bitcoin', days: string = '7', currency: string = 'usd') {
  const [data, setData] = useState<CryptoMarketData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isRealtime, setIsRealtime] = useState(false);
  const [dataSource, setDataSource] = useState<string>("loading");
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);
  
  // Use a ref to store the fetch timer
  const fetchTimerRef = useRef<number | null>(null);
  const realtimeChannelRef = useRef<any>(null);
  
  // Track the last fetch time to avoid excessive API calls
  const lastFetchRef = useRef<number>(0);
  
  // Store the latest request parameters to avoid duplicate requests
  const paramsRef = useRef({ coinId, days, currency });
  
  // Function to fetch data
  const fetchCryptoData = useCallback(async (force = false) => {
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
    
    try {
      setLoading(true);
      setError(null);
      
      console.log(`Fetching data for ${coinId}, days: ${days}, currency: ${currency}`);
      
      // Use the new crypto-cache function instead of direct crypto-data function
      const { data: responseData, error: responseError } = await supabase.functions.invoke('crypto-cache', {
        body: {
          coinId,
          days,
          currency,
          forceRefresh: force
        }
      });

      if (responseError) {
        console.error('Supabase function error:', responseError);
        throw new Error(responseError.message);
      }

      if (!responseData) {
        throw new Error('No data received from API');
      }
      
      console.log('Received cryptocurrency data:', responseData);
      
      // Validate that the response has the required data structure
      if (!responseData.prices || !Array.isArray(responseData.prices)) {
        console.error('Invalid data format received:', responseData);
        throw new Error('Invalid data format received from API');
      }

      setData(responseData as CryptoMarketData);
      setIsRealtime(responseData.isRealtime || false);
      setDataSource(responseData.dataSource || "unknown");
      setLastUpdated(responseData.fetchedAt || new Date().toISOString());
      
      // Update the last fetch time
      lastFetchRef.current = now;
    } catch (err) {
      console.error('Error fetching crypto data:', err);
      const errorMessage = err instanceof Error ? err.message : 'خطأ في جلب بيانات العملة الرقمية';
      setError(errorMessage);
      toast({
        title: "خطأ",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  }, [coinId, days, currency, loading]);
  
  // Set up realtime channel for updates
  const setupRealtimeChannel = useCallback(() => {
    if (realtimeChannelRef.current) {
      supabase.removeChannel(realtimeChannelRef.current);
    }

    // Setup a channel for real-time updates
    const channelName = `crypto-${coinId}-${days}-${currency}`;
    console.log(`Setting up realtime channel: ${channelName}`);
    
    const channel = supabase
      .channel(channelName)
      .on('broadcast', { event: 'crypto-update' }, (payload) => {
        if (payload.payload && 
            payload.payload.coinId === coinId && 
            payload.payload.days === days && 
            payload.payload.currency === currency) {
          console.log('Received real-time crypto update:', payload.payload);
          
          const updatedData = payload.payload.data;
          setData(updatedData);
          setIsRealtime(updatedData.isRealtime || false);
          setDataSource(updatedData.dataSource || "realtime-update");
          setLastUpdated(payload.payload.updatedAt || new Date().toISOString());
          lastFetchRef.current = Date.now();
          
          // Show a toast notification for the update
          toast({
            title: "تحديث البيانات",
            description: "تم تحديث بيانات العملة الرقمية",
          });
        }
      })
      .subscribe((status) => {
        console.log(`Realtime subscription status: ${status}`);
      });

    realtimeChannelRef.current = channel;
    return channel;
  }, [coinId, days, currency]);
  
  // Set up polling for real-time updates
  useEffect(() => {
    // Always fetch data immediately on mount or when parameters change
    fetchCryptoData(true);
    
    // Set up realtime channel
    const channel = setupRealtimeChannel();
    
    // Set up polling interval (5 minutes for standard data, 1 minute for 1-day view)
    const intervalMs = days === '1' ? 60000 : 300000;
    
    // Clear any existing timer
    if (fetchTimerRef.current !== null) {
      window.clearInterval(fetchTimerRef.current);
    }
    
    // Set up new timer for polling
    fetchTimerRef.current = window.setInterval(() => {
      fetchCryptoData();
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
  }, [coinId, days, currency, fetchCryptoData, setupRealtimeChannel]);
  
  // Function to manually refresh data
  const refreshData = useCallback(() => {
    fetchCryptoData(true);
    toast({
      title: "جاري التحديث",
      description: "يتم تحديث بيانات العملة الرقمية الآن",
    });
  }, [fetchCryptoData]);

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
