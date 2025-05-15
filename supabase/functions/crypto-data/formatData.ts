
/**
 * Formats historical data to match the CryptoMarketData interface
 */
export function formatHistoricalData(historicalData: any, quoteData: any, currency: string) {
  // Process historical quotes data from CMC to match our expected format
  if (!historicalData.data || 
      !historicalData.data.quotes || 
      historicalData.data.quotes.length === 0) {
    console.error("Invalid historical data format received");
    return {
      prices: [],
      market_caps: [],
      total_volumes: [],
    };
  }
  
  const quotes = historicalData.data.quotes;
  
  // Sort by timestamp ascending
  quotes.sort((a: any, b: any) => {
    return new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime();
  });
  
  const prices: [number, number][] = [];
  const market_caps: [number, number][] = [];
  const total_volumes: [number, number][] = [];
  
  quotes.forEach((quote: any) => {
    const timestamp = new Date(quote.timestamp).getTime();
    const quoteData = quote.quote[currency.toUpperCase()];
    
    if (quoteData) {
      prices.push([timestamp, quoteData.close]);
      if (quoteData.market_cap) {
        market_caps.push([timestamp, quoteData.market_cap]);
      }
      if (quoteData.volume) {
        total_volumes.push([timestamp, quoteData.volume]);
      }
    }
  });
  
  const formattedData = {
    prices,
    market_caps,
    total_volumes,
  };
  
  // Add current price from quotes endpoint to ensure we have the latest price
  addCurrentPriceData(formattedData, quoteData, currency);
  
  console.log("Successfully processed CoinMarketCap data");
  
  return formattedData;
}

/**
 * Adds current price data from the quotes endpoint to the formatted data
 */
function addCurrentPriceData(formattedData: any, quoteData: any, currency: string) {
  // Get symbol from quote data
  const symbol = Object.keys(quoteData.data)[0];
  
  if (quoteData.data && 
      quoteData.data[symbol] && 
      quoteData.data[symbol][0] && 
      quoteData.data[symbol][0].quote && 
      quoteData.data[symbol][0].quote[currency.toUpperCase()]) {
    
    const latestQuote = quoteData.data[symbol][0].quote[currency.toUpperCase()];
    const now = Date.now();
    
    // Add current price to the prices array if we have historical data
    if (formattedData.prices.length > 0) {
      formattedData.prices.push([now, latestQuote.price]);
    }
    
    // Add metadata to response
    formattedData.metadata = {
      name: quoteData.data[symbol][0].name,
      symbol: symbol,
      current_price: latestQuote.price,
      market_cap: latestQuote.market_cap,
      volume_24h: latestQuote.volume_24h,
      percent_change_24h: latestQuote.percent_change_24h,
      percent_change_7d: latestQuote.percent_change_7d,
      last_updated: latestQuote.last_updated,
    };
  }
}
