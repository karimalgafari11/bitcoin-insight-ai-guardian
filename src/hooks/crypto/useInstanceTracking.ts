
import { useRef, useCallback } from 'react';

// Track mounted instances to optimize network requests more efficiently
const mountedInstances = new Map<string, number>();

export function useInstanceTracking(coinId: string, days: string, currency: string) {
  const mountedRef = useRef<boolean>(true);
  const instanceIdRef = useRef<string>(`${coinId}:${days}:${currency}`);
  
  // Function to track this instance with reference counting
  const trackInstance = useCallback(() => {
    const instanceId = `${coinId}:${days}:${currency}`;
    instanceIdRef.current = instanceId;
    
    // Register this instance with reference counting
    const currentCount = mountedInstances.get(instanceId) || 0;
    mountedInstances.set(instanceId, currentCount + 1);
    
    return currentCount === 0; // Return true if this is the first instance
  }, [coinId, days, currency]);
  
  // Function to clean up this instance
  const cleanupInstance = useCallback(() => {
    const instanceId = instanceIdRef.current;
    
    // Update instance reference counting
    const updatedCount = mountedInstances.get(instanceId) || 0;
    if (updatedCount <= 1) {
      mountedInstances.delete(instanceId);
    } else {
      mountedInstances.set(instanceId, updatedCount - 1);
    }
  }, []);
  
  return {
    mountedRef,
    instanceId: instanceIdRef.current,
    trackInstance,
    cleanupInstance
  };
}
