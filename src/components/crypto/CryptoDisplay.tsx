
import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { getSymbolName, formatData } from '@/utils/cryptoUtils';
import CryptoPriceHeader from './CryptoPriceHeader';
import CryptoMarketMetrics from './CryptoMarketMetrics';
import CryptoPriceChart from './CryptoPriceChart';
import CryptoDataInfo from './CryptoDataInfo';
import CryptoDisclaimer from './CryptoDisclaimer';
import { CryptoMarketData } from '@/types/crypto';

interface CryptoDisplayProps {
  data: CryptoMarketData;
  selectedCoin: string;
  dataSource: string;
  lastUpdated: string | null;
  lastRefresh: Date;
  isRealtime: boolean;
}

const CryptoDisplay: React.FC<CryptoDisplayProps> = ({
  data,
  selectedCoin,
  dataSource,
  lastUpdated,
  lastRefresh,
  isRealtime
}) => {
  const { t } = useLanguage();

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <CryptoPriceHeader
          name={data.metadata?.name || getSymbolName(selectedCoin)}
          currentPrice={data.metadata?.current_price || data.prices[data.prices.length - 1][1]}
          percentChange={data.metadata?.percent_change_24h}
          lastUpdated={data.metadata?.last_updated}
        />
        
        {data.metadata && (
          <CryptoMarketMetrics
            marketCap={data.metadata.market_cap}
            volume24h={data.metadata.volume_24h}
            percentChange24h={data.metadata.percent_change_24h}
            percentChange7d={data.metadata.percent_change_7d}
          />
        )}
      </div>
      
      <CryptoPriceChart priceData={formatData(data.prices)} />
      
      <CryptoDataInfo 
        lastUpdated={lastUpdated}
        lastRefresh={lastRefresh}
        dataSource={dataSource}
        fromCache={data.fromCache}
      />
      
      <CryptoDisclaimer />
    </div>
  );
};

export default CryptoDisplay;
