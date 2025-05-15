
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/use-toast";
import { BellRing } from "lucide-react";

// Add interface for notification preferences
interface NotificationPreferences {
  enabled: boolean;
  price_alerts?: boolean;
  market_updates?: boolean;
  trade_signals?: boolean;
}

const NotificationSettings = () => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [loading, setLoading] = useState(false);

  // Update notifications setting
  const handleNotificationsChange = async (checked: boolean) => {
    if (!user) return;
    setLoading(true);
    
    try {
      setNotificationsEnabled(checked);
      
      // Create a proper notification preferences object
      const notificationPreferences = {
        enabled: checked,
        price_alerts: checked,
        market_updates: checked,
        trade_signals: checked
      };
      
      const { error } = await supabase
        .from('user_settings')
        .update({
          // Cast to unknown first to handle the Json type requirement
          notification_preferences: notificationPreferences as unknown as any
        })
        .eq('user_id', user.id);
        
      if (error) throw error;
      
      toast({
        title: t("تم تحديث الإعدادات", "Settings Updated"),
        description: t("تم تحديث إعدادات الإشعارات بنجاح.", "Notification settings updated successfully."),
      });
    } catch (error) {
      console.error('Error updating settings:', error);
      toast({
        title: t("خطأ", "Error"),
        description: t("حدث خطأ أثناء تحديث الإعدادات.", "An error occurred while updating settings."),
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="border-zinc-800 mb-6">
      <CardHeader>
        <CardTitle>{t("إعدادات الإشعارات", "Notification Settings")}</CardTitle>
        <CardDescription>
          {t("إدارة الإشعارات والتنبيهات", "Manage notifications and alerts")}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between rounded-lg border p-4 shadow-sm">
          <div className="flex items-center space-x-4 space-x-reverse rtl:space-x-reverse">
            <BellRing className="h-5 w-5 text-primary" />
            <div className="space-y-0.5">
              <Label htmlFor="notifications">{t("الإشعارات", "Notifications")}</Label>
              <p className="text-sm text-muted-foreground">
                {t("تمكين أو تعطيل جميع الإشعارات", "Enable or disable all notifications")}
              </p>
            </div>
          </div>
          <Switch
            id="notifications"
            checked={notificationsEnabled}
            onCheckedChange={handleNotificationsChange}
            disabled={loading}
          />
        </div>
        
        <div className={`space-y-4 ${!notificationsEnabled && "opacity-50 pointer-events-none"}`}>
          <h3 className="text-md font-medium">{t("أنواع الإشعارات", "Notification Types")}</h3>
          
          <div className="flex items-center justify-between py-2">
            <div className="space-y-0.5">
              <Label htmlFor="price-alerts">{t("تنبيهات الأسعار", "Price Alerts")}</Label>
              <p className="text-sm text-muted-foreground">
                {t("إشعارات عند تغير سعر البيتكوين بشكل كبير", "Notifications when Bitcoin price changes significantly")}
              </p>
            </div>
            <Switch
              id="price-alerts"
              defaultChecked
              disabled={loading || !notificationsEnabled}
            />
          </div>
          
          <div className="flex items-center justify-between py-2">
            <div className="space-y-0.5">
              <Label htmlFor="market-updates">{t("تحديثات السوق", "Market Updates")}</Label>
              <p className="text-sm text-muted-foreground">
                {t("إشعارات حول أخبار وتحديثات السوق المهمة", "Notifications about important market news and updates")}
              </p>
            </div>
            <Switch
              id="market-updates"
              defaultChecked
              disabled={loading || !notificationsEnabled}
            />
          </div>
          
          <div className="flex items-center justify-between py-2">
            <div className="space-y-0.5">
              <Label htmlFor="trade-signals">{t("إشارات التداول", "Trading Signals")}</Label>
              <p className="text-sm text-muted-foreground">
                {t("إشعارات حول إشارات التداول المحتملة", "Notifications about potential trading signals")}
              </p>
            </div>
            <Switch
              id="trade-signals"
              defaultChecked
              disabled={loading || !notificationsEnabled}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default NotificationSettings;
