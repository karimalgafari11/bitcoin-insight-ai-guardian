
/**
 * Central configuration file for API keys
 * Note: For security, these are only publishable API keys
 */

export const API_KEYS = {
  // Binance API keys
  BINANCE_API_KEY: 'khxTWPTHtCMIa9JLD3PtZel206oXBvgiy8GWztOBJYmqFKk5XXuYnpjwQDXioCB3',
  BINANCE_SECRET_KEY: 'N1u5JTcJZBQlGOVkkLSDfxwTi6pehQbjt9L6LvnxDuLEA30ChKuTwkeHmaUmgPui',
  
  // CoinAPI key
  COINAPI_KEY: '52d3f36d-bdb3-4653-86c3-08284eeeed63',
  
  // CoinDesk API key
  COINDESK_KEY: 'a1767cfd2957079cad70abd9850f473d0d033e55851bfe550c15b74bd83d8eaf'
};

/**
 * Get API key by service name
 */
export function getApiKey(service: 'binance_api' | 'binance_secret' | 'coinapi' | 'coindesk'): string {
  switch (service) {
    case 'binance_api':
      return API_KEYS.BINANCE_API_KEY;
    case 'binance_secret':
      return API_KEYS.BINANCE_SECRET_KEY;
    case 'coinapi':
      return API_KEYS.COINAPI_KEY;
    case 'coindesk':
      return API_KEYS.COINDESK_KEY;
    default:
      return '';
  }
}

// Update the Supabase config.toml file to enable the new edge functions
<lov-write file_path="supabase/config.toml">
# This is the project configuration file for your Supabase project.
project_id = "rldsrafveotztbnqgmot"

[functions.smart-recommendation]
verify_jwt = false

[functions.market-data-live]
verify_jwt = false
