
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";

import AppSidebar from "@/components/AppSidebar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { 
  BellRing, 
  Lock, 
  PaintBucket, 
  User, 
  Moon, 
  Sun, 
  Globe,
  Bell,
  Shield
} from "lucide-react";
import UserSettingsAdvanced from "@/components/UserSettingsAdvanced";

const Settings = () => {
  const { user } = useAuth();
  const { t, language, setLanguage } = useLanguage();
  const [darkMode, setDarkMode] = useState(true);
  const [loading, setLoading] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const navigate = useNavigate();

  // Fetch user settings
  useEffect(() => {
    const fetchSettings = async () => {
      if (!user) return;
      
      try {
        const { data, error } = await supabase
          .from('user_settings')
          .select('dark_mode, notification_preferences, default_language')
          .eq('user_id', user.id)
          .single();
          
        if (error) throw error;
        
        if (data) {
          setDarkMode(data.dark_mode);
          setNotificationsEnabled(data.notification_preferences?.enabled ?? true);
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

  // Update notifications setting
  const handleNotificationsChange = async (checked: boolean) => {
    if (!user) return;
    setLoading(true);
    
    try {
      setNotificationsEnabled(checked);
      
      const { error } = await supabase
        .from('user_settings')
        .update({
          notification_preferences: {
            enabled: checked,
            price_alerts: checked,
            market_updates: checked,
          }
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
          
          <Tabs defaultValue="appearance" className="w-full">
            <TabsList className="mb-6 w-full sm:w-auto flex flex-wrap">
              <TabsTrigger value="appearance" className="flex items-center gap-2">
                <PaintBucket className="h-4 w-4" />
                {t("المظهر", "Appearance")}
              </TabsTrigger>
              <TabsTrigger value="account" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                {t("الحساب", "Account")}
              </TabsTrigger>
              <TabsTrigger value="notifications" className="flex items-center gap-2">
                <Bell className="h-4 w-4" />
                {t("الإشعارات", "Notifications")}
              </TabsTrigger>
              <TabsTrigger value="advanced" className="flex items-center gap-2">
                <Shield className="h-4 w-4" />
                {t("متقدم", "Advanced")}
              </TabsTrigger>
            </TabsList>
            
            {/* Appearance Tab */}
            <TabsContent value="appearance">
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
            </TabsContent>
            
            {/* Account Tab */}
            <TabsContent value="account">
              <Card className="border-zinc-800 mb-6">
                <CardHeader>
                  <CardTitle>{t("إعدادات الحساب", "Account Settings")}</CardTitle>
                  <CardDescription>
                    {t("إدارة معلومات حسابك", "Manage your account information")}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {user ? (
                    <div className="space-y-6">
                      <div className="space-y-1">
                        <h3 className="text-lg font-medium">{t("المعلومات الأساسية", "Basic Information")}</h3>
                        <div className="grid gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="email">{t("البريد الإلكتروني", "Email")}</Label>
                            <Input id="email" value={user.email} readOnly disabled className="bg-muted" />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="user-id">{t("معرف المستخدم", "User ID")}</Label>
                            <Input id="user-id" value={user.id} readOnly disabled className="bg-muted text-xs" />
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <h3 className="text-lg font-medium">{t("الأمان", "Security")}</h3>
                        <div className="flex items-center justify-between rounded-lg border p-4 shadow-sm">
                          <div className="space-y-0.5">
                            <div className="flex items-center gap-2">
                              <Lock className="h-4 w-4" />
                              <span>{t("تغيير كلمة المرور", "Change Password")}</span>
                            </div>
                            <p className="text-sm text-muted-foreground">
                              {t("قم بتحديث كلمة المرور الخاصة بك بانتظام للحفاظ على أمان حسابك", 
                                "Update your password regularly to keep your account secure")}
                            </p>
                          </div>
                          <Button variant="outline" size="sm">
                            {t("تغيير", "Change")}
                          </Button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="py-4 text-center">
                      <p>{t("يرجى تسجيل الدخول لعرض إعدادات الحساب.", "Please sign in to view account settings.")}</p>
                      <Button className="mt-2" onClick={() => navigate('/auth')}>
                        {t("تسجيل الدخول", "Sign In")}
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            {/* Notifications Tab */}
            <TabsContent value="notifications">
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
            </TabsContent>
            
            {/* Advanced Tab */}
            <TabsContent value="advanced">
              {user && <UserSettingsAdvanced />}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Settings;
