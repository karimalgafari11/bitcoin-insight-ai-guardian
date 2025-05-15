
/**
 * Utility functions for handling cryptocurrency symbols
 */

/**
 * Get the readable name for a cryptocurrency symbol
 */
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
