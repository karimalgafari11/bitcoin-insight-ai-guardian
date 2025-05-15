
import { supabase } from '@/integrations/supabase/client';

export function setupRealtimeChannel(
  coinId: string, 
  days: string, 
  currency: string,
  onUpdate: (payload: any) => void
) {
  // Setup a channel for real-time updates
  const channelName = `crypto-${coinId}-${days}-${currency}`;
  console.log(`Setting up realtime channel: ${channelName}`);
  
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
      console.log(`Realtime subscription status: ${status}`);
    });

  return channel;
}
