
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
  Bar
} from "recharts";
import { CandleData } from "./CandleDetail";
import { generateCandlestickData, priceFormatter } from "@/utils/candlestickUtils";
import { CandleWicks, CandleBodies } from "./chart/CandleRenders";
import PatternMarkers from "./chart/PatternMarkers";
import SelectionIndicator from "./chart/SelectionIndicator";

type CandlestickChartProps = {
  symbol: string;
  timeframe: string;
  className?: string;
  onSelectCandle?: (candle: CandleData | null) => void;
};

const CandlestickChart = ({ symbol, timeframe, className, onSelectCandle }: CandlestickChartProps) => {
  const { t } = useLanguage();
  const [data, setData] = useState<CandleData[]>([]);
  const [chartHeight, setChartHeight] = useState(450);
  const containerRef = useRef<HTMLDivElement>(null);
  const [patterns, setPatterns] = useState<any[]>([]);
  const [selectedCandleIndex, setSelectedCandleIndex] = useState<number | null>(null);
  
  useEffect(() => {
    // Load candlestick data based on symbol and timeframe
    const newData = generateCandlestickData(30);
    setData(newData);
    
    // Reset selected candle when changing symbol or timeframe
    setSelectedCandleIndex(null);
    if (onSelectCandle) {
      onSelectCandle(null);
    }
    
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
  }, [symbol, timeframe, onSelectCandle]);

  const handleClick = (data: any, index: number) => {
    if (data && data.activePayload && data.activePayload.length) {
      const candleIndex = data.activeTooltipIndex;
      setSelectedCandleIndex(candleIndex);
      
      if (onSelectCandle) {
        onSelectCandle(candleIndex !== null ? data.activePayload[0].payload : null);
      }
    }
  };
  
  return (
    <div className={`${className} overflow-hidden relative`} ref={containerRef}>
      <ResponsiveContainer width="100%" height={chartHeight}>
        <ComposedChart 
          data={data} 
          margin={{ top: 10, right: 30, left: 20, bottom: 30 }}
          onClick={handleClick}
        >
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
          
          <CandleWicks data={data} selectedCandleIndex={selectedCandleIndex} />
          <CandleBodies data={data} selectedCandleIndex={selectedCandleIndex} />
          
          {/* Volume bars */}
          <Bar 
            dataKey="volume" 
            yAxisId="volume" 
            fill="rgba(100, 100, 255, 0.4)" 
            stroke="rgba(100, 100, 255, 0.6)"
            opacity={0.5}
          />
          
          {/* Pattern markers */}
          <PatternMarkers patterns={patterns} data={data} />
        </ComposedChart>
      </ResponsiveContainer>

      <SelectionIndicator selectedCandleIndex={selectedCandleIndex} data={data} />
    </div>
  );
};

export default CandlestickChart;
