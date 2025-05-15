
import React from "react";
import CryptoDataDisplay from "@/components/CryptoDataDisplay";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";

const Index = () => {
  const { t } = useLanguage();
  
  return (
    <div className="container mx-auto py-6 px-4 max-w-6xl">
      <h1 className="text-4xl font-bold mb-6">{t('لوحة التحكم', 'Dashboard')}</h1>
      
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
  );
};

export default Index;
