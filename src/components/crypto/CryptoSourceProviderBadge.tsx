
import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Badge } from '@/components/ui/badge';

interface CryptoSourceProviderBadgeProps {
  loading: boolean;
  dataSource: string | null;
}

const CryptoSourceProviderBadge: React.FC<CryptoSourceProviderBadgeProps> = ({
  loading,
  dataSource
}) => {
  const { t } = useLanguage();
  
  if (loading || !dataSource) return null;
  
  let bgColor = "bg-gray-500/10";
  let textColor = "text-gray-500";
  let borderColor = "border-gray-500";
  let label = t('غير معروف', 'Unknown');
  
  switch (dataSource.toLowerCase()) {
    case 'coinmarketcap':
      bgColor = "bg-blue-500/10";
      textColor = "text-blue-500";
      borderColor = "border-blue-500";
      label = "CoinMarketCap";
      break;
    case 'coingecko':
      bgColor = "bg-green-500/10";
      textColor = "text-green-500";
      borderColor = "border-green-500";
      label = "CoinGecko";
      break;
    case 'publicapi':
      bgColor = "bg-purple-500/10";
      textColor = "text-purple-500";
      borderColor = "border-purple-500";
      label = "CoinCap";
      break;
    case 'mock':
      bgColor = "bg-yellow-500/10";
      textColor = "text-yellow-500";
      borderColor = "border-yellow-500";
      label = t('بيانات تجريبية', 'Mock Data');
      break;
  }
  
  return (
    <Badge variant="outline" className={`${bgColor} ${textColor} ${borderColor}`}>
      {label}
    </Badge>
  );
};

export default CryptoSourceProviderBadge;
