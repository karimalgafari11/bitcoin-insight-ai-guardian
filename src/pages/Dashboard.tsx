
import React, { useState, useCallback, useEffect, useRef } from "react";
import { AppSidebar } from "@/components/AppSidebar";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import BitcoinChart from "@/components/BitcoinChart";
import BitcoinStats from "@/components/BitcoinStats";
import TradingRecommendation from "@/components/TradingRecommendation";
import LatestNews from "@/components/LatestNews";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useLanguage } from "@/contexts/LanguageContext";
import CryptoDataDisplay from "@/components/CryptoDataDisplay";
import TimeframeSelector from "@/components/TimeframeSelector";
import { Button } from "@/components/ui/button";
import { RefreshCw, CheckCircle } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import ConnectedApiDataPanel from "@/components/dashboard/ConnectedApiDataPanel";

const Dashboard = () => {
  const { t } = useLanguage();
  const [currentTimeframe, setCurrentTimeframe] = useState<"4h" | "1d" | "1w" | "1m">("1d");
  const [refreshKey, setRefreshKey] = useState(0);
  const [hasBinanceKey, setHasBinanceKey] = useState(true);
  
  // Enhanced refs for better tracking refresh behavior
  const refreshTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const refreshCooldownRef = useRef<boolean>(false);
  const refreshCountRef = useRef<number>(0);
  const lastRefreshTimeRef = useRef<number>(Date.now());
  const initialRenderRef = useRef(true);

  // Check for Binance API keys on component mount only
  useEffect(() => {
    if (initialRenderRef.current) {
      initialRenderRef.current = false;
      
      // Show toast that we're now using Binance data for everything
      toast({
        title: t("بيانات بينانس", "Binance Data"),
        description: t(
          "تم توحيد مصدر البيانات لاستخدام بينانس كمصدر رئيسي للبيانات الحية.",
          "Data source has been unified to use Binance as the primary source for live data."
        ),
      });
    }
  }, [t]);

  // Reset refresh count periodically
  useEffect(() => {
    const resetTimer = setInterval(() => {
      refreshCountRef.current = 0;
    }, 120000); // Reset count every 2 minutes
    
    return () => {
      clearInterval(resetTimer);
    };
  }, []);

  const handleTimeframeChange = useCallback((timeframe: "4h" | "1d" | "1w" | "1m") => {
    setCurrentTimeframe(timeframe);
  }, []);

  const handleRefreshAll = useCallback(() => {
    const now = Date.now();
    
    // Enforce rate limiting to prevent excessive refreshes
    if (refreshCooldownRef.current) {
      toast({
        title: t("يرجى الانتظار", "Please Wait"),
        description: t(
          "يرجى الانتظار قبل التحديث مرة أخرى",
          "Please wait before refreshing again"
        ),
        variant: "destructive",
      });
      return;
    }
    
    // Increase refresh count and track time
    refreshCountRef.current++;
    const timeSinceLastRefresh = now - lastRefreshTimeRef.current;
    lastRefreshTimeRef.current = now;
    
    // Determine cooldown period based on refresh frequency
    let cooldownPeriod = 5000; // 5 seconds default
    
    if (refreshCountRef.current > 5 && timeSinceLastRefresh < 60000) {
      cooldownPeriod = 20000; // 20 seconds cooldown for frequent refreshes
    } else if (refreshCountRef.current > 2 && timeSinceLastRefresh < 15000) {
      cooldownPeriod = 10000; // 10 seconds for moderate frequency
    }
    
    // Execute refresh
    setRefreshKey(prev => prev + 1);
    
    toast({
      title: t("تحديث البيانات", "Refreshing Data"),
      description: t("جاري تحديث جميع البيانات من بينانس...", "Refreshing all data from Binance..."),
    });
    
    // Set cooldown state
    refreshCooldownRef.current = true;
    
    // Clear any existing timeout
    if (refreshTimeoutRef.current) {
      clearTimeout(refreshTimeoutRef.current);
    }
    
    // Set new cooldown timeout
    refreshTimeoutRef.current = setTimeout(() => {
      refreshTimeoutRef.current = null;
      refreshCooldownRef.current = false;
    }, cooldownPeriod);
  }, [t]);

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
              <Badge variant="outline" className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 flex items-center gap-1">
                <CheckCircle className="h-3 w-3" />
                {t("بيانات بينانس مباشرة", "Live Binance Data")}
              </Badge>
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleRefreshAll}
                className="gap-2"
                disabled={refreshCooldownRef.current}
              >
                <RefreshCw className={`h-4 w-4 ${refreshTimeoutRef.current ? 'animate-spin' : ''}`} />
                {t("تحديث الكل", "Refresh All")}
              </Button>
              <SidebarTrigger className="bg-white dark:bg-gray-800 shadow-sm" />
            </div>
          </div>

          {/* New Connected API Data Panel */}
          <div className="mb-6">
            <ConnectedApiDataPanel />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            <Card className="col-span-full lg:col-span-2">
              <CardContent className="pt-6">
                <div className="flex justify-end mb-4">
                  <TimeframeSelector onTimeframeChange={handleTimeframeChange} />
                </div>
                <BitcoinChart key={`chart-${refreshKey}`} timeframe={currentTimeframe} />
              </CardContent>
            </Card>
            <div className="space-y-6">
              <BitcoinStats key={`stats-${refreshKey}`} />
              <TradingRecommendation />
            </div>
          </div>

          <CryptoDataDisplay key={`crypto-${refreshKey}`} defaultCoin="bitcoin" />

          <div className="mb-6">
            <LatestNews />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
