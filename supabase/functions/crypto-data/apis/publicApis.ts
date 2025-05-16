
/**
 * Public API integrations for cryptocurrency data
 */

/**
 * Fetches cryptocurrency data from various public APIs
 */
export async function fetchFromPublicApis(coinId: string, days: string, currency: string) {
  console.log(`Fetching from public APIs: ${coinId}, days: ${days}, currency: ${currency}`);
  
  // Try CoinCap API which doesn't require an API key
  try {
    return await fetchFromCoinCap(coinId, days, currency);
  } catch (error) {
    console.error("CoinCap API error:", error);
  }
  
  // No successful public API fetch
  throw new Error("All public API fetches failed");
}

/**
 * Fetch from CoinCap API (doesn't require API key)
 */
async function fetchFromCoinCap(coinId: string, days: string, currency: string) {
  // Map common coinIds to CoinCap IDs
  const coinCapId = mapCoinIdToCoinCap(coinId);
  
  // Calculate time range
  const endTime = Date.now();
  const startTime = endTime - (parseInt(days) * 24 * 60 * 60 * 1000);
  
  // Determine interval based on days requested
  const interval = parseInt(days) <= 1 ? 'm5' : 
                  parseInt(days) <= 7 ? 'h1' : 
                  parseInt(days) <= 30 ? 'h6' : 'd1';
  
  const historyUrl = `https://api.coincap.io/v2/assets/${coinCapId}/history?interval=${interval}&start=${startTime}&end=${endTime}`;
  const currentUrl = `https://api.coincap.io/v2/assets/${coinCapId}`;
  
  console.log(`Fetching CoinCap history: ${historyUrl}`);
  console.log(`Fetching CoinCap current: ${currentUrl}`);
  
  // Fetch both history and current data in parallel
  const [historyResponse, currentResponse] = await Promise.all([
    fetch(historyUrl),
    fetch(currentUrl)
  ]);
  
  if (!historyResponse.ok) {
    throw new Error(`CoinCap history API error: ${historyResponse.status}`);
  }
  
  if (!currentResponse.ok) {
    throw new Error(`CoinCap current API error: ${currentResponse.status}`);
  }
  
  const historyData = await historyResponse.json();
  const currentData = await currentResponse.json();
  
  if (!historyData.data || !currentData.data) {
    throw new Error("Invalid data format from CoinCap API");
  }
  
  // Map the data to our expected format
  const prices: [number, number][] = historyData.data.map((item: any) => [
    parseInt(item.time),
    parseFloat(item.priceUsd)
  ]);
  
  // Create market caps from price data if needed
  const market_caps: [number, number][] = historyData.data.map((item: any) => [
    parseInt(item.time),
    parseFloat(item.priceUsd) * parseFloat(currentData.data.supply || "0")
  ]);
  
  // Create volume data
  const total_volumes: [number, number][] = historyData.data.map((item: any) => [
    parseInt(item.time),
    // For intervals smaller than a day, scale down the 24h volume
    parseFloat(currentData.data.volumeUsd24Hr || "0") / 
    (interval === 'm5' ? 288 : interval === 'h1' ? 24 : interval === 'h6' ? 4 : 1)
  ]);
  
  return {
    prices,
    market_caps,
    total_volumes,
    metadata: {
      name: currentData.data.name,
      symbol: currentData.data.symbol,
      current_price: parseFloat(currentData.data.priceUsd),
      market_cap: parseFloat(currentData.data.marketCapUsd || "0"),
      volume_24h: parseFloat(currentData.data.volumeUsd24Hr || "0"),
      percent_change_24h: parseFloat(currentData.data.changePercent24Hr || "0"),
      percent_change_7d: 0, // Not available directly from CoinCap
      last_updated: new Date().toISOString(),
    },
    dataSource: "coincap"
  };
}

/**
 * Map standard coin IDs to CoinCap format
 */
function mapCoinIdToCoinCap(coinId: string): string {
  const mapping: Record<string, string> = {
    'bitcoin': 'bitcoin',
    'ethereum': 'ethereum',
    'ripple': 'xrp',
    'litecoin': 'litecoin',
    'bitcoin-cash': 'bitcoin-cash',
    'cardano': 'cardano',
    'polkadot': 'polkadot',
    'binance-coin': 'binance-coin',
    'solana': 'solana',
    'dogecoin': 'dogecoin',
  };
  
  return mapping[coinId.toLowerCase()] || coinId.toLowerCase();
}
