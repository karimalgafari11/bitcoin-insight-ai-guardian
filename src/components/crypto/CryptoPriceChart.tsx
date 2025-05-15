
import React from 'react';
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

  const formatDate = (date: Date) => {
    const locale = language === 'ar' ? arSA : undefined;
    return format(date, 'MMM dd', { locale });
  };

  return (
    <div className="h-[250px]">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={priceData}>
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
            labelFormatter={(label) => format(new Date(label), 'PPpp')}
            formatter={(value: number) => [`$${value.toFixed(2)}`, t('السعر', 'Price')]}
          />
          <Line 
            type="monotone"
            dataKey="value"
            stroke="#10b981"
            strokeWidth={2}
            dot={false}
            animationDuration={500}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CryptoPriceChart;
