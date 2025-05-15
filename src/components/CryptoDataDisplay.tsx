
import React, { useState } from 'react';
import { useCryptoData } from '@/hooks/useCryptoData';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';
import { RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';

// Import our new components
import CryptoSelector from './crypto/CryptoSelector';
import CryptoDataSourceBadge from './crypto/CryptoDataSourceBadge';
import CryptoSourceProviderBadge from './crypto/CryptoSourceProviderBadge';
import CryptoLoadingState from './crypto/CryptoLoadingState';
import CryptoErrorState from './crypto/CryptoErrorState';
import CryptoDisplay from './crypto/CryptoDisplay';
import CryptoEmptyState from './crypto/CryptoEmptyState';

interface CryptoDataDisplayProps {
  defaultCoin?: string;
}

const CryptoDataDisplay: React.FC<CryptoDataDisplayProps> = ({ defaultCoin = 'bitcoin' }) => {
  const { t } = useLanguage();
  const [selectedCoin, setSelectedCoin] = useState(defaultCoin);
  const [timeframe, setTimeframe] = useState('7');
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());
  
  const { 
    data, 
    loading, 
    error, 
    refreshData, 
    isRealtime,
    dataSource,
    lastUpdated 
  } = useCryptoData(selectedCoin, timeframe);

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
        <div className="flex items-center gap-2">
          <CardTitle>{t('بيانات العملة الرقمية', 'Cryptocurrency Data')}</CardTitle>
          <CryptoDataSourceBadge 
            loading={loading} 
            data={data} 
            isRealtime={isRealtime} 
            dataSource={dataSource} 
          />
          <CryptoSourceProviderBadge 
            loading={loading} 
            dataSource={dataSource} 
          />
        </div>
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
          <CryptoLoadingState />
        ) : error ? (
          <CryptoErrorState error={error} />
        ) : data && data.prices && data.prices.length > 0 ? (
          <CryptoDisplay
            data={data}
            selectedCoin={selectedCoin}
            dataSource={dataSource}
            lastUpdated={lastUpdated}
            lastRefresh={lastRefresh}
            isRealtime={isRealtime}
          />
        ) : (
          <CryptoEmptyState />
        )}
      </CardContent>
    </Card>
  );
};

export default CryptoDataDisplay;
