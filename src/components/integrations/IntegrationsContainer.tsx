
import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TradingPlatformTab } from "./TradingPlatformTab";
import { SocialMediaTab } from "./SocialMediaTab";
import { AdvancedSettingsTab } from "./AdvancedSettingsTab";

interface IntegrationsContainerProps {
  apiKeys: Record<string, string>;
  setApiKeys: React.Dispatch<React.SetStateAction<Record<string, string>>>;
  socialConnections: Record<string, boolean>;
  setSocialConnections: React.Dispatch<React.SetStateAction<Record<string, boolean>>>;
  webhookUrl: string;
  setWebhookUrl: React.Dispatch<React.SetStateAction<string>>;
}

const IntegrationsContainer = ({
  apiKeys,
  setApiKeys,
  socialConnections,
  setSocialConnections,
  webhookUrl,
  setWebhookUrl
}: IntegrationsContainerProps) => {
  const { t } = useLanguage();

  return (
    <Tabs defaultValue="trading" className="w-full mb-6">
      <TabsList className="grid grid-cols-3 mb-4">
        <TabsTrigger value="trading">{t("منصات التداول", "Trading Platforms")}</TabsTrigger>
        <TabsTrigger value="social">{t("وسائل التواصل", "Social Media")}</TabsTrigger>
        <TabsTrigger value="advanced">{t("إعدادات متقدمة", "Advanced Settings")}</TabsTrigger>
      </TabsList>
      
      <TabsContent value="trading" className="mt-0">
        <TradingPlatformTab apiKeys={apiKeys} setApiKeys={setApiKeys} />
      </TabsContent>
      
      <TabsContent value="social" className="mt-0">
        <SocialMediaTab 
          socialConnections={socialConnections} 
          setSocialConnections={setSocialConnections} 
        />
      </TabsContent>
      
      <TabsContent value="advanced" className="mt-0">
        <AdvancedSettingsTab webhookUrl={webhookUrl} setWebhookUrl={setWebhookUrl} />
      </TabsContent>
    </Tabs>
  );
};

export default IntegrationsContainer;
