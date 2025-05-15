
import React, { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { AppSidebar } from "@/components/AppSidebar";
import { SidebarTrigger } from "@/components/ui/sidebar";

// Import our newly created components
import PopularIntegrationsList from "@/components/integrations/PopularIntegrationsList";
import IntegrationsContainer from "@/components/integrations/IntegrationsContainer";
import HelpCard from "@/components/integrations/HelpCard";

const Integrations = () => {
  const { t } = useLanguage();
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

          <PopularIntegrationsList 
            apiKeys={apiKeys} 
            socialConnections={socialConnections} 
          />

          <IntegrationsContainer 
            apiKeys={apiKeys}
            setApiKeys={setApiKeys}
            socialConnections={socialConnections}
            setSocialConnections={setSocialConnections}
            webhookUrl={webhookUrl}
            setWebhookUrl={setWebhookUrl}
          />
          
          <div className="mt-8">
            <HelpCard />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Integrations;
