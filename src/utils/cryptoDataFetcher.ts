
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { CryptoMarketData } from '@/types/crypto';

export async function fetchCryptoData(
  coinId: string, 
  days: string, 
  currency: string, 
  force = false
): Promise<{
  data: CryptoMarketData | null;
  error: string | null;
}> {
  try {
    console.log(`Fetching data for ${coinId}, days: ${days}, currency: ${currency}`);
    
    // Use the crypto-cache function
    const { data: responseData, error: responseError } = await supabase.functions.invoke('crypto-cache', {
      body: {
        coinId,
        days,
        currency,
        forceRefresh: force
      }
    });

    if (responseError) {
      console.error('Supabase function error:', responseError);
      throw new Error(responseError.message);
    }

    if (!responseData) {
      throw new Error('No data received from API');
    }
    
    console.log('Received cryptocurrency data:', responseData);
    
    // Validate that the response has the required data structure
    if (!responseData.prices || !Array.isArray(responseData.prices)) {
      console.error('Invalid data format received:', responseData);
      throw new Error('Invalid data format received from API');
    }

    return {
      data: responseData as CryptoMarketData,
      error: null
    };
  } catch (err) {
    console.error('Error fetching crypto data:', err);
    const errorMessage = err instanceof Error ? err.message : 'خطأ في جلب بيانات العملة الرقمية';
    
    toast({
      title: "خطأ",
      description: errorMessage,
      variant: "destructive"
    });
    
    return {
      data: null,
      error: errorMessage
    };
  }
}
