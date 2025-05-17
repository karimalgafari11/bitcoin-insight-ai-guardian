
/**
 * وظائف مساعدة لمعالجة بيانات السوق
 * تم تحسين إدارة الأخطاء وتوثيق الكود
 */

import { corsHeaders } from './cors.ts';

/**
 * واجهة معلومات الخطأ الموحدة
 * تحدد بنية موحدة لإرجاع معلومات الأخطاء
 */
interface ErrorResponseInfo {
  message: string;      // رسالة الخطأ الرئيسية
  status?: number;      // رمز حالة HTTP
  details?: unknown;    // تفاصيل إضافية عن الخطأ (اختيارية)
  source?: string;      // مصدر الخطأ (اختياري)
  errorCode?: string;   // رمز الخطأ (اختياري)
}

/**
 * دالة مساعدة لإنشاء استجابات خطأ متسقة
 * توفر بنية موحدة للإبلاغ عن الأخطاء
 * 
 * @param errorInfo - معلومات الخطأ المراد تضمينها في الاستجابة
 * @returns استجابة منسقة تحتوي على تفاصيل الخطأ
 */
export function errorResponse(errorInfo: ErrorResponseInfo): Response {
  const { message, status = 500, details, source = 'server', errorCode } = errorInfo;
  
  // تسجيل الخطأ للتتبع والتصحيح
  console.error(`Error [${source}]: ${message}`, details || '');
  
  // بنية استجابة خطأ موحدة
  return new Response(
    JSON.stringify({
      error: message,
      errorCode,
      source,
      isLive: false,
      timestamp: new Date().toISOString(),
      details: details ? String(details) : undefined,
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
 * توفر بنية موحدة للاستجابات الناجحة
 * 
 * @param data - البيانات المراد إرجاعها في الاستجابة
 * @param customHeaders - رؤوس HTTP إضافية (اختياري)
 * @returns استجابة منسقة تحتوي على البيانات المطلوبة
 */
export function successResponse(
  data: any, 
  customHeaders: Record<string, string> = {}
): Response {
  // إضافة طابع زمني وعلامات إضافية للاستجابة
  const responseData = {
    ...data,
    timestamp: new Date().toISOString(),
    success: true,
    isLive: data.isLive || false
  };
  
  // دمج الرؤوس المخصصة مع رؤوس CORS الأساسية
  const headers = { 
    ...corsHeaders, 
    "Content-Type": "application/json",
    ...customHeaders
  };
  
  return new Response(
    JSON.stringify(responseData),
    { headers }
  );
}

/**
 * تحليل معلمات URL مع التحقق من صحتها
 * توفر طريقة موثوقة للحصول على المعلمات المطلوبة من URL
 * مع قيم افتراضية آمنة
 * 
 * @param url - كائن URL المراد تحليل معلماته
 * @param allowedValues - القيم المسموح بها لكل معلمة (اختياري)
 * @returns كائن يحتوي على المعلمات المحللة والمتحقق منها
 */
export function parseRequestParams(
  url: URL,
  allowedValues: Record<string, string[]> = {}
): { 
  symbol: string, 
  currency: string, 
  source: string,
  timeframe?: string,
  limit?: number
} {
  // استخراج المعلمات مع القيم الافتراضية
  const symbol = url.searchParams.get('symbol') || 'BTC';
  const currency = url.searchParams.get('currency') || 'USD';
  const source = url.searchParams.get('source') || 'binance';
  const timeframe = url.searchParams.get('timeframe') || undefined;
  const limitStr = url.searchParams.get('limit');
  
  // التحقق من صحة المعلمات
  const validSymbol = /^[A-Za-z0-9]+$/.test(symbol);
  const validCurrency = /^[A-Za-z]+$/.test(currency);
  
  // التحقق من مصدر البيانات
  const validSources = allowedValues.source || ['binance', 'coinapi', 'cryptocompare', 'coindesk', 'livecoinwatch'];
  const validSource = validSources.includes(source.toLowerCase());
  
  // التحقق من الإطار الزمني (إذا تم توفيره)
  let validTimeframe = true;
  if (timeframe && allowedValues.timeframe) {
    validTimeframe = allowedValues.timeframe.includes(timeframe);
  }
  
  // التحقق من حد النتائج (إذا تم توفيره)
  let limit: number | undefined = undefined;
  if (limitStr) {
    const parsedLimit = parseInt(limitStr);
    if (!isNaN(parsedLimit) && parsedLimit > 0 && parsedLimit <= 1000) {
      limit = parsedLimit;
    }
  }
  
  // إرجاع المعلمات المحللة مع التنسيق المناسب
  return {
    symbol: validSymbol ? symbol.toUpperCase() : 'BTC',
    currency: validCurrency ? currency.toUpperCase() : 'USD',
    source: validSource ? source.toLowerCase() : 'binance',
    timeframe: validTimeframe ? timeframe : undefined,
    limit
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

/**
 * التقاط ومعالجة أخطاء الشبكة بشكل أنيق
 * 
 * @param promise - وعد شبكة للتعامل معه
 * @param errorMessage - رسالة خطأ افتراضية
 * @returns البيانات المستلمة أو رمي استثناء مع رسالة واضحة
 */
export async function handleFetchErrors<T>(
  promise: Promise<Response>,
  errorMessage: string = 'خطأ في طلب الشبكة'
): Promise<T> {
  try {
    const response = await promise;
    
    if (!response.ok) {
      // محاولة الحصول على رسالة الخطأ من الاستجابة
      let errorDetails;
      try {
        errorDetails = await response.text();
      } catch {
        errorDetails = `رمز الحالة: ${response.status}`;
      }
      
      throw new Error(`${errorMessage}: ${errorDetails}`);
    }
    
    return await response.json() as T;
  } catch (error) {
    // تغليف جميع الأخطاء بتنسيق موحد
    if (error instanceof Error) {
      throw new Error(`${errorMessage}: ${error.message}`);
    }
    
    throw new Error(`${errorMessage}: خطأ غير معروف`);
  }
}
