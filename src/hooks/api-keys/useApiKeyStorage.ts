
import { useState, useEffect } from "react";
import { saveApiKey, getApiKey } from "@/services/apiKeyService";
import { useToast } from "@/components/ui/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";

/**
 * Hook for loading and saving API keys to localStorage
 */
export const useApiKeyStorage = () => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [apiKeys, setApiKeys] = useState<Record<string, string>>({});
  const [apiSecret, setApiSecret] = useState("");
  const [keysSaved, setKeysSaved] = useState(false);

  // Load saved API keys on mount
  useEffect(() => {
    const loadSavedApiKeys = () => {
      try {
        // Load main Binance key
        const savedBinanceKey = getApiKey("binance_api_key");
        if (savedBinanceKey) {
          setApiKeys(prev => ({ ...prev, binance: savedBinanceKey }));
          setKeysSaved(true);
        }
        
        // Load Binance secret
        const savedBinanceSecret = getApiKey("binance_api_secret");
        if (savedBinanceSecret) {
          setApiSecret(savedBinanceSecret);
        }

        // Load other API keys
        const platforms = [
          "binance_testnet", "coinapi", "coindesk", 
          "cryptocompare", "livecoinwatch", "tradingview", "metatrader"
        ];
        
        const savedKeys: Record<string, string> = {};
        let hasKeys = false;
        
        platforms.forEach(platform => {
          const key = getApiKey(`${platform}_api_key`);
          if (key) {
            savedKeys[platform] = key;
            hasKeys = true;
          }
        });
        
        if (hasKeys) {
          setKeysSaved(true);
        }
        
        // Merge with existing keys
        setApiKeys(prev => ({ ...prev, ...savedKeys }));
      } catch (error) {
        console.error("Error loading saved API keys:", error);
      }
    };

    loadSavedApiKeys();
  }, []);

  const saveApiKeyToStorage = (platform: string, key: string, secret?: string) => {
    try {
      if (!key || key.trim() === "") {
        toast({
          title: t("خطأ", "Error"),
          description: t(
            `يجب إدخال مفتاح API لـ ${platform}`,
            `API key for ${platform} cannot be empty`
          ),
          variant: "destructive",
        });
        return false;
      }
      
      // Save the API key to localStorage
      saveApiKey(`${platform}_api_key`, key);
      console.log(`Saved API key for ${platform}`);
      
      // For platforms requiring secret keys
      if (secret && (platform === "binance" || platform === "binance_testnet")) {
        if (!secret || secret.trim() === "") {
          toast({
            title: t("خطأ", "Error"),
            description: t(
              "يجب إدخال المفتاح السري",
              "Secret key cannot be empty"
            ),
            variant: "destructive",
          });
          return false;
        }
        
        saveApiKey(`${platform}_api_secret`, secret);
      }
      
      setKeysSaved(true);
      
      toast({
        title: t("تم حفظ المفتاح", "API Key Saved"),
        description: t(
          `تم حفظ مفتاح API لـ ${platform} بنجاح`,
          `${platform} API key saved successfully`
        ),
      });
      
      return true;
    } catch (error) {
      console.error(`Error saving ${platform} API key:`, error);
      toast({
        title: t("خطأ في الحفظ", "Save Error"),
        description: t(
          `حدث خطأ أثناء حفظ مفتاح API لـ ${platform}`,
          `An error occurred while saving the ${platform} API key`
        ),
        variant: "destructive",
      });
      
      return false;
    }
  };

  return {
    apiKeys,
    setApiKeys,
    apiSecret,
    setApiSecret,
    keysSaved,
    saveApiKeyToStorage
  };
};
