
import React, { useState } from 'react';
import { useCryptoData } from '@/hooks/useCryptoData';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useLanguage } from '@/contexts/LanguageContext';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Skeleton } from '@/components/ui/skeleton';
import { format } from 'date-fns';
import { arSA } from 'date-fns/locale';
import { Loader2 } from 'lucide-react';

interface CryptoDataDisplayProps {
  defaultCoin?: string;
}

const CryptoDataDisplay: React.FC<CryptoDataDisplayProps> = ({ defaultCoin = 'bitcoin' }) => {
  const { t, language } = useLanguage();
  const [selectedCoin, setSelectedCoin] = useState(defaultCoin);
  const [timeframe, setTimeframe] = useState('7');
  
  const { data, loading, error } = useCryptoData(selectedCoin, timeframe);

  const formatData = (data: [number, number][]) => {
    if (!data || !data.length) return [];
    
    return data.map(([timestamp, value]) => ({
      date: new Date(timestamp),
      value: Number(value.toFixed(2)),
    }));
  };

  const formatDate = (date: Date) => {
    const locale = language === 'ar' ? arSA : undefined;
    return format(date, 'MMM dd', { locale });
  };

  const handleCoinChange = (value: string) => {
    setSelectedCoin(value);
  };

  const handleTimeframeChange = (value: string) => {
    setTimeframe(value);
  };
  
  const getSymbolName = (symbol: string) => {
    switch (symbol) {
      case 'bitcoin': return 'Bitcoin (BTC)';
      case 'ethereum': return 'Ethereum (ETH)';
      case 'binancecoin': return 'Binance Coin (BNB)';
      case 'ripple': return 'XRP';
      case 'cardano': return 'Cardano (ADA)';
      case 'solana': return 'Solana (SOL)';
      default: return symbol.charAt(0).toUpperCase() + symbol.slice(1);
    }
  };

  return (
    <Card className="w-full mb-6">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle>{t('بيانات العملة الرقمية', 'Cryptocurrency Data')}</CardTitle>
        <div className="flex items-center gap-2">
          <Select value={selectedCoin} onValueChange={handleCoinChange}>
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
          <Select value={timeframe} onValueChange={handleTimeframeChange}>
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
          <div className="space-y-2 flex flex-col items-center justify-center h-[300px]">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-muted-foreground">{t('جاري تحميل البيانات...', 'Loading data...')}</p>
          </div>
        ) : error ? (
          <div className="p-4 text-center text-red-500">
            {t('حدث خطأ في جلب البيانات', 'Error fetching data')}: {error}
          </div>
        ) : data && data.prices && data.prices.length > 0 ? (
          <div>
            <div className="flex justify-between items-center mb-4">
              <div>
                <h3 className="font-bold text-lg">{getSymbolName(selectedCoin)}</h3>
                <p className="text-muted-foreground text-sm">
                  {t('آخر سعر', 'Last price')}: ${data.prices[data.prices.length - 1][1].toFixed(2)}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-muted-foreground">
                  {t('التغيير', 'Change')}: 
                  <span className={
                    data.prices[data.prices.length - 1][1] > data.prices[0][1] ? 
                    'text-green-500 ml-1' : 'text-red-500 ml-1'
                  }>
                    {(((data.prices[data.prices.length - 1][1] - data.prices[0][1]) / data.prices[0][1]) * 100).toFixed(2)}%
                  </span>
                </p>
                <p className="text-sm text-muted-foreground">
                  {t('في آخر', 'In the last')} {timeframe === '1' ? t('يوم', 'day') : 
                   timeframe === '7' ? t('أسبوع', '7 days') : 
                   timeframe === '30' ? t('شهر', '30 days') : t('ثلاثة أشهر', '90 days')}
                </p>
              </div>
            </div>
            
            <div className="h-[250px]">
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
