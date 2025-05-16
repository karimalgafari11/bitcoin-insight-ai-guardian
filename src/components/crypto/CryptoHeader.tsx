
import React, { memo } from 'react';
import { CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { RefreshCw, ChevronDown, FileBarChart } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { CryptoMarketData } from '@/types/crypto';
import { CryptoFilterOptions } from '@/types/filters';
import CryptoSelector from './CryptoSelector';
import CryptoFilter from './CryptoFilter';
import CryptoSourceProviderBadge from './CryptoSourceProviderBadge';
import CryptoDataSourceBadge from './CryptoDataSourceBadge';

interface CryptoHeaderProps {
  loading: boolean;
  data: CryptoMarketData | null;
  isRealtime: boolean;
  dataSource: string;
  pollingEnabled: boolean;
  togglePolling: () => void;
  toggleWatchlist: () => void;
  handleRefresh: () => void;
  showWatchlist: boolean;
  selectedCoin: string;
  onCoinChange: (value: string) => void;
  selectedTimeframe: string;
  onTimeframeChange: (value: string) => void;
  filterOptions: CryptoFilterOptions;
  onFilterChange: (filters: CryptoFilterOptions) => void;
  isRefreshDisabled?: boolean;
}

const CryptoHeader: React.FC<CryptoHeaderProps> = ({
  loading,
  data,
  isRealtime,
  dataSource,
  pollingEnabled,
  togglePolling,
  toggleWatchlist,
  handleRefresh,
  showWatchlist,
  selectedCoin,
  onCoinChange,
  selectedTimeframe,
  onTimeframeChange,
  filterOptions,
  onFilterChange,
  isRefreshDisabled = false
}) => {
  const { t } = useLanguage();
  
  // Map timeframe values to display text
  const timeframeOptions = [
    { value: '1', label: t('24 ساعة', '24h') },
    { value: '7', label: t('7 أيام', '7d') },
    { value: '30', label: t('30 يوم', '30d') },
    { value: '90', label: t('90 يوم', '90d') },
  ];
  
  return (
    <CardHeader className="pb-2">
      <div className="flex flex-wrap justify-between items-center mb-4">
        <CardTitle className="text-2xl text-right md:text-left">
          {t('أسعار العملات الرقمية', 'Cryptocurrency Prices')}
        </CardTitle>
        
        <div className="flex items-center space-x-2 rtl:space-x-reverse">
          {dataSource && <CryptoDataSourceBadge source={dataSource} isRealtime={isRealtime} />}
          
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleRefresh}
            disabled={loading || isRefreshDisabled}
            className="gap-2"
          >
            <RefreshCw 
              className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} 
            />
            {t('تحديث', 'Refresh')}
          </Button>
          
          <div className="flex items-center gap-2">
            <Switch 
              checked={pollingEnabled}
              onCheckedChange={togglePolling}
            />
            <span className="text-sm whitespace-nowrap hidden md:inline-block">
              {t('تحديث تلقائي', 'Auto refresh')}
            </span>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-y-4">
        <div className="flex flex-wrap items-center gap-4">
          <CryptoSelector 
            value={selectedCoin}
            onChange={onCoinChange}
          />
          
          <div className="inline-flex rounded-md shadow-sm">
            {timeframeOptions.map((option) => (
              <Button
                key={option.value}
                variant={selectedTimeframe === option.value ? "default" : "outline"}
                className={`
                  ${selectedTimeframe === option.value ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'} 
                  first:rounded-l-md first:rounded-r-none last:rounded-r-md last:rounded-l-none rounded-none border-r-0 last:border-r 
                  rtl:first:rounded-r-md rtl:first:rounded-l-none rtl:last:rounded-l-md rtl:last:rounded-r-none
                `}
                onClick={() => onTimeframeChange(option.value)}
                size="sm"
              >
                {option.label}
              </Button>
            ))}
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <CryptoFilter 
            options={filterOptions}
            onChange={onFilterChange}
          >
            <Button variant="outline" size="sm" className="gap-2">
              <ChevronDown className="h-4 w-4" />
              {t('تصفية', 'Filter')}
            </Button>
          </CryptoFilter>
          
          <Button 
            variant="outline" 
            size="sm"
            onClick={toggleWatchlist}
            className="gap-2"
          >
            <FileBarChart className="h-4 w-4" />
            {showWatchlist 
              ? t('إخفاء المفضلة', 'Hide Watchlist') 
              : t('عرض المفضلة', 'Show Watchlist')
            }
          </Button>
        </div>
      </div>
      
      <CardDescription className="mt-4">
        {t(
          'يعرض سعر الصرف التاريخي والحالي، وحجم التداول، بيانات السوق للعملات الرقمية',
          'Shows historical and current exchange rates, trading volume, and market data for cryptocurrencies'
        )}
      </CardDescription>
    </CardHeader>
  );
};

export default memo(CryptoHeader);
