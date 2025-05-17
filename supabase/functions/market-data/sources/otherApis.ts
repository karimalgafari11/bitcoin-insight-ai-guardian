
import { API_KEYS } from '../apiKeys.ts';
import { MarketDataResponse } from '../types.ts';

export async function fetchFromCoinAPI(symbol: string, currency: string): Promise<MarketDataResponse> {
  try {
    // Format the symbol for CoinAPI
    const coinApiSymbol = `${symbol}/${currency}`;
    
    // Fetch data from CoinAPI
    const response = await fetch(
      `https://rest.coinapi.io/v1/exchangerate/${symbol}/${currency}`,
      {
        headers: {
          'X-CoinAPI-Key': API_KEYS.COINAPI_KEY
        }
      }
    );
    
    if (!response.ok) {
      throw new Error(`CoinAPI error: ${response.status}`);
    }
    
    const data = await response.json();
    
    // Format the response - note that CoinAPI doesn't provide all metrics in this endpoint
    return {
      price: data.rate,
      volume24h: 0, // Not available in this basic endpoint
      change24h: 0, // Not available in this basic endpoint
      marketCap: 0, // Not available in this basic endpoint
      lastUpdate: data.time || new Date().toISOString()
    };
  } catch (error) {
    throw new Error(`CoinAPI fetch error: ${error instanceof Error ? error.message : String(error)}`);
  }
}

export async function fetchFromCoinDesk(symbol: string, currency: string): Promise<MarketDataResponse> {
  try {
    // CoinDesk primarily supports BTC/USD
    if (symbol.toUpperCase() !== 'BTC') {
      throw new Error("CoinDesk API only supports BTC");
    }
    
    // Fetch data from CoinDesk
    const response = await fetch('https://api.coindesk.com/v1/bpi/currentprice.json');
    
    if (!response.ok) {
      throw new Error(`CoinDesk API error: ${response.status}`);
    }
    
    const data = await response.json();
    
    // Get price for requested currency
    const currencyData = data.bpi[currency.toUpperCase()];
    if (!currencyData) {
      throw new Error(`CoinDesk API doesn't support ${currency}`);
    }
    
    // Format the response - note that CoinDesk doesn't provide all metrics
    return {
      price: parseFloat(currencyData.rate.replace(',', '')),
      volume24h: 0, // Not available in CoinDesk API
      change24h: 0, // Not available in CoinDesk API
      marketCap: 0, // Not available in CoinDesk API
      lastUpdate: data.time.updatedISO
    };
  } catch (error) {
    throw new Error(`CoinDesk fetch error: ${error instanceof Error ? error.message : String(error)}`);
  }
}

export async function fetchFromCryptoCompare(symbol: string, currency: string): Promise<MarketDataResponse> {
  try {
    // Fetch price data
    const priceResponse = await fetch(
      `https://min-api.cryptocompare.com/data/price?fsym=${symbol}&tsyms=${currency}&api_key=${API_KEYS.CRYPTOCOMPARE_KEY}`
    );
    
    if (!priceResponse.ok) {
      throw new Error(`CryptoCompare price API error: ${priceResponse.status}`);
    }
    
    const priceData = await priceResponse.json();
    
    // Fetch additional data
    const dailyResponse = await fetch(
      `https://min-api.cryptocompare.com/data/v2/histoday?fsym=${symbol}&tsym=${currency}&limit=1&api_key=${API_KEYS.CRYPTOCOMPARE_KEY}`
    );
    
    if (!dailyResponse.ok) {
      throw new Error(`CryptoCompare daily API error: ${dailyResponse.status}`);
    }
    
    const dailyData = await dailyResponse.json();
    let dailyStats = { volume24h: 0, change24h: 0 };
    
    if (dailyData.Response === "Success" && dailyData.Data.Data.length >= 2) {
      const todayData = dailyData.Data.Data[1];
      const yesterdayData = dailyData.Data.Data[0];
      
      dailyStats = {
        volume24h: todayData.volumeto,
        change24h: ((todayData.close - yesterdayData.close) / yesterdayData.close) * 100
      };
    }
    
    // Format the response
    return {
      price: priceData[currency],
      volume24h: dailyStats.volume24h,
      change24h: dailyStats.change24h,
      marketCap: 0, // Not easily available in this endpoint
      lastUpdate: new Date().toISOString()
    };
  } catch (error) {
    throw new Error(`CryptoCompare fetch error: ${error instanceof Error ? error.message : String(error)}`);
  }
}

export async function fetchFromLiveCoinWatch(symbol: string, currency: string): Promise<MarketDataResponse> {
  try {
    // Fetch data from LiveCoinWatch
    const response = await fetch(
      "https://api.livecoinwatch.com/coins/single",
      {
        method: "POST",
        headers: {
          "content-type": "application/json",
          "x-api-key": API_KEYS.LIVECOINWATCH_KEY
        },
        body: JSON.stringify({
          currency: currency,
          code: symbol,
          meta: true
        })
      }
    );
    
    if (!response.ok) {
      throw new Error(`LiveCoinWatch API error: ${response.status}`);
    }
    
    const data = await response.json();
    
    // Format the response
    return {
      price: data.rate,
      volume24h: data.volume,
      change24h: data.delta?.day ? data.delta.day * 100 : 0,
      marketCap: data.cap || 0,
      lastUpdate: new Date().toISOString()
    };
  } catch (error) {
    throw new Error(`LiveCoinWatch fetch error: ${error instanceof Error ? error.message : String(error)}`);
  }
}
