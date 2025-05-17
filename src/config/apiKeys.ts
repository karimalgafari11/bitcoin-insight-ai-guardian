
/**
 * Central configuration file for API keys
 * Note: For security, these are only publishable API keys
 */

export const API_KEYS = {
  // Binance API keys
  BINANCE_API_KEY: 'khxTWPTHtCMIa9JLD3PtZel206oXBvgiy8GWztOBJYmqFKk5XXuYnpjwQDXioCB3',
  BINANCE_SECRET_KEY: 'N1u5JTcJZBQlGOVkkLSDfxwTi6pehQbjt9L6LvnxDuLEA30ChKuTwkeHmaUmgPui',
  
  // Binance Testnet keys
  BINANCE_TESTNET_API_KEY: 'JzIaVypgJMlr0oKbFdlMbM2TXaG9QX4kmWZB6n3kKHlVDwzdiZAOybDjXZ5mA3kc',
  BINANCE_TESTNET_SECRET_KEY: 'zu7tJoMfYskquLrPDRj8RbDYnj3hc7aTFHixiUGbX1zoYIcvzNbrNg79R5KjUkNM',
  
  // CoinAPI key
  COINAPI_KEY: '52d3f36d-bdb3-4653-86c3-08284eeeed63',
  
  // CoinDesk API key
  COINDESK_KEY: 'a1767cfd2957079cad70abd9850f473d0d033e55851bfe550c15b74bd83d8eaf',
  
  // CryptoCompare API key
  CRYPTOCOMPARE_KEY: 'd1b2f3e4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0',
  
  // LiveCoinWatch API key
  LIVECOINWATCH_KEY: '5a7b8c9d0e1f2g3h4i5j6k7l8m9n0o1p2'
};

/**
 * Get API key by service name
 */
export function getApiKey(service: 'binance_api' | 'binance_secret' | 'binance_testnet_api' | 
                          'binance_testnet_secret' | 'coinapi' | 'coindesk' | 
                          'cryptocompare' | 'livecoinwatch'): string {
  switch (service) {
    case 'binance_api':
      return API_KEYS.BINANCE_API_KEY;
    case 'binance_secret':
      return API_KEYS.BINANCE_SECRET_KEY;
    case 'binance_testnet_api':
      return API_KEYS.BINANCE_TESTNET_API_KEY;
    case 'binance_testnet_secret':
      return API_KEYS.BINANCE_TESTNET_SECRET_KEY;
    case 'coinapi':
      return API_KEYS.COINAPI_KEY;
    case 'coindesk':
      return API_KEYS.COINDESK_KEY;
    case 'cryptocompare':
      return API_KEYS.CRYPTOCOMPARE_KEY;
    case 'livecoinwatch':
      return API_KEYS.LIVECOINWATCH_KEY;
    default:
      return '';
  }
}
