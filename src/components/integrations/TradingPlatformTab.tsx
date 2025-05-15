import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, BarChartHorizontal, CloudCog, Globe, Server, AlertTriangle, CheckCircle } from "lucide-react";
import ApiKeyInput from "./ApiKeyInput";
import { useApiKeys } from "@/hooks/useApiKeys";

interface TradingPlatformTabProps {
  apiKeys: Record<string, string>;
  setApiKeys: React.Dispatch<React.SetStateAction<Record<string, string>>>;
}

const TradingPlatformTab = ({ apiKeys, setApiKeys }: TradingPlatformTabProps) => {
  const { t } = useLanguage();
  const {
    apiSecret,
    setApiSecret,
    keysSaved,
    connectedToBinance,
    handleSaveApiKey,
    testBinanceConnection
  } = useApiKeys();

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>{t("منصات التداول", "Trading Platforms")}</CardTitle>
          {keysSaved ? (
            connectedToBinance ? (
              <CheckCircle className="text-green-500" />
            ) : (
              <AlertTriangle className="text-amber-500" />
            )
          ) : (
            <AlertTriangle className="text-amber-500" />
          )}
        </div>
        <CardDescription>
          {keysSaved ? 
            t("تم حفظ مفاتيح API محلياً", "API keys have been saved locally") : 
            t("أدخل مفاتيح API للوصول إلى البيانات المباشرة", "Enter API keys to access live data")}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          <ApiKeyInput
            id="binance-api"
            label="Binance API Key"
            icon={<Server className="mr-2 h-4 w-4" />}
            value={apiKeys.binance}
            onChange={(value) => setApiKeys({ ...apiKeys, binance: value })}
            onSave={() => handleSaveApiKey("binance")}
            secretField={true}
            secretValue={apiSecret}
            onSecretChange={setApiSecret}
            testConnection={testBinanceConnection}
            isConnected={connectedToBinance}
          />

          <ApiKeyInput
            id="tradingview-api"
            label="TradingView API Key"
            icon={<BarChartHorizontal className="mr-2 h-4 w-4" />}
            value={apiKeys.tradingview}
            onChange={(value) => setApiKeys({ ...apiKeys, tradingview: value })}
            onSave={() => handleSaveApiKey("tradingview")}
          />

          <ApiKeyInput
            id="metatrader-api"
            label="MetaTrader API Key"
            icon={<CloudCog className="mr-2 h-4 w-4" />}
            value={apiKeys.metatrader}
            onChange={(value) => setApiKeys({ ...apiKeys, metatrader: value })}
            onSave={() => handleSaveApiKey("metatrader")}
          />

          <ApiKeyInput
            id="coinbase-api"
            label="Coinbase API Key"
            icon={<Globe className="mr-2 h-4 w-4" />}
            value={apiKeys.coinbase}
            onChange={(value) => setApiKeys({ ...apiKeys, coinbase: value })}
            onSave={() => handleSaveApiKey("coinbase")}
          />
        </div>
      </CardContent>
      <CardFooter className="flex flex-col items-start border-t px-6 py-4">
        <p className="text-xs text-muted-foreground mb-2">
          {t(
            "نحن نستخدم تخزين محلي آمن لحماية مفاتيح API الخاصة بك",
            "We use secure local storage to protect your API keys"
          )}
        </p>
        <div className="flex items-center gap-2">
          <Button variant="link" className="p-0 h-auto text-xs">
            {t("تعلم المزيد عن إدارة API", "Learn more about API management")}
          </Button>
          <ArrowRight className="h-3 w-3" />
        </div>
      </CardFooter>
    </Card>
  );
};

export { TradingPlatformTab };
