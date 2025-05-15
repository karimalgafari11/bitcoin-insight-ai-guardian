
export interface PriceRange {
  min: number;
  max: number;
}

export interface MarketCapRange {
  min: number;
  max: number;
}

export interface CryptoFilterOptions {
  priceRange: PriceRange;
  marketCapRange: MarketCapRange;
  showFilters: boolean;
}

export const DEFAULT_FILTER_OPTIONS: CryptoFilterOptions = {
  priceRange: { min: 0, max: 100000 },
  marketCapRange: { min: 0, max: 1000000000000 },
  showFilters: false
};
