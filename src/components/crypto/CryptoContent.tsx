
import React, { useMemo } from 'react';
import { CardContent } from '@/components/ui/card';
import { CryptoFilterOptions } from '@/types/filters';
import { CryptoMarketData } from '@/types/crypto';
import CryptoLoadingState from './CryptoLoadingState';
import CryptoErrorState from './CryptoErrorState';
import CryptoDisplay from './CryptoDisplay';
import CryptoEmptyState from './CryptoEmptyState';

interface CryptoContentProps {
  loading: boolean;
  data: CryptoMarketData | null;
  error: string | null;
  selectedCoin: string;
  dataSource: string;
  lastUpdated: string | null;
  lastRefresh: Date;
  isRealtime: boolean;
  filterOptions: CryptoFilterOptions;
}

const CryptoContent: React.FC<CryptoContentProps> = ({
  loading,
  data,
  error,
  selectedCoin,
  dataSource,
  lastUpdated,
  lastRefresh,
  isRealtime,
  filterOptions
}) => {
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

  return (
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
  );
};

export default React.memo(CryptoContent);
