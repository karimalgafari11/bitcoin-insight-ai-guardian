
import React, { useMemo } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { format } from 'date-fns';
import { arSA } from 'date-fns/locale';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface ChartDataPoint {
  date: Date;
  value: number;
}

interface CryptoPriceChartProps {
  priceData: ChartDataPoint[];
}

const CryptoPriceChart: React.FC<CryptoPriceChartProps> = ({ priceData }) => {
  const { t, language } = useLanguage();

  // استخدام useMemo لمنع إعادة إنشاء الدوال عند كل تقديم
  const formatDate = useMemo(() => {
    return (date: Date) => {
      const locale = language === 'ar' ? arSA : undefined;
      return format(date, 'MMM dd', { locale });
    };
  }, [language]);

  // استخدام useMemo لمنع التقديم المتكرر للبيانات
  const chartData = useMemo(() => {
    return priceData;
  }, [priceData]);

  // استخدام useMemo للدالة المنسقة
  const labelFormatter = useMemo(() => {
    return (label: any) => format(new Date(label), 'PPpp');
  }, []);

  // استخدام useMemo للقيمة المنسقة
  const valueFormatter = useMemo(() => {
    return (value: number) => [`$${value.toFixed(2)}`, t('السعر', 'Price')];
  }, [t]);

  return (
    <div className="h-[250px]">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="date"
            tickFormatter={formatDate}
            tick={{ fontSize: 12 }}
          />
          <YAxis 
            domain={['auto', 'auto']}
            tick={{ fontSize: 12 }}
          />
          <Tooltip 
            labelFormatter={labelFormatter}
            formatter={valueFormatter}
          />
          <Line 
            type="monotone"
            dataKey="value"
            stroke="#10b981"
            strokeWidth={2}
            dot={false}
            animationDuration={500}
            isAnimationActive={false} // إيقاف الرسوم المتحركة لتحسين الأداء
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default React.memo(CryptoPriceChart); // استخدام React.memo لمنع إعادة تقديم المكون عندما لا تتغير الخصائص
