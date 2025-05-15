
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

  // Memoize the formatted data to prevent unnecessary calculations
  const chartData = useMemo(() => priceData, [priceData]);

  // Memoize formatting functions to prevent recreation on each render
  const formatDate = useMemo(() => {
    return (date: Date) => {
      if (!date || isNaN(date.getTime())) {
        return '';
      }
      const locale = language === 'ar' ? arSA : undefined;
      return format(date, 'MMM dd', { locale });
    };
  }, [language]);

  // Memoize label formatter
  const labelFormatter = useMemo(() => {
    return (label: any) => {
      try {
        if (!label) return '';
        
        // If label is already a Date object
        if (label instanceof Date && !isNaN(label.getTime())) {
          return format(label, 'PPpp');
        }
        
        // If label is a string or number, try to convert to Date
        const date = new Date(label);
        if (isNaN(date.getTime())) {
          return 'Invalid date';
        }
        
        return format(date, 'PPpp');
      } catch (error) {
        console.error('Date formatting error:', error);
        return 'Invalid date';
      }
    };
  }, []);

  // Memoize value formatter
  const valueFormatter = useMemo(() => {
    return (value: number) => [`$${value.toFixed(2)}`, t('السعر', 'Price')];
  }, [t]);

  // Use CSS for stable rendering
  return (
    <div className="h-[250px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={chartData}
          margin={{ top: 5, right: 5, bottom: 5, left: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.1)" />
          <XAxis 
            dataKey="date"
            tickFormatter={formatDate}
            tick={{ fontSize: 12 }}
            stroke="rgba(0,0,0,0.3)"
          />
          <YAxis 
            domain={['auto', 'auto']}
            tick={{ fontSize: 12 }}
            stroke="rgba(0,0,0,0.3)"
            width={60}
          />
          <Tooltip 
            labelFormatter={labelFormatter}
            formatter={valueFormatter}
            isAnimationActive={false}
            contentStyle={{
              backgroundColor: 'rgba(255, 255, 255, 0.95)',
              border: '1px solid #ccc',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}
          />
          <Line 
            type="monotone"
            dataKey="value"
            stroke="#10b981"
            strokeWidth={2}
            dot={false}
            isAnimationActive={false}
            activeDot={{ stroke: '#047857', strokeWidth: 1, r: 4, fill: '#10b981' }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

// Use React.memo to prevent unnecessary re-renders
export default React.memo(CryptoPriceChart);
