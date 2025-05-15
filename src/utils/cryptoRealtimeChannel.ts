
import { supabase } from '@/integrations/supabase/client';

const activeChannels = new Map<string, any>();
const channelReconnectAttempts = new Map<string, number>();
const MAX_RECONNECT_ATTEMPTS = 5;
const RECONNECT_DELAY_MS = 5000; // 5 seconds

/**
 * Sets up a realtime channel to receive cryptocurrency data updates
 * with automatic reconnection and error handling
 */
export function setupRealtimeChannel(
  coinId: string, 
  days: string, 
  currency: string,
  onUpdate: (payload: any) => void
): any {
  // Setup a channel for real-time updates
  const channelName = `crypto-${coinId}-${days}-${currency}`;
  
  // If we already have this exact channel active, return it
  if (activeChannels.has(channelName)) {
    return activeChannels.get(channelName);
  }
  
  console.log(`Setting up realtime channel: ${channelName}`);
  
  // Reset reconnect count for this channel
  channelReconnectAttempts.set(channelName, 0);
  
  const setupChannel = () => {
    const channel = supabase
      .channel(channelName)
      .on('broadcast', { event: 'crypto-update' }, (payload) => {
        if (payload.payload && 
            payload.payload.coinId === coinId && 
            payload.payload.days === days && 
            payload.payload.currency === currency) {
          console.log('Received real-time crypto update:', payload.payload);
          onUpdate(payload.payload);
        }
      })
      .subscribe((status) => {
        console.log(`Realtime subscription status for ${channelName}: ${status}`);
        
        // Handle channel errors and disconnections
        if (status === 'CHANNEL_ERROR' || status === 'CLOSED') {
          const attempts = channelReconnectAttempts.get(channelName) || 0;
          
          if (attempts < MAX_RECONNECT_ATTEMPTS) {
            // Increment attempts and try to reconnect after delay
            channelReconnectAttempts.set(channelName, attempts + 1);
            console.log(`Attempting to reconnect channel ${channelName} (attempt ${attempts + 1}/${MAX_RECONNECT_ATTEMPTS})`);
            
            setTimeout(() => {
              // Remove from active channels before reconnecting
              if (activeChannels.has(channelName)) {
                supabase.removeChannel(activeChannels.get(channelName));
                activeChannels.delete(channelName);
              }
              
              // Setup the channel again
              setupChannel();
            }, RECONNECT_DELAY_MS);
          } else {
            console.error(`Maximum reconnect attempts (${MAX_RECONNECT_ATTEMPTS}) reached for channel ${channelName}`);
          }
        } else if (status === 'SUBSCRIBED') {
          // Reset attempts on successful subscription
          channelReconnectAttempts.set(channelName, 0);
        }
      });

    // Store channel reference
    activeChannels.set(channelName, channel);
    return channel;
  };

  // Initial setup
  return setupChannel();
}

/**
 * Helper function to clean up all active channels
 */
export function cleanupAllChannels(): void {
  activeChannels.forEach((channel, name) => {
    console.log(`Cleaning up channel: ${name}`);
    supabase.removeChannel(channel);
  });
  
  // Clear the maps
  activeChannels.clear();
  channelReconnectAttempts.clear();
}
