
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// تكوين رؤوس CORS
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
};

// إنشاء عميل Supabase
const supabaseAdmin = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
);

serve(async (req) => {
  // معالجة طلبات CORS المسبقة
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // التحقق من مصادقة المستخدم
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'غير مصرح به' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // استخراج رمز الوصول من رأس المصادقة
    const token = authHeader.replace('Bearer ', '');
    
    // التحقق من صحة الرمز واستخراج معرف المستخدم
    const { data: userData, error: authError } = await supabaseAdmin.auth.getUser(token);
    if (authError || !userData?.user) {
      return new Response(
        JSON.stringify({ error: 'غير مصرح به', details: authError }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const userId = userData.user.id;
    const path = new URL(req.url).pathname;
    const parts = path.split('/');
    const action = parts[parts.length - 1]; // آخر جزء من المسار

    // الحصول على بيانات الطلب
    let requestData = {};
    if (req.method === 'POST') {
      try {
        requestData = await req.json();
      } catch (e) {
        // استمر حتى إذا كان الجسم فارغًا
      }
    }

    // معالجة الإجراءات المختلفة
    let result;
    
    switch (action) {
      case 'save-api-key':
        result = await handleSaveApiKey(userId, requestData);
        break;
      
      case 'get-api-keys':
        result = await handleGetApiKeys(userId);
        break;
      
      case 'test-connection':
        result = await handleTestConnection(requestData);
        break;
      
      default:
        return new Response(
          JSON.stringify({ error: 'إجراء غير معروف' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
    }

    return new Response(
      JSON.stringify(result),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('خطأ غير متوقع:', error);
    
    return new Response(
      JSON.stringify({ 
        error: 'حدث خطأ داخلي في الخادم', 
        details: error instanceof Error ? error.message : String(error) 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});

/**
 * معالجة حفظ مفتاح API للمستخدم
 */
async function handleSaveApiKey(userId: string, data: any) {
  const { platform, apiKey, apiSecret = null } = data;
  
  if (!platform || !apiKey) {
    return { 
      success: false, 
      error: 'المنصة ومفتاح API مطلوبان' 
    };
  }

  try {
    // حفظ المفتاح في جدول user_api_keys
    // إن لم يكن الجدول موجودًا، يجب إنشاؤه عبر هجرة SQL
    await supabaseAdmin.from('user_api_keys').upsert({
      user_id: userId,
      platform,
      api_key: apiKey,
      api_secret: apiSecret,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }, {
      onConflict: 'user_id,platform'
    });

    return { 
      success: true, 
      message: 'تم حفظ مفتاح API بنجاح' 
    };
  } catch (error) {
    console.error('خطأ في حفظ مفتاح API:', error);
    
    return { 
      success: false, 
      error: 'فشل حفظ مفتاح API', 
      details: error instanceof Error ? error.message : String(error) 
    };
  }
}

/**
 * الحصول على مفاتيح API للمستخدم
 */
async function handleGetApiKeys(userId: string) {
  try {
    const { data, error } = await supabaseAdmin
      .from('user_api_keys')
      .select('platform, created_at, updated_at')
      .eq('user_id', userId);

    if (error) throw error;

    // تحويل البيانات إلى شكل أكثر فائدة للواجهة
    // لاحظ أننا لا نرسل المفاتيح الفعلية، فقط معلومات عن وجودها
    const formattedData = data.map(item => ({
      platform: item.platform,
      hasKey: true,
      lastUpdated: item.updated_at
    }));

    return { 
      success: true, 
      data: formattedData 
    };
  } catch (error) {
    console.error('خطأ في الحصول على مفاتيح API:', error);
    
    return { 
      success: false, 
      error: 'فشل الحصول على مفاتيح API', 
      details: error instanceof Error ? error.message : String(error) 
    };
  }
}

/**
 * اختبار الاتصال بمنصة API
 */
async function handleTestConnection(data: any) {
  const { platform, apiKey, apiSecret = null } = data;
  
  if (!platform || !apiKey) {
    return { 
      success: false, 
      error: 'المنصة ومفتاح API مطلوبان لاختبار الاتصال' 
    };
  }

  try {
    // تنفيذ اختبار الاتصال بناءً على المنصة
    let testResult = false;
    
    switch (platform) {
      case 'binance':
        testResult = await testBinanceConnection(apiKey);
        break;
      case 'binance_testnet':
        testResult = await testBinanceTestnetConnection(apiKey);
        break;
      case 'coinapi':
        testResult = await testCoinApiConnection(apiKey);
        break;
      case 'coindesk':
        // CoinDesk لا يتطلب مفتاح، فقط نختبر إذا كانت الواجهة متاحة
        testResult = await testCoindeskConnection();
        break;
      case 'cryptocompare':
        testResult = await testCryptoCompareConnection(apiKey);
        break;
      case 'livecoinwatch':
        testResult = await testLiveCoinWatchConnection(apiKey);
        break;
      default:
        return { 
          success: false, 
          error: `منصة غير مدعومة: ${platform}` 
        };
    }

    return {
      success: true,
      connected: testResult,
      message: testResult 
        ? `تم الاتصال بنجاح بمنصة ${platform}` 
        : `فشل الاتصال بمنصة ${platform}`
    };
  } catch (error) {
    console.error(`خطأ في اختبار اتصال ${platform}:`, error);
    
    return { 
      success: false, 
      connected: false,
      error: `فشل اختبار الاتصال بمنصة ${platform}`, 
      details: error instanceof Error ? error.message : String(error) 
    };
  }
}

/**
 * اختبار الاتصال بواجهة Binance API
 */
async function testBinanceConnection(apiKey: string): Promise<boolean> {
  try {
    const response = await fetch('https://api.binance.com/api/v3/ping', {
      method: 'GET',
      headers: {
        'X-MBX-APIKEY': apiKey
      }
    });
    
    return response.ok;
  } catch (error) {
    console.error('خطأ في اختبار اتصال Binance:', error);
    return false;
  }
}

/**
 * اختبار الاتصال بواجهة Binance Testnet API
 */
async function testBinanceTestnetConnection(apiKey: string): Promise<boolean> {
  try {
    const response = await fetch('https://testnet.binance.vision/api/v3/ping', {
      method: 'GET',
      headers: {
        'X-MBX-APIKEY': apiKey
      }
    });
    
    return response.ok;
  } catch (error) {
    console.error('خطأ في اختبار اتصال Binance Testnet:', error);
    return false;
  }
}

/**
 * اختبار الاتصال بواجهة CoinAPI
 */
async function testCoinApiConnection(apiKey: string): Promise<boolean> {
  try {
    const response = await fetch('https://rest.coinapi.io/v1/exchanges', {
      method: 'GET',
      headers: {
        'X-CoinAPI-Key': apiKey
      }
    });
    
    return response.ok;
  } catch (error) {
    console.error('خطأ في اختبار اتصال CoinAPI:', error);
    return false;
  }
}

/**
 * اختبار الاتصال بواجهة CoinDesk API
 * لا تتطلب مفتاح API
 */
async function testCoindeskConnection(): Promise<boolean> {
  try {
    const response = await fetch('https://api.coindesk.com/v1/bpi/currentprice.json');
    return response.ok;
  } catch (error) {
    console.error('خطأ في اختبار اتصال CoinDesk:', error);
    return false;
  }
}

/**
 * اختبار الاتصال بواجهة CryptoCompare API
 */
async function testCryptoCompareConnection(apiKey: string): Promise<boolean> {
  try {
    const response = await fetch('https://min-api.cryptocompare.com/data/price?fsym=BTC&tsyms=USD', {
      method: 'GET',
      headers: {
        'authorization': `Apikey ${apiKey}`
      }
    });
    
    return response.ok;
  } catch (error) {
    console.error('خطأ في اختبار اتصال CryptoCompare:', error);
    return false;
  }
}

/**
 * اختبار الاتصال بواجهة LiveCoinWatch API
 */
async function testLiveCoinWatchConnection(apiKey: string): Promise<boolean> {
  try {
    const response = await fetch('https://api.livecoinwatch.com/status', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'x-api-key': apiKey
      },
      body: JSON.stringify({})
    });
    
    return response.ok;
  } catch (error) {
    console.error('خطأ في اختبار اتصال LiveCoinWatch:', error);
    return false;
  }
}
