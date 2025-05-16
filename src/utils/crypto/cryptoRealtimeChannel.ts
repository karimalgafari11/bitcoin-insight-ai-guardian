import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { MAX_RECONNECT_ATTEMPTS, RECONNECT_DELAY_MS } from './constants';

// Improved management of active channels to prevent duplications
const activeChannels = new Map<string, any>();
const channelReconnectAttempts = new Map<string, number>();
const reconnectTimers = new Map<string, number>();
const channelSubscriptionStatus = new Map<string, string>();

/**
 * Sets up a realtime channel to receive cryptocurrency data updates
 * with improved stability, automatic reconnection and error handling
 */
export function setupRealtimeChannel(
  coinId: string, 
  days: string, 
  currency: string,
  onUpdate: (payload: any) => void
): any {
  // Setup a channel for real-time updates with a consistent channel name
  const channelName = `crypto-${coinId}-${days}-${currency}`;
  
  // If we already have an active channel with the same parameters, return it
  if (activeChannels.has(channelName) && channelSubscriptionStatus.get(channelName) === 'SUBSCRIBED') {
    console.log(`Reusing existing channel: ${channelName}`);
    return activeChannels.get(channelName);
  }
  
  console.log(`Setting up realtime channel: ${channelName}`);
  
  // Clean up any existing channel with the same name before creating a new one
  if (activeChannels.has(channelName)) {
    try {
      console.log(`Cleaning up existing channel before recreating: ${channelName}`);
      const existingChannel = activeChannels.get(channelName);
      supabase.removeChannel(existingChannel);
      activeChannels.delete(channelName);
    } catch (err) {
      console.error(`Error cleaning up existing channel: ${channelName}`, err);
    }
  }
  
  // Reset reconnect count for this channel
  channelReconnectAttempts.set(channelName, 0);
  
  // Setup the channel with more robust error handling
  const channel = supabase
    .channel(channelName)
    .on('broadcast', { event: 'crypto-update' }, (payload) => {
      if (!payload.payload) return;
      
      // Only process updates that match our current parameters
      if (payload.payload.coinId === coinId && 
          payload.payload.days === days && 
          payload.payload.currency === currency) {
        console.log('Received real-time crypto update:', payload.payload.coinId);
        onUpdate(payload.payload);
      }
    })
    .subscribe((status) => {
      console.log(`Realtime subscription status for ${channelName}: ${status}`);
      channelSubscriptionStatus.set(channelName, status);
      
      // Handle channel errors and disconnections
      if (status === 'CHANNEL_ERROR' || status === 'CLOSED' || status === 'TIMED_OUT') {
        const attempts = channelReconnectAttempts.get(channelName) || 0;
        
        if (attempts < MAX_RECONNECT_ATTEMPTS) {
          // If there's a pending reconnect timer for this channel, clear it
          if (reconnectTimers.has(channelName)) {
            window.clearTimeout(reconnectTimers.get(channelName));
          }
          
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
              try {
                supabase.removeChannel(activeChannels.get(channelName));
              } catch (e) {
                console.log('Error removing channel during reconnect attempt:', e);
              }
              activeChannels.delete(channelName);
              
              // Setup the channel again
              setupRealtimeChannel(coinId, days, currency, onUpdate);
            }
          }, RECONNECT_DELAY_MS * (attempts + 1)); // Increase backoff time with each attempt
          
          reconnectTimers.set(channelName, timerId);
        } else {
          console.error(`Maximum reconnect attempts (${MAX_RECONNECT_ATTEMPTS}) reached for channel ${channelName}`);
          // Don't keep the failed channel in the active channels map
          activeChannels.delete(channelName);
          channelSubscriptionStatus.delete(channelName);
          
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
}

/**
 * Helper function to clean up all active channels
 */
export function cleanupAllChannels(): void {
  console.log(`Cleaning up all channels (${activeChannels.size} active)`);
  
  // Clear all reconnect timers
  reconnectTimers.forEach((timerId, channelName) => {
    window.clearTimeout(timerId);
    console.log(`Cleared reconnect timer for ${channelName}`);
  });
  reconnectTimers.clear();
  
  // Remove all active channels
  activeChannels.forEach((channel, name) => {
    console.log(`Cleaning up channel: ${name}`);
    try {
      supabase.removeChannel(channel);
    } catch (e) {
      console.log(`Error removing channel ${name}:`, e);
    }
  });
  
  // Clear all maps
  activeChannels.clear();
  channelReconnectAttempts.clear();
  channelSubscriptionStatus.clear();
}

/**
 * Helper function to clean up a specific channel by its parameters
 * with improved error handling
 */
export function cleanupChannel(coinId: string, days: string, currency: string): void {
  const channelName = `crypto-${coinId}-${days}-${currency}`;
  
  console.log(`Cleaning up specific channel: ${channelName}`);
  
  // Clear any pending reconnect timer
  if (reconnectTimers.has(channelName)) {
    window.clearTimeout(reconnectTimers.get(channelName));
    reconnectTimers.delete(channelName);
    console.log(`Cleared reconnect timer for ${channelName}`);
  }
  
  // Remove the channel if it exists
  if (activeChannels.has(channelName)) {
    const channel = activeChannels.get(channelName);
    try {
      supabase.removeChannel(channel);
    } catch (e) {
      console.log(`Error removing channel ${channelName}:`, e);
    }
    activeChannels.delete(channelName);
    channelReconnectAttempts.delete(channelName);
    channelSubscriptionStatus.delete(channelName);
  }
}
