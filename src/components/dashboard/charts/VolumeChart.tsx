
import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { ChartContainer } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { volumeData } from "./chartData";
import { createChartConfig } from "./chartConfig";

const VolumeChart = () => {
  const { t } = useLanguage();
  const chartConfig = createChartConfig(t);

  return (
    <ChartContainer config={chartConfig}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={volumeData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip 
            formatter={(value: number) => [`$${value.toLocaleString()}M`, '']}
            contentStyle={{ 
              backgroundColor: 'rgba(255, 255, 255, 0.9)',
              borderRadius: '6px',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
              border: 'none'
            }}
          />
          <Legend />
          <Bar dataKey="btc" name="Bitcoin" fill="var(--color-btc)" radius={[4, 4, 0, 0]} />
          <Bar dataKey="eth" name="Ethereum" fill="var(--color-eth)" radius={[4, 4, 0, 0]} />
          <Bar dataKey="sol" name="Solana" fill="var(--color-sol)" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
};

export default VolumeChart;
