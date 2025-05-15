
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useLanguage } from "@/contexts/LanguageContext";
import { ChartContainer } from "@/components/ui/chart";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend } from "recharts";

const DashboardChartPanel = () => {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState('price');

  // Sample data for the chart
  const priceData = [
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

  const volumeData = [
    { name: 'Jan', btc: 1200, eth: 800, sol: 400 },
    { name: 'Feb', btc: 1400, eth: 700, sol: 350 },
    { name: 'Mar', btc: 1800, eth: 1100, sol: 500 },
    { name: 'Apr', btc: 1600, eth: 1000, sol: 450 },
    { name: 'May', btc: 2000, eth: 1200, sol: 600 },
    { name: 'Jun', btc: 2200, eth: 1300, sol: 650 },
    { name: 'Jul', btc: 2100, eth: 1250, sol: 620 },
    { name: 'Aug', btc: 2300, eth: 1400, sol: 700 },
    { name: 'Sep', btc: 2500, eth: 1500, sol: 750 },
    { name: 'Oct', btc: 2400, eth: 1450, sol: 720 },
    { name: 'Nov', btc: 2700, eth: 1600, sol: 800 },
    { name: 'Dec', btc: 2900, eth: 1700, sol: 850 },
  ];

  const marketCapData = [
    { name: 'Jan', value: 840000 },
    { name: 'Feb', value: 920000 },
    { name: 'Mar', value: 880000 },
    { name: 'Apr', value: 950000 },
    { name: 'May', value: 1020000 },
    { name: 'Jun', value: 1150000 },
    { name: 'Jul', value: 1250000 },
    { name: 'Aug', value: 1380000 },
    { name: 'Sep', value: 1420000 },
    { name: 'Oct', value: 1350000 },
    { name: 'Nov', value: 1480000 },
    { name: 'Dec', value: 1600000 },
  ];

  const chartConfig = {
    market: {
      label: t('مؤشرات السوق', 'Market Indicators'),
      theme: { 
        light: '#10b981',
        dark: '#059669' 
      },
    },
    btc: {
      label: 'Bitcoin',
      theme: {
        light: '#f59e0b',
        dark: '#d97706'
      }
    },
    eth: {
      label: 'Ethereum',
      theme: {
        light: '#6366f1',
        dark: '#4f46e5'
      }
    },
    sol: {
      label: 'Solana',
      theme: {
        light: '#ec4899',
        dark: '#db2777'
      }
    }
  };

  return (
    <Card className="border-none shadow-md bg-gradient-to-b from-white to-gray-50 dark:from-gray-800 dark:to-gray-900">
      <CardHeader>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <CardTitle>{t('اتجاهات السوق', 'Market Trends')}</CardTitle>
            <CardDescription>
              {t('مؤشرات الأداء الرئيسية على مدار العام', 'Key performance indicators throughout the year')}
            </CardDescription>
          </div>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full sm:w-auto">
            <TabsList className="grid grid-cols-3 w-full sm:w-auto">
              <TabsTrigger value="price">{t('السعر', 'Price')}</TabsTrigger>
              <TabsTrigger value="volume">{t('حجم التداول', 'Volume')}</TabsTrigger>
              <TabsTrigger value="marketcap">{t('القيمة السوقية', 'Market Cap')}</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[350px] w-full">
          <TabsContent value="price" className="mt-0 h-full">
            <ChartContainer config={chartConfig}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={priceData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
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
                    formatter={(value: number) => [`$${value.toLocaleString()}`, t('قيمة', 'Value')]}
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
                    stroke="var(--color-market)"
                    fillOpacity={1}
                    fill="url(#colorValue)"
                    strokeWidth={2}
                    activeDot={{ r: 6, strokeWidth: 0 }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </ChartContainer>
          </TabsContent>
          
          <TabsContent value="volume" className="mt-0 h-full">
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
          </TabsContent>
          
          <TabsContent value="marketcap" className="mt-0 h-full">
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
          </TabsContent>
        </div>
      </CardContent>
    </Card>
  );
};

export default DashboardChartPanel;
