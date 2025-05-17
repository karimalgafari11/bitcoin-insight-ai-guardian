
import { MarketDataResponse, DataSource, SourceConfig } from './types.ts';
import { fetchFromBinance, fetchFromBinanceTestnet } from './sources/binance.ts';
import { fetchFromCoinAPI, fetchFromCoinDesk, fetchFromCryptoCompare, fetchFromLiveCoinWatch } from './sources/otherApis.ts';
import { errorResponse, successResponse } from './utils.ts';

// Map of data sources to their fetching functions
const dataSources: Record<string, SourceConfig> = {
  'binance': {
    name: 'binance',
    fetchFunction: fetchFromBinance
  },
  'binance_testnet': {
    name: 'binance_testnet',
    fetchFunction: fetchFromBinanceTestnet
  },
  'coinapi': {
    name: 'coinapi',
    fetchFunction: fetchFromCoinAPI
  },
  'coindesk': {
    name: 'coindesk',
    fetchFunction: fetchFromCoinDesk,
    supportedSymbols: ['BTC']
  },
  'cryptocompare': {
    name: 'cryptocompare',
    fetchFunction: fetchFromCryptoCompare
  },
  'livecoinwatch': {
    name: 'livecoinwatch',
    fetchFunction: fetchFromLiveCoinWatch
  }
};

// Controller function to fetch data from a specific source
export async function fetchMarketData(
  symbol: string, 
  currency: string, 
  source: string
): Promise<Response> {
  try {
    // If source is 'all', try all sources in sequence
    if (source === 'all') {
      return await tryAllSources(symbol, currency);
    }
    
    // Check if the source is supported
    const dataSource = dataSources[source];
    if (!dataSource) {
      return errorResponse(`Unknown data source: ${source}`, 400);
    }
    
    // Check if the source supports the requested symbol
    if (dataSource.supportedSymbols && 
        !dataSource.supportedSymbols.includes(symbol.toUpperCase())) {
      return errorResponse(
        `${source} only supports the following symbols: ${dataSource.supportedSymbols.join(', ')}`,
        400
      );
    }
    
    // Fetch data from the specified source
    const marketData = await dataSource.fetchFunction(symbol, currency);
    
    // Return the data
    return successResponse({
      ...marketData,
      source: source,
      isLive: true
    });
  } catch (error) {
    return errorResponse(error instanceof Error ? error.message : String(error));
  }
}

// Try all sources in sequence until one succeeds
async function tryAllSources(symbol: string, currency: string): Promise<Response> {
  // Order of sources to try, prioritizing more reliable ones
  const sourcesToTry: DataSource[] = [
    'binance', 
    'coinapi', 
    'cryptocompare', 
    'livecoinwatch'
  ];
  
  // Add coindesk only for BTC
  if (symbol.toUpperCase() === 'BTC') {
    sourcesToTry.splice(2, 0, 'coindesk');
  }
  
  // Try each source in sequence
  let lastError = null;
  
  for (const source of sourcesToTry) {
    try {
      const dataSource = dataSources[source];
      
      if (!dataSource) continue;
      
      // Skip if source has symbol restrictions and doesn't support this symbol
      if (dataSource.supportedSymbols && 
          !dataSource.supportedSymbols.includes(symbol.toUpperCase())) {
        continue;
      }
      
      const marketData = await dataSource.fetchFunction(symbol, currency);
      
      return successResponse({
        ...marketData,
        source,
        isLive: true
      });
    } catch (error) {
      console.error(`Error from ${source}:`, error);
      lastError = error;
      // Continue to next source on failure
    }
  }
  
  // If all sources failed, return error
  return errorResponse(lastError instanceof Error ? 
    `All data sources failed: ${lastError.message}` : 
    "All data sources failed"
  );
}
