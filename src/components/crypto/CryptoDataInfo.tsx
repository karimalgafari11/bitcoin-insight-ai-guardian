
import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

interface CryptoDataInfoProps {
  lastUpdated: string | null;
  lastRefresh: Date;
  dataSource: string;
  fromCache?: boolean;
}

const CryptoDataInfo: React.FC<CryptoDataInfoProps> = ({
  lastUpdated,
  lastRefresh,
  dataSource,
  fromCache
}) => {
  const { t } = useLanguage();

  const getDataAge = () => {
    if (!lastUpdated) return t('غير معروف', 'Unknown');
    
    const now = new Date();
    const updated = new Date(lastUpdated);
    const diffMs = now.getTime() - updated.getTime();
    const diffSecs = Math.floor(diffMs / 1000);
    const diffMins = Math.floor(diffSecs / 60);
    const diffHours = Math.floor(diffMins / 60);
    
    if (diffSecs < 60) return t(`منذ ${diffSecs} ثانية`, `${diffSecs} seconds ago`);
    if (diffMins < 60) return t(`منذ ${diffMins} دقيقة`, `${diffMins} minutes ago`);
    if (diffHours < 24) return t(`منذ ${diffHours} ساعة`, `${diffHours} hours ago`);
    return t('منذ أكثر من يوم', 'More than a day ago');
  };

  return (
    <div className="mt-4 flex flex-wrap items-center justify-between text-xs text-muted-foreground">
      <div className="flex items-center gap-2">
        <span>{t('مصدر البيانات', 'Data source')}:</span>
        {dataSource === 'mock' ? (
          <span className="text-yellow-500">
            {t('بيانات تجريبية', 'Mock data')}
          </span>
        ) : (
          <span className={fromCache ? 'text-blue-500' : 'text-green-500'}>
            {dataSource} {fromCache ? t('(من الذاكرة المؤقتة)', '(from cache)') : ''}
          </span>
        )}
      </div>
      <div>
        {t('تم التحديث', 'Updated')}: {getDataAge()}
      </div>
      <div>
        {t('آخر تحديث محلي', 'Last local refresh')}: {lastRefresh.toLocaleTimeString()}
      </div>
    </div>
  );
};

export default CryptoDataInfo;
