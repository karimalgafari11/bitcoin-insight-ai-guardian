
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

// Sample data - in a real app, this would come from an API
const generateDemoData = () => {
  const data = [];
  let price = 50000;
  
  for (let i = 0; i < 100; i++) {
    const change = Math.random() > 0.5 ? 1 : -1;
    price = price + (Math.random() * 500) * change;
    
    data.push({
      time: new Date(new Date().getTime() - (100 - i) * 3600000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      price,
    });
  }
  
  return data;
};

type BitcoinChartProps = {
  timeframe: string;
  className?: string;
};

const BitcoinChart = ({ timeframe, className }: BitcoinChartProps) => {
  const [data, setData] = useState<any[]>([]);
  const [chartHeight, setChartHeight] = useState(400);
  const containerRef = useRef<HTMLDivElement>(null);
  const [percentChange, setPercentChange] = useState(0);
  
  useEffect(() => {
    setData(generateDemoData());
    
    // Calculate percent change
    const firstPrice = data[0]?.price;
    const lastPrice = data[data.length - 1]?.price;
    
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
  }, [timeframe]);
  
  const priceFormatter = (value: number) => {
    return `$${value.toLocaleString()}`;
  };
  
  const isPositiveChange = percentChange >= 0;
  
  return (
    <Card className={`${className} overflow-hidden border-zinc-800 bg-chart-bg`}>
      <div className="flex items-center justify-between p-4 border-b border-zinc-800">
        <div className="font-medium text-lg">BTC/USD {timeframe}</div>
        <div className={`flex items-center ${isPositiveChange ? 'text-bitcoin-green' : 'text-bitcoin-red'}`}>
          {isPositiveChange ? '+' : ''}{percentChange}%
        </div>
      </div>
      
      <CardContent className="p-0" ref={containerRef}>
        <ResponsiveContainer width="100%" height={chartHeight}>
          <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
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
              domain={['dataMin - 1000', 'dataMax + 1000']} 
              tickFormatter={priceFormatter} 
              tick={{ fill: '#999' }} 
              axisLine={{ stroke: '#333' }} 
            />
            <Tooltip 
              contentStyle={{ backgroundColor: '#1E1E1E', borderColor: '#333' }} 
              labelStyle={{ color: '#CCC' }}
              formatter={(value: any) => [`$${Number(value).toLocaleString()}`, 'السعر']}
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
      </CardContent>
    </Card>
  );
};

export default BitcoinChart;
