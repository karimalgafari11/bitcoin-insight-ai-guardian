
import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Info } from 'lucide-react';

const CryptoDisclaimer: React.FC = () => {
  const { t } = useLanguage();
  
  return (
    <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-md flex items-start gap-2">
      <Info className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
      <p className="text-sm text-muted-foreground">
        {t(
          'البيانات مقدمة بواسطة CoinMarketCap. قد تختلف الأسعار قليلاً عن منصات التداول الأخرى.',
          'Data provided by CoinMarketCap. Prices may slightly differ from other trading platforms.'
        )}
      </p>
    </div>
  );
};

export default CryptoDisclaimer;
