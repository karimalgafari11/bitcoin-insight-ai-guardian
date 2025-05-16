
import React from 'react';
import { Filter, SlidersHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { useLanguage } from '@/contexts/LanguageContext';
import { CryptoFilterOptions } from '@/types/filters';

interface CryptoFilterProps {
  filterOptions: CryptoFilterOptions;
  onFilterChange: (filters: CryptoFilterOptions) => void;
}

const CryptoFilter: React.FC<CryptoFilterProps> = ({ 
  filterOptions,
  onFilterChange 
}) => {
  const { t } = useLanguage();
  const { priceRange, marketCapRange, showFilters } = filterOptions;

  const handlePriceChange = (values: number[]) => {
    onFilterChange({
      ...filterOptions,
      priceRange: { min: values[0], max: values[1] }
    });
  };

  const handleMarketCapChange = (values: number[]) => {
    onFilterChange({
      ...filterOptions,
      marketCapRange: { min: values[0], max: values[1] }
    });
  };

  const handlePriceInputChange = (type: 'min' | 'max', value: string) => {
    const numValue = value === '' ? 0 : Number(value);
    if (!isNaN(numValue)) {
      onFilterChange({
        ...filterOptions,
        priceRange: {
          ...priceRange,
          [type]: numValue
        }
      });
    }
  };

  const handleMarketCapInputChange = (type: 'min' | 'max', value: string) => {
    const numValue = value === '' ? 0 : Number(value);
    if (!isNaN(numValue)) {
      onFilterChange({
        ...filterOptions,
        marketCapRange: {
          ...marketCapRange,
          [type]: numValue
        }
      });
    }
  };

  if (!showFilters) {
    return null;
  }
  
  return (
    <div className="w-full">
      <div className="bg-card border rounded-md p-3 shadow-sm space-y-4 mb-2">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium">
              {t('نطاق السعر', 'Price Range')} (USD)
            </label>
            <div className="flex items-center gap-2">
              <Input
                type="number"
                value={priceRange.min}
                onChange={(e) => handlePriceInputChange('min', e.target.value)}
                className="h-7 w-20 text-xs"
                min={0}
              />
              <span className="text-xs">-</span>
              <Input
                type="number"
                value={priceRange.max}
                onChange={(e) => handlePriceInputChange('max', e.target.value)}
                className="h-7 w-20 text-xs"
                min={0}
              />
            </div>
          </div>
          <Slider
            defaultValue={[priceRange.min, priceRange.max]}
            max={100000}
            step={100}
            value={[priceRange.min, priceRange.max]}
            onValueChange={handlePriceChange}
            className="mt-2"
          />
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium">
              {t('القيمة السوقية', 'Market Cap')} (USD)
            </label>
            <div className="flex items-center gap-2">
              <Input
                type="number"
                value={marketCapRange.min}
                onChange={(e) => handleMarketCapInputChange('min', e.target.value)}
                className="h-7 w-20 text-xs"
                min={0}
              />
              <span className="text-xs">-</span>
              <Input
                type="number"
                value={marketCapRange.max}
                onChange={(e) => handleMarketCapInputChange('max', e.target.value)}
                className="h-7 w-20 text-xs"
                min={0}
              />
            </div>
          </div>
          <Slider
            defaultValue={[marketCapRange.min, marketCapRange.max]}
            max={1000000000000}
            step={1000000000}
            value={[marketCapRange.min, marketCapRange.max]}
            onValueChange={handleMarketCapChange}
            className="mt-2"
          />
        </div>
      </div>
    </div>
  );
};

export default CryptoFilter;
