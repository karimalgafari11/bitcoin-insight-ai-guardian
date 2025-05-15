
import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

interface CryptoErrorStateProps {
  error: string;
}

const CryptoErrorState: React.FC<CryptoErrorStateProps> = ({ error }) => {
  const { t } = useLanguage();
  
  return (
    <div className="p-4 text-center text-red-500">
      {t('حدث خطأ في جلب البيانات', 'Error fetching data')}: {error}
    </div>
  );
};

export default CryptoErrorState;
