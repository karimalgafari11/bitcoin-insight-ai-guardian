
import { fetchCryptoData } from './dataFetcher';

/**
 * Utility function to preload commonly accessed data
 */
export async function preloadCommonCryptoData(): Promise<void> {
  try {
    // Silently preload Bitcoin and Ethereum data in the background
    // Use Promise.allSettled to handle failures gracefully
    await Promise.allSettled([
      fetchCryptoData('bitcoin', '7', 'usd', false),
      fetchCryptoData('ethereum', '7', 'usd', false)
    ]);
  } catch (error) {
    console.error('Error preloading common crypto data:', error);
    // Silently fail - this is just optimization
  }
}
