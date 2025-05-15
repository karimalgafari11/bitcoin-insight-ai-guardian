
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useCryptoData } from '@/hooks/crypto'; 
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';
import { RefreshCw, Star, Wifi, WifiOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { CryptoFilterOptions, DEFAULT_FILTER_OPTIONS } from '@/types/filters';
import { Badge } from '@/components/ui/badge';

// Import our components
import CryptoSelector from './crypto/CryptoSelector';
import CryptoDataSourceBadge from './crypto/CryptoDataSourceBadge';
import CryptoSourceProviderBadge from './crypto/CryptoSourceProviderBadge';
import CryptoLoadingState from './crypto/CryptoLoadingState';
import CryptoErrorState from './crypto/CryptoErrorState';
import CryptoDisplay from './crypto/CryptoDisplay';
import CryptoEmptyState from './crypto/CryptoEmptyState';
import WatchlistButton from './crypto/WatchlistButton';
import WatchlistPanel from './crypto/WatchlistPanel';

interface CryptoDataDisplayProps {
  defaultCoin?: string;
}

const CryptoDataDisplay: React.FC<CryptoDataDisplayProps> = ({ defaultCoin = 'bitcoin' }) => {
  const { t } = useLanguage();
  const [selectedCoin, setSelectedCoin] = useState(defaultCoin);
  const [timeframe, setTimeframe] = useState('7');
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());
  const [filterOptions, setFilterOptions] = useState<CryptoFilterOptions>(DEFAULT_FILTER_OPTIONS);
  const [showWatchlist, setShowWatchlist] = useState(false);
  
  const { 
    data, 
    loading, 
    error, 
    refreshData, 
    isRealtime,
    dataSource,
    lastUpdated,
    pollingEnabled,
    togglePolling
  } = useCryptoData(selectedCoin, timeframe);

  // Use useCallback to prevent re-creations of event handlers
  const handleCoinChange = useCallback((value: string) => {
    setSelectedCoin(value);
  }, []);

  const handleTimeframeChange = useCallback((value: string) => {
    setTimeframe(value);
  }, []);
  
  const handleRefresh = useCallback(() => {
    refreshData();
    setLastRefresh(new Date());
    toast({
      title: t('تحديث البيانات', 'Data Refresh'),
      description: t('جاري تحديث البيانات...', 'Refreshing data...'),
    });
  }, [refreshData, t]);

  const handleFilterChange = useCallback((newFilters: CryptoFilterOptions) => {
    setFilterOptions(newFilters);
  }, []);

  const toggleWatchlist = useCallback(() => {
    setShowWatchlist(prev => !prev);
  }, []);

  // Apply filters to the data
  const filteredData = useMemo(() => {
    if (!data || !data.metadata) return data;
    
    const currentPrice = data.metadata.current_price;
    const marketCap = data.metadata.market_cap;
    
    const isPriceInRange = 
      currentPrice >= filterOptions.priceRange.min && 
      currentPrice <= filterOptions.priceRange.max;
      
    const isMarketCapInRange = 
      marketCap >= filterOptions.marketCapRange.min && 
      marketCap <= filterOptions.marketCapRange.max;
    
    if (isPriceInRange && isMarketCapInRange) {
      return data;
    }
    
    return null;
  }, [data, filterOptions]);

  // Main layout with fixed height containers to prevent layout shifts
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
      {showWatchlist && (
        <div className="md:col-span-1">
          <WatchlistPanel 
            onSymbolSelect={handleCoinChange} 
            currentSymbol={selectedCoin}
            className="sticky top-6"
          />
        </div>
      )}
      
      <Card className={`w-full mb-6 ${showWatchlist ? 'md:col-span-3' : 'md:col-span-4'}`}>
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
            
            {/* Add real-time status badge */}
            {!loading && data && (
              <Badge 
                variant="outline" 
                className={isRealtime 
                  ? "bg-green-500/10 text-green-500 border-green-500" 
                  : "bg-orange-500/10 text-orange-500 border-orange-500"
                }
              >
                {isRealtime 
                  ? <><Wifi className="h-3 w-3 mr-1" /> {t("بث مباشر", "Live")}</>
                  : <><WifiOff className="h-3 w-3 mr-1" /> {t("غير مباشر", "Not Live")}</>
                }
              </Badge>
            )}
            
            {/* Add polling toggle button */}
            {!loading && togglePolling && (
              <Button
                variant="ghost"
                size="sm"
                onClick={togglePolling}
                title={pollingEnabled 
                  ? t("إيقاف التحديث التلقائي", "Stop Auto-Refresh") 
                  : t("تمكين التحديث التلقائي", "Enable Auto-Refresh")
                }
                className={`text-xs ${pollingEnabled ? 'text-green-500' : 'text-gray-500'}`}
              >
                {pollingEnabled 
                  ? t("تحديث تلقائي", "Auto") 
                  : t("تحديث يدوي", "Manual")
                }
              </Button>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="icon" 
              onClick={toggleWatchlist} 
              title={t('إظهار/إخفاء قائمة المراقبة', 'Toggle Watchlist')}
            >
              <Star className={`h-4 w-4 ${showWatchlist ? 'fill-yellow-400 text-yellow-400' : ''}`} />
            </Button>
            
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
              filterOptions={filterOptions}
              onFilterChange={handleFilterChange}
            />
            
            {!loading && data && (
              <WatchlistButton 
                coinId={selectedCoin} 
                size="icon"
                variant="outline"
              />
            )}
          </div>
        </CardHeader>
        <CardContent className="relative min-h-[350px]">
          {loading ? (
            <CryptoLoadingState />
          ) : error ? (
            <CryptoErrorState error={error} />
          ) : filteredData && filteredData.prices && filteredData.prices.length > 0 ? (
            <CryptoDisplay
              data={filteredData}
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
    </div>
  );
};

export default React.memo(CryptoDataDisplay);
