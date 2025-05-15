
import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";
import { saveApiKey, getApiKey, testBinanceConnection } from "@/services/apiKeyService";

interface ApiKeyHookResult {
  apiKeys: Record<string, string>;
  setApiKeys: React.Dispatch<React.SetStateAction<Record<string, string>>>;
  apiSecret: string;
  setApiSecret: React.Dispatch<React.SetStateAction<string>>;
  keysSaved: boolean;
  connectedToBinance: boolean;
  handleSaveApiKey: (platform: string) => void;
  testBinanceConnection: () => Promise<void>;
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

  const handleSaveApiKey = (platform: keyof typeof apiKeys) => {
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

    if (platform === "binance" && !apiSecret) {
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

    // For Binance, save both key and secret to localStorage
    if (platform === "binance") {
      saveApiKey("binance_api_key", apiKeys.binance);
      saveApiKey("binance_api_secret", apiSecret);
      setKeysSaved(true);
      
      // Test the connection to Binance
      testBinanceConnectionHandler();
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

  return {
    apiKeys,
    setApiKeys,
    apiSecret,
    setApiSecret,
    keysSaved,
    connectedToBinance,
    handleSaveApiKey,
    testBinanceConnection: testBinanceConnectionHandler
  };
};
