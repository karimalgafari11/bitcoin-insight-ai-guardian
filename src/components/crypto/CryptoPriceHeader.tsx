
import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { ArrowUp, ArrowDown } from 'lucide-react';

interface CryptoPriceHeaderProps {
  name: string;
  currentPrice: number;
  percentChange?: number;
  lastUpdated?: string;
}

const CryptoPriceHeader: React.FC<CryptoPriceHeaderProps> = ({ 
  name, 
  currentPrice, 
  percentChange, 
  lastUpdated 
}) => {
  const { t } = useLanguage();

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 2
    }).format(value);
  };

  return (
    <div>
      <h3 className="font-bold text-lg">{name}</h3>
      <div className="flex items-center gap-2">
        <p className="text-2xl font-bold">
          {formatCurrency(currentPrice)}
        </p>
        {percentChange !== undefined && (
          <span className={
            percentChange > 0 ? 
            'text-green-500 flex items-center' : 'text-red-500 flex items-center'
          }>
            {percentChange > 0 ? <ArrowUp className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />}
            {Math.abs(percentChange).toFixed(2)}%
          </span>
        )}
      </div>
      {lastUpdated && (
        <p className="text-sm text-muted-foreground">
          {t('آخر تحديث', 'Last updated')}: {
            new Date(lastUpdated).toLocaleTimeString()
          }
        </p>
      )}
    </div>
  );
};

export default CryptoPriceHeader;
