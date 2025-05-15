
import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

const CryptoEmptyState: React.FC = () => {
  const { t } = useLanguage();
  
  return (
    <div className="p-4 text-center">
      {t('لا توجد بيانات متاحة', 'No data available')}
    </div>
  );
};

export default CryptoEmptyState;
