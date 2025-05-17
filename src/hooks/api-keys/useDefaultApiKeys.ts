
import { useEffect } from "react";
import { useApiKeyStorage } from "./useApiKeyStorage";
import { useToast } from "@/components/ui/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";
import { saveApiKey } from "@/services/apiKeyService";

/**
 * Hook to set default API keys if none are set
 */
export const useDefaultApiKeys = () => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const { apiKeys, setApiKeys, setApiSecret } = useApiKeyStorage();

  useEffect(() => {
    const setDefaultKeys = () => {
      const defaultApiKey = "WTECzlRFpNgTAR1LBssxDGkby6WREdv9ip7rZu1UDYEEO5EDZVxIjSWnIM5MxJk9";
      const defaultApiSecret = "qRjlT5VaqDcJreP1BHX9Ud9Tge3PwYZ8dioyZEGyfTxEHJzaO2RzAuxSJnR5G6M9";
      
      // Only set if not already set
      if (!apiKeys.binance) {
        setApiKeys(prev => ({ ...prev, binance: defaultApiKey }));
        setApiSecret(defaultApiSecret);
        
        // Save to localStorage
        saveApiKey("binance_api_key", defaultApiKey);
        saveApiKey("binance_api_secret", defaultApiSecret);
        
        toast({
          title: t("تم تعيين مفاتيح API", "API Keys Set"),
          description: t(
            "تم تعيين مفاتيح API الافتراضية لـ Binance",
            "Default Binance API keys have been set"
          ),
        });
      }
    };

    setDefaultKeys();
  }, [apiKeys.binance, setApiKeys, setApiSecret, t, toast]);
};
