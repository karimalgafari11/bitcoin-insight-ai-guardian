
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { AlertTriangle } from "lucide-react";

const UserSettingsAdvanced = () => {
  const { t } = useLanguage();
  const { user } = useAuth();
  const { toast } = useToast();
  const [isBackupLoading, setIsBackupLoading] = useState(false);
  const [isCreatingAlert, setIsCreatingAlert] = useState(false);
  
  const handleBackupData = async () => {
    if (!user) {
      toast({
        title: t("خطأ", "Error"),
        description: t("يجب تسجيل الدخول أولاً", "You must be logged in first"),
        variant: "destructive",
      });
      return;
    }
    
    setIsBackupLoading(true);
    
    try {
      const { data, error } = await supabase.rpc('backup_user_data');
      
      if (error) throw error;
      
      toast({
        title: t("تم النسخ الاحتياطي", "Backup Completed"),
        description: t("تم إنشاء نسخة احتياطية من بياناتك بنجاح", "Your data has been successfully backed up"),
      });
    } catch (error) {
      console.error('Error creating backup:', error);
      toast({
        title: t("خطأ", "Error"),
        description: t("حدث خطأ أثناء إنشاء النسخة الاحتياطية", "An error occurred while creating the backup"),
        variant: "destructive",
      });
    } finally {
      setIsBackupLoading(false);
    }
  };
  
  const createTestAlert = async () => {
    if (!user) {
      toast({
        title: t("خطأ", "Error"),
        description: t("يجب تسجيل الدخول أولاً", "You must be logged in first"),
        variant: "destructive",
      });
      return;
    }
    
    setIsCreatingAlert(true);
    
    try {
      const response = await fetch(
        'https://rldsrafveotztbnqgmot.functions.supabase.co/alerts',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${supabase.auth.getSession().then(res => res.data.session?.access_token)}`,
          },
          body: JSON.stringify({
            user_id: user.id,
            alert_type: 'price_threshold',
            price_threshold: 50000,
            message: t("وصل سعر بيتكوين إلى 50,000 دولار", "Bitcoin price has reached $50,000")
          }),
        }
      );
      
      const data = await response.json();
      
      if (!response.ok) throw new Error(data.error || 'حدث خطأ غير معروف');
      
      toast({
        title: t("تم إنشاء التنبيه", "Alert Created"),
        description: t("تم إنشاء تنبيه اختباري بنجاح", "A test alert was created successfully"),
      });
    } catch (error) {
      console.error('Error creating alert:', error);
      toast({
        title: t("خطأ", "Error"),
        description: t("حدث خطأ أثناء إنشاء التنبيه", "An error occurred while creating the alert"),
        variant: "destructive",
      });
    } finally {
      setIsCreatingAlert(false);
    }
  };
  
  if (!user) {
    return null;
  }
  
  return (
    <Card className="border-zinc-800 mb-6">
      <CardHeader>
        <CardTitle>{t("الإعدادات المتقدمة", "Advanced Settings")}</CardTitle>
        <CardDescription>
          {t("إعدادات متقدمة للمستخدمين ذوي الخبرة", "Advanced settings for experienced users")}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <h4 className="font-medium">{t("إدارة البيانات", "Data Management")}</h4>
          <div className="flex items-center justify-between rounded-lg border p-4">
            <div className="space-y-0.5">
              <p className="text-sm font-medium">{t("نسخ احتياطي للبيانات", "Backup Data")}</p>
              <p className="text-xs text-muted-foreground">
                {t("إنشاء نسخة احتياطية من بياناتك", "Create a backup of your data")}
              </p>
            </div>
            <Button
              onClick={handleBackupData}
              disabled={isBackupLoading}
              size="sm"
            >
              {isBackupLoading ? t("جارٍ النسخ...", "Backing up...") : t("نسخ احتياطي", "Backup")}
            </Button>
          </div>
        </div>
        
        <div className="space-y-2">
          <h4 className="font-medium">{t("التنبيهات والإشعارات", "Alerts & Notifications")}</h4>
          <div className="flex items-center justify-between rounded-lg border p-4">
            <div className="space-y-0.5">
              <p className="text-sm font-medium">{t("إنشاء تنبيه اختباري", "Create Test Alert")}</p>
              <p className="text-xs text-muted-foreground">
                {t("إنشاء تنبيه اختباري لاختبار نظام التنبيهات", "Create a test alert to verify the alert system")}
              </p>
            </div>
            <Button
              onClick={createTestAlert}
              disabled={isCreatingAlert}
              size="sm"
              variant="outline"
            >
              {isCreatingAlert ? t("جارٍ الإنشاء...", "Creating...") : t("إنشاء تنبيه", "Create Alert")}
            </Button>
          </div>
        </div>
        
        <div className="rounded-lg border border-amber-500/20 bg-amber-500/10 p-4">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-amber-500" />
            <h4 className="font-medium text-amber-500">
              {t("تنبيه: منطقة للمستخدمين المتقدمين", "Warning: Advanced User Area")}
            </h4>
          </div>
          <p className="mt-2 text-sm">
            {t(
              "الإعدادات في هذا القسم مخصصة للمستخدمين ذوي الخبرة. التغييرات الخاطئة قد تؤثر على أداء التطبيق وبياناتك.",
              "Settings in this section are intended for experienced users. Incorrect changes may affect application performance and your data."
            )}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default UserSettingsAdvanced;
