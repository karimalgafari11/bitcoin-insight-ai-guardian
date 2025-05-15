
import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { supabase } from "@/integrations/supabase/client";

import AppSidebar from "@/components/AppSidebar";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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

// Import our new component files
import AppearanceSettings from "@/components/settings/AppearanceSettings";
import AccountSettings from "@/components/settings/AccountSettings";
import NotificationSettings from "@/components/settings/NotificationSettings";
import UserSettingsAdvanced from "@/components/UserSettingsAdvanced";

// Add interface for notification preferences
interface NotificationPreferences {
  enabled: boolean;
  price_alerts?: boolean;
  market_updates?: boolean;
  trade_signals?: boolean;
}

const Settings = () => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [darkMode, setDarkMode] = useState(true);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

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
          
          // Properly handle the notification_preferences value with type safety
          // First cast to unknown, then to our specific type
          const notifPref = data.notification_preferences as unknown;
          const notificationPrefs = notifPref as NotificationPreferences | null;
          setNotificationsEnabled(notificationPrefs?.enabled ?? true);
        }
      } catch (error) {
        console.error('Error fetching settings:', error);
      }
    };
    
    fetchSettings();
  }, [user]);

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
              <AppearanceSettings />
            </TabsContent>
            
            {/* Account Tab */}
            <TabsContent value="account">
              <AccountSettings />
            </TabsContent>
            
            {/* Notifications Tab */}
            <TabsContent value="notifications">
              <NotificationSettings />
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
