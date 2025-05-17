
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
      
      return false;
    }
  }, [apiKeys, t, toast, testBinanceConnectionHandler]);

  return {
    connectedToBinance,
    testBinanceConnection: testBinanceConnectionHandler,
    testConnection: testConnectionHandler
  };
};
