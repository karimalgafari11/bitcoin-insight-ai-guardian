
import React, { useState, useCallback, useRef, useEffect } from 'react';
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
  
  // Enhanced refs for better tracking and limiting
  const refreshTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const refreshCooldownRef = useRef<boolean>(false);
  const refreshCountRef = useRef<number>(0);
  const lastRefreshTimeRef = useRef<number>(Date.now());
  
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

  // Reset refresh count periodically
  useEffect(() => {
    const resetTimer = setInterval(() => {
      refreshCountRef.current = 0;
    }, 60000); // Reset count every minute
    
    return () => {
      clearInterval(resetTimer);
    };
  }, []);

  // Use useCallback to prevent re-creations of event handlers
  const handleCoinChange = useCallback((value: string) => {
    setSelectedCoin(value);
  }, []);

  const handleTimeframeChange = useCallback((value: string) => {
    setTimeframe(value);
  }, []);
  
  const handleRefresh = useCallback(() => {
    const now = Date.now();
    
    // Implement increasingly stringent rate limits to prevent excessive refreshing
    if (refreshCooldownRef.current) {
      toast({
        title: t('يرجى الانتظار', 'Please wait'),
        description: t('يرجى الانتظار قبل تحديث البيانات مرة أخرى', 'Please wait before refreshing again'),
        variant: 'destructive',
      });
      return;
    }
    
    // Increase cooldown period based on refresh frequency
    refreshCountRef.current++;
    const timeSinceLastRefresh = now - lastRefreshTimeRef.current;
    
    // If user is refreshing too frequently, enforce a longer cooldown
    let cooldownPeriod = 3000; // Default cooldown: 3 seconds
    
    if (refreshCountRef.current > 5 && timeSinceLastRefresh < 30000) {
      cooldownPeriod = 10000; // 10 seconds if more than 5 refreshes in 30 seconds
    } else if (refreshCountRef.current > 2 && timeSinceLastRefresh < 10000) {
      cooldownPeriod = 5000; // 5 seconds if more than 2 refreshes in 10 seconds
    }
    
    // Execute the refresh
    refreshData();
    setLastRefresh(new Date());
    lastRefreshTimeRef.current = now;
    
    toast({
      title: t('تحديث البيانات', 'Data Refresh'),
      description: t('جاري تحديث البيانات...', 'Refreshing data...'),
    });
    
    // Set cooldown state and timer
    refreshCooldownRef.current = true;
    
    if (refreshTimeoutRef.current) {
      clearTimeout(refreshTimeoutRef.current);
    }
    
    refreshTimeoutRef.current = setTimeout(() => {
      refreshTimeoutRef.current = null;
      refreshCooldownRef.current = false;
    }, cooldownPeriod);
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
          isRefreshDisabled={refreshCooldownRef.current}
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
