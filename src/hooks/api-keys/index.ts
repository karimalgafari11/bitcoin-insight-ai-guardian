
import { useCallback } from "react";
import { useApiKeyStorage } from "./useApiKeyStorage";
import { useConnectionTesting } from "./useConnectionTesting";
import { useApiKeyValidation } from "./useApiKeyValidation";
import { useDefaultApiKeys } from "./useDefaultApiKeys";

/**
 * Main API keys hook that combines functionality from smaller hooks
 */
export const useApiKeys = () => {
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
    loadingStates,
    testBinanceConnection,
    testConnection
  } = useConnectionTesting(apiKeys);

  // Combined handler for saving API keys
  const handleSaveApiKey = useCallback((platform: string) => {
    // Validate the API key before saving
    if (!validateApiKey(platform, apiKeys[platform], platform === "binance" || platform === "binance_testnet" ? apiSecret : undefined)) {
      return;
    }

    // Save the API key
    const success = saveApiKeyToStorage(platform, apiKeys[platform], platform === "binance" || platform === "binance_testnet" ? apiSecret : undefined);
    
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
  }, [apiKeys, apiSecret, validateApiKey, saveApiKeyToStorage, testBinanceConnection, testConnection]);

  return {
    apiKeys,
    setApiKeys,
    apiSecret,
    setApiSecret,
    keysSaved,
    connectedToBinance,
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
