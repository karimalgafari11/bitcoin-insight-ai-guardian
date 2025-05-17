
import { useCallback } from "react";
import { useApiKeyStorage } from "./useApiKeyStorage";
import { useConnectionTesting } from "./useConnectionTesting";
import { useApiKeyValidation } from "./useApiKeyValidation";
import { useDefaultApiKeys } from "./useDefaultApiKeys";
import { useToast } from "@/components/ui/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";

/**
 * Main API keys hook that combines functionality from smaller hooks
 */
export const useApiKeys = () => {
  const { t } = useLanguage();
  const { toast } = useToast();
  
  const {
    apiKeys,
    setApiKeys,
    apiSecret,
    setApiSecret,
    keysSaved,
    saveApiKeyToStorage
  } = useApiKeyStorage();
  
  // Initialize default API keys if needed
  useDefaultApiKeys();
  
  const { validateApiKey } = useApiKeyValidation();
  
  const {
    connectedToBinance,
    connectionStates,
    loadingStates,
    testBinanceConnection,
    testConnection
  } = useConnectionTesting(apiKeys);

  // Combined handler for saving API keys
  const handleSaveApiKey = useCallback((platform: string) => {
    try {
      // Special handling for empty API keys
      if (!apiKeys[platform] || apiKeys[platform].trim() === "") {
        toast({
          title: t("خطأ", "Error"),
          description: t(
            "يرجى إدخال مفتاح API أولاً",
            "Please enter an API key first"
          ),
          variant: "destructive",
        });
        return false;
      }
      
      // Validate the API key before saving
      if (!validateApiKey(platform, apiKeys[platform], (platform === "binance" || platform === "binance_testnet") ? apiSecret : undefined)) {
        return false;
      }

      // Save the API key
      const success = saveApiKeyToStorage(platform, apiKeys[platform], (platform === "binance" || platform === "binance_testnet") ? apiSecret : undefined);
      
      if (success) {
        // Test the connection if we're saving a platform that can be tested
        if (["binance", "binance_testnet", "coinapi", "coindesk", "cryptocompare", "livecoinwatch"].includes(platform)) {
          if (platform === "binance") {
            testBinanceConnection();
          } else {
            testConnection(platform);
          }
        }
      }
      
      return success;
    } catch (error) {
      console.error("Error in handleSaveApiKey:", error);
      toast({
        title: t("خطأ", "Error"),
        description: t(
          "حدث خطأ أثناء حفظ مفتاح API",
          "An error occurred while saving the API key"
        ),
        variant: "destructive",
      });
      return false;
    }
  }, [apiKeys, apiSecret, validateApiKey, saveApiKeyToStorage, testBinanceConnection, testConnection, t, toast]);

  return {
    apiKeys,
    setApiKeys,
    apiSecret,
    setApiSecret,
    keysSaved,
    connectedToBinance,
    connectionStates,
    loadingStates,
    handleSaveApiKey,
    testBinanceConnection,
    testConnection
  };
};

export * from "./useApiKeyStorage";
export * from "./useApiKeyValidation";
export * from "./useConnectionTesting";
export * from "./useDefaultApiKeys";
