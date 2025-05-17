
import { API_KEYS } from '../apiKeys.ts';
import { MarketDataResponse } from '../types.ts';

export async function fetchFromBinance(symbol: string, currency: string): Promise<MarketDataResponse> {
  // Format the symbol for Binance API
  const binanceSymbol = `${symbol}${currency}T`;  // Note the 'T' suffix for most Binance pairs
  
  try {
    // Fetch ticker data from Binance
    const tickerResponse = await fetch(
      `https://api.binance.com/api/v3/ticker/24hr?symbol=${binanceSymbol}`,
      {
        headers: {
          'X-MBX-APIKEY': API_KEYS.BINANCE_API_KEY
        }
      }
    );
    
    if (!tickerResponse.ok) {
      // Try alternative symbol format (without T suffix)
      const alternativeSymbol = `${symbol}${currency}`;
      const retryResponse = await fetch(
        `https://api.binance.com/api/v3/ticker/24hr?symbol=${alternativeSymbol}`,
        {
          headers: {
            'X-MBX-APIKEY': API_KEYS.BINANCE_API_KEY
          }
        }
      );
      
      if (!retryResponse.ok) {
        throw new Error(`Binance API error: ${tickerResponse.status} - Unable to find matching symbol`);
      }
      
      const tickerData = await retryResponse.json();
      
      // Get current price using ticker price endpoint for more accuracy
      const priceResponse = await fetch(
        `https://api.binance.com/api/v3/ticker/price?symbol=${alternativeSymbol}`
      );
      
      if (!priceResponse.ok) {
        throw new Error(`Binance price API error: ${priceResponse.status}`);
      }
      
      const priceData = await priceResponse.json();
      
      // Format the response
      return {
        price: parseFloat(priceData.price),
        volume24h: parseFloat(tickerData.volume),
        change24h: parseFloat(tickerData.priceChangePercent),
        marketCap: parseFloat(tickerData.quoteVolume), // Using quote volume as a proxy
        lastUpdate: new Date().toISOString()
      };
    }
    
    const tickerData = await tickerResponse.json();
    
    // Get current price using ticker price endpoint for more accuracy
    const priceResponse = await fetch(
      `https://api.binance.com/api/v3/ticker/price?symbol=${binanceSymbol}`
    );
    
    if (!priceResponse.ok) {
      throw new Error(`Binance price API error: ${priceResponse.status}`);
    }
    
    const priceData = await priceResponse.json();
    
    // Format the response
    return {
      price: parseFloat(priceData.price),
      volume24h: parseFloat(tickerData.volume),
      change24h: parseFloat(tickerData.priceChangePercent),
      marketCap: parseFloat(tickerData.quoteVolume), // Using quote volume as a proxy
      lastUpdate: new Date().toISOString()
    };
  } catch (error) {
    throw new Error(`Binance fetch error: ${error instanceof Error ? error.message : String(error)}`);
  }
}

export async function fetchFromBinanceTestnet(symbol: string, currency: string): Promise<MarketDataResponse> {
  // Format the symbol for Binance Testnet API
  const binanceSymbol = `${symbol}${currency}T`;  // Note the 'T' suffix for most Binance pairs
  
  try {
    // Fetch ticker data from Binance Testnet
    const tickerResponse = await fetch(
      `https://testnet.binance.vision/api/v3/ticker/24hr?symbol=${binanceSymbol}`,
      {
        headers: {
          'X-MBX-APIKEY': API_KEYS.BINANCE_TESTNET_API_KEY
        }
      }
    );
    
    if (!tickerResponse.ok) {
      // Try alternative symbol format (without T suffix)
      const alternativeSymbol = `${symbol}${currency}`;
      const retryResponse = await fetch(
        `https://testnet.binance.vision/api/v3/ticker/24hr?symbol=${alternativeSymbol}`,
        {
          headers: {
            'X-MBX-APIKEY': API_KEYS.BINANCE_TESTNET_API_KEY
          }
        }
      );
      
      if (!retryResponse.ok) {
        throw new Error(`Binance Testnet API error: ${tickerResponse.status} - Unable to find matching symbol`);
      }
      
      const tickerData = await retryResponse.json();
      
      // Format the response
      return {
        price: parseFloat(tickerData.lastPrice),
        volume24h: parseFloat(tickerData.volume),
        change24h: parseFloat(tickerData.priceChangePercent),
        marketCap: parseFloat(tickerData.quoteVolume), // Using quote volume as a proxy
        lastUpdate: new Date().toISOString()
      };
    }
    
    const tickerData = await tickerResponse.json();
    
    // Format the response
    return {
      price: parseFloat(tickerData.lastPrice),
      volume24h: parseFloat(tickerData.volume),
      change24h: parseFloat(tickerData.priceChangePercent),
      marketCap: parseFloat(tickerData.quoteVolume), // Using quote volume as a proxy
      lastUpdate: new Date().toISOString()
    };
  } catch (error) {
    throw new Error(`Binance Testnet fetch error: ${error instanceof Error ? error.message : String(error)}`);
  }
}
