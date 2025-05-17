
import { toast } from '@/components/ui/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';

/**
 * أنواع الأخطاء المدعومة في النظام
 * تعريف للمستويات المختلفة من الأخطاء التي يمكن الإبلاغ عنها
 */
export enum ErrorSeverity {
  CRITICAL = 'critical',   // أخطاء حرجة تمنع استمرار العمل
  ERROR = 'error',         // أخطاء تؤثر على وظائف أساسية
  WARNING = 'warning',     // تحذيرات قد تؤثر على بعض الوظائف
  INFO = 'info'            // معلومات عن مشكلات طفيفة
}

/**
 * واجهة لتوحيد بنية معلومات الخطأ
 */
export interface ErrorInfo {
  message: string;         // رسالة الخطأ
  severity: ErrorSeverity; // مستوى خطورة الخطأ
  source?: string;         // مصدر الخطأ (واجهة المستخدم، API، إلخ)
  details?: unknown;       // تفاصيل إضافية عن الخطأ
  timestamp?: Date;        // وقت حدوث الخطأ
  code?: string;           // رمز الخطأ (اختياري)
}

/**
 * عرض الخطأ للمستخدم باستخدام نظام التنبيهات
 * 
 * @param error - معلومات الخطأ المراد عرضها
 * @param t - وظيفة الترجمة من سياق اللغة
 */
export const displayError = (
  error: ErrorInfo,
  t: (arabic: string, english: string) => string
): void => {
  // تحديد نوع التنبيه بناءً على مستوى الخطأ
  const variant = error.severity === ErrorSeverity.CRITICAL || error.severity === ErrorSeverity.ERROR
    ? 'destructive'
    : error.severity === ErrorSeverity.WARNING
    ? 'warning'
    : 'default';
  
  // عرض التنبيه للمستخدم
  toast({
    title: t(
      getErrorTitle(error.severity),
      getErrorTitleEn(error.severity)
    ),
    description: error.message,
    variant,
  });
  
  // تسجيل الخطأ في وحدة التحكم للمطورين
  console.error(
    `[${error.severity.toUpperCase()}] ${error.source ? `[${error.source}]` : ''} ${error.message}`, 
    error.details || ''
  );
};

/**
 * التقاط ومعالجة الأخطاء من الوعود (Promises)
 * 
 * @param promise - الوعد المراد التقاط أخطائه
 * @param errorInfo - معلومات إضافية عن الخطأ (اختياري)
 * @returns نتيجة الوعد أو لا شيء في حالة الخطأ
 */
export const catchPromiseError = async <T>(
  promise: Promise<T>,
  errorInfo?: Partial<ErrorInfo>
): Promise<T | undefined> => {
  try {
    return await promise;
  } catch (error) {
    const defaultErrorInfo: ErrorInfo = {
      message: error instanceof Error ? error.message : 'حدث خطأ غير معروف',
      severity: ErrorSeverity.ERROR,
      source: 'api',
      details: error,
      timestamp: new Date()
    };
    
    console.error('خطأ في تنفيذ العملية:', {
      ...defaultErrorInfo,
      ...errorInfo
    });
    
    return undefined;
  }
};

/**
 * الحصول على عنوان الخطأ بالعربية بناءً على مستوى الخطورة
 */
function getErrorTitle(severity: ErrorSeverity): string {
  switch (severity) {
    case ErrorSeverity.CRITICAL:
      return 'خطأ حرج';
    case ErrorSeverity.ERROR:
      return 'خطأ';
    case ErrorSeverity.WARNING:
      return 'تحذير';
    case ErrorSeverity.INFO:
      return 'تنبيه';
    default:
      return 'خطأ';
  }
}

/**
 * الحصول على عنوان الخطأ بالإنجليزية بناءً على مستوى الخطورة
 */
function getErrorTitleEn(severity: ErrorSeverity): string {
  switch (severity) {
    case ErrorSeverity.CRITICAL:
      return 'Critical Error';
    case ErrorSeverity.ERROR:
      return 'Error';
    case ErrorSeverity.WARNING:
      return 'Warning';
    case ErrorSeverity.INFO:
      return 'Notice';
    default:
      return 'Error';
  }
}

/**
 * هوك مساعد لاستخدام وظائف إدارة الأخطاء
 * يوفر وظائف لعرض الأخطاء والتقاطها بسهولة
 */
export const useErrorHandler = () => {
  const { t } = useLanguage();
  
  const showError = (errorInfo: ErrorInfo) => {
    displayError(errorInfo, t);
  };
  
  const handleApiError = (error: unknown, source: string = 'api') => {
    const errorMessage = error instanceof Error 
      ? error.message 
      : typeof error === 'string'
      ? error
      : 'حدث خطأ غير متوقع';
    
    showError({
      message: errorMessage,
      severity: ErrorSeverity.ERROR,
      source,
      details: error,
      timestamp: new Date()
    });
  };
  
  return {
    showError,
    handleApiError,
    catchPromiseError: async <T>(promise: Promise<T>, errorInfo?: Partial<ErrorInfo>) => {
      try {
        return await promise;
      } catch (error) {
        handleApiError(error, errorInfo?.source);
        return undefined;
      }
    }
  };
};
