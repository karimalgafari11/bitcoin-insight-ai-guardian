
import { useState, useCallback } from 'react';
import { POLL_INTERVAL_SHORT, POLL_INTERVAL_STANDARD } from '@/utils/crypto/constants';

// Enhanced polling strategy based on timeframe
const getPollingInterval = (days: string): number => {
  return days === "1" ? POLL_INTERVAL_SHORT : POLL_INTERVAL_STANDARD;
};

export function useCryptoPolling(fetchTimerRef: React.MutableRefObject<number | null>) {
  const [pollingEnabled, setPollingEnabled] = useState(true);

  // Allow manual toggling of polling
  const togglePolling = useCallback(() => {
    setPollingEnabled(prev => {
      if (prev && fetchTimerRef.current !== null) {
        // Disable polling
        window.clearInterval(fetchTimerRef.current);
        fetchTimerRef.current = null;
        return false;
      } else {
        // Enable polling (actual timer setup happens in the effect)
        return true;
      }
    });
  }, [fetchTimerRef]);

  // Utility function to setup polling with the correct interval
  const setupPolling = useCallback((days: string, fetchCallback: () => void) => {
    if (pollingEnabled && fetchTimerRef.current === null) {
      const interval = getPollingInterval(days);
      fetchTimerRef.current = window.setInterval(fetchCallback, interval);
      return true;
    }
    return false;
  }, [pollingEnabled, fetchTimerRef]);

  return {
    pollingEnabled,
    setPollingEnabled,
    togglePolling,
    setupPolling,
    getPollingInterval
  };
}
