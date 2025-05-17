
/**
 * مدير اتصال WebSocket لتحديثات السوق المباشرة
 * يوفر وظائف لإنشاء وإدارة اتصالات WebSocket للحصول على بيانات السوق في الوقت الفعلي
 */

/**
 * أنواع الرموز المدعومة للمراقبة
 */
export type SupportedSymbol = 'btcusdt' | 'ethusdt' | 'bnbusdt' | 'solusdt';

/**
 * أنواع التحديثات المدعومة
 */
export type UpdateType = 'ticker' | 'kline' | 'depth' | 'trade';

/**
 * واجهة خيارات اتصال WebSocket
 */
export interface WebSocketOptions {
  symbol: SupportedSymbol;
  updateType: UpdateType;
  interval?: string; // مطلوب فقط لتحديثات kline
  retryLimit?: number; // عدد محاولات إعادة الاتصال القصوى
  reconnectDelay?: number; // التأخير بين محاولات إعادة الاتصال (بالمللي ثانية)
}

/**
 * إنشاء وإدارة اتصال WebSocket مع Binance
 * 
 * @param onMessageCallback - دالة رد النداء التي سيتم استدعاؤها عند استلام تحديث
 * @param options - خيارات تكوين WebSocket (اختياري، الافتراضي هو btcusdt@ticker)
 * @returns كائن WebSocket الذي تم إنشاؤه
 */
export function setupBinanceWebSocket(
  onMessageCallback: (data: any) => void,
  options: Partial<WebSocketOptions> = {}
): WebSocket {
  // تعيين القيم الافتراضية للخيارات
  const config: WebSocketOptions = {
    symbol: options.symbol || 'btcusdt',
    updateType: options.updateType || 'ticker',
    interval: options.updateType === 'kline' ? (options.interval || '1m') : undefined,
    retryLimit: options.retryLimit || 5,
    reconnectDelay: options.reconnectDelay || 3000,
  };
  
  // إنشاء مسار WebSocket المناسب
  const streamPath = config.updateType === 'kline'
    ? `${config.symbol}@kline_${config.interval}`
    : `${config.symbol}@${config.updateType}`;
  
  // التوصيل إلى Binance WebSocket API
  const binanceWsUrl = `wss://stream.binance.com:9443/ws/${streamPath}`;
  
  // تتبع محاولات إعادة الاتصال
  let retryCount = 0;
  let ws: WebSocket;
  
  // دالة لإنشاء الاتصال
  const connect = () => {
    const socket = new WebSocket(binanceWsUrl);
    
    // معالجة فتح الاتصال
    socket.onopen = () => {
      retryCount = 0; // إعادة تعيين العداد عند نجاح الاتصال
      console.log(`تم الاتصال بـ Binance WebSocket: ${streamPath}`);
    };
    
    // معالجة الرسائل الواردة
    socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        
        // تحديد ما إذا كان التحديث مهمًا بما يكفي لاستدعاء رد النداء
        let shouldCallback = true;
        
        // بالنسبة لتحديثات ticker، تحقق من وجود تغيير كبير في السعر
        if (config.updateType === 'ticker' && data.p) {
          const priceChange = parseFloat(data.p);
          shouldCallback = Math.abs(priceChange) > 0.5; // تغيير السعر أكبر من 0.5٪
        }
        
        // استدعاء رد النداء إذا كان التحديث مهمًا
        if (shouldCallback) {
          console.log(`تم اكتشاف تغيير مهم في تدفق WebSocket: ${streamPath}`);
          onMessageCallback(data);
        }
      } catch (e) {
        console.error("خطأ في معالجة رسالة WebSocket:", e);
      }
    };
    
    // معالجة أخطاء الاتصال
    socket.onerror = (error) => {
      console.error(`خطأ في WebSocket ${streamPath}:`, error);
    };
    
    // معالجة إغلاق الاتصال وإعادة الاتصال تلقائيًا إذا لزم الأمر
    socket.onclose = (event) => {
      console.log(`تم قطع الاتصال بـ Binance WebSocket: ${streamPath}, Code: ${event.code}`);
      
      // إعادة الاتصال تلقائيًا إذا لم يكن الإغلاق متعمدًا
      if (retryCount < config.retryLimit) {
        retryCount++;
        console.log(`محاولة إعادة الاتصال ${retryCount}/${config.retryLimit} بعد ${config.reconnectDelay}ms`);
        
        setTimeout(() => {
          ws = connect();
        }, config.reconnectDelay);
      } else {
        console.error(`فشلت إعادة الاتصال بعد ${config.retryLimit} محاولات`);
      }
    };
    
    return socket;
  };
  
  // بدء الاتصال الأولي
  ws = connect();
  
  return ws;
}

/**
 * إغلاق اتصال WebSocket بأمان
 * 
 * @param websocket - كائن WebSocket المراد إغلاقه
 * @param code - رمز الإغلاق (اختياري)
 * @param reason - سبب الإغلاق (اختياري)
 */
export function closeWebSocketSafely(websocket: WebSocket | null, code?: number, reason?: string): void {
  if (websocket && websocket.readyState === WebSocket.OPEN) {
    try {
      websocket.close(code || 1000, reason || 'إغلاق طبيعي');
    } catch (error) {
      console.error("خطأ أثناء إغلاق اتصال WebSocket:", error);
    }
  }
}

/**
 * إنشاء اشتراك مجمع لعدة رموز
 * 
 * @param symbols - مصفوفة من الرموز للاشتراك فيها
 * @param onMessageCallback - دالة رد النداء التي سيتم استدعاؤها عند استلام تحديث
 * @returns مصفوفة من كائنات WebSocket
 */
export function setupMultipleStreams(
  symbols: SupportedSymbol[], 
  onMessageCallback: (data: any) => void
): WebSocket[] {
  return symbols.map(symbol => 
    setupBinanceWebSocket(onMessageCallback, { symbol })
  );
}
