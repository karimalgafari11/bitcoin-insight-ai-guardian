
import { useState, useCallback } from "react";
import { useToast } from "@/components/ui/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";
import { testBinanceConnection, testApiConnection } from "@/services/apiKeyService";

/**
 * Hook for testing API connections
 */
export const useConnectionTesting = (apiKeys: Record<string, string>) => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [connectedToBinance, setConnectedToBinance] = useState(false);
  const [loadingStates, setLoadingStates] = useState<Record<string, boolean>>({});

  const setLoadingForPlatform = (platform: string, isLoading: boolean) => {
    setLoadingStates(prev => ({ ...prev, [platform]: isLoading }));
  };

  const testBinanceConnectionHandler = useCallback(async () => {
    try {
      if (!apiKeys.binance) {
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
      
      setLoadingForPlatform('binance', true);
      
      const isConnected = await testBinanceConnection(apiKeys.binance);
      
      setConnectedToBinance(isConnected);
      
      if (isConnected) {
        toast({
          title: t("تم الاتصال بنجاح", "Connected Successfully"),
          description: t(
            "تم الاتصال بـ Binance بنجاح",
            "Successfully connected to Binance"
          ),
        });
      } else {
        toast({
          title: t("فشل الاتصال", "Connection Failed"),
          description: t(
            "فشل الاتصال بـ Binance، يرجى التحقق من المفاتيح",
            "Failed to connect to Binance, please check your keys"
          ),
          variant: "destructive",
        });
      }
      
      setLoadingForPlatform('binance', false);
      return isConnected;
    } catch (error) {
      console.error("Error testing Binance connection:", error);
      setConnectedToBinance(false);
      toast({
        title: t("خطأ", "Error"),
        description: t(
          "حدث خطأ أثناء الاتصال بـ Binance",
          "An error occurred while connecting to Binance"
        ),
        variant: "destructive",
      });
      
      setLoadingForPlatform('binance', false);
      return false;
    }
  }, [apiKeys.binance, t, toast]);

  const testConnectionHandler = useCallback(async (platform: string) => {
    try {
      // Get the appropriate API key
      const apiKey = apiKeys[platform];
      
      if (!apiKey) {
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
      
      // For Binance, we already have a specific test function
      if (platform === "binance") {
        return testBinanceConnectionHandler();
      }
      
      // Set loading state
      setLoadingForPlatform(platform, true);
      
      // Test connection for other platforms
      const isConnected = await testApiConnection(platform, apiKey);
      
      if (isConnected) {
        toast({
          title: t("تم الاتصال بنجاح", "Connected Successfully"),
          description: t(
            `تم الاتصال بـ ${platform} بنجاح`,
            `Successfully connected to ${platform}`
          ),
        });
      } else {
        toast({
          title: t("فشل الاتصال", "Connection Failed"),
          description: t(
            `فشل الاتصال بـ ${platform}، يرجى التحقق من المفاتيح`,
            `Failed to connect to ${platform}, please check your keys`
          ),
          variant: "destructive",
        });
      }
      
      // Clear loading state
      setLoadingForPlatform(platform, false);
      return isConnected;
    } catch (error) {
      console.error(`Error testing ${platform} connection:`, error);
      toast({
        title: t("خطأ", "Error"),
        description: t(
          `حدث خطأ أثناء الاتصال بـ ${platform}`,
          `An error occurred while connecting to ${platform}`
        ),
        variant: "destructive",
      });
      
      // Clear loading state on error
      setLoadingForPlatform(platform, false);
      return false;
    }
  }, [apiKeys, t, toast, testBinanceConnectionHandler]);

  return {
    connectedToBinance,
    loadingStates,
    testBinanceConnection: testBinanceConnectionHandler,
    testConnection: testConnectionHandler
  };
};
