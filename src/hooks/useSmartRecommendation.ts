
import { useCallback, useEffect, useState } from 'react';
import { useCryptoData } from '@/hooks/crypto';
import { toast } from '@/components/ui/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';
import { processMarketData } from '@/utils/smartRecommendation/marketDataProcessor';
import { fetchAdditionalMarketData } from '@/utils/smartRecommendation/additionalDataFetcher';
import { fetchLatestRecommendation, generateSmartRecommendation } from '@/utils/smartRecommendation/recommendationService';
import { setupBinanceWebSocket } from '@/utils/smartRecommendation/websocketManager';
import { DEFAULT_TIMEFRAME } from '@/utils/smartRecommendation/constants';

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
  technical_indicators?: Record<string, number>;
}

export function useSmartRecommendation(timeframe: string = DEFAULT_TIMEFRAME) {
  const [recommendation, setRecommendation] = useState<SmartRecommendation | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { t } = useLanguage();
  
  // الحصول على أحدث بيانات العملات المشفرة من hook الذي يستخدم بيانات Binance
  const { data: cryptoData, dataSource } = useCryptoData('bitcoin', '1', 'usd');
  
  // وظيفة لإنشاء توصية بناءً على بيانات السوق المباشرة
  const generateRecommendation = useCallback(async () => {
    // تحقق من وجود البيانات
    if (!cryptoData || !cryptoData.prices || cryptoData.prices.length === 0) {
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      // معالجة بيانات السوق لتحليل النمط
      const {
        hasValidData,
        patternStrength,
        patternName,
        priceLevels
      } = processMarketData(cryptoData);
      
      if (!hasValidData || !priceLevels) {
        throw new Error('بيانات السوق غير صالحة');
      }
      
      console.log(`إنشاء توصية بنمط: ${patternName}، قوة: ${patternStrength.toFixed(2)}`);
      
      // محاولة جلب بيانات السوق الإضافية من edge function الخاصة بنا
      const additionalMarketResult = await fetchAdditionalMarketData();
      const additionalMarketData = additionalMarketResult.success ? additionalMarketResult.data : {};
      
      // استدعاء وظيفة serverless لإنشاء توصية ذكية
      const result = await generateSmartRecommendation(
        timeframe,
        patternName,
        patternStrength,
        priceLevels,
        additionalMarketData
      );
      
      if (!result.success) {
        throw new Error(result.error);
      }
      
      if (result.recommendation) {
        setRecommendation(result.recommendation);
        
        // عرض إشعار للتوصية الجديدة
        toast({
          title: t('توصية جديدة', 'New Recommendation'),
          description: t(
            `تم إنشاء توصية جديدة بناءً على بيانات بينانس المباشرة: ${result.recommendation.recommendation_type}`,
            `New recommendation based on live Binance data: ${result.recommendation.recommendation_type}`
          ),
        });
      }
    } catch (err) {
      console.error('خطأ في إنشاء التوصية:', err);
      setError(err instanceof Error ? err.message : 'خطأ في إنشاء التوصية');
      
      // الحصول على أحدث توصية من قاعدة البيانات كحل بديل
      const fallbackRecommendation = await fetchLatestRecommendation();
      if (fallbackRecommendation) {
        setRecommendation(fallbackRecommendation);
      }
    } finally {
      setLoading(false);
    }
  }, [cryptoData, timeframe, t]);
  
  // إنشاء توصية عند تغيير بيانات العملة المشفرة أو تحديثها
  useEffect(() => {
    // إنشاء توصية فقط إذا كانت لدينا بيانات من Binance
    if (cryptoData && dataSource === 'binance') {
      generateRecommendation();
    }
  }, [cryptoData, dataSource, generateRecommendation]);
  
  // إعداد اتصال WebSocket لتحديثات بيانات Binance في الوقت الفعلي
  useEffect(() => {
    // تهيئة WebSocket مع معالج تحديث
    const ws = setupBinanceWebSocket(() => {
      generateRecommendation();
    });
    
    // تنظيف اتصال WebSocket
    return () => {
      ws.close();
    };
  }, [generateRecommendation]);
  
  return { recommendation, loading, error, regenerate: generateRecommendation };
}
