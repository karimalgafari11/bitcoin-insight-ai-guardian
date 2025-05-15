
// Follow this setup guide to integrate the Supabase Edge Functions with your Lovable project:
// https://docs.lovable.dev/integrations/supabase

import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY') || '';

serve(async (req) => {
  try {
    // التحقق من أن الطلب هو POST
    if (req.method !== 'POST') {
      return new Response(
        JSON.stringify({ error: "يجب أن تكون الطلبات من نوع POST" }),
        { headers: { "Content-Type": "application/json" }, status: 405 }
      );
    }

    // تحليل بيانات الطلب
    const { user_id, alert_type, price_threshold, message } = await req.json();
    
    // التحقق من البيانات المطلوبة
    if (!user_id || !alert_type) {
      return new Response(
        JSON.stringify({ error: "يجب تقديم معرف المستخدم ونوع التنبيه" }),
        { headers: { "Content-Type": "application/json" }, status: 400 }
      );
    }

    // إنشاء عميل Supabase
    const supabase = createClient(supabaseUrl, supabaseAnonKey);

    // إنشاء شروط التنبيه
    const alertCondition = {
      type: alert_type,
      threshold: price_threshold,
      message: message || `تنبيه: تم الوصول إلى المستوى المحدد ${price_threshold}`,
    };

    // إنشاء تنبيه جديد
    const { data, error } = await supabase
      .from('alerts')
      .insert({
        user_id,
        condition: alertCondition,
        was_notified: false
      })
      .select()
      .single();

    if (error) throw error;

    // محاكاة إرسال إشعار
    console.log(`تم إرسال إشعار للمستخدم ${user_id}: ${alertCondition.message}`);

    return new Response(
      JSON.stringify({
        success: true,
        message: "تم إنشاء التنبيه بنجاح",
        alert: data
      }),
      { headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message || "حدث خطأ أثناء إنشاء التنبيه" }),
      { headers: { "Content-Type": "application/json" }, status: 500 }
    );
  }
})
