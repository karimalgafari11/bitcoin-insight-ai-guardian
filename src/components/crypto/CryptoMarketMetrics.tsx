
import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

interface CryptoMarketMetricsProps {
  marketCap: number;
  volume24h: number;
  percentChange24h: number;
  percentChange7d: number;
}

const CryptoMarketMetrics: React.FC<CryptoMarketMetricsProps> = ({
  marketCap,
  volume24h,
  percentChange24h,
  percentChange7d
}) => {
  const { t } = useLanguage();

  const formatLargeNumber = (num: number) => {
    if (num >= 1e9) {
      return `${(num / 1e9).toFixed(2)}B`;
    } else if (num >= 1e6) {
      return `${(num / 1e6).toFixed(2)}M`;
    } else if (num >= 1e3) {
      return `${(num / 1e3).toFixed(2)}K`;
    }
    return num.toString();
  };

  return (
    <div className="grid grid-cols-2 gap-4">
      <div>
        <p className="text-sm text-muted-foreground">{t('القيمة السوقية', 'Market Cap')}</p>
        <p className="font-medium">{formatLargeNumber(marketCap)}</p>
      </div>
      <div>
        <p className="text-sm text-muted-foreground">{t('حجم التداول (24 ساعة)', 'Volume (24h)')}</p>
        <p className="font-medium">{formatLargeNumber(volume24h)}</p>
      </div>
      <div>
        <p className="text-sm text-muted-foreground">{t('التغير (24 ساعة)', 'Change (24h)')}</p>
        <p className={percentChange24h > 0 ? "text-green-500" : "text-red-500"}>
          {percentChange24h.toFixed(2)}%
        </p>
      </div>
      <div>
        <p className="text-sm text-muted-foreground">{t('التغير (7 أيام)', 'Change (7d)')}</p>
        <p className={percentChange7d > 0 ? "text-green-500" : "text-red-500"}>
          {percentChange7d.toFixed(2)}%
        </p>
      </div>
    </div>
  );
};

export default CryptoMarketMetrics;
