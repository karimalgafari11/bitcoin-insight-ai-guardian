
import { corsHeaders } from './cors.ts';

/**
 * دالة مساعدة لإنشاء استجابات خطأ متسقة
 * 
 * @param message - رسالة الخطأ التي سيتم عرضها للمستخدم
 * @param status - رمز حالة HTTP (الافتراضي 500)
 * @returns استجابة منسقة تحتوي على تفاصيل الخطأ
 */
export function errorResponse(message: string, status: number = 500): Response {
  console.error(`Error: ${message}`);
  
  // بنية استجابة خطأ موحدة
  return new Response(
    JSON.stringify({
      error: message,
      source: "error",
      isLive: false,
      timestamp: new Date().toISOString(),
      status
    }),
    { 
      headers: { ...corsHeaders, "Content-Type": "application/json" }, 
      status 
    }
  );
}

/**
 * دالة مساعدة للاستجابات الناجحة
 * 
 * @param data - البيانات المراد إرجاعها في الاستجابة
 * @returns استجابة منسقة تحتوي على البيانات المطلوبة
 */
export function successResponse(data: any): Response {
  // إضافة طابع زمني للاستجابة
  const responseData = {
    ...data,
    timestamp: new Date().toISOString()
  };
  
  return new Response(
    JSON.stringify(responseData),
    { headers: { ...corsHeaders, "Content-Type": "application/json" } }
  );
}

/**
 * تحليل معلمات URL مع التحقق من صحتها
 * 
 * @param url - كائن URL المراد تحليل معلماته
 * @returns كائن يحتوي على المعلمات المحللة والمتحقق منها
 */
export function parseRequestParams(url: URL): { 
  symbol: string, 
  currency: string, 
  source: string 
} {
  // استخراج المعلمات مع القيم الافتراضية
  const symbol = url.searchParams.get('symbol') || 'BTC';
  const currency = url.searchParams.get('currency') || 'USD';
  const source = url.searchParams.get('source') || 'binance';
  
  // التحقق من صحة المعلمات
  const validSymbol = /^[A-Za-z0-9]+$/.test(symbol);
  const validCurrency = /^[A-Za-z]+$/.test(currency);
  const validSource = ['binance', 'coinapi', 'cryptocompare', 'coindesk', 'livecoinwatch'].includes(source.toLowerCase());
  
  // إرجاع المعلمات المحللة مع التنسيق المناسب
  return {
    symbol: validSymbol ? symbol.toUpperCase() : 'BTC',
    currency: validCurrency ? currency.toUpperCase() : 'USD',
    source: validSource ? source.toLowerCase() : 'binance'
  };
}

/**
 * تحويل التاريخ إلى تنسيق قياسي
 * 
 * @param date - كائن التاريخ المراد تنسيقه
 * @returns سلسلة تمثل التاريخ بتنسيق ISO
 */
export function formatDate(date: Date): string {
  return date.toISOString();
}
