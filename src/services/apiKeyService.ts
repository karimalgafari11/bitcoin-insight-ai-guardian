
/**
 * Service to handle API key operations
 */

// Save API key to localStorage
export const saveApiKey = (key: string, value: string): void => {
  if (!key || !value) {
    console.error("Cannot save empty key or value");
    return;
  }
  try {
    localStorage.setItem(key, value);
    console.log(`API key ${key} saved successfully`);
  } catch (error) {
    console.error("Error saving API key:", error);
    throw new Error(`Failed to save API key: ${error}`);
  }
};

// Get API key from localStorage
export const getApiKey = (key: string): string | null => {
  try {
    return localStorage.getItem(key);
  } catch (error) {
    console.error("Error getting API key:", error);
    return null;
  }
};

// Test Binance connection with provided API key
export const testBinanceConnection = async (apiKey: string): Promise<boolean> => {
  try {
    if (!apiKey) {
      console.error("Cannot test connection with empty API key");
      return false;
    }
    
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

// Test connection for other API platforms
export const testApiConnection = async (platform: string, apiKey: string): Promise<boolean> => {
  try {
    if (!apiKey) {
      console.error(`Cannot test connection for ${platform} with empty API key`);
      return false;
    }
    
    let endpoint = "";
    let headers: Record<string, string> = {};
    let method: string = "GET";
    let body: string | undefined = undefined;
    
    switch (platform) {
      case "binance_testnet":
        endpoint = "https://testnet.binance.vision/api/v3/ping";
        headers = { "X-MBX-APIKEY": apiKey };
        break;
        
      case "coinapi":
        endpoint = "https://rest.coinapi.io/v1/exchanges";
        headers = { "X-CoinAPI-Key": apiKey };
        break;
        
      case "coindesk":
        // CoinDesk doesn't require API key for their public price endpoint
        endpoint = "https://api.coindesk.com/v1/bpi/currentprice.json";
        break;
        
      case "cryptocompare":
        endpoint = "https://min-api.cryptocompare.com/data/price?fsym=BTC&tsyms=USD";
        headers = { "authorization": `Apikey ${apiKey}` };
        break;
        
      case "livecoinwatch":
        endpoint = "https://api.livecoinwatch.com/status";
        headers = { 
          "content-type": "application/json",
          "x-api-key": apiKey 
        };
        method = "POST";
        body = JSON.stringify({});
        break;
        
      default:
        console.warn(`No endpoint configured for platform: ${platform}`);
        return false;
    }
    
    // Make the test request
    const response = await fetch(endpoint, {
      method,
      headers,
      body
    });
    
    return response.ok;
  } catch (error) {
    console.error(`Error testing ${platform} connection:`, error);
    return false;
  }
};
