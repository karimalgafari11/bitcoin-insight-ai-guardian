
import { useCallback } from "react";
import { useToast } from "@/components/ui/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";

/**
 * Hook for API key validation functions
 */
export const useApiKeyValidation = () => {
  const { t } = useLanguage();
  const { toast } = useToast();

  const validateApiKey = useCallback((platform: string, key: string, secret?: string) => {
    if (!key) {
      toast({
        title: t("خطأ", "Error"),
        description: t(
          "يرجى إدخال مفتاح API",
          "Please enter an API key"
        ),
        variant: "destructive",
      });
      return false;
    }

    if ((platform === "binance" || platform === "binance_testnet") && !secret) {
      toast({
        title: t("خطأ", "Error"),
        description: t(
          "يرجى إدخال مفتاح السري أيضاً",
          "Please enter the Secret key as well"
        ),
        variant: "destructive",
      });
      return false;
    }

    return true;
  }, [t, toast]);

  return { validateApiKey };
};
