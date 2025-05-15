
import { useRef } from 'react';

export function useCryptoDataTimers() {
  // Use refs to store timers and channels
  const fetchTimerRef = useRef<number | null>(null);
  const realtimeChannelRef = useRef<any>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  
  return {
    fetchTimerRef,
    realtimeChannelRef,
    abortControllerRef
  };
}
