
import { CandleData } from "@/components/CandleDetail";

// Generate demo candlestick data
export const generateCandlestickData = (count: number): CandleData[] => {
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

// Format price for tooltip and axis
export const priceFormatter = (value: number): string => {
  return `$${value.toLocaleString()}`;
};
