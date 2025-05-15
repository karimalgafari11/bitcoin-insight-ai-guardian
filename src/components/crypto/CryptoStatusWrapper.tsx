
import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import CryptoLoadingState from './CryptoLoadingState';
import CryptoErrorState from './CryptoErrorState';
import CryptoEmptyState from './CryptoEmptyState';
import { Button } from '@/components/ui/button';
import { RefreshCcw } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface CryptoStatusWrapperProps {
  loading: boolean;
  error: string | null;
  isEmpty?: boolean;
  onRefresh?: () => void;
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
  
  return <>{children}</>;
};

export default CryptoStatusWrapper;
