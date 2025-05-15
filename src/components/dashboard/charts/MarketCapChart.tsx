
import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { ChartContainer } from "@/components/ui/chart";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { marketCapData } from "./chartData";
import { createChartConfig } from "./chartConfig";

const MarketCapChart = () => {
  const { t } = useLanguage();
  const chartConfig = createChartConfig(t);
  
  return (
    <ChartContainer config={chartConfig}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={marketCapData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="colorMarketCap" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="var(--color-btc)" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="var(--color-btc)" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip 
            formatter={(value: number) => [`$${(value/1000).toLocaleString()}B`, t('القيمة السوقية', 'Market Cap')]}
            labelFormatter={(label) => `${label}`}
            contentStyle={{ 
              backgroundColor: 'rgba(255, 255, 255, 0.9)',
              borderRadius: '6px',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
              border: 'none'
            }}
          />
          <Area
            type="monotone"
            dataKey="value"
            stroke="var(--color-btc)"
            fillOpacity={1}
            fill="url(#colorMarketCap)"
            strokeWidth={2}
            activeDot={{ r: 6, strokeWidth: 0 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
};

export default MarketCapChart;
