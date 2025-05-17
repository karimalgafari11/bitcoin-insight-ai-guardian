
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
import { ArrowRight, BarChartHorizontal, CloudCog, Globe, Server, AlertTriangle, CheckCircle, Zap, Layers, LineChart, Network, BarChart2 } from "lucide-react";
import ApiKeyInput from "./ApiKeyInput";
import { useApiKeys } from "@/hooks/api-keys";

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
    loadingStates,
    handleSaveApiKey,
    testBinanceConnection,
    testConnection
  } = useApiKeys();

  const handleApiKeyChange = (platform: string, value: string) => {
    setApiKeys(prev => ({ ...prev, [platform]: value }));
  };

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
            value={apiKeys.binance || ""}
            onChange={(value) => handleApiKeyChange("binance", value)}
            onSave={() => handleSaveApiKey("binance")}
            secretField={true}
            secretValue={apiSecret}
            onSecretChange={setApiSecret}
            testConnection={testBinanceConnection}
            isConnected={connectedToBinance}
            isLoading={loadingStates?.binance}
          />

          <ApiKeyInput
            id="binance-testnet-api"
            label="Binance Testnet API Key"
            icon={<Network className="mr-2 h-4 w-4" />}
            value={apiKeys.binance_testnet || ""}
            onChange={(value) => handleApiKeyChange("binance_testnet", value)}
            onSave={() => handleSaveApiKey("binance_testnet")}
            secretField={true}
            secretValue={apiSecret}
            onSecretChange={setApiSecret}
            testConnection={() => testConnection("binance_testnet")}
            isLoading={loadingStates?.binance_testnet}
          />

          <ApiKeyInput
            id="coinapi"
            label="CoinAPI Key"
            icon={<Zap className="mr-2 h-4 w-4" />}
            value={apiKeys.coinapi || ""}
            onChange={(value) => handleApiKeyChange("coinapi", value)}
            onSave={() => handleSaveApiKey("coinapi")}
            testConnection={() => testConnection("coinapi")}
            isLoading={loadingStates?.coinapi}
          />

          <ApiKeyInput
            id="coindesk-api"
            label="CoinDesk API Key"
            icon={<Globe className="mr-2 h-4 w-4" />}
            value={apiKeys.coindesk || ""}
            onChange={(value) => handleApiKeyChange("coindesk", value)}
            onSave={() => handleSaveApiKey("coindesk")}
            testConnection={() => testConnection("coindesk")}
            isLoading={loadingStates?.coindesk}
          />

          <ApiKeyInput
            id="cryptocompare-api"
            label="CryptoCompare API Key"
            icon={<BarChart2 className="mr-2 h-4 w-4" />}
            value={apiKeys.cryptocompare || ""}
            onChange={(value) => handleApiKeyChange("cryptocompare", value)}
            onSave={() => handleSaveApiKey("cryptocompare")}
            testConnection={() => testConnection("cryptocompare")}
            isLoading={loadingStates?.cryptocompare}
          />

          <ApiKeyInput
            id="livecoinwatch-api"
            label="LiveCoinWatch API Key"
            icon={<LineChart className="mr-2 h-4 w-4" />}
            value={apiKeys.livecoinwatch || ""}
            onChange={(value) => handleApiKeyChange("livecoinwatch", value)}
            onSave={() => handleSaveApiKey("livecoinwatch")}
            testConnection={() => testConnection("livecoinwatch")}
            isLoading={loadingStates?.livecoinwatch}
          />

          <ApiKeyInput
            id="tradingview-api"
            label="TradingView API Key"
            icon={<BarChartHorizontal className="mr-2 h-4 w-4" />}
            value={apiKeys.tradingview || ""}
            onChange={(value) => handleApiKeyChange("tradingview", value)}
            onSave={() => handleSaveApiKey("tradingview")}
          />

          <ApiKeyInput
            id="metatrader-api"
            label="MetaTrader API Key"
            icon={<CloudCog className="mr-2 h-4 w-4" />}
            value={apiKeys.metatrader || ""}
            onChange={(value) => handleApiKeyChange("metatrader", value)}
            onSave={() => handleSaveApiKey("metatrader")}
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
