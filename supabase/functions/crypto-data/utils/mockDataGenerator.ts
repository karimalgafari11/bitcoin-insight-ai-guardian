
import { generateMockData } from "../mockData.ts";

/**
 * Generate mock data as a fallback when all other sources fail
 */
export function generateFallbackData(coinId: string, days: string, currency: string, errorMessage?: string) {
  console.log("All API sources failed, returning mock data");
  
  const mockData = generateMockData(coinId, days, currency);
  
  return {
    ...mockData,
    isMockData: true,
    dataSource: "mock",
    error: errorMessage,
    fetchedAt: new Date().toISOString()
  };
}
