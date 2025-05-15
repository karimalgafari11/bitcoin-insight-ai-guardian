
import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  MessageSquare, 
  Server,
  CloudCog,
  BarChartHorizontal,
  CheckCircle 
} from "lucide-react";

interface IntegrationItem {
  name: string;
  description: string;
  connected: boolean;
  icon: React.ReactNode;
}

interface PopularIntegrationsListProps {
  apiKeys: Record<string, string>;
  socialConnections: Record<string, boolean>;
}

const PopularIntegrationsList = ({ apiKeys, socialConnections }: PopularIntegrationsListProps) => {
  const { t } = useLanguage();

  const popularIntegrations: IntegrationItem[] = [
    {
      name: "Binance",
      description: t(
        "منصة تداول العملات الرقمية الأكثر شعبية",
        "The most popular cryptocurrency trading platform"
      ),
      connected: Boolean(apiKeys.binance),
      icon: <Server className="h-8 w-8 text-yellow-500" />
    },
    {
      name: "TradingView",
      description: t(
        "منصة تحليل الرسوم البيانية والتداول الاحترافية",
        "Professional charting and trading platform"
      ),
      connected: Boolean(apiKeys.tradingview),
      icon: <BarChartHorizontal className="h-8 w-8 text-blue-500" />
    },
    {
      name: "Telegram",
      description: t(
        "منصة المراسلة للتنبيهات وإشارات التداول",
        "Messaging platform for alerts and trading signals"
      ),
      connected: socialConnections.telegram,
      icon: <MessageSquare className="h-8 w-8 text-blue-400" />
    },
    {
      name: "MetaTrader",
      description: t(
        "منصة تداول الفوركس والعقود مقابل الفروقات",
        "Forex and CFD trading platform"
      ),
      connected: Boolean(apiKeys.metatrader),
      icon: <CloudCog className="h-8 w-8 text-green-500" />
    },
  ];

  return (
    <div className="mb-8">
      <h2 className="text-xl font-medium mb-4">
        {t("التكاملات الشائعة", "Popular Integrations")}
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {popularIntegrations.map((integration) => (
          <Card key={integration.name} className="overflow-hidden transition-all hover:shadow-md">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                {integration.icon}
                <CardTitle className="text-base font-semibold">
                  {integration.name}
                </CardTitle>
              </div>
              {integration.connected && (
                <CheckCircle className="h-5 w-5 text-green-500" />
              )}
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                {integration.description}
              </p>
            </CardContent>
            <CardFooter className="pt-0">
              <Button 
                variant={integration.connected ? "outline" : "default"}
                className="w-full"
                size="sm"
              >
                {integration.connected 
                  ? t("تم الاتصال", "Connected") 
                  : t("اتصال", "Connect")}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default PopularIntegrationsList;
