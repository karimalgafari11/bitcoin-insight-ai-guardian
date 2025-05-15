
import React, { useState } from 'react';
import { useCryptoData } from '@/hooks/useCryptoData';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useLanguage } from '@/contexts/LanguageContext';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Skeleton } from '@/components/ui/skeleton';
import { format } from 'date-fns';
import { arSA } from 'date-fns/locale';
import { Loader2, ArrowUp, ArrowDown, Info } from 'lucide-react';

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

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 2
    }).format(value);
  };

  const formatLargeNumber = (num: number) => {
    if (num >= 1e9) {
      return `${(num / 1e9).toFixed(2)}B`;
    } else if (num >= 1e6) {
      return `${(num / 1e6).toFixed(2)}M`;
    } else if (num >= 1e3) {
      return `${(num / 1e3).toFixed(2)}K`;
    }
    return num.toString();
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <h3 className="font-bold text-lg">
                  {data.metadata?.name || getSymbolName(selectedCoin)}
                </h3>
                <div className="flex items-center gap-2">
                  <p className="text-2xl font-bold">
                    {formatCurrency(data.metadata?.current_price || data.prices[data.prices.length - 1][1])}
                  </p>
                  {data.metadata && (
                    <span className={
                      data.metadata.percent_change_24h > 0 ? 
                      'text-green-500 flex items-center' : 'text-red-500 flex items-center'
                    }>
                      {data.metadata.percent_change_24h > 0 ? <ArrowUp className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />}
                      {Math.abs(data.metadata.percent_change_24h).toFixed(2)}%
                    </span>
                  )}
                </div>
                <p className="text-sm text-muted-foreground">
                  {t('آخر تحديث', 'Last updated')}: {data.metadata ? 
                    new Date(data.metadata.last_updated).toLocaleTimeString() : 
                    new Date().toLocaleTimeString()
                  }
                </p>
              </div>
              
              {data.metadata && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">{t('القيمة السوقية', 'Market Cap')}</p>
                    <p className="font-medium">{formatLargeNumber(data.metadata.market_cap)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">{t('حجم التداول (24 ساعة)', 'Volume (24h)')}</p>
                    <p className="font-medium">{formatLargeNumber(data.metadata.volume_24h)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">{t('التغير (24 ساعة)', 'Change (24h)')}</p>
                    <p className={data.metadata.percent_change_24h > 0 ? "text-green-500" : "text-red-500"}>
                      {data.metadata.percent_change_24h.toFixed(2)}%
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">{t('التغير (7 أيام)', 'Change (7d)')}</p>
                    <p className={data.metadata.percent_change_7d > 0 ? "text-green-500" : "text-red-500"}>
                      {data.metadata.percent_change_7d.toFixed(2)}%
                    </p>
                  </div>
                </div>
              )}
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
            
            <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-md flex items-start gap-2">
              <Info className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-muted-foreground">
                {t(
                  'البيانات مقدمة بواسطة CoinMarketCap. قد تختلف الأسعار قليلاً عن منصات التداول الأخرى.',
                  'Data provided by CoinMarketCap. Prices may slightly differ from other trading platforms.'
                )}
              </p>
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
