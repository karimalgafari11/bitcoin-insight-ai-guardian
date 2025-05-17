
import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";
import { saveApiKey, getApiKey, testBinanceConnection, testApiConnection } from "@/services/apiKeyService";

interface ApiKeyHookResult {
  apiKeys: Record<string, string>;
  setApiKeys: React.Dispatch<React.SetStateAction<Record<string, string>>>;
  apiSecret: string;
  setApiSecret: React.Dispatch<React.SetStateAction<string>>;
  keysSaved: boolean;
  connectedToBinance: boolean;
  handleSaveApiKey: (platform: string) => void;
  testBinanceConnection: () => Promise<void>;
  testConnection: (platform: string) => Promise<void>;
}

export const useApiKeys = (): ApiKeyHookResult => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [apiKeys, setApiKeys] = useState<Record<string, string>>({});
  const [apiSecret, setApiSecret] = useState("");
  const [keysSaved, setKeysSaved] = useState(false);
  const [connectedToBinance, setConnectedToBinance] = useState(false);
  
  // Load saved API keys on mount
  useEffect(() => {
    const savedBinanceKey = getApiKey("binance_api_key");
    if (savedBinanceKey) {
      setApiKeys(prev => ({ ...prev, binance: savedBinanceKey }));
      setKeysSaved(true);
    }
    
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
    platforms.forEach(platform => {
      const key = getApiKey(`${platform}_api_key`);
      if (key) {
        savedKeys[platform] = key;
      }
    });
    
    setApiKeys(prev => ({ ...prev, ...savedKeys }));
  }, []);
  
  // Set default API keys if none are set
  useEffect(() => {
    const defaultApiKey = "WTECzlRFpNgTAR1LBssxDGkby6WREdv9ip7rZu1UDYEEO5EDZVxIjSWnIM5MxJk9";
    const defaultApiSecret = "qRjlT5VaqDcJreP1BHX9Ud9Tge3PwYZ8dioyZEGyfTxEHJzaO2RzAuxSJnR5G6M9";
    
    // Only set if not already set
    if (!apiKeys.binance) {
      setApiKeys(prev => ({ ...prev, binance: defaultApiKey }));
      setApiSecret(defaultApiSecret);
      
      // Save to localStorage
      saveApiKey("binance_api_key", defaultApiKey);
      saveApiKey("binance_api_secret", defaultApiSecret);
      
      setKeysSaved(true);
      toast({
        title: t("تم تعيين مفاتيح API", "API Keys Set"),
        description: t(
          "تم تعيين مفاتيح API الافتراضية لـ Binance",
          "Default Binance API keys have been set"
        ),
      });
    }
  }, [t, toast, apiKeys.binance]);

  const handleSaveApiKey = (platform: string) => {
    if (!apiKeys[platform]) {
      toast({
        title: t("خطأ", "Error"),
        description: t(
          "يرجى إدخال مفتاح API",
          "Please enter an API key"
        ),
        variant: "destructive",
      });
      return;
    }

    if ((platform === "binance" || platform === "binance_testnet") && !apiSecret) {
      toast({
        title: t("خطأ", "Error"),
        description: t(
          "يرجى إدخال مفتاح السري أيضاً",
          "Please enter the Secret key as well"
        ),
        variant: "destructive",
      });
      return;
    }

    // Save the API key to localStorage
    saveApiKey(`${platform}_api_key`, apiKeys[platform]);
    
    // For platforms requiring secret keys
    if (platform === "binance" || platform === "binance_testnet") {
      saveApiKey(`${platform}_api_secret`, apiSecret);
      setKeysSaved(true);
      
      // Test the connection
      testConnectionHandler(platform);
    }
    
    toast({
      title: t("تم حفظ المفتاح", "API Key Saved"),
      description: t(
        `تم حفظ مفتاح API لـ ${platform} بنجاح`,
        `${platform} API key saved successfully`
      ),
    });
  };

  const testBinanceConnectionHandler = async () => {
    try {
      const isConnected = await testBinanceConnection(apiKeys.binance);
      
      setConnectedToBinance(isConnected);
      
      if (isConnected) {
        toast({
          title: t("تم الاتصال بنجاح", "Connected Successfully"),
          description: t(
            "تم الاتصال بـ Binance بنجاح",
            "Successfully connected to Binance"
          ),
          variant: "default",
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
    }
  };

  const testConnectionHandler = async (platform: string) => {
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
        return;
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
    }
  };

  return {
    apiKeys,
    setApiKeys,
    apiSecret,
    setApiSecret,
    keysSaved,
    connectedToBinance,
    handleSaveApiKey,
    testBinanceConnection: testBinanceConnectionHandler,
    testConnection: testConnectionHandler
  };
};
