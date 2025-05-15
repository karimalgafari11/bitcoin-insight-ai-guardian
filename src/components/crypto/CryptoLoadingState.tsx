
import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Loader2 } from 'lucide-react';

const CryptoLoadingState: React.FC = () => {
  const { t } = useLanguage();
  
  return (
    <div className="space-y-2 flex flex-col items-center justify-center h-[300px]">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
      <p className="text-muted-foreground">{t('جاري تحميل البيانات...', 'Loading data...')}</p>
    </div>
  );
};

export default CryptoLoadingState;
