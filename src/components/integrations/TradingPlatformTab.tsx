
import React, { useState, useEffect } from "react";
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
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { Server, CloudCog, Globe, Lock, ArrowRight, BarChartHorizontal, AlertTriangle, CheckCircle } from "lucide-react";

interface TradingPlatformTabProps {
  apiKeys: Record<string, string>;
  setApiKeys: React.Dispatch<React.SetStateAction<Record<string, string>>>;
}

const TradingPlatformTab = ({ apiKeys, setApiKeys }: TradingPlatformTabProps) => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [apiSecret, setApiSecret] = useState("");
  const [keysSaved, setKeysSaved] = useState(false);
  const [connectedToBinance, setConnectedToBinance] = useState(false);

  // Set default API keys (the ones provided)
  useEffect(() => {
    const defaultApiKey = "WTECzlRFpNgTAR1LBssxDGkby6WREdv9ip7rZu1UDYEEO5EDZVxIjSWnIM5MxJk9";
    const defaultApiSecret = "qRjlT5VaqDcJreP1BHX9Ud9Tge3PwYZ8dioyZEGyfTxEHJzaO2RzAuxSJnR5G6M9";
    
    // Only set if not already set
    if (!apiKeys.binance) {
      setApiKeys(prev => ({ ...prev, binance: defaultApiKey }));
      setApiSecret(defaultApiSecret);
      
      // Save to localStorage
      localStorage.setItem("binance_api_key", defaultApiKey);
      localStorage.setItem("binance_api_secret", defaultApiSecret);
      
      setKeysSaved(true);
      toast({
        title: t("تم تعيين مفاتيح API", "API Keys Set"),
        description: t(
          "تم تعيين مفاتيح API الافتراضية لـ Binance",
          "Default Binance API keys have been set"
        ),
      });
    }
  }, []);

  const handleSaveApiKey = (platform: keyof typeof apiKeys) => {
    if (!apiKeys[platform]) {
      toast({
        title: t("خطأ", "Error"),
        description: t(
          "يرجى إدخال مفتاح API",
          "Please enter an API key"
        ),
        variant: "destructive",
      });
      return;
    }

    if (platform === "binance" && !apiSecret) {
      toast({
        title: t("خطأ", "Error"),
        description: t(
          "يرجى إدخال مفتاح السري أيضاً",
          "Please enter the Secret key as well"
        ),
        variant: "destructive",
      });
      return;
    }

    // For Binance, save both key and secret to localStorage
    if (platform === "binance") {
      localStorage.setItem("binance_api_key", apiKeys.binance);
      localStorage.setItem("binance_api_secret", apiSecret);
      setKeysSaved(true);
      
      // Test the connection to Binance
      testBinanceConnection();
    }
    
    toast({
      title: t("تم حفظ المفتاح", "API Key Saved"),
      description: t(
        `تم حفظ مفتاح API لـ ${platform} بنجاح`,
        `${platform} API key saved successfully`
      ),
    });
  };

  // New function to test Binance connection
  const testBinanceConnection = async () => {
    try {
      const response = await fetch("https://api.binance.com/api/v3/ping", {
        method: "GET",
        headers: {
          "X-MBX-APIKEY": apiKeys.binance
        }
      });
      
      if (response.ok) {
        setConnectedToBinance(true);
        toast({
          title: t("تم الاتصال بنجاح", "Connected Successfully"),
          description: t(
            "تم الاتصال بـ Binance بنجاح",
            "Successfully connected to Binance"
          ),
          variant: "default",
        });
      } else {
        setConnectedToBinance(false);
        toast({
          title: t("فشل الاتصال", "Connection Failed"),
          description: t(
            "فشل الاتصال بـ Binance، يرجى التحقق من المفاتيح",
            "Failed to connect to Binance, please check your keys"
          ),
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error testing Binance connection:", error);
      setConnectedToBinance(false);
      toast({
        title: t("خطأ", "Error"),
        description: t(
          "حدث خطأ أثناء الاتصال بـ Binance",
          "An error occurred while connecting to Binance"
        ),
        variant: "destructive",
      });
    }
  };

  // Load any saved Binance keys on component mount
  useEffect(() => {
    const savedBinanceKey = localStorage.getItem("binance_api_key");
    if (savedBinanceKey) {
      setApiKeys(prev => ({ ...prev, binance: savedBinanceKey }));
      setKeysSaved(true);
    }
    
    const savedBinanceSecret = localStorage.getItem("binance_api_secret");
    if (savedBinanceSecret) {
      setApiSecret(savedBinanceSecret);
    }
  }, [setApiKeys]);

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
          <div className="space-y-2">
            <div className="flex items-center justify-between mb-2">
              <label htmlFor="binance-api" className="text-sm font-medium flex items-center">
                <Server className="mr-2 h-4 w-4" />
                Binance API Key
              </label>
              <Lock className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="flex flex-col gap-2">
              <Input
                id="binance-api"
                value={apiKeys.binance}
                onChange={(e) =>
                  setApiKeys({ ...apiKeys, binance: e.target.value })
                }
                placeholder="Enter your Binance API key"
                type="password"
              />
              <Input
                id="binance-secret"
                value={apiSecret}
                onChange={(e) => setApiSecret(e.target.value)}
                placeholder="Enter your Binance Secret key"
                type="password"
              />
              <div className="flex gap-2">
                <Button
                  onClick={() => handleSaveApiKey("binance")}
                  className="flex-1"
                >
                  {t("حفظ", "Save")}
                </Button>
                <Button
                  variant="outline"
                  onClick={testBinanceConnection}
                  className="flex-1"
                >
                  {t("اختبار الاتصال", "Test Connection")}
                </Button>
              </div>
            </div>
            {connectedToBinance && (
              <p className="text-xs text-green-500 mt-1">
                {t("تم الاتصال بنجاح", "Connected successfully")}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between mb-2">
              <label htmlFor="tradingview-api" className="text-sm font-medium flex items-center">
                <BarChartHorizontal className="mr-2 h-4 w-4" />
                TradingView API Key
              </label>
              <Lock className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="flex gap-2">
              <Input
                id="tradingview-api"
                value={apiKeys.tradingview}
                onChange={(e) =>
                  setApiKeys({ ...apiKeys, tradingview: e.target.value })
                }
                placeholder="Enter your TradingView API key"
                type="password"
              />
              <Button
                size="sm"
                onClick={() => handleSaveApiKey("tradingview")}
              >
                {t("حفظ", "Save")}
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between mb-2">
              <label htmlFor="metatrader-api" className="text-sm font-medium flex items-center">
                <CloudCog className="mr-2 h-4 w-4" />
                MetaTrader API Key
              </label>
              <Lock className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="flex gap-2">
              <Input
                id="metatrader-api"
                value={apiKeys.metatrader}
                onChange={(e) =>
                  setApiKeys({ ...apiKeys, metatrader: e.target.value })
                }
                placeholder="Enter your MetaTrader API key"
                type="password"
              />
              <Button
                size="sm"
                onClick={() => handleSaveApiKey("metatrader")}
              >
                {t("حفظ", "Save")}
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between mb-2">
              <label htmlFor="coinbase-api" className="text-sm font-medium flex items-center">
                <Globe className="mr-2 h-4 w-4" />
                Coinbase API Key
              </label>
              <Lock className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="flex gap-2">
              <Input
                id="coinbase-api"
                value={apiKeys.coinbase}
                onChange={(e) =>
                  setApiKeys({ ...apiKeys, coinbase: e.target.value })
                }
                placeholder="Enter your Coinbase API key"
                type="password"
              />
              <Button
                size="sm"
                onClick={() => handleSaveApiKey("coinbase")}
              >
                {t("حفظ", "Save")}
              </Button>
            </div>
          </div>
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
