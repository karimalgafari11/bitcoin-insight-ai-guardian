
import { useEffect, useState, useRef } from "react";
import { Card } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";
import { 
  ResponsiveContainer, 
  ComposedChart, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid, 
  Bar,
  Line,
  ReferenceLine
} from "recharts";

type CandlestickChartProps = {
  symbol: string;
  timeframe: string;
  className?: string;
};

// Generate demo candlestick data
const generateCandlestickData = (count: number) => {
  const data = [];
  let date = new Date();
  let close = 60000;
  
  for (let i = 0; i < count; i++) {
    const change = Math.random() > 0.5 ? 1 : -1;
    const volatility = Math.random() * 2000;
    
    close = close + (volatility * change);
    const open = close - (Math.random() > 0.5 ? -1 : 1) * Math.random() * 1000;
    const high = Math.max(open, close) + Math.random() * 500;
    const low = Math.min(open, close) - Math.random() * 500;
    const volume = Math.round(Math.random() * 1000000);
    
    // Format date based on timeframe
    const formattedDate = date.toLocaleDateString('en-US', { 
      month: 'short',
      day: 'numeric'
    });
    
    data.unshift({
      date: formattedDate,
      open: parseFloat(open.toFixed(2)),
      high: parseFloat(high.toFixed(2)),
      low: parseFloat(low.toFixed(2)),
      close: parseFloat(close.toFixed(2)),
      volume,
      fillColor: open > close ? "#f6465d" : "#0ecb81"
    });
    
    // Move back in time
    date = new Date(date.getTime() - 24 * 60 * 60 * 1000);
  }
  
  return data;
};

const CandlestickChart = ({ symbol, timeframe, className }: CandlestickChartProps) => {
  const { t } = useLanguage();
  const [data, setData] = useState<any[]>([]);
  const [chartHeight, setChartHeight] = useState(450);
  const containerRef = useRef<HTMLDivElement>(null);
  const [patterns, setPatterns] = useState<any[]>([]);
  
  useEffect(() => {
    // Load candlestick data based on symbol and timeframe
    const newData = generateCandlestickData(30);
    setData(newData);
    
    // Simulate finding patterns
    const simulatedPatterns = [
      { index: 24, type: "bullish-engulfing" },
      { index: 10, type: "hammer" }
    ];
    setPatterns(simulatedPatterns);
    
    // Responsive chart height
    const updateHeight = () => {
      if (containerRef.current) {
        const width = containerRef.current.clientWidth;
        setChartHeight(Math.max(400, Math.min(600, width * 0.6)));
      }
    };
    
    updateHeight();
    window.addEventListener("resize", updateHeight);
    
    return () => window.removeEventListener("resize", updateHeight);
  }, [symbol, timeframe]);
  
  // Format price for tooltip and axis
  const priceFormatter = (value: number) => {
    return `$${value.toLocaleString()}`;
  };
  
  return (
    <div className={`${className} overflow-hidden`} ref={containerRef}>
      <ResponsiveContainer width="100%" height={chartHeight}>
        <ComposedChart data={data} margin={{ top: 10, right: 30, left: 20, bottom: 30 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#333" />
          
          <XAxis 
            dataKey="date" 
            tick={{ fill: '#999' }} 
            axisLine={{ stroke: '#333' }}
          />
          
          <YAxis 
            yAxisId="price"
            domain={['auto', 'auto']} 
            tickFormatter={priceFormatter} 
            tick={{ fill: '#999' }} 
            axisLine={{ stroke: '#333' }}
            orientation="right"
          />
          
          <YAxis 
            yAxisId="volume"
            domain={['auto', 'auto']} 
            tickFormatter={(value) => `${(value / 1000).toFixed(0)}K`}
            tick={{ fill: '#999' }} 
            axisLine={{ stroke: '#333' }}
            orientation="left"
          />
          
          <Tooltip
            contentStyle={{ backgroundColor: '#1E1E1E', borderColor: '#333' }}
            labelStyle={{ color: '#CCC' }}
            formatter={(value: any, name: string) => {
              if (name === "volume") return [`${(value / 1000).toFixed(0)}K`, t("الحجم", "Volume")];
              return [priceFormatter(value), name];
            }}
          />
          
          {/* Candlesticks */}
          <Bar 
            dataKey="high" 
            yAxisId="price"
            fill="transparent" 
            stroke="transparent"
          />
          <Bar 
            dataKey="low" 
            yAxisId="price"
            fill="transparent" 
            stroke="transparent"
          />
          {data.map((entry, index) => (
            <ReferenceLine
              key={`candle-${index}`}
              x={entry.date}
              yAxisId="price"
              stroke="transparent"
              segment={[
                { x: index, y: entry.low },
                { x: index, y: entry.high }
              ]}
            />
          ))}
          {data.map((entry, index) => (
            <ReferenceLine
              key={`body-${index}`}
              yAxisId="price"
              x={entry.date}
              stroke={entry.open > entry.close ? "#f6465d" : "#0ecb81"}
              strokeWidth={8}
              segment={[
                { x: index, y: entry.open },
                { x: index, y: entry.close }
              ]}
            />
          ))}
          
          {/* Volume bars */}
          <Bar 
            dataKey="volume" 
            yAxisId="volume" 
            fill="rgba(100, 100, 255, 0.4)" 
            stroke="rgba(100, 100, 255, 0.6)"
            opacity={0.5}
          />
          
          {/* Pattern markers */}
          {patterns.map((pattern, index) => (
            <ReferenceLine
              key={`pattern-${index}`}
              x={data[pattern.index]?.date}
              yAxisId="price"
              stroke="#ffcc00"
              strokeWidth={1}
              strokeDasharray="3 3"
            />
          ))}
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CandlestickChart;
