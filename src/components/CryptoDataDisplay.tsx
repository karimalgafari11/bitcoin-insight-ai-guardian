
import React, { useState } from 'react';
import { useCryptoData } from '@/hooks/useCryptoData';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';
import { Loader2, RefreshCw } from 'lucide-react';
import { getSymbolName, formatData } from '@/utils/cryptoUtils';
import { Button } from '@/components/ui/button';
import CryptoSelector from './crypto/CryptoSelector';
import CryptoPriceHeader from './crypto/CryptoPriceHeader';
import CryptoMarketMetrics from './crypto/CryptoMarketMetrics';
import CryptoPriceChart from './crypto/CryptoPriceChart';
import CryptoDisclaimer from './crypto/CryptoDisclaimer';
import { toast } from '@/components/ui/use-toast';

interface CryptoDataDisplayProps {
  defaultCoin?: string;
}

const CryptoDataDisplay: React.FC<CryptoDataDisplayProps> = ({ defaultCoin = 'bitcoin' }) => {
  const { t } = useLanguage();
  const [selectedCoin, setSelectedCoin] = useState(defaultCoin);
  const [timeframe, setTimeframe] = useState('7');
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());
  
  const { data, loading, error, refreshData } = useCryptoData(selectedCoin, timeframe);

  const handleCoinChange = (value: string) => {
    setSelectedCoin(value);
  };

  const handleTimeframeChange = (value: string) => {
    setTimeframe(value);
  };
  
  const handleRefresh = () => {
    refreshData();
    setLastRefresh(new Date());
    toast({
      title: t('تحديث البيانات', 'Data Refresh'),
      description: t('جاري تحديث البيانات...', 'Refreshing data...'),
    });
  };

  return (
    <Card className="w-full mb-6">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle>{t('بيانات العملة الرقمية', 'Cryptocurrency Data')}</CardTitle>
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="icon" 
            onClick={handleRefresh} 
            disabled={loading}
            title={t('تحديث البيانات', 'Refresh Data')}
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          </Button>
          
          <CryptoSelector 
            selectedCoin={selectedCoin}
            onCoinChange={handleCoinChange}
            selectedTimeframe={timeframe}
            onTimeframeChange={handleTimeframeChange}
          />
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-2 flex flex-col items-center justify-center h-[300px]">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-muted-foreground">{t('جاري تحميل البيانات...', 'Loading data...')}</p>
          </div>
        ) : error ? (
          <div className="p-4 text-center text-red-500">
            {t('حدث خطأ في جلب البيانات', 'Error fetching data')}: {error}
          </div>
        ) : data && data.prices && data.prices.length > 0 ? (
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
            
            <div className="mt-4 text-xs text-muted-foreground text-right">
              {t('آخر تحديث', 'Last refresh')}: {lastRefresh.toLocaleTimeString()}
            </div>
            
            <CryptoDisclaimer />
          </div>
        ) : (
          <div className="p-4 text-center">
            {t('لا توجد بيانات متاحة', 'No data available')}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CryptoDataDisplay;
