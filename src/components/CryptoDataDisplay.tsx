
import React, { useState } from 'react';
import { useCryptoData } from '@/hooks/useCryptoData';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useLanguage } from '@/contexts/LanguageContext';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Skeleton } from '@/components/ui/skeleton';
import { format } from 'date-fns';
import { arSA } from 'date-fns/locale';

interface CryptoDataDisplayProps {
  defaultCoin?: string;
}

const CryptoDataDisplay: React.FC<CryptoDataDisplayProps> = ({ defaultCoin = 'bitcoin' }) => {
  const { t } = useLanguage();
  const [selectedCoin, setSelectedCoin] = useState(defaultCoin);
  const [timeframe, setTimeframe] = useState('7');
  
  const { data, loading, error } = useCryptoData(selectedCoin, timeframe);

  const formatData = (data: [number, number][]) => {
    if (!data) return [];
    return data.map(([timestamp, value]) => ({
      date: new Date(timestamp),
      value,
    }));
  };

  const formatDate = (date: Date) => {
    const locale = localStorage.getItem('language') === 'ar' ? arSA : undefined;
    return format(date, 'MMM dd', { locale });
  };

  return (
    <Card className="w-full mb-6">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle>{t('بيانات العملة الرقمية', 'Cryptocurrency Data')}</CardTitle>
        <div className="flex items-center gap-2">
          <Select value={selectedCoin} onValueChange={setSelectedCoin}>
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder={t('اختر العملة', 'Select Coin')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="bitcoin">Bitcoin</SelectItem>
              <SelectItem value="ethereum">Ethereum</SelectItem>
              <SelectItem value="binancecoin">Binance Coin</SelectItem>
            </SelectContent>
          </Select>
          <Select value={timeframe} onValueChange={setTimeframe}>
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
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-2">
            <Skeleton className="h-[300px] w-full" />
          </div>
        ) : error ? (
          <div className="p-4 text-center text-red-500">
            {t('حدث خطأ في جلب البيانات', 'Error fetching data')}: {error}
          </div>
        ) : data ? (
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={formatData(data.prices)}>
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
        ) : (
          <div className="p-4 text-center">
            {t('لا توجد بيانات متاحة', 'No data available')}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CryptoDataDisplay;
