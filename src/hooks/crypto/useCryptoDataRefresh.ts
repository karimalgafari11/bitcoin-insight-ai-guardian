
import { useCallback } from 'react';
import { toast } from '@/components/ui/use-toast';

interface UseCryptoDataRefreshProps {
  mountedRef: React.MutableRefObject<boolean>;
  fetchCryptoDataCallback: (force?: boolean) => Promise<void>;
  setLastRefresh: (date: Date) => void;
  t: (arabic: string, english: string) => string;
}

export function useCryptoDataRefresh({
  mountedRef,
  fetchCryptoDataCallback,
  setLastRefresh,
  t
}: UseCryptoDataRefreshProps) {
  // Function to manually refresh data
  const refreshData = useCallback(() => {
    if (mountedRef.current) {
      fetchCryptoDataCallback(true);
      setLastRefresh(new Date());
      toast({
        title: t("جاري التحديث", "Refreshing"),
        description: t("يتم تحديث بيانات العملة الرقمية دون مغادرة الصفحة", "Updating cryptocurrency data without leaving the page"),
      });
    }
  }, [fetchCryptoDataCallback, setLastRefresh, t, mountedRef]);

  return { refreshData };
}
