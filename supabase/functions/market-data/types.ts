
// Type definitions for market data responses

export interface MarketDataResponse {
  price: number;
  volume24h: number;
  change24h: number;
  marketCap: number;
  lastUpdate: string;
  error?: string;
}

export type DataSource = 'binance' | 'binance_testnet' | 'coinapi' | 
                        'coindesk' | 'cryptocompare' | 'livecoinwatch' | 'all';

export interface SourceConfig {
  name: DataSource;
  fetchFunction: (symbol: string, currency: string) => Promise<MarketDataResponse>;
  supportedSymbols?: string[];
}
