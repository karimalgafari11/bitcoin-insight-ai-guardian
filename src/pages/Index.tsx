
import React from "react";
import CryptoDataDisplay from "@/components/CryptoDataDisplay";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";
import AppSidebar from "@/components/AppSidebar";
import { SidebarTrigger } from "@/components/ui/sidebar";

const Index = () => {
  const { t } = useLanguage();
  
  return (
    <div className="min-h-screen flex w-full">
      <AppSidebar />
      <div className="flex-1 overflow-auto">
        <div className="container mx-auto py-6 px-4 max-w-6xl">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-4xl font-bold">{t('لوحة التحكم', 'Dashboard')}</h1>
            <SidebarTrigger />
          </div>
          
          <div className="grid gap-6">
            <Card>
              <CardHeader className="pb-2">
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
        </div>
      </div>
    </div>
  );
};

export default Index;
