
import { useState } from "react";
import AppSidebar from "@/components/AppSidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SidebarTrigger } from "@/components/ui/sidebar";
import BitcoinChart from "@/components/BitcoinChart";
import BitcoinStats from "@/components/BitcoinStats";
import TechnicalIndicators from "@/components/TechnicalIndicators";
import TradingRecommendation from "@/components/TradingRecommendation";
import LatestNews from "@/components/LatestNews";
import TimeframeSelector from "@/components/TimeframeSelector";

const Analysis = () => {
  const [timeframe, setTimeframe] = useState("4h");

  const handleTimeframeChange = (newTimeframe: string) => {
    setTimeframe(newTimeframe);
  };

  return (
    <div className="min-h-screen flex w-full">
      <AppSidebar />
      <div className="flex-1 overflow-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-semibold">التحليل</h1>
            <div className="flex items-center gap-4">
              <TimeframeSelector onTimeframeChange={handleTimeframeChange} className="flex-row-reverse" />
              <SidebarTrigger />
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* الرسم البياني الرئيسي */}
            <BitcoinChart timeframe={timeframe} className="lg:col-span-8" />
            
            {/* القسم الجانبي */}
            <div className="lg:col-span-4 flex flex-col gap-6">
              <TradingRecommendation />
              <TechnicalIndicators />
            </div>
            
            {/* إحصائيات البيتكوين */}
            <BitcoinStats className="lg:col-span-12" />
            
            {/* أحدث الأخبار */}
            <LatestNews className="lg:col-span-12" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analysis;
