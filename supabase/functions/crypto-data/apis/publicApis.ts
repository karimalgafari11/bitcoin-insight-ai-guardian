
/**
 * Fetch from available public APIs as fallback
 */
export async function fetchFromPublicApi(coinId: string, days: string, currency: string) {
  // Try another public API endpoint (example)
  const publicApiUrl = `https://api.coincap.io/v2/assets/${coinId}/history?interval=h1&start=${getStartTime(days)}&end=${Date.now()}`;
  
  console.log(`Fetching from public API: ${publicApiUrl}`);
  
  const response = await fetch(publicApiUrl);
  
  if (!response.ok) {
    throw new Error(`Public API error: ${response.status}`);
  }
  
  const data = await response.json();
  
  // Get current price data
  const currentDataUrl = `https://api.coincap.io/v2/assets/${coinId}`;
  const currentResponse = await fetch(currentDataUrl);
  
  if (!currentResponse.ok) {
    throw new Error(`Public API current data error: ${currentResponse.status}`);
  }
  
  const currentData = await currentResponse.json();
  
  // Convert the data format to match our expected structure
  const prices: [number, number][] = data.data.map((item: any) => [
    parseInt(item.time),
    parseFloat(item.priceUsd)
  ]);
  
  // Create simplified market caps and volumes (if no data available)
  const market_caps: [number, number][] = prices.map(([time, price]) => [
    time,
    parseFloat(currentData.data.marketCapUsd) * (price / parseFloat(currentData.data.priceUsd))
  ]);
  
  const total_volumes: [number, number][] = prices.map(([time]) => [
    time,
    parseFloat(currentData.data.volumeUsd24Hr) / 24
  ]);
  
  return {
    prices,
    market_caps,
    total_volumes,
    metadata: {
      name: currentData.data.name,
      symbol: currentData.data.symbol,
      current_price: parseFloat(currentData.data.priceUsd),
      market_cap: parseFloat(currentData.data.marketCapUsd),
      volume_24h: parseFloat(currentData.data.volumeUsd24Hr),
      percent_change_24h: parseFloat(currentData.data.changePercent24Hr),
      percent_change_7d: 0, // Not available from this API
      last_updated: new Date().toISOString(),
    },
  };
}

/**
 * Calculate start time based on days
 */
function getStartTime(days: string): number {
  const now = Date.now();
  const daysInMs = parseInt(days) * 24 * 60 * 60 * 1000;
  return now - daysInMs;
}
