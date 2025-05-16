
import React, { useState, useCallback, useRef } from 'react';
import { toast } from '@/components/ui/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';
import { CryptoFilterOptions, DEFAULT_FILTER_OPTIONS } from '@/types/filters';
import { Card } from '@/components/ui/card';
import { useCryptoData } from '@/hooks/crypto';
import CryptoHeader from './CryptoHeader';
import CryptoContent from './CryptoContent';
import CryptoWatchlistPanel from './CryptoWatchlistPanel';

interface CryptoDataContainerProps {
  defaultCoin?: string;
}

const CryptoDataContainer: React.FC<CryptoDataContainerProps> = ({ defaultCoin = 'bitcoin' }) => {
  const { t } = useLanguage();
  const [selectedCoin, setSelectedCoin] = useState(defaultCoin);
  const [timeframe, setTimeframe] = useState('7');
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());
  const [filterOptions, setFilterOptions] = useState<CryptoFilterOptions>(DEFAULT_FILTER_OPTIONS);
  const [showWatchlist, setShowWatchlist] = useState(false);
  const refreshTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
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
    // Prevent multiple rapid refresh requests
    if (refreshTimeoutRef.current) {
      clearTimeout(refreshTimeoutRef.current);
    }
    
    refreshData();
    setLastRefresh(new Date());
    
    toast({
      title: t('تحديث البيانات', 'Data Refresh'),
      description: t('جاري تحديث البيانات...', 'Refreshing data...'),
    });
    
    // Set a cooldown period for refresh button
    refreshTimeoutRef.current = setTimeout(() => {
      refreshTimeoutRef.current = null;
    }, 3000);
  }, [refreshData, t]);

  const handleFilterChange = useCallback((newFilters: CryptoFilterOptions) => {
    setFilterOptions(newFilters);
  }, []);

  const toggleWatchlist = useCallback(() => {
    setShowWatchlist(prev => !prev);
  }, []);

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
      {showWatchlist && (
        <CryptoWatchlistPanel 
          onSymbolSelect={handleCoinChange}
          currentSymbol={selectedCoin}
        />
      )}
      
      <Card className={`w-full mb-6 ${showWatchlist ? 'md:col-span-3' : 'md:col-span-4'}`}>
        <CryptoHeader
          loading={loading}
          data={data}
          isRealtime={isRealtime}
          dataSource={dataSource}
          pollingEnabled={pollingEnabled}
          togglePolling={togglePolling}
          toggleWatchlist={toggleWatchlist}
          handleRefresh={handleRefresh}
          showWatchlist={showWatchlist}
          selectedCoin={selectedCoin}
          onCoinChange={handleCoinChange}
          selectedTimeframe={timeframe}
          onTimeframeChange={handleTimeframeChange}
          filterOptions={filterOptions}
          onFilterChange={handleFilterChange}
        />
        
        <CryptoContent
          loading={loading}
          data={data}
          error={error}
          selectedCoin={selectedCoin}
          dataSource={dataSource}
          lastUpdated={lastUpdated}
          lastRefresh={lastRefresh}
          isRealtime={isRealtime}
          filterOptions={filterOptions}
        />
      </Card>
    </div>
  );
};

export default React.memo(CryptoDataContainer);
