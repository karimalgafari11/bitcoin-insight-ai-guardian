
import { useState, useEffect } from 'react';
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

  useEffect(() => {
    // Create a flag to track if the component is still mounted
    let isMounted = true;
    
    async function fetchCryptoData() {
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

        // If component has been unmounted, don't update state
        if (!isMounted) return;

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
      } catch (err) {
        // Only update state if component is still mounted
        if (!isMounted) return;
        
        console.error('Error fetching crypto data:', err);
        const errorMessage = err instanceof Error ? err.message : 'خطأ في جلب بيانات العملة الرقمية';
        setError(errorMessage);
        toast({
          title: "خطأ",
          description: errorMessage,
          variant: "destructive"
        });
      } finally {
        // Only update state if component is still mounted
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    fetchCryptoData();
    
    // Cleanup function to handle component unmounting
    return () => {
      isMounted = false;
    };
  }, [coinId, days, currency]);

  return { data, loading, error };
}
