
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface CryptoMarketData {
  prices: [number, number][];
  market_caps: [number, number][];
  total_volumes: [number, number][];
}

export function useCryptoData(coinId: string = 'bitcoin', days: string = '7', currency: string = 'usd') {
  const [data, setData] = useState<CryptoMarketData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchCryptoData() {
      try {
        setLoading(true);
        setError(null);

        const { data, error } = await supabase.functions.invoke('crypto-data', {
          body: {
            coinId,
            days,
            currency
          }
        });

        if (error) {
          throw new Error(error.message);
        }

        setData(data);
      } catch (err) {
        console.error('Error fetching crypto data:', err);
        setError(err instanceof Error ? err.message : 'خطأ في جلب بيانات العملة الرقمية');
      } finally {
        setLoading(false);
      }
    }

    fetchCryptoData();
  }, [coinId, days, currency]);

  return { data, loading, error };
}
