
import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Wifi, WifiOff, Database, CloudOff, CheckCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface CryptoDataSourceBadgeProps {
  loading: boolean;
  data: any | null;
  isRealtime: boolean;
  dataSource: string;
}

const CryptoDataSourceBadge: React.FC<CryptoDataSourceBadgeProps> = ({
  loading,
  data,
  isRealtime,
  dataSource
}) => {
  const { t } = useLanguage();
  
  if (loading) return null;
  
  if (!data) {
    return (
      <Badge variant="outline" className="bg-red-500/10 text-red-500 border-red-500">
        <CloudOff className="w-3 h-3 mr-1" />
        {t('لا توجد بيانات', 'No Data')}
      </Badge>
    );
  }
  
  // Special badge for Binance data
  if (dataSource === 'binance') {
    return (
      <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500">
        <CheckCircle className="w-3 h-3 mr-1" />
        {t('بيانات بينانس', 'Binance Data')}
      </Badge>
    );
  }
  
  if (data.fromCache) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
            <Badge variant="outline" className="bg-blue-500/10 text-blue-500 border-blue-500">
              <Database className="w-3 h-3 mr-1" />
              {t('من الذاكرة المؤقتة', 'From Cache')}
            </Badge>
          </TooltipTrigger>
          <TooltipContent>
            <p>{t('تم تحديث الذاكرة المؤقتة', 'Cache was updated')}: {
              data.cacheTime ? new Date(data.cacheTime).toLocaleTimeString() : t('غير معروف', 'Unknown')
            }</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }
  
  if (isRealtime) {
    return (
      <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500">
        <Wifi className="w-3 h-3 mr-1" />
        {t('بيانات مباشرة', 'Live Data')}
      </Badge>
    );
  }
  
  return (
    <Badge variant="outline" className="bg-orange-500/10 text-orange-500 border-orange-500">
      <WifiOff className="w-3 h-3 mr-1" />
      {t('بيانات غير مباشرة', 'Non-Live Data')}
    </Badge>
  );
};

export default CryptoDataSourceBadge;
