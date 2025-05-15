
import { useState, useEffect, useRef } from 'react';
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
}

export function useCryptoData(coinId: string = 'bitcoin', days: string = '7', currency: string = 'usd') {
  const [data, setData] = useState<CryptoMarketData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Use a ref to store the fetch timer
  const fetchTimerRef = useRef<number | null>(null);
  
  // Track the last fetch time to avoid excessive API calls
  const lastFetchRef = useRef<number>(0);
  
  // Store the latest request parameters to avoid duplicate requests
  const paramsRef = useRef({ coinId, days, currency });
  
  // Function to fetch data
  const fetchCryptoData = async (force = false) => {
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
      
      const { data: responseData, error: responseError } = await supabase.functions.invoke('crypto-data', {
        body: {
          coinId,
          days,
          currency
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
  };
  
  // Set up polling for real-time updates
  useEffect(() => {
    // Always fetch data immediately on mount or when parameters change
    fetchCryptoData(true);
    
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
    };
  }, [coinId, days, currency]);
  
  // Function to manually refresh data
  const refreshData = () => {
    fetchCryptoData(true);
  };

  return { data, loading, error, refreshData };
}
