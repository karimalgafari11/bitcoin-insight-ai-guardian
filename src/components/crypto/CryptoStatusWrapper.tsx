
import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import CryptoLoadingState from './CryptoLoadingState';
import CryptoErrorState from './CryptoErrorState';
import CryptoEmptyState from './CryptoEmptyState';
import { Button } from '@/components/ui/button';
import { Loader2, RefreshCcw, AlertTriangle } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface CryptoStatusWrapperProps {
  loading: boolean;
  error: string | null;
  isEmpty?: boolean;
  onRefresh?: () => void;
  isStaleData?: boolean;
  dataSource?: string;
  children: React.ReactNode;
}

/**
 * مكون يغلف محتوى بيانات العملة الرقمية ويعرض حالات مختلفة
 * (تحميل، خطأ، لا بيانات) بشكل متسق عبر التطبيق
 */
const CryptoStatusWrapper: React.FC<CryptoStatusWrapperProps> = ({
  loading,
  error,
  isEmpty = false,
  onRefresh,
  isStaleData = false,
  dataSource,
  children
}) => {
  const { t } = useLanguage();
  
  const handleRefresh = () => {
    if (onRefresh) {
      toast({
        title: t("جاري التحديث", "Refreshing data"),
        description: t("نحاول جلب أحدث البيانات...", "Fetching latest data...")
      });
      onRefresh();
    }
  };
  
  if (loading) {
    return <CryptoLoadingState />;
  }
  
  if (error) {
    return (
      <div className="space-y-4">
        <CryptoErrorState error={error} />
        {onRefresh && (
          <div className="flex justify-center">
            <Button 
              variant="outline" 
              onClick={handleRefresh}
              className="gap-2"
            >
              <RefreshCcw className="h-4 w-4" />
              {t("إعادة المحاولة", "Try again")}
            </Button>
          </div>
        )}
      </div>
    );
  }
  
  if (isEmpty) {
    return <CryptoEmptyState />;
  }
  
  // Show a warning if using stale data but display the content
  if (isStaleData) {
    return (
      <>
        <Alert className="mb-4 border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20">
          <AlertTriangle className="h-4 w-4 text-yellow-500" />
          <AlertTitle className="text-yellow-700 dark:text-yellow-400">{t("بيانات غير محدثة", "Stale Data")}</AlertTitle>
          <AlertDescription className="text-yellow-600 dark:text-yellow-300">
            {t(
              "نعرض بيانات مخزنة مؤقتًا. انقر على تحديث للحصول على أحدث البيانات.",
              "Displaying cached data. Click refresh to get the latest data."
            )}
            {onRefresh && (
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleRefresh}
                className="gap-2 ml-2 mt-2 border-yellow-500 text-yellow-700 hover:bg-yellow-100 dark:hover:bg-yellow-900/40"
              >
                <RefreshCcw className="h-3 w-3" />
                {t("تحديث", "Refresh")}
              </Button>
            )}
          </AlertDescription>
        </Alert>
        {children}
      </>
    );
  }
  
  // Show a warning if using mock data but display the content
  if (dataSource === 'mock') {
    return (
      <>
        <Alert className="mb-4 border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20">
          <AlertTriangle className="h-4 w-4 text-yellow-500" />
          <AlertTitle className="text-yellow-700 dark:text-yellow-400">{t("بيانات تجريبية", "Mock Data")}</AlertTitle>
          <AlertDescription className="text-yellow-600 dark:text-yellow-300">
            {t(
              "نعرض بيانات تجريبية بسبب عدم إمكانية الوصول لمصادر البيانات الحقيقية.",
              "Displaying mock data because real data sources are unavailable."
            )}
            {onRefresh && (
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleRefresh}
                className="gap-2 ml-2 mt-2 border-yellow-500 text-yellow-700 hover:bg-yellow-100 dark:hover:bg-yellow-900/40"
              >
                <RefreshCcw className="h-3 w-3" />
                {t("إعادة المحاولة", "Try again")}
              </Button>
            )}
          </AlertDescription>
        </Alert>
        {children}
      </>
    );
  }
  
  return <>{children}</>;
};

export default CryptoStatusWrapper;
