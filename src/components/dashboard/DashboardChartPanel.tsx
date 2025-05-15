
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";
import { ChartContainer } from "@/components/ui/chart";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const DashboardChartPanel = () => {
  const { t } = useLanguage();

  // Sample data for the chart
  const data = [
    { name: 'Jan', value: 3400 },
    { name: 'Feb', value: 2800 },
    { name: 'Mar', value: 4300 },
    { name: 'Apr', value: 3900 },
    { name: 'May', value: 4800 },
    { name: 'Jun', value: 5300 },
    { name: 'Jul', value: 4900 },
    { name: 'Aug', value: 5700 },
    { name: 'Sep', value: 6200 },
    { name: 'Oct', value: 5800 },
    { name: 'Nov', value: 6800 },
    { name: 'Dec', value: 7200 },
  ];

  const chartConfig = {
    market: {
      label: t('مؤشرات السوق', 'Market Indicators'),
      theme: { 
        light: '#10b981',
        dark: '#059669' 
      },
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('اتجاهات السوق', 'Market Trends')}</CardTitle>
        <CardDescription>
          {t('مؤشرات الأداء الرئيسية على مدار العام', 'Key performance indicators throughout the year')}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[350px] w-full">
          <ChartContainer config={chartConfig}>
            <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--color-market)" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="var(--color-market)" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip 
                formatter={(value: number) => [`$${value}`, t('قيمة', 'Value')]}
                labelFormatter={(label) => `${label}`}
              />
              <Area
                type="monotone"
                dataKey="value"
                stroke="var(--color-market)"
                fillOpacity={1}
                fill="url(#colorValue)"
                strokeWidth={2}
              />
            </AreaChart>
          </ChartContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default DashboardChartPanel;
