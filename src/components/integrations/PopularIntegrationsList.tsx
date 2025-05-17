
import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Zap, Check, X, Network, BarChart2, Globe, LineChart } from "lucide-react";

interface PopularIntegrationsListProps {
  apiKeys: Record<string, string>;
  socialConnections: Record<string, boolean>;
}

const PopularIntegrationsList = ({
  apiKeys,
  socialConnections,
}: PopularIntegrationsListProps) => {
  const { t } = useLanguage();
  
  const integrations = [
    {
      name: "Binance",
      connected: !!apiKeys.binance,
      icon: <Zap className="h-4 w-4" />,
      type: "crypto"
    },
    {
      name: "Binance Testnet",
      connected: !!apiKeys.binance_testnet,
      icon: <Network className="h-4 w-4" />,
      type: "crypto"
    },
    {
      name: "CoinAPI",
      connected: !!apiKeys.coinapi,
      icon: <BarChart2 className="h-4 w-4" />,
      type: "crypto"
    },
    {
      name: "CoinDesk",
      connected: !!apiKeys.coindesk,
      icon: <Globe className="h-4 w-4" />,
      type: "crypto"
    },
    {
      name: "CryptoCompare",
      connected: !!apiKeys.cryptocompare,
      icon: <BarChart2 className="h-4 w-4" />,
      type: "crypto"
    },
    {
      name: "LiveCoinWatch",
      connected: !!apiKeys.livecoinwatch,
      icon: <LineChart className="h-4 w-4" />,
      type: "crypto"
    },
    {
      name: "Telegram",
      connected: socialConnections.telegram,
      icon: <Zap className="h-4 w-4" />,
      type: "social"
    },
    {
      name: "Twitter",
      connected: socialConnections.twitter,
      icon: <Zap className="h-4 w-4" />,
      type: "social"
    }
  ];

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>{t("التكاملات الشائعة", "Popular Integrations")}</CardTitle>
        <CardDescription>
          {t(
            "اتصل بالمنصات المختلفة للحصول على بيانات في الوقت الحقيقي",
            "Connect to various platforms for real-time data"
          )}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {integrations.map((integration) => (
            <div
              key={integration.name}
              className="flex items-center gap-2 rounded-md border p-3"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted">
                {integration.icon}
              </div>
              <div className="flex flex-1 flex-col">
                <span className="text-sm font-medium leading-none">
                  {integration.name}
                </span>
                <span className="text-xs text-muted-foreground">
                  {integration.type === "crypto" 
                    ? t("منصة بيانات", "Data platform") 
                    : t("منصة اجتماعية", "Social platform")}
                </span>
              </div>
              {integration.connected ? (
                <Badge className="bg-green-500">
                  <Check className="mr-1 h-3 w-3" />
                  {t("متصل", "Connected")}
                </Badge>
              ) : (
                <Badge variant="outline">
                  <X className="mr-1 h-3 w-3" />
                  {t("غير متصل", "Not Connected")}
                </Badge>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default PopularIntegrationsList;
