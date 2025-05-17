
/**
 * إدارة اتصال WebSocket لتحديثات السوق المباشرة
 */
export function setupBinanceWebSocket(onMessageCallback: (data: any) => void) {
  // توصيل إلى Binance WebSocket API
  const binanceWsUrl = `wss://stream.binance.com:9443/ws/btcusdt@ticker`;
  
  const ws = new WebSocket(binanceWsUrl);
  
  ws.onopen = () => {
    console.log("تم الاتصال بـ Binance WebSocket للحصول على تحديثات السوق في الوقت الفعلي");
  };
  
  ws.onmessage = (event) => {
    try {
      const data = JSON.parse(event.data);
      // تفعيل تحديث التوصية فقط عند وجود تغيير كبير في السعر
      if (Math.abs(parseFloat(data.p)) > 0.5) {
        console.log("تم اكتشاف تغيير كبير في السعر في تدفق WebSocket، وتحديث التوصية");
        onMessageCallback(data);
      }
    } catch (e) {
      console.error("خطأ في معالجة رسالة WebSocket:", e);
    }
  };
  
  ws.onerror = (error) => {
    console.error("خطأ في WebSocket:", error);
  };
  
  ws.onclose = () => {
    console.log("تم قطع الاتصال بـ Binance WebSocket");
  };
  
  return ws;
}
