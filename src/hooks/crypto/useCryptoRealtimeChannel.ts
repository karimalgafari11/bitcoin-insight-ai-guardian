
import { useCallback } from 'react';
import { toast } from '@/components/ui/use-toast';
import { CryptoMarketData } from '@/types/crypto';

interface UseCryptoRealtimeChannelProps {
  mountedRef: React.MutableRefObject<boolean>;
  setData: React.Dispatch<React.SetStateAction<CryptoMarketData | null>>;
  setIsRealtime: React.Dispatch<React.SetStateAction<boolean>>;
  setDataSource: React.Dispatch<React.SetStateAction<string>>;
  setLastUpdated: React.Dispatch<React.SetStateAction<string | null>>;
  lastFetchRef: React.MutableRefObject<number>;
  setLastRefresh: React.Dispatch<React.SetStateAction<Date>>;
  t: (arabic: string, english: string) => string;
}

export function useCryptoRealtimeChannel({
  mountedRef,
  setData,
  setIsRealtime,
  setDataSource,
  setLastUpdated,
  lastFetchRef,
  setLastRefresh,
  t
}: UseCryptoRealtimeChannelProps) {
  // Handle realtime updates from the Supabase channel
  const handleRealtimeUpdate = useCallback((payload: any) => {
    if (!payload.data || !mountedRef.current) return;
    
    const updatedData = payload.data;
    
    // Ensure we set isRealtime correctly from broadcasted data
    setData(updatedData);
    setIsRealtime(true); // Explicit set to true for realtime updates
    setDataSource(updatedData.dataSource || "realtime-update");
    setLastUpdated(payload.updatedAt || new Date().toISOString());
    lastFetchRef.current = Date.now();
    setLastRefresh(new Date());
    
    // Only show toast for real data updates, not cache hits
    if (!updatedData.fromCache) {
      toast({
        title: t("تحديث البيانات", "Data Update"),
        description: t("تم تحديث بيانات العملة الرقمية دون مغادرة الصفحة", "Cryptocurrency data updated without leaving the page"),
      });
    }
  }, [mountedRef, setData, setIsRealtime, setDataSource, setLastUpdated, lastFetchRef, setLastRefresh, t]);

  return { handleRealtimeUpdate };
}
