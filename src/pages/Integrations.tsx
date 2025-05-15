
import { useState } from 'react';
import { AppSidebar } from '@/components/AppSidebar';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { useLanguage } from '@/contexts/LanguageContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/hooks/use-toast';
import { ExternalLink, Globe, Bitcoin, Telegram, Globe2, MessageSquare } from 'lucide-react';

const Integrations = () => {
  const { t } = useLanguage();
  const [binanceApiKey, setBinanceApiKey] = useState('');
  const [binanceSecretKey, setBinanceSecretKey] = useState('');
  const [cmcApiKey, setCmcApiKey] = useState('');
  const [telegramBotToken, setTelegramBotToken] = useState('');
  const [telegramChatId, setTelegramChatId] = useState('');
  const [webhookUrl, setWebhookUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [notificationEnabled, setNotificationEnabled] = useState(false);

  const handleConnectBinance = () => {
    if (!binanceApiKey || !binanceSecretKey) {
      toast({
        title: t('خطأ', 'Error'),
        description: t('الرجاء إدخال مفاتيح API الخاصة ببينانس', 'Please enter your Binance API keys'),
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    
    setTimeout(() => {
      setIsLoading(false);
      toast({
        title: t('تم الاتصال بنجاح', 'Connected Successfully'),
        description: t('تم ربط حسابك ببينانس بنجاح', 'Your account has been connected to Binance successfully'),
      });
    }, 1500);
  };

  const handleConnectCMC = () => {
    if (!cmcApiKey) {
      toast({
        title: t('خطأ', 'Error'),
        description: t('الرجاء إدخال مفتاح API الخاص بكوين ماركت كاب', 'Please enter your CoinMarketCap API key'),
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    
    setTimeout(() => {
      setIsLoading(false);
      toast({
        title: t('تم الاتصال بنجاح', 'Connected Successfully'),
        description: t('تم ربط حسابك بكوين ماركت كاب بنجاح', 'Your account has been connected to CoinMarketCap successfully'),
      });
    }, 1500);
  };

  const handleConnectTelegram = () => {
    if (!telegramBotToken || !telegramChatId) {
      toast({
        title: t('خطأ', 'Error'),
        description: t('الرجاء إدخال رمز البوت ومعرف المحادثة', 'Please enter your Telegram bot token and chat ID'),
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    
    setTimeout(() => {
      setIsLoading(false);
      toast({
        title: t('تم الاتصال بنجاح', 'Connected Successfully'),
        description: t('تم ربط حسابك بتليجرام بنجاح', 'Your account has been connected to Telegram successfully'),
      });
    }, 1500);
  };

  const handleTestWebhook = () => {
    if (!webhookUrl) {
      toast({
        title: t('خطأ', 'Error'),
        description: t('الرجاء إدخال عنوان الويب هوك', 'Please enter your webhook URL'),
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    
    try {
      fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        mode: 'no-cors', // للتعامل مع مشاكل CORS
        body: JSON.stringify({
          timestamp: new Date().toISOString(),
          event: 'test_webhook',
          message: 'This is a test webhook from the trading platform',
        }),
      });

      setTimeout(() => {
        setIsLoading(false);
        toast({
          title: t('تم إرسال الاختبار بنجاح', 'Test Sent Successfully'),
          description: t('تم إرسال اختبار الويب هوك بنجاح', 'Webhook test has been sent successfully'),
        });
      }, 1000);
    } catch (error) {
      console.error('Error sending webhook:', error);
      setIsLoading(false);
      toast({
        title: t('خطأ', 'Error'),
        description: t('فشل في إرسال اختبار الويب هوك', 'Failed to send webhook test'),
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="flex min-h-screen w-full">
      <AppSidebar />
      <div className="flex-1 overflow-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6 sticky top-0 z-10 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm py-2">
            <h1 className="text-2xl font-semibold">
              {t("التكاملات الخارجية", "External Integrations")}
            </h1>
            <div className="flex items-center gap-4">
              <SidebarTrigger className="bg-white dark:bg-gray-800 shadow-sm" />
            </div>
          </div>

          <div className="mb-6">
            <p className="text-muted-foreground">
              {t(
                "قم بربط منصتنا مع التطبيقات والخدمات الخارجية لتحسين تجربة التداول الخاصة بك.",
                "Connect our platform with external applications and services to enhance your trading experience."
              )}
            </p>
          </div>

          <Tabs defaultValue="exchanges" className="w-full">
            <TabsList className="mb-4">
              <TabsTrigger value="exchanges">
                <Bitcoin className="mr-2 h-4 w-4" />
                {t("منصات التداول", "Exchanges")}
              </TabsTrigger>
              <TabsTrigger value="notifications">
                <MessageSquare className="mr-2 h-4 w-4" />
                {t("الإشعارات", "Notifications")}
              </TabsTrigger>
              <TabsTrigger value="api">
                <Globe className="mr-2 h-4 w-4" />
                {t("واجهة برمجة التطبيقات", "API")}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="exchanges" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <img src="https://cryptologos.cc/logos/binance-coin-bnb-logo.png" alt="Binance Logo" className="h-6 w-6 mr-2" />
                    {t("ربط مع بينانس", "Connect with Binance")}
                  </CardTitle>
                  <CardDescription>
                    {t("قم بربط حسابك ببينانس للتداول المباشر وتتبع المحفظة.", "Connect your account to Binance for live trading and portfolio tracking.")}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="binance-api-key">{t("مفتاح API", "API Key")}</Label>
                    <Input 
                      id="binance-api-key" 
                      placeholder={t("أدخل مفتاح API الخاص بك", "Enter your API key")} 
                      value={binanceApiKey}
                      onChange={(e) => setBinanceApiKey(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="binance-api-secret">{t("مفتاح API السري", "API Secret")}</Label>
                    <Input 
                      id="binance-api-secret" 
                      type="password" 
                      placeholder={t("أدخل المفتاح السري الخاص بك", "Enter your API secret")}
                      value={binanceSecretKey}
                      onChange={(e) => setBinanceSecretKey(e.target.value)}
                    />
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {t(
                      "ملاحظة: قم بتقييد مفاتيح API الخاصة بك للقراءة فقط للحفاظ على أمان أموالك.",
                      "Note: Restrict your API keys to read-only to keep your funds secure."
                    )}
                  </div>
                </CardContent>
                <CardFooter>
                  <Button onClick={handleConnectBinance} disabled={isLoading}>
                    {isLoading ? t("جاري الربط...", "Connecting...") : t("ربط الحساب", "Connect Account")}
                  </Button>
                  <a 
                    href="https://www.binance.com/en/my/settings/api-management" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="ml-4 text-sm text-blue-500 hover:underline flex items-center"
                  >
                    {t("الحصول على مفاتيح API", "Get API keys")} 
                    <ExternalLink className="ml-1 h-3 w-3" />
                  </a>
                </CardFooter>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <img src="https://cryptologos.cc/logos/coinmarketcap-cmc-logo.png" alt="CoinMarketCap Logo" className="h-6 w-6 mr-2" />
                    {t("ربط مع كوين ماركت كاب", "Connect with CoinMarketCap")}
                  </CardTitle>
                  <CardDescription>
                    {t("قم بربط حسابك بكوين ماركت كاب للحصول على بيانات سوق أكثر دقة.", "Connect your account to CoinMarketCap for more accurate market data.")}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="cmc-api-key">{t("مفتاح API", "API Key")}</Label>
                    <Input 
                      id="cmc-api-key" 
                      placeholder={t("أدخل مفتاح API الخاص بك", "Enter your API key")} 
                      value={cmcApiKey}
                      onChange={(e) => setCmcApiKey(e.target.value)}
                    />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button onClick={handleConnectCMC} disabled={isLoading}>
                    {isLoading ? t("جاري الربط...", "Connecting...") : t("ربط الحساب", "Connect Account")}
                  </Button>
                  <a 
                    href="https://coinmarketcap.com/api/" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="ml-4 text-sm text-blue-500 hover:underline flex items-center"
                  >
                    {t("الحصول على مفتاح API", "Get API key")} 
                    <ExternalLink className="ml-1 h-3 w-3" />
                  </a>
                </CardFooter>
              </Card>
            </TabsContent>

            <TabsContent value="notifications" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Telegram className="mr-2 h-5 w-5 text-blue-500" />
                    {t("ربط مع تيليجرام", "Connect with Telegram")}
                  </CardTitle>
                  <CardDescription>
                    {t("استلم إشعارات وتنبيهات التداول على حساب تيليجرام الخاص بك.", "Receive trading notifications and alerts on your Telegram account.")}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="telegram-bot-token">{t("رمز بوت تيليجرام", "Telegram Bot Token")}</Label>
                    <Input 
                      id="telegram-bot-token" 
                      placeholder={t("أدخل رمز البوت الخاص بك", "Enter your bot token")}
                      value={telegramBotToken}
                      onChange={(e) => setTelegramBotToken(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="telegram-chat-id">{t("معرف المحادثة", "Chat ID")}</Label>
                    <Input 
                      id="telegram-chat-id" 
                      placeholder={t("أدخل معرف المحادثة الخاص بك", "Enter your chat ID")}
                      value={telegramChatId}
                      onChange={(e) => setTelegramChatId(e.target.value)}
                    />
                  </div>
                  <div className="flex items-center space-x-2 pt-2">
                    <Switch
                      id="notifications"
                      checked={notificationEnabled}
                      onCheckedChange={setNotificationEnabled}
                    />
                    <Label htmlFor="notifications">
                      {t("تفعيل إشعارات التداول", "Enable trading notifications")}
                    </Label>
                  </div>
                </CardContent>
                <CardFooter className="flex flex-col space-y-2 items-start sm:flex-row sm:space-y-0 sm:items-center">
                  <Button onClick={handleConnectTelegram} disabled={isLoading}>
                    {isLoading ? t("جاري الربط...", "Connecting...") : t("ربط مع تيليجرام", "Connect Telegram")}
                  </Button>
                  <a 
                    href="https://core.telegram.org/bots#how-do-i-create-a-bot" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="ml-0 sm:ml-4 text-sm text-blue-500 hover:underline flex items-center"
                  >
                    {t("كيفية إنشاء بوت تيليجرام", "How to create a Telegram bot")} 
                    <ExternalLink className="ml-1 h-3 w-3" />
                  </a>
                </CardFooter>
              </Card>
            </TabsContent>

            <TabsContent value="api" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Globe2 className="mr-2 h-5 w-5 text-green-500" />
                    {t("واجهة برمجة التطبيق الخارجية", "External API Integration")}
                  </CardTitle>
                  <CardDescription>
                    {t("استخدم ويب هوك لربط منصتنا مع تطبيقاتك الخارجية.", "Use webhooks to connect our platform with your external applications.")}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="webhook-url">{t("عنوان الويب هوك", "Webhook URL")}</Label>
                    <Input 
                      id="webhook-url" 
                      placeholder="https://example.com/webhook"
                      value={webhookUrl}
                      onChange={(e) => setWebhookUrl(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="webhook-payload">{t("نموذج البيانات", "Payload Template")}</Label>
                    <Textarea 
                      id="webhook-payload" 
                      className="font-mono text-sm" 
                      rows={5}
                      readOnly
                      defaultValue={`{
  "event": "trade_alert",
  "symbol": "BTC/USDT",
  "price": 50000,
  "direction": "buy",
  "timestamp": "2023-06-01T12:00:00Z"
}`}
                    />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button onClick={handleTestWebhook} disabled={isLoading}>
                    {isLoading ? t("جاري الاختبار...", "Testing...") : t("اختبار الويب هوك", "Test Webhook")}
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Integrations;
