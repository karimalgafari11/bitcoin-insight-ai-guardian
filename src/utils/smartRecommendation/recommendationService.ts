
import { supabase } from '@/integrations/supabase/client';
import { API_KEYS } from '@/config/apiKeys';
import { toast } from '@/components/ui/use-toast';
import { SmartRecommendation } from '@/hooks/useSmartRecommendation';
import { useLanguage } from '@/contexts/LanguageContext';

/**
 * جلب أحدث توصية من قاعدة البيانات كحل بديل
 */
export async function fetchLatestRecommendation(): Promise<SmartRecommendation | null> {
  try {
    const { data: latestRec } = await supabase
      .from('smart_recommendations')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();
    
    return latestRec as SmartRecommendation;
  } catch (fallbackError) {
    console.error('فشل جلب التوصية البديلة:', fallbackError);
    return null;
  }
}

/**
 * إنشاء توصية ذكية باستخدام وظيفة Serverless
 */
export async function generateSmartRecommendation(
  timeframe: string, 
  patternName: string, 
  patternStrength: number, 
  priceLevels: any, 
  additionalMarketData: any = {}
) {
  try {
    const { data, error } = await supabase.functions.invoke('smart-recommendation', {
      body: {
        user_id: 'system',
        timeframe,
        pattern_name: patternName,
        pattern_strength: patternStrength,
        price_levels: priceLevels,
        api_keys: {
          binance: API_KEYS.BINANCE_API_KEY,
          coinapi: API_KEYS.COINAPI_KEY,
          coindesk: API_KEYS.COINDESK_KEY
        },
        additional_market_data: additionalMarketData
      }
    });
    
    if (error) {
      throw new Error(error.message);
    }
    
    return {
      success: true,
      recommendation: data?.recommendation as SmartRecommendation
    };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : 'خطأ في إنشاء التوصية'
    };
  }
}
