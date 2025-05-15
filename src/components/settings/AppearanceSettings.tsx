
import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "@/components/ui/use-toast";
import { Moon, Sun, Globe } from "lucide-react";

const AppearanceSettings = () => {
  const { user } = useAuth();
  const { t, language, setLanguage } = useLanguage();
  const [darkMode, setDarkMode] = useState(true);
  const [loading, setLoading] = useState(false);

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

  // Handle language change
  const handleLanguageChange = async (newLanguage: 'ar' | 'en') => {
    if (!user) return;
    setLoading(true);
    
    try {
      setLanguage(newLanguage);
      
      const { error } = await supabase
        .from('user_settings')
        .update({ default_language: newLanguage })
        .eq('user_id', user.id);
        
      if (error) throw error;
      
      toast({
        title: t("تم تحديث الإعدادات", "Settings Updated"),
        description: t("تم تحديث إعدادات اللغة بنجاح.", "Language settings updated successfully."),
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
        <CardTitle>{t("إعدادات المظهر", "Appearance Settings")}</CardTitle>
        <CardDescription>
          {t("تخصيص مظهر التطبيق", "Customize how the application looks")}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          {/* Dark Mode Setting */}
          <div className="flex items-center justify-between rounded-lg border p-4 shadow-sm">
            <div className="flex items-center space-x-4 space-x-reverse rtl:space-x-reverse">
              {darkMode ? (
                <Moon className="h-5 w-5 text-primary" />
              ) : (
                <Sun className="h-5 w-5 text-primary" />
              )}
              <div className="space-y-0.5">
                <Label htmlFor="dark-mode">{t("الوضع الداكن", "Dark Mode")}</Label>
                <p className="text-sm text-muted-foreground">
                  {t("تفضيل الوضع الداكن للواجهة", "Prefer dark mode for the interface")}
                </p>
              </div>
            </div>
            <Switch
              id="dark-mode"
              checked={darkMode}
              onCheckedChange={handleDarkModeChange}
              disabled={loading}
            />
          </div>
          
          {/* Language Setting */}
          <div className="rounded-lg border p-4 shadow-sm">
            <div className="flex items-center space-x-4 space-x-reverse rtl:space-x-reverse mb-4">
              <Globe className="h-5 w-5 text-primary" />
              <div className="space-y-0.5">
                <Label>{t("اللغة", "Language")}</Label>
                <p className="text-sm text-muted-foreground">
                  {t("اختر لغة واجهة المستخدم", "Choose user interface language")}
                </p>
              </div>
            </div>
            
            <RadioGroup 
              value={language} 
              onValueChange={(value) => handleLanguageChange(value as 'ar' | 'en')}
              className="flex gap-4"
            >
              <div className="flex items-center space-x-2 space-x-reverse rtl:space-x-reverse">
                <RadioGroupItem value="ar" id="r1" />
                <Label htmlFor="r1">العربية</Label>
              </div>
              <div className="flex items-center space-x-2 space-x-reverse rtl:space-x-reverse">
                <RadioGroupItem value="en" id="r2" />
                <Label htmlFor="r2">English</Label>
              </div>
            </RadioGroup>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AppearanceSettings;
