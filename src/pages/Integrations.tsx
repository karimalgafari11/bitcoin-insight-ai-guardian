
import React, { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { AppSidebar } from "@/components/AppSidebar";
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
import { SidebarTrigger } from "@/components/ui/sidebar";
import { MessageSquare, Twitter, Instagram, Facebook } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

const Integrations = () => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [apiKeys, setApiKeys] = useState({
    binance: "",
    tradingview: "",
    metatrader: "",
  });
  const [socialConnections, setSocialConnections] = useState({
    telegram: false,
    twitter: false,
    instagram: false,
    facebook: false,
  });

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

    toast({
      title: t("تم حفظ المفتاح", "API Key Saved"),
      description: t(
        `تم حفظ مفتاح API لـ ${platform} بنجاح`,
        `${platform} API key saved successfully`
      ),
    });
  };

  const handleConnectSocial = (platform: keyof typeof socialConnections) => {
    setSocialConnections((prev) => ({
      ...prev,
      [platform]: !prev[platform],
    }));

    if (!socialConnections[platform]) {
      toast({
        title: t("تم الاتصال", "Connected"),
        description: t(
          `تم الاتصال بحسابك على ${platform}`,
          `Successfully connected to your ${platform} account`
        ),
      });
    } else {
      toast({
        title: t("تم قطع الاتصال", "Disconnected"),
        description: t(
          `تم قطع الاتصال بحسابك على ${platform}`,
          `Disconnected from your ${platform} account`
        ),
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen flex w-full">
      <AppSidebar />
      <div className="flex-1 overflow-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-semibold">
              {t("التكاملات", "Integrations")}
            </h1>
            <SidebarTrigger />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <Card>
              <CardHeader>
                <CardTitle>{t("منصات التداول", "Trading Platforms")}</CardTitle>
                <CardDescription>
                  {t(
                    "قم بربط حسابات منصات التداول الخاصة بك",
                    "Connect your trading platform accounts"
                  )}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="binance-api" className="text-sm font-medium">
                    Binance API Key
                  </label>
                  <Input
                    id="binance-api"
                    value={apiKeys.binance}
                    onChange={(e) =>
                      setApiKeys({ ...apiKeys, binance: e.target.value })
                    }
                    placeholder="Enter your Binance API key"
                  />
                  <Button
                    size="sm"
                    onClick={() => handleSaveApiKey("binance")}
                    className="w-full mt-1"
                  >
                    {t("حفظ", "Save")}
                  </Button>
                </div>

                <div className="space-y-2">
                  <label htmlFor="tradingview-api" className="text-sm font-medium">
                    TradingView API Key
                  </label>
                  <Input
                    id="tradingview-api"
                    value={apiKeys.tradingview}
                    onChange={(e) =>
                      setApiKeys({ ...apiKeys, tradingview: e.target.value })
                    }
                    placeholder="Enter your TradingView API key"
                  />
                  <Button
                    size="sm"
                    onClick={() => handleSaveApiKey("tradingview")}
                    className="w-full mt-1"
                  >
                    {t("حفظ", "Save")}
                  </Button>
                </div>

                <div className="space-y-2">
                  <label htmlFor="metatrader-api" className="text-sm font-medium">
                    MetaTrader API Key
                  </label>
                  <Input
                    id="metatrader-api"
                    value={apiKeys.metatrader}
                    onChange={(e) =>
                      setApiKeys({ ...apiKeys, metatrader: e.target.value })
                    }
                    placeholder="Enter your MetaTrader API key"
                  />
                  <Button
                    size="sm"
                    onClick={() => handleSaveApiKey("metatrader")}
                    className="w-full mt-1"
                  >
                    {t("حفظ", "Save")}
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>
                  {t("وسائل التواصل الاجتماعي", "Social Media")}
                </CardTitle>
                <CardDescription>
                  {t(
                    "اربط حسابات وسائل التواصل الاجتماعي الخاصة بك",
                    "Connect your social media accounts"
                  )}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button
                  variant={socialConnections.telegram ? "default" : "outline"}
                  className="w-full flex justify-start gap-2"
                  onClick={() => handleConnectSocial("telegram")}
                >
                  <MessageSquare className="h-4 w-4" />
                  {socialConnections.telegram
                    ? t("متصل بـ Telegram", "Connected to Telegram")
                    : t("ربط حساب Telegram", "Connect Telegram Account")}
                </Button>

                <Button
                  variant={socialConnections.twitter ? "default" : "outline"}
                  className="w-full flex justify-start gap-2"
                  onClick={() => handleConnectSocial("twitter")}
                >
                  <Twitter className="h-4 w-4" />
                  {socialConnections.twitter
                    ? t("متصل بـ Twitter", "Connected to Twitter")
                    : t("ربط حساب Twitter", "Connect Twitter Account")}
                </Button>

                <Button
                  variant={socialConnections.instagram ? "default" : "outline"}
                  className="w-full flex justify-start gap-2"
                  onClick={() => handleConnectSocial("instagram")}
                >
                  <Instagram className="h-4 w-4" />
                  {socialConnections.instagram
                    ? t("متصل بـ Instagram", "Connected to Instagram")
                    : t("ربط حساب Instagram", "Connect Instagram Account")}
                </Button>

                <Button
                  variant={socialConnections.facebook ? "default" : "outline"}
                  className="w-full flex justify-start gap-2"
                  onClick={() => handleConnectSocial("facebook")}
                >
                  <Facebook className="h-4 w-4" />
                  {socialConnections.facebook
                    ? t("متصل بـ Facebook", "Connected to Facebook")
                    : t("ربط حساب Facebook", "Connect Facebook Account")}
                </Button>
              </CardContent>
              <CardFooter className="flex justify-center">
                <p className="text-xs text-gray-500">
                  {t(
                    "نحن لا نشارك بياناتك مع أطراف ثالثة",
                    "We do not share your data with third parties"
                  )}
                </p>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Integrations;
