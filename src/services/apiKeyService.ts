
/**
 * Service to handle API key operations
 */

// Save API key to localStorage
export const saveApiKey = (key: string, value: string): void => {
  localStorage.setItem(key, value);
};

// Get API key from localStorage
export const getApiKey = (key: string): string | null => {
  return localStorage.getItem(key);
};

// Test Binance connection with provided API key
export const testBinanceConnection = async (apiKey: string): Promise<boolean> => {
  try {
    const response = await fetch("https://api.binance.com/api/v3/ping", {
      method: "GET",
      headers: {
        "X-MBX-APIKEY": apiKey
      }
    });
    
    return response.ok;
  } catch (error) {
    console.error("Error testing Binance connection:", error);
    return false;
  }
};
