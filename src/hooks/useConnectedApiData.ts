
/**
 * هوك لاسترجاع البيانات من منصات API المتصلة
 * يقوم بجلب البيانات من جميع المنصات التي تم إعداد مفاتيح API لها
 * تم تحسينه باستخدام معالجة أخطاء أفضل ومزامنة WebSocket للتحديثات المباشرة
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { useApiKeys } from '@/hooks/api-keys';
import { useLanguage } from '@/contexts/LanguageContext';
import { useErrorHandler, ErrorSeverity } from '@/utils/errorHandling';
import { WebSocketConnectionType, createWebSocketConnection } from '@/utils/crypto/websocketService';

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
 */
export const useConnectedApiData = () => {
  const { t } = useLanguage();
  const { apiKeys, connectionStates } = useApiKeys();
  const { showError, catchPromiseError } = useErrorHandler();
  
  const [apiData, setApiData] = useState<ApiDataSummary[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [lastRefreshed, setLastRefreshed] = useState<Date>(new Date());
  
  // مراجع للتعامل مع تحديثات الوقت الحقيقي
  const wsConnectionsRef = useRef<Record<string, any>>({});
  const activeRealTimeUpdatesRef = useRef<boolean>(true);

  /**
   * دالة موحدة لإجراء طلبات الواجهة البرمجية
   * تعالج الأخطاء وتنسق الاستجابات بشكل موحد
   * 
   * @param url - عنوان URL للطلب
   * @param options - خيارات الطلب
   * @returns بيانات الاستجابة أو يرمي استثناء
   */
  const fetchWithErrorHandling = async (url: string, options: RequestInit = {}) => {
    try {
      const response = await fetch(url, options);
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`خطأ API (${response.status}): ${errorText}`);
      }
      
      return await response.json();
    } catch (error) {
      throw error;
    }
  };

  /**
   * جلب البيانات من واجهة برمجة بينانس
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
      throw new Error(`فشل الاتصال بـ ${platform === 'binance' ? 'بينانس' : 'تستنت بينانس'}: ${error instanceof Error ? error.message : 'خطأ غير معروف'}`);
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
      throw new Error(`فشل الاتصال بـ CoinAPI: ${error instanceof Error ? error.message : 'خطأ غير معروف'}`);
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
      throw new Error(`فشل الاتصال بـ CryptoCompare: ${error instanceof Error ? error.message : 'خطأ غير معروف'}`);
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
      throw new Error(`فشل الاتصال بـ LiveCoinWatch: ${error instanceof Error ? error.message : 'خطأ غير معروف'}`);
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
      throw new Error(`فشل الاتصال بـ CoinDesk: ${error instanceof Error ? error.message : 'خطأ غير معروف'}`);
    }
  }, []);

  /**
   * معالج تحديثات الوقت الحقيقي
   * يتم استدعاؤه عند استلام بيانات جديدة عبر WebSocket
   */
  const handleRealtimeUpdate = useCallback((platform: string, data: any) => {
    if (!activeRealTimeUpdatesRef.current) return;
    
    setApiData(prevData => {
      const updatedData = [...prevData];
      const platformIndex = updatedData.findIndex(item => item.platform === platform);
      
      if (platformIndex !== -1) {
        updatedData[platformIndex] = {
          ...updatedData[platformIndex],
          data,
          lastUpdated: new Date().toISOString(),
          error: null
        };
      }
      
      return updatedData;
    });
  }, []);

  /**
   * إعداد الاتصالات بالوقت الحقيقي للمنصات المدعومة
   */
  const setupRealtimeConnections = useCallback(() => {
    // التنظيف أولاً
    Object.values(wsConnectionsRef.current).forEach((connection: any) => {
      if (connection && connection.disconnect) {
        connection.disconnect();
      }
    });
    
    wsConnectionsRef.current = {};
    
    // إنشاء اتصالات جديدة للمنصات المتصلة
    if (connectionStates.binance && apiKeys.binance) {
      const wsConfig = {
        symbol: 'btcusdt',
        type: WebSocketConnectionType.TICKER,
        market: 'binance',
        reconnectAttempts: 5
      };
      
      const connection = createWebSocketConnection(
        wsConfig,
        (data) => handleRealtimeUpdate('binance', data)
      );
      
      wsConnectionsRef.current.binance = connection;
    }
    
    // يمكن إضافة المزيد من الاتصالات هنا للمنصات الأخرى التي تدعم WebSocket
  }, [connectionStates, apiKeys, handleRealtimeUpdate]);

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
            data = await catchPromiseError(
              fetchBinanceData(platform, apiKeys[platform]),
              { 
                severity: ErrorSeverity.WARNING,
                source: `api-${platform}`
              }
            );
          } else if (platform === 'coinapi') {
            data = await catchPromiseError(
              fetchCoinApiData(apiKeys[platform]),
              { 
                severity: ErrorSeverity.WARNING,
                source: `api-${platform}`
              }
            );
          } else if (platform === 'cryptocompare') {
            data = await catchPromiseError(
              fetchCryptoCompareData(apiKeys[platform]),
              { 
                severity: ErrorSeverity.WARNING,
                source: `api-${platform}`
              }
            );
          } else if (platform === 'livecoinwatch') {
            data = await catchPromiseError(
              fetchLiveCoinWatchData(apiKeys[platform]),
              { 
                severity: ErrorSeverity.WARNING,
                source: `api-${platform}`
              }
            );
          } else if (platform === 'coindesk') {
            data = await catchPromiseError(
              fetchCoinDeskData(),
              { 
                severity: ErrorSeverity.WARNING,
                source: `api-${platform}`
              }
            );
          }

          // إرجاع بيانات مهيكلة للمنصة
          return {
            platform,
            isConnected: true,
            lastUpdated: new Date().toISOString(),
            data,
            error: data ? null : `فشل جلب البيانات من ${platform}`
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
      
      // إعادة إنشاء اتصالات الوقت الحقيقي بعد التحديث الأولي
      setupRealtimeConnections();
    } catch (err) {
      // معالجة الأخطاء العامة
      showError({
        message: t(
          'حدث خطأ أثناء جلب البيانات من المنصات المتصلة',
          'An error occurred while fetching data from connected platforms'
        ),
        severity: ErrorSeverity.ERROR,
        source: 'connected-api-data',
        details: err
      });
    } finally {
      // إنهاء حالة التحميل وتحديث وقت التحديث الأخير
      setIsLoading(false);
      setLastRefreshed(new Date());
    }
  }, [
    connectionStates, 
    apiKeys, 
    fetchBinanceData, 
    fetchCoinApiData, 
    fetchCryptoCompareData, 
    fetchLiveCoinWatchData, 
    fetchCoinDeskData, 
    showError,
    t,
    catchPromiseError,
    setupRealtimeConnections
  ]);

  // تمكين/تعطيل تحديثات الوقت الحقيقي
  const toggleRealTimeUpdates = useCallback((enabled: boolean) => {
    activeRealTimeUpdatesRef.current = enabled;
  }, []);

  // جلب البيانات الأولية عند تركيب المكون
  useEffect(() => {
    // تعيين المرجع لتتبع ما إذا كان المكون مثبتًا
    const isComponentMounted = true;
    
    fetchConnectedApiData();
    
    return () => {
      // تنظيف اتصالات WebSocket عند تفريغ المكون
      Object.values(wsConnectionsRef.current).forEach((connection: any) => {
        if (connection && connection.disconnect) {
          connection.disconnect();
        }
      });
    };
  }, [connectionStates, fetchConnectedApiData]);

  return {
    apiData,
    isLoading,
    lastRefreshed,
    refreshData: fetchConnectedApiData,
    toggleRealTimeUpdates
  };
};
