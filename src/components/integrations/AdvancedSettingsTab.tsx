
import React, { useState } from "react";
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
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/components/ui/use-toast";

interface AdvancedSettingsTabProps {
  webhookUrl: string;
  setWebhookUrl: React.Dispatch<React.SetStateAction<string>>;
}

const AdvancedSettingsTab = ({ webhookUrl, setWebhookUrl }: AdvancedSettingsTabProps) => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [isTestingConnection, setIsTestingConnection] = useState(false);

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

  return (
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
  );
};

export { AdvancedSettingsTab };
