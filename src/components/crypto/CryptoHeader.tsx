
import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RefreshCw, Star, Wifi, WifiOff } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { CryptoFilterOptions } from '@/types/filters';
import CryptoSelector from './CryptoSelector';
import CryptoDataSourceBadge from './CryptoDataSourceBadge';
import CryptoSourceProviderBadge from './CryptoSourceProviderBadge';
import WatchlistButton from './WatchlistButton';

interface CryptoHeaderProps {
  loading: boolean;
  data: any;
  isRealtime: boolean;
  dataSource: string;
  pollingEnabled?: boolean;
  togglePolling?: () => void;
  toggleWatchlist: () => void;
  handleRefresh: () => void;
  showWatchlist: boolean;
  selectedCoin: string;
  onCoinChange: (value: string) => void;
  selectedTimeframe: string;
  onTimeframeChange: (value: string) => void;
  filterOptions: CryptoFilterOptions;
  onFilterChange: (newFilters: CryptoFilterOptions) => void;
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
  onFilterChange
}) => {
  const { t } = useLanguage();
  
  return (
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
          onCoinChange={onCoinChange}
          selectedTimeframe={selectedTimeframe}
          onTimeframeChange={onTimeframeChange}
          filterOptions={filterOptions}
          onFilterChange={onFilterChange}
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
  );
};

export default CryptoHeader;
