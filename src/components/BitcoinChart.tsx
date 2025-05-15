
import { useEffect, useRef, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useCryptoData } from "@/hooks/useCryptoData";
import { Skeleton } from "@/components/ui/skeleton";
import { Loader2, RefreshCw } from "lucide-react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";

type BitcoinChartProps = {
  timeframe: string;
  className?: string;
};

const BitcoinChart = ({ timeframe, className }: BitcoinChartProps) => {
  const { t } = useLanguage();
  const [chartHeight, setChartHeight] = useState(400);
  const containerRef = useRef<HTMLDivElement>(null);
  const [percentChange, setPercentChange] = useState(0);
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());
  
  // Convert timeframe to days for API
  const getDaysFromTimeframe = (timeframe: string): string => {
    switch (timeframe) {
      case "4h": return "1";
      case "1d": return "1";
      case "1w": return "7";
      case "1m": return "30";
      default: return "7";
    }
  };
  
  const days = getDaysFromTimeframe(timeframe);
  const { data, loading, error, refreshData } = useCryptoData("bitcoin", days);
  
  useEffect(() => {
    if (!data || !data.prices || data.prices.length < 2) return;
    
    // Calculate percent change from first to last price
    const firstPrice = data.prices[0][1];
    const lastPrice = data.prices[data.prices.length - 1][1];
    
    if (firstPrice && lastPrice) {
      const change = ((lastPrice - firstPrice) / firstPrice) * 100;
      setPercentChange(parseFloat(change.toFixed(2)));
    }
    
    // Adjust height based on container width for better proportions
    const updateHeight = () => {
      if (containerRef.current) {
        const width = containerRef.current.clientWidth;
        setChartHeight(Math.max(300, Math.min(500, width * 0.5)));
      }
    };
    
    updateHeight();
    window.addEventListener("resize", updateHeight);
    
    return () => window.removeEventListener("resize", updateHeight);
  }, [data]);
  
  const priceFormatter = (value: number) => {
    return `$${value.toLocaleString()}`;
  };
  
  const formatData = (prices: [number, number][]) => {
    if (!prices) return [];
    
    return prices.map(([timestamp, price]) => ({
      time: format(new Date(timestamp), 'HH:mm'),
      date: new Date(timestamp),
      price,
    }));
  };
  
  const isPositiveChange = percentChange >= 0;
  
  const handleRefresh = () => {
    refreshData();
    setLastRefresh(new Date());
    toast({
      title: t('تحديث البيانات', 'Data Refresh'),
      description: t('جاري تحديث البيانات...', 'Refreshing data...'),
    });
  };
  
  if (loading) {
    return (
      <Card className={`${className} overflow-hidden border-zinc-800`}>
        <div className="flex items-center justify-between p-4 border-b border-zinc-800">
          <div className="font-medium text-lg">BTC/USD {timeframe}</div>
          <div className="flex items-center">
            <Skeleton className="h-5 w-16" />
          </div>
        </div>
        <CardContent className="p-6 flex items-center justify-center" style={{ height: chartHeight }}>
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </CardContent>
      </Card>
    );
  }
  
  if (error || !data || !data.prices || data.prices.length === 0) {
    return (
      <Card className={`${className} overflow-hidden border-zinc-800`}>
        <div className="flex items-center justify-between p-4 border-b border-zinc-800">
          <div className="font-medium text-lg">BTC/USD {timeframe}</div>
          <div className="flex items-center text-red-500">Error loading data</div>
        </div>
        <CardContent className="p-6 flex items-center justify-center" style={{ height: chartHeight }}>
          <p className="text-muted-foreground">Failed to load chart data</p>
        </CardContent>
      </Card>
    );
  }
  
  const chartData = formatData(data.prices);
  
  // Safe date formatter for tooltip that checks if input is valid
  const safeDateFormatter = (label: any): string => {
    try {
      // Make sure label is a valid date before formatting
      if (!label) return '';
      
      // If label is already a Date object
      if (label instanceof Date) {
        return format(label, 'PPpp');
      }
      
      // If label is a timestamp string or number, convert to Date
      const date = new Date(label);
      
      // Check if date is valid
      if (isNaN(date.getTime())) {
        return 'Invalid date';
      }
      
      return format(date, 'PPpp');
    } catch (error) {
      console.error('Date formatting error:', error);
      return 'Invalid date';
    }
  };
  
  return (
    <Card className={`${className} overflow-hidden border-zinc-800 bg-chart-bg`}>
      <div className="flex items-center justify-between p-4 border-b border-zinc-800">
        <div className="font-medium text-lg">BTC/USD {timeframe}</div>
        <div className="flex items-center gap-2">
          <div className={`${isPositiveChange ? 'text-bitcoin-green' : 'text-bitcoin-red'}`}>
            {isPositiveChange ? '+' : ''}{percentChange}%
          </div>
          <Button
            variant="outline"
            size="icon"
            onClick={handleRefresh}
            title={t('تحديث البيانات', 'Refresh Data')}
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      <CardContent className="p-0" ref={containerRef}>
        <ResponsiveContainer width="100%" height={chartHeight}>
          <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={isPositiveChange ? "#0ecb81" : "#f6465d"} stopOpacity={0.3} />
                <stop offset="95%" stopColor={isPositiveChange ? "#0ecb81" : "#f6465d"} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid stroke="#333" strokeDasharray="3 3" />
            <XAxis 
              dataKey="time" 
              tick={{ fill: '#999' }} 
              axisLine={{ stroke: '#333' }} 
            />
            <YAxis 
              domain={['auto', 'auto']} 
              tickFormatter={priceFormatter} 
              tick={{ fill: '#999' }} 
              axisLine={{ stroke: '#333' }} 
            />
            <Tooltip 
              contentStyle={{ backgroundColor: '#1E1E1E', borderColor: '#333' }} 
              labelStyle={{ color: '#CCC' }}
              formatter={(value: any) => [`$${Number(value).toLocaleString()}`, 'السعر']}
              labelFormatter={safeDateFormatter}
            />
            <Area 
              type="monotone" 
              dataKey="price" 
              stroke={isPositiveChange ? "#0ecb81" : "#f6465d"} 
              fillOpacity={1} 
              fill="url(#colorPrice)" 
            />
          </AreaChart>
        </ResponsiveContainer>
        
        <div className="p-2 text-xs text-muted-foreground text-right">
          {t('آخر تحديث', 'Last refresh')}: {lastRefresh.toLocaleTimeString()}
        </div>
      </CardContent>
    </Card>
  );
};

export default BitcoinChart;
