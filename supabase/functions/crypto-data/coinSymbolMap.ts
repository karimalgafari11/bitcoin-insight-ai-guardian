
// Map our internal coin IDs to CoinMarketCap symbols
export const coinSymbolMap: Record<string, string> = {
  'bitcoin': 'BTC',
  'ethereum': 'ETH',
  'binancecoin': 'BNB',
  'ripple': 'XRP',
  'cardano': 'ADA',
  'solana': 'SOL',
};

// Map days parameter to interval for API
export const intervalMap: Record<string, string> = {
  '1': '1h',  // 1 day = hourly data
  '7': '4h',  // 7 days = 4 hour intervals
  '30': '1d', // 30 days = daily data
  '90': '1d', // 90 days = daily data
};
