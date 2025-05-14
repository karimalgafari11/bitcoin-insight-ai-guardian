
import { useState } from "react";
import AppSidebar from "@/components/AppSidebar";
import BitcoinChart from "@/components/BitcoinChart";
import BitcoinStats from "@/components/BitcoinStats";
import TradingRecommendation from "@/components/TradingRecommendation";
import LatestNews from "@/components/LatestNews";
import TechnicalIndicators from "@/components/TechnicalIndicators";
import TimeframeSelector from "@/components/TimeframeSelector";
import { SidebarTrigger } from "@/components/ui/sidebar";

const Dashboard = () => {
  const [timeframe, setTimeframe] = useState("4h");

  return (
    <div className="min-h-screen flex w-full">
      <AppSidebar />
      <div className="flex-1 overflow-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-semibold">لوحة تحليل البيتكوين</h1>
            <div className="flex items-center gap-4">
              <SidebarTrigger />
            </div>
          </div>

          <BitcoinStats className="mb-6" />
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            <div className="lg:col-span-2">
              <div className="flex justify-between items-center mb-4">
                <TimeframeSelector 
                  onTimeframeChange={(newTimeframe) => setTimeframe(newTimeframe)}
                  className="flex-row-reverse" // Right-to-left layout
                />
              </div>
              <BitcoinChart timeframe={timeframe} />
            </div>
            <TradingRecommendation />
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <LatestNews />
            <TechnicalIndicators />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
