
/**
 * Generates mock cryptocurrency data for testing when API key is not available
 */
export function generateMockData(coinId: string, days: string, currency: string) {
  const now = Date.now();
  const prices: [number, number][] = [];
  const market_caps: [number, number][] = [];
  const total_volumes: [number, number][] = [];
  
  // Generate base price based on coin type
  const basePrice = getBasePriceForCoin(coinId);
  
  // Number of data points based on days
  let dataPoints = 0;
  switch (days) {
    case "1": dataPoints = 24; break;  // hourly for 1 day
    case "7": dataPoints = 42; break;  // 4-hour intervals for 7 days
    case "30": dataPoints = 30; break; // daily for 30 days
    case "90": dataPoints = 90; break; // daily for 90 days
    default: dataPoints = 30;
  }
  
  // Generate mock historical data with some volatility
  for (let i = 0; i < dataPoints; i++) {
    // Create a timestamp with appropriate intervals
    const timestamp = now - ((dataPoints - i) * (days === "1" ? 3600000 : 86400000 / (days === "7" ? 6 : 1)));
    
    // Generate price with some randomness to simulate market volatility
    const volatility = 0.02; // 2% volatility
    const randomChange = 1 + (Math.random() * volatility * 2 - volatility);
    const trendFactor = 1 + ((i / dataPoints) * 0.1 - 0.05); // Small uptrend or downtrend
    
    const price = basePrice * randomChange * trendFactor;
    prices.push([timestamp, price]);
    
    // Generate related market cap and volume data
    const marketCap = price * getMarketCapMultiplier(coinId);
    const volume = price * getVolumeMultiplier(coinId) * (0.8 + Math.random() * 0.4);
    
    market_caps.push([timestamp, marketCap]);
    total_volumes.push([timestamp, volume]);
  }
  
  // Add metadata for current price info
  const currentPrice = prices[prices.length - 1][1];
  const firstPrice = prices[0][1];
  const percentChange24h = ((currentPrice - firstPrice) / firstPrice) * 100;
  
  return {
    prices,
    market_caps,
    total_volumes,
    metadata: {
      name: getCoinName(coinId),
      symbol: coinId.toUpperCase(),
      current_price: currentPrice,
      market_cap: market_caps[market_caps.length - 1][1],
      volume_24h: total_volumes[total_volumes.length - 1][1],
      percent_change_24h: percentChange24h,
      percent_change_7d: percentChange24h * 1.2, // Simulate 7d change
      last_updated: new Date().toISOString()
    }
  };
}

/**
 * Gets a realistic base price for a given coin
 */
function getBasePriceForCoin(coinId: string): number {
  switch (coinId.toLowerCase()) {
    case 'bitcoin': return 29500 + (Math.random() * 2000 - 1000);
    case 'ethereum': return 1750 + (Math.random() * 150 - 75);
    case 'binancecoin': return 210 + (Math.random() * 20 - 10);
    case 'ripple': return 0.50 + (Math.random() * 0.1 - 0.05);
    case 'cardano': return 0.30 + (Math.random() * 0.04 - 0.02);
    case 'solana': return 95 + (Math.random() * 10 - 5);
    default: return 100 + (Math.random() * 20 - 10);
  }
}

/**
 * Gets a realistic market cap multiplier for a given coin
 */
function getMarketCapMultiplier(coinId: string): number {
  switch (coinId.toLowerCase()) {
    case 'bitcoin': return 19000000;
    case 'ethereum': return 120000000;
    case 'binancecoin': return 153000000;
    case 'ripple': return 45000000000;
    case 'cardano': return 35000000000;
    case 'solana': return 40000000;
    default: return 10000000;
  }
}

/**
 * Gets a realistic trading volume multiplier for a given coin
 */
function getVolumeMultiplier(coinId: string): number {
  switch (coinId.toLowerCase()) {
    case 'bitcoin': return 35000;
    case 'ethereum': return 15000;
    case 'binancecoin': return 5000;
    case 'ripple': return 10000000;
    case 'cardano': return 20000000;
    case 'solana': return 8000;
    default: return 5000;
  }
}

/**
 * Gets the full name of a coin
 */
function getCoinName(coinId: string): string {
  switch (coinId.toLowerCase()) {
    case 'bitcoin': return 'Bitcoin';
    case 'ethereum': return 'Ethereum';
    case 'binancecoin': return 'Binance Coin';
    case 'ripple': return 'XRP';
    case 'cardano': return 'Cardano';
    case 'solana': return 'Solana';
    default: return coinId.charAt(0).toUpperCase() + coinId.slice(1);
  }
}
