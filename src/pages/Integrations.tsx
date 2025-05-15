
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
import { 
  MessageSquare, 
  Twitter, 
  Instagram, 
  Facebook, 
  Globe,
  ArrowRight,
  CheckCircle,
  Lock,
  Server,
  CloudCog,
  BarChartHorizontal
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Skeleton } from "@/components/ui/skeleton";

const Integrations = () => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [apiKeys, setApiKeys] = useState({
    binance: "",
    tradingview: "",
    metatrader: "",
    coinbase: "",
    ftx: "",
  });
  const [socialConnections, setSocialConnections] = useState({
    telegram: false,
    twitter: false,
    instagram: false,
    facebook: false,
    discord: false,
    slack: false,
  });
  const [webhookUrl, setWebhookUrl] = useState("");
  const [isTestingConnection, setIsTestingConnection] = useState(false);
  
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

  const handleTestWebhook = () => {
    if (!webhookUrl) {
      toast({
        title: t("خطأ", "Error"),
        description: t(
          "يرجى إدخال رابط webhook",
          "Please enter a webhook URL"
        ),
        variant: "destructive",
      });
      return;
    }

    setIsTestingConnection(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsTestingConnection(false);
      toast({
        title: t("تم الاختبار بنجاح", "Test Successful"),
        description: t(
          "تم اختبار اتصال webhook بنجاح",
          "Webhook connection tested successfully"
        ),
      });
    }, 1500);
  };

  const popularIntegrations = [
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

          <Tabs defaultValue="trading" className="w-full mb-6">
            <TabsList className="grid grid-cols-3 mb-4">
              <TabsTrigger value="trading">{t("منصات التداول", "Trading Platforms")}</TabsTrigger>
              <TabsTrigger value="social">{t("وسائل التواصل", "Social Media")}</TabsTrigger>
              <TabsTrigger value="advanced">{t("إعدادات متقدمة", "Advanced Settings")}</TabsTrigger>
            </TabsList>
            
            <TabsContent value="trading" className="mt-0">
              <Card>
                <CardHeader>
                  <CardTitle>{t("منصات التداول", "Trading Platforms")}</CardTitle>
                  <CardDescription>
                    {t(
                      "قم بربط حسابات منصات التداول الخاصة بك لتسهيل إدارتها",
                      "Connect your trading platform accounts for easier management"
                    )}
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
                      <div className="flex gap-2">
                        <Input
                          id="binance-api"
                          value={apiKeys.binance}
                          onChange={(e) =>
                            setApiKeys({ ...apiKeys, binance: e.target.value })
                          }
                          placeholder="Enter your Binance API key"
                          type="password"
                        />
                        <Button
                          size="sm"
                          onClick={() => handleSaveApiKey("binance")}
                        >
                          {t("حفظ", "Save")}
                        </Button>
                      </div>
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
                      "نحن نستخدم تشفيرًا آمنًا لحماية مفاتيح API الخاصة بك",
                      "We use secure encryption to protect your API keys"
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
            </TabsContent>
            
            <TabsContent value="social" className="mt-0">
              <Card>
                <CardHeader>
                  <CardTitle>
                    {t("وسائل التواصل الاجتماعي", "Social Media")}
                  </CardTitle>
                  <CardDescription>
                    {t(
                      "اربط حسابات وسائل التواصل الاجتماعي الخاصة بك لمشاركة تحليلاتك وصفقاتك",
                      "Connect your social media accounts to share your analysis and trades"
                    )}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Card className="border">
                        <CardHeader className="p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <MessageSquare className="h-5 w-5 text-blue-400" />
                              <CardTitle className="text-base">Telegram</CardTitle>
                            </div>
                            <Switch
                              checked={socialConnections.telegram}
                              onCheckedChange={() => handleConnectSocial("telegram")}
                            />
                          </div>
                        </CardHeader>
                        <CardContent className="p-4 pt-0">
                          <p className="text-xs text-muted-foreground">
                            {t(
                              "إرسال تنبيهات وإشارات التداول عبر بوت تليجرام",
                              "Send trading alerts and signals via Telegram bot"
                            )}
                          </p>
                        </CardContent>
                      </Card>

                      <Card className="border">
                        <CardHeader className="p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Twitter className="h-5 w-5 text-blue-500" />
                              <CardTitle className="text-base">Twitter</CardTitle>
                            </div>
                            <Switch
                              checked={socialConnections.twitter}
                              onCheckedChange={() => handleConnectSocial("twitter")}
                            />
                          </div>
                        </CardHeader>
                        <CardContent className="p-4 pt-0">
                          <p className="text-xs text-muted-foreground">
                            {t(
                              "مشاركة تحليلاتك وصفقاتك على تويتر",
                              "Share your analysis and trades on Twitter"
                            )}
                          </p>
                        </CardContent>
                      </Card>

                      <Card className="border">
                        <CardHeader className="p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Instagram className="h-5 w-5 text-pink-500" />
                              <CardTitle className="text-base">Instagram</CardTitle>
                            </div>
                            <Switch
                              checked={socialConnections.instagram}
                              onCheckedChange={() => handleConnectSocial("instagram")}
                            />
                          </div>
                        </CardHeader>
                        <CardContent className="p-4 pt-0">
                          <p className="text-xs text-muted-foreground">
                            {t(
                              "مشاركة رسوم بيانية ونتائج التداول على انستغرام",
                              "Share charts and trading results on Instagram"
                            )}
                          </p>
                        </CardContent>
                      </Card>

                      <Card className="border">
                        <CardHeader className="p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Facebook className="h-5 w-5 text-blue-600" />
                              <CardTitle className="text-base">Facebook</CardTitle>
                            </div>
                            <Switch
                              checked={socialConnections.facebook}
                              onCheckedChange={() => handleConnectSocial("facebook")}
                            />
                          </div>
                        </CardHeader>
                        <CardContent className="p-4 pt-0">
                          <p className="text-xs text-muted-foreground">
                            {t(
                              "مشاركة تحليلاتك وصفقاتك على فيسبوك",
                              "Share your analysis and trades on Facebook"
                            )}
                          </p>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex flex-col items-start border-t px-6 py-4">
                  <p className="text-xs text-muted-foreground">
                    {t(
                      "نحن لا نشارك بياناتك مع أطراف ثالثة دون موافقتك",
                      "We do not share your data with third parties without your consent"
                    )}
                  </p>
                </CardFooter>
              </Card>
            </TabsContent>
            
            <TabsContent value="advanced" className="mt-0">
              <Card>
                <CardHeader>
                  <CardTitle>{t("إعدادات متقدمة", "Advanced Settings")}</CardTitle>
                  <CardDescription>
                    {t(
                      "إعدادات API وwebhook المتقدمة",
                      "Advanced API and webhook settings"
                    )}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="text-sm font-medium">{t("إعدادات Webhook", "Webhook Settings")}</h3>
                    <div className="space-y-2">
                      <label htmlFor="webhook-url" className="text-sm text-muted-foreground">
                        {t("عنوان URL للـ Webhook", "Webhook URL")}
                      </label>
                      <div className="flex gap-2">
                        <Input
                          id="webhook-url"
                          value={webhookUrl}
                          onChange={(e) => setWebhookUrl(e.target.value)}
                          placeholder="https://your-webhook-endpoint.com"
                        />
                        <Button 
                          onClick={handleTestWebhook}
                          disabled={isTestingConnection}
                        >
                          {isTestingConnection ? (
                            <>
                              <Skeleton className="h-4 w-4 rounded-full mr-2" />
                              {t("جارٍ الاختبار", "Testing...")}
                            </>
                          ) : (
                            t("اختبار الاتصال", "Test Connection")
                          )}
                        </Button>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {t(
                          "سيتم استدعاء عنوان URL هذا عند حدوث أحداث معينة مثل الصفقات الجديدة أو التنبيهات",
                          "This URL will be called when certain events occur like new trades or alerts"
                        )}
                      </p>
                    </div>
                    
                    <Separator />
                    
                    <div className="space-y-4">
                      <h3 className="text-sm font-medium">{t("خيارات التكامل", "Integration Options")}</h3>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <label htmlFor="auto-sync" className="text-sm">
                            {t("مزامنة تلقائية للصفقات", "Auto-sync trades")}
                          </label>
                          <Switch id="auto-sync" />
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {t(
                            "مزامنة تلقائية للصفقات بين منصات التداول المتصلة",
                            "Automatically sync trades between connected trading platforms"
                          )}
                        </p>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <label htmlFor="auto-post" className="text-sm">
                            {t("نشر تلقائي للصفقات", "Auto-post trades")}
                          </label>
                          <Switch id="auto-post" />
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {t(
                            "نشر تلقائي للصفقات الناجحة على منصات التواصل الاجتماعي المتصلة",
                            "Automatically post successful trades to connected social media platforms"
                          )}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="border-t px-6 py-4">
                  <Button variant="outline" className="mr-2">
                    {t("إعادة تعيين", "Reset")}
                  </Button>
                  <Button>
                    {t("حفظ الإعدادات", "Save Settings")}
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
          
          <div className="mt-8">
            <Card className="bg-primary/5">
              <CardHeader>
                <CardTitle className="text-lg">
                  {t("هل تحتاج إلى مساعدة مع التكاملات؟", "Need help with integrations?")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm mb-4">
                  {t(
                    "استكشف دليل التكاملات الخاص بنا أو اتصل بفريق الدعم للحصول على مساعدة في إعداد تكاملات المنصة الخاصة بك.",
                    "Explore our integration guide or contact our support team for help setting up your platform integrations."
                  )}
                </p>
                <div className="flex flex-wrap gap-3">
                  <Button variant="outline">
                    {t("دليل التكاملات", "Integration Guide")}
                  </Button>
                  <Button variant="secondary">
                    {t("اتصل بالدعم", "Contact Support")}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Integrations;
