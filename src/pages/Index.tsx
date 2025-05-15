
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";
import AppSidebar from "@/components/AppSidebar";
import { SidebarTrigger } from "@/components/ui/sidebar";
import CryptoDataDisplay from "@/components/CryptoDataDisplay";
import DashboardMetricsCards from "@/components/dashboard/DashboardMetricsCards";
import DashboardChartPanel from "@/components/dashboard/DashboardChartPanel";
import DashboardNewsPanel from "@/components/dashboard/DashboardNewsPanel";
import DashboardWatchlistPanel from "@/components/dashboard/DashboardWatchlistPanel";

const Index = () => {
  const { t } = useLanguage();
  
  return (
    <div className="min-h-screen flex w-full">
      <AppSidebar />
      <div className="flex-1 overflow-auto bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto py-6 px-4 max-w-7xl">
          <div className="flex justify-between items-center mb-6 sticky top-0 z-10 bg-gray-50/80 dark:bg-gray-900/80 backdrop-blur-sm py-2">
            <h1 className="text-4xl font-bold">{t('لوحة التحكم', 'Dashboard')}</h1>
            <SidebarTrigger className="bg-white dark:bg-gray-800 shadow-sm" />
          </div>
          
          <DashboardMetricsCards />
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
            <div className="lg:col-span-2">
              <DashboardChartPanel />
            </div>
            <div>
              <DashboardWatchlistPanel />
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>{t('تحليل العملات الرقمية', 'Cryptocurrency Analysis')}</CardTitle>
                  <CardDescription>
                    {t('متابعة أسعار العملات الرقمية والتحليلات', 'Track cryptocurrency prices and analytics')}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <CryptoDataDisplay defaultCoin="bitcoin" />
                </CardContent>
              </Card>
            </div>
            <div>
              <DashboardNewsPanel />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
