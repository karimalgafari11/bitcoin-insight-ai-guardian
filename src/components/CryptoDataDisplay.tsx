
import React, { useState } from 'react';
import { useCryptoData } from '@/hooks/useCryptoData';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';
import { Loader2, RefreshCw, Wifi, WifiOff, Database, CloudOff } from 'lucide-react';
import { getSymbolName, formatData } from '@/utils/cryptoUtils';
import { Button } from '@/components/ui/button';
import CryptoSelector from './crypto/CryptoSelector';
import CryptoPriceHeader from './crypto/CryptoPriceHeader';
import CryptoMarketMetrics from './crypto/CryptoMarketMetrics';
import CryptoPriceChart from './crypto/CryptoPriceChart';
import CryptoDisclaimer from './crypto/CryptoDisclaimer';
import { toast } from '@/components/ui/use-toast';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

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

  // Format the data age in a human-readable format
  const getDataAge = () => {
    if (!lastUpdated) return t('غير معروف', 'Unknown');
    
    const now = new Date();
    const updated = new Date(lastUpdated);
    const diffMs = now.getTime() - updated.getTime();
    const diffSecs = Math.floor(diffMs / 1000);
    const diffMins = Math.floor(diffSecs / 60);
    const diffHours = Math.floor(diffMins / 60);
    
    if (diffSecs < 60) return t(`منذ ${diffSecs} ثانية`, `${diffSecs} seconds ago`);
    if (diffMins < 60) return t(`منذ ${diffMins} دقيقة`, `${diffMins} minutes ago`);
    if (diffHours < 24) return t(`منذ ${diffHours} ساعة`, `${diffHours} hours ago`);
    return t('منذ أكثر من يوم', 'More than a day ago');
  };

  // Get a badge for the data source
  const getDataSourceBadge = () => {
    if (loading) return null;
    
    if (!data) {
      return (
        <Badge variant="outline" className="bg-red-500/10 text-red-500 border-red-500">
          <CloudOff className="w-3 h-3 mr-1" />
          {t('لا توجد بيانات', 'No Data')}
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

  // Get a badge for the data source provider
  const getSourceProviderBadge = () => {
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

  return (
    <Card className="w-full mb-6">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div className="flex items-center gap-2">
          <CardTitle>{t('بيانات العملة الرقمية', 'Cryptocurrency Data')}</CardTitle>
          {getDataSourceBadge()}
          {getSourceProviderBadge()}
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
            
            <div className="mt-4 flex flex-wrap items-center justify-between text-xs text-muted-foreground">
              <div className="flex items-center gap-2">
                <span>{t('مصدر البيانات', 'Data source')}:</span>
                {dataSource === 'mock' ? (
                  <span className="text-yellow-500">
                    {t('بيانات تجريبية', 'Mock data')}
                  </span>
                ) : (
                  <span className={isRealtime ? 'text-green-500' : 'text-orange-500'}>
                    {dataSource} {data.fromCache ? t('(من الذاكرة المؤقتة)', '(from cache)') : ''}
                  </span>
                )}
              </div>
              <div>
                {t('تم التحديث', 'Updated')}: {getDataAge()}
              </div>
              <div>
                {t('آخر تحديث محلي', 'Last local refresh')}: {lastRefresh.toLocaleTimeString()}
              </div>
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
