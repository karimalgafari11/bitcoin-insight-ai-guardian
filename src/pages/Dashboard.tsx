
import React, { useState } from "react";
import { AppSidebar } from "@/components/AppSidebar";
import { Card, CardContent } from "@/components/ui/card";
import BitcoinChart from "@/components/BitcoinChart";
import BitcoinStats from "@/components/BitcoinStats";
import TradingRecommendation from "@/components/TradingRecommendation";
import LatestNews from "@/components/LatestNews";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useLanguage } from "@/contexts/LanguageContext";
import CryptoDataDisplay from "@/components/CryptoDataDisplay";
import TimeframeSelector from "@/components/TimeframeSelector";

const Dashboard = () => {
  const { t } = useLanguage();
  const [currentTimeframe, setCurrentTimeframe] = useState<"4h" | "1d" | "1w" | "1m">("1d");

  // Map UI timeframes to API days parameter
  const timeframeToDays = {
    "4h": "1",
    "1d": "1",
    "1w": "7",
    "1m": "30",
  };

  const handleTimeframeChange = (timeframe: "4h" | "1d" | "1w" | "1m") => {
    setCurrentTimeframe(timeframe);
  };

  return (
    <div className="flex min-h-screen w-full">
      <AppSidebar />
      <div className="flex-1 overflow-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6 sticky top-0 z-10 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm py-2">
            <h1 className="text-2xl font-semibold">
              {t("لوحة المعلومات", "Dashboard")}
            </h1>
            <div className="flex items-center gap-4">
              <SidebarTrigger className="bg-white dark:bg-gray-800 shadow-sm" />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            <Card className="col-span-full lg:col-span-2">
              <CardContent className="pt-6">
                <div className="flex justify-end mb-4">
                  <TimeframeSelector onTimeframeChange={handleTimeframeChange} />
                </div>
                <BitcoinChart timeframe={currentTimeframe} />
              </CardContent>
            </Card>
            <div className="space-y-6">
              <BitcoinStats />
              <TradingRecommendation />
            </div>
          </div>

          <CryptoDataDisplay defaultCoin="bitcoin" />

          <div className="mb-6">
            <LatestNews />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
