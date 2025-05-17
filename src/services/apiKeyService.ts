
/**
 * خدمة للتعامل مع عمليات مفاتيح API
 * توفر وظائف لحفظ واسترجاع واختبار مفاتيح API
 */

/**
 * حفظ مفتاح API في التخزين المحلي
 * 
 * @param key - المعرّف الفريد لمفتاح API (مثل 'binance', 'coinapi')
 * @param value - قيمة مفتاح API
 * @throws {Error} عند الفشل في حفظ المفتاح
 */
export const saveApiKey = (key: string, value: string): void => {
  // التحقق من صحة المدخلات
  if (!key || !value) {
    console.error("لا يمكن حفظ مفتاح أو قيمة فارغة");
    throw new Error("مفتاح API أو القيمة لا يمكن أن تكون فارغة");
  }
  
  try {
    localStorage.setItem(key, value);
    console.log(`تم حفظ مفتاح API ${key} بنجاح`);
  } catch (error) {
    console.error("خطأ في حفظ مفتاح API:", error);
    throw new Error(`فشل حفظ مفتاح API: ${error}`);
  }
};

/**
 * استرجاع مفتاح API من التخزين المحلي
 * 
 * @param key - المعرّف الفريد لمفتاح API
 * @returns قيمة المفتاح أو null إذا لم يتم العثور عليه
 */
export const getApiKey = (key: string): string | null => {
  try {
    const value = localStorage.getItem(key);
    return value;
  } catch (error) {
    console.error("خطأ في استرجاع مفتاح API:", error);
    return null;
  }
};

/**
 * اختبار اتصال بينانس باستخدام مفتاح API المقدم
 * 
 * @param apiKey - مفتاح API بينانس للاختبار
 * @returns {Promise<boolean>} نجاح أو فشل الاتصال
 */
export const testBinanceConnection = async (apiKey: string): Promise<boolean> => {
  // التحقق من وجود مفتاح API
  if (!apiKey) {
    console.error("لا يمكن اختبار الاتصال بدون مفتاح API");
    return false;
  }
  
  try {
    // استخدام نقطة نهاية ping البسيطة لاختبار الاتصال
    const response = await fetch("https://api.binance.com/api/v3/ping", {
      method: "GET",
      headers: {
        "X-MBX-APIKEY": apiKey
      }
    });
    
    return response.ok;
  } catch (error) {
    console.error("خطأ في اختبار اتصال بينانس:", error);
    return false;
  }
};

/**
 * اختبار اتصال API لمنصات مختلفة
 * يحدد تلقائيًا نقطة النهاية والرؤوس المناسبة بناءً على المنصة
 * 
 * @param platform - اسم المنصة ('binance_testnet', 'coinapi', إلخ)
 * @param apiKey - مفتاح API للاختبار
 * @returns {Promise<boolean>} نجاح أو فشل الاتصال
 */
export const testApiConnection = async (platform: string, apiKey: string): Promise<boolean> => {
  // التحقق من وجود مفتاح API (باستثناء coindesk التي لا تتطلب مفتاح)
  if (!apiKey && platform !== 'coindesk') {
    console.error(`لا يمكن اختبار اتصال ${platform} بدون مفتاح API`);
    return false;
  }
  
  try {
    // تكوين معلمات الطلب بناءً على المنصة
    let endpoint = "";
    let headers: Record<string, string> = {};
    let method: string = "GET";
    let body: string | undefined = undefined;
    
    // تعيين تكوين مخصص لكل منصة
    switch (platform) {
      case "binance_testnet":
        endpoint = "https://testnet.binance.vision/api/v3/ping";
        headers = { "X-MBX-APIKEY": apiKey };
        break;
        
      case "coinapi":
        endpoint = "https://rest.coinapi.io/v1/exchanges";
        headers = { "X-CoinAPI-Key": apiKey };
        break;
        
      case "coindesk":
        // CoinDesk لا تتطلب مفتاح API لنقطة نهاية السعر العامة
        endpoint = "https://api.coindesk.com/v1/bpi/currentprice.json";
        break;
        
      case "cryptocompare":
        endpoint = "https://min-api.cryptocompare.com/data/price?fsym=BTC&tsyms=USD";
        headers = { "authorization": `Apikey ${apiKey}` };
        break;
        
      case "livecoinwatch":
        endpoint = "https://api.livecoinwatch.com/status";
        headers = { 
          "content-type": "application/json",
          "x-api-key": apiKey 
        };
        method = "POST";
        body = JSON.stringify({});
        break;
        
      default:
        console.warn(`لم يتم تكوين نقطة نهاية للمنصة: ${platform}`);
        return false;
    }
    
    // إجراء طلب الاختبار
    const response = await fetch(endpoint, {
      method,
      headers,
      body
    });
    
    return response.ok;
  } catch (error) {
    console.error(`خطأ في اختبار اتصال ${platform}:`, error);
    return false;
  }
};

/**
 * تهيئة مفاتيح API لـ Binance Testnet و LiveCoinWatch
 * (سيتم تشغيل هذا مرة واحدة عندما يتم استيراد الخدمة)
 */
try {
  // Binance Testnet
  if (!localStorage.getItem('binance_testnet_api_key')) {
    localStorage.setItem('binance_testnet_api_key', 'MZHFuqNOHvWKnOzkHW40wnSMZnGt5uBKf52MGlaS56KxhPRlvtMpaPKLskbugXo6');
    localStorage.setItem('binance_testnet_api_secret', 'EeNklW8QSleR9kREtZSlHoHpSggCSqZKpZ2Gu9COb6toKFuCpXLmXgguxOABlS7w');
  }
  
  // LiveCoinWatch
  if (!localStorage.getItem('livecoinwatch_api_key')) {
    localStorage.setItem('livecoinwatch_api_key', 'e0905662-5ee1-485d-bba6-bfc643ce0d3a');
  }
} catch (error) {
  console.error("خطأ في تهيئة مفاتيح API:", error);
}
