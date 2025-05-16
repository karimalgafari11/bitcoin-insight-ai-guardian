
/**
 * Generates mock cryptocurrency data for testing and fallback purposes
 * With improved consistency and stability to prevent UI flickering
 */
export function generateMockData(coinId: string, days: string, currency: string) {
  console.log(`Generating mock data for ${coinId}, days: ${days}, currency: ${currency}`);
  
  const currentTime = Date.now();
  const daysMs = parseInt(days) * 24 * 60 * 60 * 1000;
  const startTime = currentTime - daysMs;
  
  // Generate prices with some realistic volatility
  const prices: [number, number][] = [];
  const volumes: [number, number][] = [];
  const marketCaps: [number, number][] = [];
  
  // Base price varies by coin - consistent base values
  let basePrice = 0;
  switch (coinId.toLowerCase()) {
    case 'bitcoin':
      basePrice = 50000;
      break;
    case 'ethereum':
      basePrice = 2500;
      break;
    case 'solana':
      basePrice = 100;
      break;
    case 'cardano':
      basePrice = 0.5;
      break;
    default:
      basePrice = 100;
  }
  
  // Number of data points - approximately 1 per hour for the requested days
  // But set reasonable limits to avoid performance issues
  const hoursPerDay = 24;
  const requestedDataPoints = parseInt(days) * hoursPerDay;
  
  // Fixed maximum data points to ensure consistent performance
  const maxDataPoints = Math.min(500, requestedDataPoints);
  const dataPoints = Math.max(24, maxDataPoints); // At least 24 data points
  const timeStep = daysMs / dataPoints;
  
  // Use a consistent seed based on coinId, days, and current day
  // This ensures mock data remains relatively stable during a user session
  // but can change day-to-day for variety
  const currentDay = Math.floor(currentTime / (24 * 60 * 60 * 1000));
  const seed = coinId + days + currency + currentDay.toString();
  const seedNum = Array.from(seed).reduce((acc, char) => acc + char.charCodeAt(0), 0);
  
  // Simple seeded random function with improved consistency
  let seedValue = seedNum;
  const seededRandom = () => {
    seedValue = (seedValue * 9301 + 49297) % 233280;
    return seedValue / 233280;
  };
  
  // Starting values
  let currentPrice = basePrice;
  let currentVolume = basePrice * 10000;
  let currentMarketCap = basePrice * 1000000;
  
  // Create the data points with more consistent random fluctuations
  for (let i = 0; i < dataPoints; i++) {
    const timestamp = startTime + i * timeStep;
    
    // Use smaller price changes to reduce volatility
    const priceChange = (seededRandom() - 0.5) * 0.01 * currentPrice;
    currentPrice += priceChange;
    
    // Ensure price stays within reasonable bounds
    currentPrice = Math.max(currentPrice, basePrice * 0.85);
    currentPrice = Math.min(currentPrice, basePrice * 1.15);
    
    // Volume fluctuates with more consistency
    const volumeChange = (seededRandom() - 0.5) * 0.05 * currentVolume;
    currentVolume += volumeChange;
    currentVolume = Math.max(currentVolume, basePrice * 8000);
    currentVolume = Math.min(currentVolume, basePrice * 12000);
    
    // Market cap follows price but with less volatility
    const marketCapChange = priceChange * 800000 + (seededRandom() - 0.5) * 0.002 * currentMarketCap;
    currentMarketCap += marketCapChange;
    currentMarketCap = Math.max(currentMarketCap, basePrice * 800000);
    currentMarketCap = Math.min(currentMarketCap, basePrice * 1200000);
    
    prices.push([timestamp, currentPrice]);
    volumes.push([timestamp, currentVolume]);
    marketCaps.push([timestamp, currentMarketCap]);
  }
  
  // Calculate a 24h change percentage
  const lastPrice = prices[prices.length - 1][1];
  const dayAgoIndex = Math.max(0, prices.length - hoursPerDay);
  const dayAgoPrice = prices[dayAgoIndex][1];
  const percentChange24h = ((lastPrice - dayAgoPrice) / dayAgoPrice) * 100;
  
  // Build the response object with consistent metadata
  return {
    id: coinId,
    symbol: coinId.substring(0, 3).toUpperCase(),
    name: coinId.charAt(0).toUpperCase() + coinId.slice(1),
    prices,
    market_caps: marketCaps,
    total_volumes: volumes,
    metadata: {
      current_price: lastPrice,
      market_cap: marketCaps[marketCaps.length - 1][1],
      total_volume: volumes[volumes.length - 1][1],
      volume_24h: volumes[volumes.length - 1][1],
      percent_change_24h: percentChange24h,
      percent_change_7d: ((lastPrice - prices[0][1]) / prices[0][1]) * 100,
      last_updated: new Date().toISOString(),
    },
    isMockData: true,
    dataSource: "mock-stable",
    fetchedAt: new Date().toISOString()
  };
}
