
import { useCallback, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useCryptoData } from '@/hooks/crypto';
import { toast } from '@/components/ui/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';

export interface SmartRecommendation {
  id: string;
  recommendation_type: string;
  confidence_level: number;
  reason: string;
  stop_loss: number;
  take_profit: number;
  created_at: string;
  timeframe: string;
  is_active: boolean;
}

export function useSmartRecommendation(timeframe: string = '1d') {
  const [recommendation, setRecommendation] = useState<SmartRecommendation | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { t } = useLanguage();
  
  // Get the latest crypto data from our hook that uses Binance data
  const { data: cryptoData, dataSource } = useCryptoData('bitcoin', '1', 'usd');
  
  // Function to generate a recommendation based on market data
  const generateRecommendation = useCallback(async () => {
    if (!cryptoData || !cryptoData.prices || cryptoData.prices.length === 0) {
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      // Get latest price and determine pattern strength based on price movement
      const prices = cryptoData.prices;
      const lastPrice = prices[prices.length - 1][1];
      const prevPrice = prices[prices.length - 2]?.[1] || lastPrice;
      
      // Calculate a simple pattern strength based on recent price movement
      const priceChange = lastPrice - prevPrice;
      const percentChange = (priceChange / prevPrice) * 100;
      const patternStrength = 50 + percentChange * 5; // Simple formula: neutral (50) +/- percentage change
      
      // Determine pattern name based on market movement
      let patternName = 'نمط متعادل';
      if (percentChange > 1) {
        patternName = 'نموذج صعودي';
      } else if (percentChange < -1) {
        patternName = 'نموذج هبوطي';
      }
      
      // Price levels for stop loss and take profit
      const priceLevels = {
        current: lastPrice,
        resistance: lastPrice * 1.03, // Simple 3% above as resistance
        support: lastPrice * 0.97,    // Simple 3% below as support
      };
      
      console.log(`Generating recommendation with pattern: ${patternName}, strength: ${patternStrength.toFixed(2)}`);
      
      // Call our serverless function to generate a smart recommendation
      const { data, error } = await supabase.functions.invoke('smart-recommendation', {
        body: {
          user_id: 'system',
          timeframe,
          pattern_name: patternName,
          pattern_strength: patternStrength,
          price_levels: priceLevels
        }
      });
      
      if (error) {
        throw new Error(error.message);
      }
      
      if (data?.recommendation) {
        setRecommendation(data.recommendation);
        
        // Show toast notification for new recommendation
        toast({
          title: t('توصية جديدة', 'New Recommendation'),
          description: t(
            `تم إنشاء توصية جديدة بناءً على بيانات بينانس المباشرة: ${data.recommendation.recommendation_type}`,
            `New recommendation based on live Binance data: ${data.recommendation.recommendation_type}`
          ),
        });
      }
    } catch (err) {
      console.error('Error generating recommendation:', err);
      setError(err instanceof Error ? err.message : 'خطأ في إنشاء التوصية');
      
      // Get the most recent recommendation from the database as fallback
      try {
        const { data: latestRec } = await supabase
          .from('smart_recommendations')
          .select('*')
          .eq('is_active', true)
          .order('created_at', { ascending: false })
          .limit(1)
          .single();
        
        if (latestRec) {
          setRecommendation(latestRec);
        }
      } catch (fallbackError) {
        console.error('Fallback recommendation fetch failed:', fallbackError);
      }
    } finally {
      setLoading(false);
    }
  }, [cryptoData, timeframe, t]);
  
  // Generate recommendation when crypto data changes or is refreshed
  useEffect(() => {
    // Only generate a recommendation if we have data from Binance
    if (cryptoData && dataSource === 'binance') {
      generateRecommendation();
    }
  }, [cryptoData, dataSource, generateRecommendation]);
  
  return { recommendation, loading, error, regenerate: generateRecommendation };
}
