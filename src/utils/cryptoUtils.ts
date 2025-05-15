
export const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 2
  }).format(value);
};

export const formatLargeNumber = (num: number) => {
  if (num >= 1e9) {
    return `${(num / 1e9).toFixed(2)}B`;
  } else if (num >= 1e6) {
    return `${(num / 1e6).toFixed(2)}M`;
  } else if (num >= 1e3) {
    return `${(num / 1e3).toFixed(2)}K`;
  }
  return num.toString();
};

export const getSymbolName = (symbol: string) => {
  switch (symbol) {
    case 'bitcoin': return 'Bitcoin (BTC)';
    case 'ethereum': return 'Ethereum (ETH)';
    case 'binancecoin': return 'Binance Coin (BNB)';
    case 'ripple': return 'XRP';
    case 'cardano': return 'Cardano (ADA)';
    case 'solana': return 'Solana (SOL)';
    default: return symbol.charAt(0).toUpperCase() + symbol.slice(1);
  }
};

export const formatData = (data: [number, number][]) => {
  if (!data || !data.length) return [];
  
  return data.map(([timestamp, value]) => ({
    date: new Date(timestamp),
    value: Number(value.toFixed(2)),
  }));
};
