
/**
 * خدمة WebSocket للحصول على تحديثات البيانات في الوقت الحقيقي
 * يوفر واجهة موحدة للاتصال بمختلف خدمات WebSocket واستخدامها بكفاءة
 */

import { toast } from '@/components/ui/use-toast';

/**
 * أنواع الاتصال المدعومة
 */
export enum WebSocketConnectionType {
  MARKET_DATA = 'market_data',
  PRICE_FEED = 'price_feed',
  ORDER_BOOK = 'order_book',
  TRADES = 'trades',
  TICKER = 'ticker',
  KLINE = 'kline'
}

/**
 * واجهة إعدادات الاتصال
 */
export interface WebSocketConfig {
  symbol: string;                 // رمز العملة المشفرة (مثل btcusdt)
  type: WebSocketConnectionType;  // نوع الاتصال المطلوب
  interval?: string;              // الفاصل الزمني (مطلوب فقط لبعض الأنواع)
  market?: string;                // السوق المستهدف (مثل binance, kraken)
  reconnectAttempts?: number;     // عدد محاولات إعادة الاتصال
  reconnectInterval?: number;     // الفترة بين محاولات إعادة الاتصال (بالمللي ثانية)
  onReconnect?: () => void;       // دالة استدعاء عند إعادة الاتصال
  onError?: (error: any) => void; // دالة استدعاء عند حدوث خطأ
}

/**
 * إدارة اتصالات WebSocket النشطة ومحاولات إعادة الاتصال
 */
const connections = new Map<string, WebSocket>();
const reconnectTimers = new Map<string, number>();
const reconnectCounts = new Map<string, number>();
const messageBuffers = new Map<string, any[]>();
const connectionStatus = new Map<string, string>();

/**
 * إنشاء معرف فريد لاتصال WebSocket
 * يساعد في تتبع وإدارة اتصالات متعددة
 */
const createConnectionId = (config: WebSocketConfig): string => {
  return `${config.market || 'default'}_${config.type}_${config.symbol}_${config.interval || ''}`;
};

/**
 * الحصول على عنوان URL المناسب لنوع الاتصال والسوق
 */
const getWebSocketUrl = (config: WebSocketConfig): string => {
  const { symbol, type, interval, market } = config;
  
  // binance هو الخيار الافتراضي
  const provider = market?.toLowerCase() || 'binance';
  
  switch (provider) {
    case 'binance':
      // بناء المسار المناسب لـ Binance
      let streamPath = '';
      
      switch (type) {
        case WebSocketConnectionType.TICKER:
          streamPath = `${symbol}@ticker`;
          break;
        case WebSocketConnectionType.KLINE:
          if (!interval) throw new Error('interval مطلوب لاتصالات KLINE');
          streamPath = `${symbol}@kline_${interval}`;
          break;
        case WebSocketConnectionType.ORDER_BOOK:
          streamPath = `${symbol}@depth`;
          break;
        case WebSocketConnectionType.TRADES:
          streamPath = `${symbol}@trade`;
          break;
        default:
          streamPath = `${symbol}@ticker`; // استخدام ticker كخيار افتراضي
      }
      
      return `wss://stream.binance.com:9443/ws/${streamPath}`;
      
    case 'coinbase':
      // بناء المسار المناسب لـ Coinbase
      return 'wss://ws-feed.exchange.coinbase.com';
      
    case 'kraken':
      // بناء المسار المناسب لـ Kraken
      return 'wss://ws.kraken.com';
      
    case 'custom':
      // يمكن للمستخدم توفير عنوان URL مخصص في حقل symbol
      return symbol;
      
    default:
      // استخدام Binance كخيار افتراضي
      return `wss://stream.binance.com:9443/ws/${symbol}@ticker`;
  }
};

/**
 * إنشاء طلب الاشتراك المناسب للسوق المحدد
 */
const createSubscriptionRequest = (config: WebSocketConfig): string | null => {
  const { symbol, type, interval, market } = config;
  
  // binance لا تتطلب طلب اشتراك، فهي تستخدم المسار في URL
  if (!market || market.toLowerCase() === 'binance') {
    return null;
  }
  
  const provider = market.toLowerCase();
  
  switch (provider) {
    case 'coinbase':
      return JSON.stringify({
        type: 'subscribe',
        product_ids: [symbol],
        channels: [type === WebSocketConnectionType.TRADES ? 'matches' : 'ticker']
      });
      
    case 'kraken':
      return JSON.stringify({
        name: 'subscribe',
        reqid: Math.floor(Math.random() * 10000),
        pair: [symbol],
        subscription: {
          name: type === WebSocketConnectionType.TRADES ? 'trade' : 'ticker'
        }
      });
      
    default:
      return null;
  }
};

/**
 * معالجة الرسالة الواردة وتحويلها إلى تنسيق موحد
 */
const processIncomingMessage = (
  message: any, 
  config: WebSocketConfig
): any => {
  try {
    const data = typeof message === 'string' ? JSON.parse(message) : message;
    const { market, type } = config;
    
    // معالجة الرسالة بناءً على السوق وتحويلها إلى تنسيق موحد
    const provider = market?.toLowerCase() || 'binance';
    
    switch (provider) {
      case 'binance':
        // معالجة رسائل Binance
        if (type === WebSocketConnectionType.TICKER) {
          return {
            symbol: data.s,
            price: parseFloat(data.c),
            change: parseFloat(data.p),
            changePercent: parseFloat(data.P),
            volume: parseFloat(data.v),
            source: 'binance',
            timestamp: Date.now()
          };
        } else if (type === WebSocketConnectionType.KLINE) {
          return {
            symbol: data.s,
            interval: data.k.i,
            open: parseFloat(data.k.o),
            high: parseFloat(data.k.h),
            low: parseFloat(data.k.l),
            close: parseFloat(data.k.c),
            volume: parseFloat(data.k.v),
            isClosed: data.k.x,
            source: 'binance',
            timestamp: data.k.t
          };
        }
        break;
        
      case 'coinbase':
        // معالجة رسائل Coinbase
        if (data.type === 'ticker') {
          return {
            symbol: data.product_id,
            price: parseFloat(data.price),
            volume: parseFloat(data.volume_24h),
            source: 'coinbase',
            timestamp: new Date(data.time).getTime()
          };
        }
        break;
        
      case 'kraken':
        // معالجة رسائل Kraken
        // لا يمكن تحديد معالجة عامة لـ Kraken نظرًا لتنوع بنية الرسائل
        break;
    }
    
    // إذا لم يتم معالجة الرسالة، إرجاع البيانات الخام
    return data;
  } catch (error) {
    console.error('خطأ في معالجة رسالة WebSocket:', error);
    return message;
  }
};

/**
 * إنشاء اتصال WebSocket مع إدارة إعادة الاتصال
 */
export const createWebSocketConnection = (
  config: WebSocketConfig,
  onMessage: (data: any) => void
): { connectionId: string; disconnect: () => void } => {
  // إنشاء معرف للاتصال
  const connectionId = createConnectionId(config);
  
  // التحقق مما إذا كان الاتصال موجودًا بالفعل
  if (connections.has(connectionId)) {
    const existingConnection = connections.get(connectionId);
    if (existingConnection && (existingConnection.readyState === WebSocket.OPEN || existingConnection.readyState === WebSocket.CONNECTING)) {
      console.log(`إعادة استخدام اتصال WebSocket موجود: ${connectionId}`);
      return {
        connectionId,
        disconnect: () => disconnectWebSocket(connectionId)
      };
    }
  }
  
  // إنشاء اتصال جديد
  try {
    const wsUrl = getWebSocketUrl(config);
    const ws = new WebSocket(wsUrl);
    
    // تعيين الاتصال في الخريطة
    connections.set(connectionId, ws);
    connectionStatus.set(connectionId, 'connecting');
    
    // تهيئة عداد إعادة الاتصال
    reconnectCounts.set(connectionId, 0);
    
    // تهيئة مخزن مؤقت للرسائل
    messageBuffers.set(connectionId, []);
    
    // معالجة فتح الاتصال
    ws.onopen = () => {
      console.log(`تم فتح اتصال WebSocket: ${connectionId}`);
      connectionStatus.set(connectionId, 'connected');
      
      // إرسال طلب الاشتراك إذا كان مطلوبًا
      const subscriptionRequest = createSubscriptionRequest(config);
      if (subscriptionRequest) {
        ws.send(subscriptionRequest);
      }
      
      // إعادة تعيين عداد إعادة الاتصال
      reconnectCounts.set(connectionId, 0);
      
      // إذا كان هناك رسائل في المخزن المؤقت، قم بمعالجتها الآن
      const buffer = messageBuffers.get(connectionId) || [];
      if (buffer.length > 0) {
        console.log(`معالجة ${buffer.length} رسالة من المخزن المؤقت`);
        buffer.forEach((msg) => onMessage(msg));
        messageBuffers.set(connectionId, []);
      }
    };
    
    // معالجة الرسائل الواردة
    ws.onmessage = (event) => {
      try {
        const processedData = processIncomingMessage(event.data, config);
        onMessage(processedData);
      } catch (error) {
        console.error(`خطأ في معالجة رسالة WebSocket (${connectionId}):`, error);
        if (config.onError) {
          config.onError(error);
        }
      }
    };
    
    // معالجة الأخطاء
    ws.onerror = (error) => {
      console.error(`خطأ في اتصال WebSocket (${connectionId}):`, error);
      connectionStatus.set(connectionId, 'error');
      
      if (config.onError) {
        config.onError(error);
      }
    };
    
    // معالجة إغلاق الاتصال
    ws.onclose = (event) => {
      console.log(`تم إغلاق اتصال WebSocket (${connectionId}) - الرمز: ${event.code}, السبب: ${event.reason}`);
      connectionStatus.set(connectionId, 'disconnected');
      
      // محاولة إعادة الاتصال إذا لم يكن الإغلاق من جانبنا
      if (event.code !== 1000) {
        const attempts = reconnectCounts.get(connectionId) || 0;
        const maxAttempts = config.reconnectAttempts ?? 5;
        
        if (attempts < maxAttempts) {
          const nextAttempt = attempts + 1;
          reconnectCounts.set(connectionId, nextAttempt);
          
          const delay = config.reconnectInterval ?? 3000 * Math.pow(1.5, attempts);
          console.log(`محاولة إعادة اتصال WebSocket (${connectionId}) رقم ${nextAttempt} بعد ${delay}ms`);
          
          // إزالة أي مؤقت موجود
          if (reconnectTimers.has(connectionId)) {
            window.clearTimeout(reconnectTimers.get(connectionId));
          }
          
          // إعداد مؤقت إعادة الاتصال
          const timerId = window.setTimeout(() => {
            if (config.onReconnect) {
              config.onReconnect();
            }
            
            createWebSocketConnection(config, onMessage);
          }, delay);
          
          reconnectTimers.set(connectionId, timerId);
        } else {
          console.error(`تجاوز الحد الأقصى لمحاولات إعادة الاتصال (${maxAttempts}) لـ ${connectionId}`);
          
          toast({
            title: "مشكلة في الاتصال",
            description: "تعذر الاتصال بتحديثات الوقت الحقيقي. سيتم تحديث البيانات يدويًا.",
            variant: "destructive",
          });
        }
      }
    };
    
  } catch (error) {
    console.error(`خطأ في إنشاء اتصال WebSocket (${connectionId}):`, error);
    connectionStatus.set(connectionId, 'error');
    
    if (config.onError) {
      config.onError(error);
    }
  }
  
  return {
    connectionId,
    disconnect: () => disconnectWebSocket(connectionId)
  };
};

/**
 * قطع اتصال WebSocket وتنظيف الموارد المرتبطة به
 */
export const disconnectWebSocket = (connectionId: string): void => {
  // إيقاف أي مؤقت إعادة اتصال
  if (reconnectTimers.has(connectionId)) {
    window.clearTimeout(reconnectTimers.get(connectionId));
    reconnectTimers.delete(connectionId);
  }
  
  // الحصول على الاتصال
  const ws = connections.get(connectionId);
  if (!ws) {
    return;
  }
  
  // إغلاق الاتصال إذا كان مفتوحًا
  if (ws.readyState === WebSocket.OPEN || ws.readyState === WebSocket.CONNECTING) {
    try {
      ws.close(1000, "إغلاق طبيعي");
      console.log(`تم إغلاق اتصال WebSocket بنجاح: ${connectionId}`);
    } catch (error) {
      console.error(`خطأ في إغلاق اتصال WebSocket (${connectionId}):`, error);
    }
  }
  
  // إزالة الاتصال من الخرائط
  connections.delete(connectionId);
  connectionStatus.delete(connectionId);
  reconnectCounts.delete(connectionId);
  messageBuffers.delete(connectionId);
  
  console.log(`تم تنظيف موارد الاتصال: ${connectionId}`);
};

/**
 * هوك لإدارة اتصال WebSocket مباشر 
 */
export const useWebSocket = (
  config: WebSocketConfig | null,
  onMessage: (data: any) => void
) => {
  let connectionId: string | null = null;
  let disconnect: (() => void) | null = null;
  
  if (config) {
    const connection = createWebSocketConnection(config, onMessage);
    connectionId = connection.connectionId;
    disconnect = connection.disconnect;
  }
  
  return {
    connectionId,
    disconnect,
    isConnected: connectionId ? connectionStatus.get(connectionId) === 'connected' : false
  };
};

/**
 * تنظيف جميع اتصالات WebSocket
 * مفيد عند تفريغ المكونات أو تسجيل الخروج
 */
export const cleanupAllWebSocketConnections = (): void => {
  console.log(`تنظيف ${connections.size} اتصال WebSocket نشط`);
  
  // إيقاف جميع مؤقتات إعادة الاتصال
  reconnectTimers.forEach((timerId, connectionId) => {
    window.clearTimeout(timerId);
    console.log(`تم إيقاف مؤقت إعادة الاتصال: ${connectionId}`);
  });
  reconnectTimers.clear();
  
  // إغلاق جميع الاتصالات
  connections.forEach((ws, id) => {
    try {
      if (ws.readyState === WebSocket.OPEN || ws.readyState === WebSocket.CONNECTING) {
        ws.close(1000, "تنظيف عام");
        console.log(`تم إغلاق اتصال WebSocket: ${id}`);
      }
    } catch (error) {
      console.error(`خطأ في إغلاق اتصال WebSocket (${id}):`, error);
    }
  });
  
  // مسح جميع الخرائط
  connections.clear();
  connectionStatus.clear();
  reconnectCounts.clear();
  messageBuffers.clear();
  
  console.log("تم تنظيف جميع اتصالات WebSocket");
};
