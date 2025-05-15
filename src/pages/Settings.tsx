
import AppSidebar from "@/components/AppSidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/use-toast";

const Settings = () => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [darkMode, setDarkMode] = useState(true);
  const [loading, setLoading] = useState(false);

  // Fetch user settings
  useEffect(() => {
    const fetchSettings = async () => {
      if (!user) return;
      
      try {
        const { data, error } = await supabase
          .from('user_settings')
          .select('dark_mode')
          .eq('user_id', user.id)
          .single();
          
        if (error) throw error;
        
        if (data) {
          setDarkMode(data.dark_mode);
        }
      } catch (error) {
        console.error('Error fetching settings:', error);
      }
    };
    
    fetchSettings();
  }, [user]);

  // Update dark mode setting
  const handleDarkModeChange = async (checked: boolean) => {
    if (!user) return;
    setLoading(true);
    
    try {
      setDarkMode(checked);
      
      const { error } = await supabase
        .from('user_settings')
        .update({ dark_mode: checked })
        .eq('user_id', user.id);
        
      if (error) throw error;
      
      toast({
        title: t("تم تحديث الإعدادات", "Settings Updated"),
        description: t("تم تحديث إعدادات الوضع الداكن بنجاح.", "Dark mode settings updated successfully."),
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
    <div className="min-h-screen flex w-full">
      <AppSidebar />
      <div className="flex-1 overflow-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-semibold">{t("الإعدادات", "Settings")}</h1>
            <div className="flex items-center gap-4">
              <SidebarTrigger />
            </div>
          </div>
          
          <Card className="border-zinc-800 mb-6">
            <CardHeader>
              <CardTitle>{t("إعدادات الواجهة", "Interface Settings")}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="dark-mode">{t("الوضع الداكن", "Dark Mode")}</Label>
                  <p className="text-sm text-muted-foreground">
                    {t("تفضيل الوضع الداكن للواجهة", "Prefer dark mode for the interface")}
                  </p>
                </div>
                <Switch
                  id="dark-mode"
                  checked={darkMode}
                  onCheckedChange={handleDarkModeChange}
                  disabled={loading}
                />
              </div>
            </CardContent>
          </Card>

          <Card className="border-zinc-800">
            <CardHeader>
              <CardTitle>{t("إعدادات الحساب", "Account Settings")}</CardTitle>
            </CardHeader>
            <CardContent>
              {user ? (
                <div className="space-y-2">
                  <p><strong>{t("البريد الإلكتروني", "Email")}:</strong> {user.email}</p>
                  <p><strong>{t("معرف المستخدم", "User ID")}:</strong> {user.id}</p>
                </div>
              ) : (
                <p>{t("يرجى تسجيل الدخول لعرض إعدادات الحساب.", "Please sign in to view account settings.")}</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Settings;
