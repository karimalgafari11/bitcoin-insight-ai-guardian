
/**
 * جلب بيانات إضافية من API لاستخدامها في التوصيات
 */
export async function fetchAdditionalMarketData(symbol: string = 'BTC', currency: string = 'USD') {
  try {
    const response = await fetch(
      `/api/market-data-live?symbol=${symbol}&currency=${currency}&source=binance`
    );
    
    if (response.ok) {
      const marketData = await response.json();
      return {
        success: true,
        data: {
          binanceData: marketData,
          change24h: marketData.change24h,
          high24h: marketData.high24h,
          low24h: marketData.low24h
        }
      };
    }
    
    return {
      success: false,
      data: null,
      error: `فشل في جلب البيانات الإضافية: ${response.status}`
    };
  } catch (error) {
    console.error("خطأ في جلب بيانات السوق الإضافية:", error);
    return {
      success: false,
      data: null,
      error: error instanceof Error ? error.message : 'خطأ غير معروف'
    };
  }
}
