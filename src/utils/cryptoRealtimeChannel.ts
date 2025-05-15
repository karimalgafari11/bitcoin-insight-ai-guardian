
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';

const activeChannels = new Map<string, any>();
const channelReconnectAttempts = new Map<string, number>();
// Increased delay between reconnections for better stability
const MAX_RECONNECT_ATTEMPTS = 3;
const RECONNECT_DELAY_MS = 10000; // 10 seconds - increased from 5 seconds

// Keep track of pending reconnect timers
const reconnectTimers = new Map<string, number>();

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
  
  // If we already have this exact channel active, return it instead of creating another
  if (activeChannels.has(channelName)) {
    return activeChannels.get(channelName);
  }
  
  console.log(`Setting up realtime channel: ${channelName}`);
  
  // Reset reconnect count for this channel
  channelReconnectAttempts.set(channelName, 0);
  
  const setupChannel = () => {
    // If there's a pending reconnect timer for this channel, clear it
    if (reconnectTimers.has(channelName)) {
      window.clearTimeout(reconnectTimers.get(channelName));
      reconnectTimers.delete(channelName);
    }

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
            
            // Store the timer reference so we can clear it if needed
            const timerId = window.setTimeout(() => {
              reconnectTimers.delete(channelName);
              
              // Only try to reconnect if the channel is still in activeChannels
              // (meaning it hasn't been cleaned up by another part of the code)
              if (activeChannels.has(channelName)) {
                // Remove from active channels before reconnecting
                supabase.removeChannel(activeChannels.get(channelName));
                activeChannels.delete(channelName);
                
                // Setup the channel again
                setupChannel();
              }
            }, RECONNECT_DELAY_MS);
            
            reconnectTimers.set(channelName, timerId);
          } else {
            console.error(`Maximum reconnect attempts (${MAX_RECONNECT_ATTEMPTS}) reached for channel ${channelName}`);
            // Don't keep the failed channel in the active channels map
            activeChannels.delete(channelName);
            
            // Notify the user but don't interrupt their experience
            toast({
              title: "Connection issue",
              description: "Unable to connect to real-time updates. Data will be refreshed manually.",
              variant: "destructive",
            });
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
  // Clear all reconnect timers
  reconnectTimers.forEach((timerId) => {
    window.clearTimeout(timerId);
  });
  reconnectTimers.clear();
  
  // Remove all active channels
  activeChannels.forEach((channel, name) => {
    console.log(`Cleaning up channel: ${name}`);
    supabase.removeChannel(channel);
  });
  
  // Clear the maps
  activeChannels.clear();
  channelReconnectAttempts.clear();
}

/**
 * Helper function to clean up a specific channel by its parameters
 */
export function cleanupChannel(coinId: string, days: string, currency: string): void {
  const channelName = `crypto-${coinId}-${days}-${currency}`;
  
  // Clear any pending reconnect timer
  if (reconnectTimers.has(channelName)) {
    window.clearTimeout(reconnectTimers.get(channelName));
    reconnectTimers.delete(channelName);
  }
  
  // Remove the channel if it exists
  if (activeChannels.has(channelName)) {
    const channel = activeChannels.get(channelName);
    console.log(`Cleaning up specific channel: ${channelName}`);
    supabase.removeChannel(channel);
    activeChannels.delete(channelName);
    channelReconnectAttempts.delete(channelName);
  }
}
