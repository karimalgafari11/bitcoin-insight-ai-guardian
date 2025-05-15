
export interface CryptoMarketData {
  prices: [number, number][];
  market_caps: [number, number][];
  total_volumes: [number, number][];
  metadata?: {
    name: string;
    symbol: string;
    current_price: number;
    market_cap: number;
    volume_24h: number;
    percent_change_24h: number;
    percent_change_7d: number;
    last_updated: string;
  };
  isRealtime?: boolean;
  isMockData?: boolean;
  dataSource?: string;
  fromCache?: boolean;
  fetchedAt?: string;
  cacheTime?: string;
}

export interface UseCryptoDataResult {
  data: CryptoMarketData | null;
  loading: boolean;
  error: string | null;
  refreshData: () => void;
  isRealtime: boolean;
  dataSource: string;
  lastUpdated: string | null;
  lastRefresh: Date;
}
