
import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CryptoFilterOptions, DEFAULT_FILTER_OPTIONS } from '@/types/filters';

interface CryptoSelectorProps {
  selectedCoin: string;
  onCoinChange: (value: string) => void;
  selectedTimeframe: string;
  onTimeframeChange: (value: string) => void;
  filterOptions?: CryptoFilterOptions;
  onFilterChange?: (filters: CryptoFilterOptions) => void;
}

const CryptoSelector: React.FC<CryptoSelectorProps> = ({
  selectedCoin,
  onCoinChange,
  selectedTimeframe,
  onTimeframeChange,
  filterOptions = DEFAULT_FILTER_OPTIONS,
  onFilterChange = () => {}
}) => {
  const { t } = useLanguage();

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2">
        <Select value={selectedCoin} onValueChange={onCoinChange}>
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder={t('اختر العملة', 'Select Coin')} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="bitcoin">Bitcoin (BTC)</SelectItem>
            <SelectItem value="ethereum">Ethereum (ETH)</SelectItem>
            <SelectItem value="binancecoin">Binance (BNB)</SelectItem>
            <SelectItem value="ripple">XRP</SelectItem>
            <SelectItem value="cardano">Cardano (ADA)</SelectItem>
            <SelectItem value="solana">Solana (SOL)</SelectItem>
          </SelectContent>
        </Select>
        <Select value={selectedTimeframe} onValueChange={onTimeframeChange}>
          <SelectTrigger className="w-[80px]">
            <SelectValue placeholder={t('المدة', 'Period')} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1">1D</SelectItem>
            <SelectItem value="7">7D</SelectItem>
            <SelectItem value="30">30D</SelectItem>
            <SelectItem value="90">90D</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default CryptoSelector;
