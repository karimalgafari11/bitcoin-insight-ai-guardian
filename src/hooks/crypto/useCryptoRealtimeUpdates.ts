
import { useCallback } from 'react';
import { toast } from '@/components/ui/use-toast';
import { CryptoMarketData } from '@/types/crypto';

interface UseCryptoRealtimeUpdatesProps {
  mountedRef: React.MutableRefObject<boolean>;
  data: CryptoMarketData | null;
  lastFetchRef: React.MutableRefObject<number>;
  lastDataHashRef: React.MutableRefObject<string>;
  updateCountRef: React.MutableRefObject<number>;
  setData: React.Dispatch<React.SetStateAction<CryptoMarketData | null>>;
  setIsRealtime: React.Dispatch<React.SetStateAction<boolean>>;
  setDataSource: React.Dispatch<React.SetStateAction<string>>;
  setLastUpdated: React.Dispatch<React.SetStateAction<string | null>>;
  t: (arabic: string, english: string) => string;
}

export function useCryptoRealtimeUpdates({
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
}: UseCryptoRealtimeUpdatesProps) {
  // Improved handler for realtime updates
  const handleRealtimeUpdate = useCallback((payload: any) => {
    if (!mountedRef.current || !payload.data) return;
    
    const updatedData = payload.data;
    updateCountRef.current++;
    
    // Implement rate limiting for realtime updates - no more than 3 updates per minute
    const now = Date.now();
    if (updateCountRef.current > 3 && now - lastFetchRef.current < 60000) {
      console.log('Rate limiting realtime updates - too many too quickly');
      return;
    }
    
    // Update only if data is different from what we already have
    const currentHash = lastDataHashRef.current;
    const newHash = JSON.stringify(updatedData.prices?.[updatedData.prices.length - 1] || '');
    
    if (currentHash === newHash && data) {
      console.log('Skipping update - data has not changed');
      return;
    }
    
    lastDataHashRef.current = newHash;
    
    console.log('Processing realtime update');
    setData(updatedData);
    setIsRealtime(true);
    setDataSource(updatedData.dataSource || "realtime-update");
    setLastUpdated(payload.updatedAt || new Date().toISOString());
    lastFetchRef.current = now;
    
    // Only show toast for significant data updates, not small changes
    if (!updatedData.fromCache && updateCountRef.current <= 2) {
      toast({
        title: t("تحديث البيانات", "Data Update"),
        description: t("تم تحديث بيانات العملة الرقمية", "Cryptocurrency data updated"),
      });
    }
  }, [data, lastDataHashRef, lastFetchRef, mountedRef, setData, setDataSource, setIsRealtime, setLastUpdated, t, updateCountRef]);

  return { handleRealtimeUpdate };
}
