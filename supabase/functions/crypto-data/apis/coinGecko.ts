
/**
 * Fetches data from CoinGecko API
 */
export async function fetchFromCoinGecko(coinId: string, days: string, currency: string, apiKey?: string) {
  // Map coin IDs to CoinGecko format if needed
  const geckoId = mapToGeckoId(coinId);
  
  try {
    // Build base URL
    let pricesUrl = `https://api.coingecko.com/api/v3/coins/${geckoId}/market_chart?vs_currency=${currency}&days=${days}`;
    
    // Add API key if available for higher rate limits
    if (apiKey) {
      pricesUrl += `&x_cg_pro_api_key=${apiKey}`;
    }
    
    console.log(`Fetching from CoinGecko: ${pricesUrl}`);
    
    const pricesResponse = await fetch(pricesUrl);
    
    if (!pricesResponse.ok) {
      const errorText = await pricesResponse.text();
      console.error(`CoinGecko Market Chart API error: ${pricesResponse.status} - ${errorText}`);
      throw new Error(`CoinGecko API error: ${pricesResponse.status}`);
    }
    
    const pricesData = await pricesResponse.json();
    
    // Get additional metadata
    let infoUrl = `https://api.coingecko.com/api/v3/coins/${geckoId}?localization=false&tickers=false&community_data=false&developer_data=false`;
    
    // Add API key if available
    if (apiKey) {
      infoUrl += `&x_cg_pro_api_key=${apiKey}`;
    }
    
    const infoResponse = await fetch(infoUrl);
    
    if (!infoResponse.ok) {
      const errorText = await infoResponse.text();
      console.error(`CoinGecko Info API error: ${infoResponse.status} - ${errorText}`);
      throw new Error(`CoinGecko Info API error: ${infoResponse.status}`);
    }
    
    const coinInfo = await infoResponse.json();
    
    // Format data to match our expected structure
    return {
      prices: pricesData.prices,
      market_caps: pricesData.market_caps,
      total_volumes: pricesData.total_volumes,
      metadata: {
        name: coinInfo.name,
        symbol: coinInfo.symbol.toUpperCase(),
        current_price: coinInfo.market_data.current_price[currency],
        market_cap: coinInfo.market_data.market_cap[currency],
        volume_24h: coinInfo.market_data.total_volume[currency],
        percent_change_24h: coinInfo.market_data.price_change_percentage_24h,
        percent_change_7d: coinInfo.market_data.price_change_percentage_7d,
        last_updated: coinInfo.market_data.last_updated,
      },
    };
  } catch (error) {
    console.error("Detailed CoinGecko fetch error:", error);
    throw error;
  }
}

/**
 * Map coin IDs to CoinGecko format
 */
function mapToGeckoId(coinId: string): string {
  const mapping: Record<string, string> = {
    'bitcoin': 'bitcoin',
    'ethereum': 'ethereum',
    'binancecoin': 'binancecoin',
    'ripple': 'ripple',
    'cardano': 'cardano',
    'solana': 'solana',
  };
  
  return mapping[coinId] || coinId;
}
