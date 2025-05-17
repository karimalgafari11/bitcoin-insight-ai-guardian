
import { useState, useEffect, useCallback } from 'react';
import { useApiKeys } from '@/hooks/api-keys';
import { useToast } from '@/components/ui/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';

/**
 * واجهة بيانات ملخص API
 * تحدد هيكل البيانات المسترجعة من كل منصة متصلة
 */
export interface ApiDataSummary {
  platform: string;      // اسم المنصة (مثل binance، coinapi)
  isConnected: boolean;  // حالة الاتصال
  lastUpdated: string;   // توقيت آخر تحديث
  data: any | null;      // البيانات المسترجعة
  error: string | null;  // رسالة الخطأ إن وجدت
}

/**
 * هوك لاسترجاع البيانات من منصات API المتصلة
 * يقوم بجلب البيانات من جميع المنصات التي تم إعداد مفاتيح API لها
 */
export const useConnectedApiData = () => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const { apiKeys, connectionStates } = useApiKeys();
  const [apiData, setApiData] = useState<ApiDataSummary[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [lastRefreshed, setLastRefreshed] = useState<Date>(new Date());

  /**
   * دالة موحدة لإجراء طلبات الواجهة البرمجية
   * تعالج الأخطاء وتنسق الاستجابات بشكل موحد
   * 
   * @param url - عنوان URL للطلب
   * @param options - خيارات الطلب
   * @returns بيانات الاستجابة أو يرمي استثناء
   */
  const fetchWithErrorHandling = async (url: string, options: RequestInit = {}) => {
    const response = await fetch(url, options);
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API error (${response.status}): ${errorText}`);
    }
    
    return await response.json();
  };

  /**
   * جلب البيانات من واجهة برمجة بينانس
   * يستخدم نقاط نهاية مختلفة بناءً على نوع المنصة (حقيقية أو تجريبية)
   * 
   * @param platform - نوع المنصة (binance أو binance_testnet)
   * @param apiKey - مفتاح API المستخدم للمصادقة
   * @returns البيانات المنسقة من بينانس
   */
  const fetchBinanceData = useCallback(async (platform: string, apiKey: string): Promise<any> => {
    // استخدام نقطة نهاية تجريبية للـ binance_testnet
    const endpoint = platform === 'binance' 
      ? 'https://api.binance.com/api/v3/ticker/24hr?symbols=["BTCUSDT","ETHUSDT","BNBUSDT","ADAUSDT","SOLUSDT"]' 
      : 'https://testnet.binance.vision/api/v3/ticker/24hr?symbols=["BTCUSDT","ETHUSDT","BNBUSDT"]';
    
    try {
      return await fetchWithErrorHandling(endpoint, {
        headers: { 'X-MBX-APIKEY': apiKey }
      });
    } catch (error) {
      console.error(`خطأ في جلب بيانات ${platform}:`, error);
      throw new Error(`فشل الاتصال بـ ${platform === 'binance' ? 'بينانس' : 'تستنت بينانس'}`);
    }
  }, []);

  /**
   * جلب البيانات من واجهة برمجة CoinAPI
   * 
   * @param apiKey - مفتاح API المستخدم للمصادقة
   * @returns بيانات أسعار الصرف
   */
  const fetchCoinApiData = useCallback(async (apiKey: string): Promise<any> => {
    try {
      return await fetchWithErrorHandling('https://rest.coinapi.io/v1/exchangerate/BTC/USD', {
        headers: { 'X-CoinAPI-Key': apiKey }
      });
    } catch (error) {
      console.error('خطأ في جلب بيانات CoinAPI:', error);
      throw new Error('فشل الاتصال بـ CoinAPI');
    }
  }, []);

  /**
   * جلب البيانات من واجهة برمجة CryptoCompare
   * 
   * @param apiKey - مفتاح API المستخدم للمصادقة
   * @returns بيانات أسعار العملات المشفرة بعملات متعددة
   */
  const fetchCryptoCompareData = useCallback(async (apiKey: string): Promise<any> => {
    try {
      return await fetchWithErrorHandling('https://min-api.cryptocompare.com/data/price?fsym=BTC&tsyms=USD,EUR,GBP', {
        headers: { 'authorization': `Apikey ${apiKey}` }
      });
    } catch (error) {
      console.error('خطأ في جلب بيانات CryptoCompare:', error);
      throw new Error('فشل الاتصال بـ CryptoCompare');
    }
  }, []);

  /**
   * جلب البيانات من واجهة برمجة LiveCoinWatch
   * 
   * @param apiKey - مفتاح API المستخدم للمصادقة
   * @returns بيانات تفصيلية عن عملة مشفرة محددة
   */
  const fetchLiveCoinWatchData = useCallback(async (apiKey: string): Promise<any> => {
    try {
      return await fetchWithErrorHandling('https://api.livecoinwatch.com/coins/single', {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          'x-api-key': apiKey
        },
        body: JSON.stringify({
          currency: 'USD',
          code: 'BTC',
          meta: true
        })
      });
    } catch (error) {
      console.error('خطأ في جلب بيانات LiveCoinWatch:', error);
      throw new Error('فشل الاتصال بـ LiveCoinWatch');
    }
  }, []);

  /**
   * جلب البيانات من واجهة برمجة CoinDesk
   * هذه الواجهة لا تتطلب مفتاح API
   * 
   * @returns بيانات سعر البيتكوين الحالية
   */
  const fetchCoinDeskData = useCallback(async (): Promise<any> => {
    try {
      return await fetchWithErrorHandling('https://api.coindesk.com/v1/bpi/currentprice.json');
    } catch (error) {
      console.error('خطأ في جلب بيانات CoinDesk:', error);
      throw new Error('فشل الاتصال بـ CoinDesk');
    }
  }, []);

  /**
   * دالة رئيسية لجلب البيانات من جميع المنصات المتصلة
   * تجمع البيانات بالتوازي من جميع المنصات النشطة
   */
  const fetchConnectedApiData = useCallback(async () => {
    setIsLoading(true);
    // تحديد المنصات المتصلة من حالات الاتصال
    const connectedPlatforms = Object.keys(connectionStates).filter(
      platform => connectionStates[platform]
    );

    // إذا لم توجد منصات متصلة، تعيين مصفوفة فارغة وإنهاء التحميل
    if (connectedPlatforms.length === 0) {
      setApiData([]);
      setIsLoading(false);
      return;
    }

    try {
      // إنشاء وعود لكل منصة متصلة
      const dataPromises = connectedPlatforms.map(async (platform) => {
        try {
          // منطق جلب مختلف بناءً على نوع المنصة
          let data = null;
          
          // تحديد دالة الجلب المناسبة لكل منصة
          if (platform === 'binance' || platform === 'binance_testnet') {
            data = await fetchBinanceData(platform, apiKeys[platform]);
          } else if (platform === 'coinapi') {
            data = await fetchCoinApiData(apiKeys[platform]);
          } else if (platform === 'cryptocompare') {
            data = await fetchCryptoCompareData(apiKeys[platform]);
          } else if (platform === 'livecoinwatch') {
            data = await fetchLiveCoinWatchData(apiKeys[platform]);
          } else if (platform === 'coindesk') {
            data = await fetchCoinDeskData();
          }

          // إرجاع بيانات مهيكلة للمنصة
          return {
            platform,
            isConnected: true,
            lastUpdated: new Date().toISOString(),
            data,
            error: null
          };
        } catch (error) {
          // معالجة أخطاء جلب البيانات من منصة محددة
          console.error(`خطأ في جلب البيانات من ${platform}:`, error);
          return {
            platform,
            isConnected: true,
            lastUpdated: new Date().toISOString(),
            data: null,
            error: error instanceof Error ? error.message : 'خطأ غير معروف'
          };
        }
      });

      // انتظار إكمال جميع الوعود
      const results = await Promise.all(dataPromises);
      setApiData(results);
    } catch (err) {
      // معالجة الأخطاء العامة وعرضها للمستخدم
      toast({
        title: t('خطأ', 'Error'),
        description: t(
          'حدث خطأ أثناء جلب البيانات من المنصات المتصلة',
          'An error occurred while fetching data from connected platforms'
        ),
        variant: 'destructive',
      });
      console.error('خطأ في جلب بيانات API:', err);
    } finally {
      // إنهاء حالة التحميل وتحديث وقت التحديث الأخير
      setIsLoading(false);
      setLastRefreshed(new Date());
    }
  }, [connectionStates, apiKeys, fetchBinanceData, fetchCoinApiData, fetchCryptoCompareData, fetchLiveCoinWatchData, fetchCoinDeskData, toast, t]);

  // جلب البيانات الأولية عند تركيب المكون
  useEffect(() => {
    fetchConnectedApiData();
  }, [connectionStates, fetchConnectedApiData]); // إعادة الجلب عند تغير حالات الاتصال

  return {
    apiData,
    isLoading,
    lastRefreshed,
    refreshData: fetchConnectedApiData
  };
};
