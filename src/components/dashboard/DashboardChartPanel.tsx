
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useLanguage } from "@/contexts/LanguageContext";
import PriceChart from "./charts/PriceChart";
import VolumeChart from "./charts/VolumeChart";
import MarketCapChart from "./charts/MarketCapChart";

const DashboardChartPanel = () => {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState('price');

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
          <Tabs value={activeTab}>
            <TabsContent value="price" className="mt-0 h-full">
              <PriceChart />
            </TabsContent>
            
            <TabsContent value="volume" className="mt-0 h-full">
              <VolumeChart />
            </TabsContent>
            
            <TabsContent value="marketcap" className="mt-0 h-full">
              <MarketCapChart />
            </TabsContent>
          </Tabs>
        </div>
      </CardContent>
    </Card>
  );
};

export default DashboardChartPanel;
