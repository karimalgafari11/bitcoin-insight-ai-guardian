
/**
 * خدمة للتعامل مع عمليات مفاتيح API
 * توفر وظائف لحفظ واسترجاع واختبار مفاتيح API
 * تم تحسين الأمان من خلال استخدام وظائف Supabase Edge للتعامل مع المفاتيح الحساسة
 */
import { supabase } from '@/integrations/supabase/client';
import { ErrorSeverity } from '@/utils/errorHandling';

/**
 * واجهة المفتاح المحفوظ
 */
interface SavedApiKey {
  platform: string;
  hasKey: boolean;
  lastUpdated: string;
}

/**
 * واجهة نتيجة اختبار الاتصال
 */
interface ConnectionTestResult {
  success: boolean;
  connected: boolean;
  message?: string;
  error?: string;
}

/**
 * حفظ مفتاح API في التخزين المحلي
 * للاستخدام المؤقت أو في بيئة التطوير فقط
 * 
 * @param key - المعرّف الفريد لمفتاح API (مثل 'binance', 'coinapi')
 * @param value - قيمة مفتاح API
 * @throws {Error} عند الفشل في حفظ المفتاح
 */
export const saveApiKeyLocally = (key: string, value: string): void => {
  // التحقق من صحة المدخلات
  if (!key || !value) {
    console.error("لا يمكن حفظ مفتاح أو قيمة فارغة");
    throw new Error("مفتاح API أو القيمة لا يمكن أن تكون فارغة");
  }
  
  try {
    localStorage.setItem(key, value);
    console.log(`تم حفظ مفتاح API ${key} محليًا بنجاح`);
  } catch (error) {
    console.error("خطأ في حفظ مفتاح API محليًا:", error);
    throw new Error(`فشل حفظ مفتاح API محليًا: ${error}`);
  }
};

/**
 * استرجاع مفتاح API من التخزين المحلي
 * للاستخدام المؤقت أو في بيئة التطوير فقط
 * 
 * @param key - المعرّف الفريد لمفتاح API
 * @returns قيمة المفتاح أو null إذا لم يتم العثور عليه
 */
export const getApiKeyLocally = (key: string): string | null => {
  try {
    const value = localStorage.getItem(key);
    return value;
  } catch (error) {
    console.error("خطأ في استرجاع مفتاح API محليًا:", error);
    return null;
  }
};

/**
 * حفظ مفتاح API بشكل آمن باستخدام وظيفة Supabase
 * 
 * @param platform - اسم المنصة (مثل 'binance', 'coinapi')
 * @param apiKey - قيمة مفتاح API
 * @param apiSecret - قيمة سر API (اختياري)
 * @returns وعد يحتوي على نتيجة عملية الحفظ
 */
export const saveApiKey = async (
  platform: string, 
  apiKey: string, 
  apiSecret?: string
): Promise<{ success: boolean; message?: string; error?: string }> => {
  try {
    // استدعاء وظيفة Supabase لحفظ المفتاح بشكل آمن
    const { data, error } = await supabase.functions.invoke('api-key-service', {
      body: {
        action: 'save-api-key',
        platform,
        apiKey,
        apiSecret
      }
    });

    if (error) {
      console.error('خطأ في حفظ مفتاح API:', error);
      return { 
        success: false, 
        error: `فشل حفظ مفتاح API: ${error.message || 'خطأ غير معروف'}` 
      };
    }

    return data as { success: boolean; message?: string; error?: string };
  } catch (error) {
    console.error('خطأ في استدعاء وظيفة حفظ مفتاح API:', error);
    return { 
      success: false, 
      error: `فشل في استدعاء وظيفة حفظ مفتاح API: ${error instanceof Error ? error.message : 'خطأ غير معروف'}` 
    };
  }
};

/**
 * الحصول على قائمة مفاتيح API المحفوظة
 * 
 * @returns وعد يحتوي على قائمة المفاتيح المحفوظة
 */
export const getApiKeys = async (): Promise<SavedApiKey[]> => {
  try {
    // استدعاء وظيفة Supabase للحصول على المفاتيح المحفوظة
    const { data, error } = await supabase.functions.invoke('api-key-service', {
      body: { action: 'get-api-keys' }
    });

    if (error) {
      console.error('خطأ في الحصول على مفاتيح API:', error);
      return [];
    }

    return (data?.data || []) as SavedApiKey[];
  } catch (error) {
    console.error('خطأ في استدعاء وظيفة الحصول على مفاتيح API:', error);
    return [];
  }
};

/**
 * اختبار اتصال API باستخدام مفتاح محدد
 * 
 * @param platform - اسم المنصة
 * @param apiKey - مفتاح API للاختبار
 * @param apiSecret - سر API (اختياري)
 * @returns وعد يحتوي على نتيجة اختبار الاتصال
 */
export const testApiConnection = async (
  platform: string, 
  apiKey: string,
  apiSecret?: string
): Promise<ConnectionTestResult> => {
  try {
    // التحقق من وجود مفتاح API (باستثناء coindesk التي لا تتطلب مفتاح)
    if (!apiKey && platform !== 'coindesk') {
      console.error(`لا يمكن اختبار اتصال ${platform} بدون مفتاح API`);
      return {
        success: false,
        connected: false,
        error: `مفتاح API مطلوب لاختبار اتصال ${platform}`
      };
    }
    
    // استدعاء وظيفة Supabase لاختبار الاتصال
    const { data, error } = await supabase.functions.invoke('api-key-service', {
      body: {
        action: 'test-connection',
        platform,
        apiKey,
        apiSecret
      }
    });

    if (error) {
      console.error(`خطأ في اختبار اتصال ${platform}:`, error);
      return {
        success: false,
        connected: false,
        error: `فشل في اختبار اتصال ${platform}: ${error.message || 'خطأ غير معروف'}`
      };
    }

    return data as ConnectionTestResult;
  } catch (error) {
    console.error(`خطأ في استدعاء وظيفة اختبار اتصال ${platform}:`, error);
    return {
      success: false,
      connected: false,
      error: `فشل في استدعاء وظيفة اختبار اتصال: ${error instanceof Error ? error.message : 'خطأ غير معروف'}`
    };
  }
};

/**
 * تهيئة مفاتيح API الافتراضية للتطوير
 * هذه الوظيفة مخصصة للاستخدام في بيئة التطوير فقط
 * في الإنتاج، يجب على المستخدمين إدخال مفاتيحهم الخاصة
 */
export const initializeDefaultApiKeys = (): void => {
  try {
    // التحقق مما إذا كنا في بيئة التطوير
    const isDevelopment = process.env.NODE_ENV === 'development';
    
    if (!isDevelopment) {
      console.log('تجاوز تهيئة مفاتيح API الافتراضية في بيئة الإنتاج');
      return;
    }
    
    // Binance Testnet
    if (!localStorage.getItem('binance_testnet_api_key')) {
      localStorage.setItem('binance_testnet_api_key', 'MZHFuqNOHvWKnOzkHW40wnSMZnGt5uBKf52MGlaS56KxhPRlvtMpaPKLskbugXo6');
      localStorage.setItem('binance_testnet_api_secret', 'EeNklW8QSleR9kREtZSlHoHpSggCSqZKpZ2Gu9COb6toKFuCpXLmXgguxOABlS7w');
    }
    
    // LiveCoinWatch
    if (!localStorage.getItem('livecoinwatch_api_key')) {
      localStorage.setItem('livecoinwatch_api_key', 'e0905662-5ee1-485d-bba6-bfc643ce0d3a');
    }
    
    console.log('تم تهيئة مفاتيح API الافتراضية للتطوير بنجاح');
  } catch (error) {
    console.error("خطأ في تهيئة مفاتيح API الافتراضية:", error);
  }
};

// تهيئة مفاتيح API الافتراضية عند استيراد هذا الملف (للتطوير فقط)
initializeDefaultApiKeys();
