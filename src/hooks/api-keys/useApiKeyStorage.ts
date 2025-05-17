
/**
 * هوك لإدارة تخزين مفاتيح API
 * توفر واجهة موحدة للتعامل مع مفاتيح API سواء محليًا أو عبر Supabase
 */
import { useState, useEffect, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';
import { 
  saveApiKey, saveApiKeyLocally, getApiKeyLocally, getApiKeys as fetchApiKeys
} from '@/services/apiKeyService';
import { useErrorHandler, ErrorSeverity } from '@/utils/errorHandling';

export function useApiKeyStorage() {
  const { t } = useLanguage();
  const { toast } = useToast();
  const { handleApiError } = useErrorHandler();
  
  const [apiKeys, setApiKeys] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState<boolean>(false);

  /**
   * تحميل المفاتيح المخزنة سابقًا من مصادر مختلفة
   */
  const loadSavedApiKeys = useCallback(async () => {
    setIsLoading(true);
    
    try {
      // محاولة الحصول على المفاتيح من Supabase أولاً
      const apiKeysList = await fetchApiKeys();
      
      const savedKeys: Record<string, string> = {};
      
      // إذا تم الحصول على مفاتيح من Supabase، استخدمها
      if (apiKeysList && apiKeysList.length > 0) {
        // بالنسبة لمفاتيح Supabase، نحن نعلم أنها موجودة ولكن لا نخزن قيمها فعليًا هنا
        apiKeysList.forEach(key => {
          // نضع قيمة رمزية لنشير إلى أن المفتاح موجود
          savedKeys[key.platform] = 'STORED_SECURELY';
        });
      } 
      
      // محاولة الحصول على مفاتيح من التخزين المحلي كنسخة احتياطية
      const localPlatforms = ['binance', 'binance_testnet', 'coinapi', 'coindesk', 'cryptocompare', 'livecoinwatch'];
      
      localPlatforms.forEach(platform => {
        if (!savedKeys[platform]) {
          const localKey = getApiKeyLocally(`${platform}_api_key`);
          if (localKey) {
            savedKeys[platform] = localKey;
          }
        }
      });
      
      setApiKeys(savedKeys);
    } catch (error) {
      handleApiError(error, 'api-key-storage');
      // الحفاظ على المفاتيح الموجودة إذا فشل التحميل
    } finally {
      setIsLoading(false);
    }
  }, [handleApiError]);

  // تحميل المفاتيح المخزنة عند تركيب المكون
  useEffect(() => {
    loadSavedApiKeys();
  }, [loadSavedApiKeys]);

  /**
   * حفظ مفتاح API للمنصة المحددة
   */
  const storeApiKey = useCallback(async (
    platform: string, 
    apiKey: string,
    apiSecret?: string
  ): Promise<boolean> => {
    if (!platform || !apiKey) {
      toast({
        title: t('خطأ', 'Error'),
        description: t('المنصة ومفتاح API مطلوبان', 'Platform and API key are required'),
        variant: 'destructive',
      });
      return false;
    }

    setIsLoading(true);
    
    try {
      // أولاً نحاول حفظ المفتاح بشكل آمن باستخدام Supabase
      const result = await saveApiKey(platform, apiKey, apiSecret);
      
      if (result.success) {
        // تحديث الحالة المحلية
        setApiKeys(prev => ({
          ...prev,
          [platform]: 'STORED_SECURELY'
        }));
        
        toast({
          title: t('تم بنجاح', 'Success'),
          description: t(
            'تم حفظ مفتاح API بأمان', 
            'API key has been securely saved'
          ),
        });
        
        return true;
      } else {
        // إذا فشل الحفظ في Supabase، نحتفظ به محليًا كنسخة احتياطية
        console.log('فشل الحفظ عبر Supabase، الاحتفاظ بالمفتاح محليًا', result.error);
        
        // حفظ المفتاح محليًا
        saveApiKeyLocally(`${platform}_api_key`, apiKey);
        
        if (apiSecret) {
          saveApiKeyLocally(`${platform}_api_secret`, apiSecret);
        }
        
        // تحديث الحالة المحلية
        setApiKeys(prev => ({
          ...prev,
          [platform]: apiKey
        }));
        
        toast({
          title: t('تم الحفظ محليًا', 'Saved Locally'),
          description: t(
            'تم حفظ مفتاح API محليًا. للحماية القصوى، حاول الاتصال بـ Supabase',
            'API key saved locally. For maximum protection, try connecting to Supabase'
          ),
          variant: 'warning',
        });
        
        return true;
      }
    } catch (error) {
      handleApiError(error, 'api-key-storage');
      
      // محاولة التخزين المحلي كملاذ أخير
      try {
        saveApiKeyLocally(`${platform}_api_key`, apiKey);
        
        if (apiSecret) {
          saveApiKeyLocally(`${platform}_api_secret`, apiSecret);
        }
        
        setApiKeys(prev => ({
          ...prev,
          [platform]: apiKey
        }));
        
        toast({
          title: t('تم الحفظ محليًا', 'Saved Locally'),
          description: t(
            'تم حفظ مفتاح API محليًا بسبب خطأ',
            'API key saved locally due to an error'
          ),
          variant: 'warning',
        });
        
        return true;
      } catch (localError) {
        toast({
          title: t('خطأ', 'Error'),
          description: t(
            'فشل حفظ مفتاح API',
            'Failed to save API key'
          ),
          variant: 'destructive',
        });
        return false;
      }
    } finally {
      setIsLoading(false);
    }
  }, [t, toast, handleApiError]);

  /**
   * الحصول على مفتاح API للمنصة المحددة
   */
  const getApiKey = useCallback((platform: string): string | null => {
    // إذا كان المفتاح مخزنًا بشكل آمن، فإننا لا نستطيع استرداد قيمته الفعلية
    // في هذه الحالة، سنستخدم النسخة المخزنة محليًا إذا كانت متوفرة
    if (apiKeys[platform] === 'STORED_SECURELY') {
      return getApiKeyLocally(`${platform}_api_key`);
    }
    
    return apiKeys[platform] || null;
  }, [apiKeys]);

  /**
   * التحقق مما إذا كان لدى المستخدم مفتاح API مخزن للمنصة المحددة
   */
  const hasApiKey = useCallback((platform: string): boolean => {
    return !!apiKeys[platform] || !!getApiKeyLocally(`${platform}_api_key`);
  }, [apiKeys]);

  return {
    apiKeys,
    isLoading,
    storeApiKey,
    getApiKey,
    hasApiKey,
    refreshApiKeys: loadSavedApiKeys
  };
}
