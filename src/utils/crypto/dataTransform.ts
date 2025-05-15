
/**
 * Utility functions for transforming cryptocurrency data
 */

/**
 * Format raw time-series data into chart-friendly format
 */
export const formatData = (data: [number, number][]) => {
  if (!data || !data.length) return [];
  
  return data.map(([timestamp, value]) => ({
    date: new Date(timestamp),
    value: Number(value.toFixed(2)),
  }));
};
