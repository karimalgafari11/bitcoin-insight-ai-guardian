
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
    const { user_id, timeframe, pattern_name, pattern_strength, price_levels } = await req.json();
    
    // التحقق من البيانات المطلوبة
    if (!user_id || !timeframe) {
      return new Response(
        JSON.stringify({ error: "يجب تقديم معرف المستخدم والإطار الزمني" }),
        { headers: { "Content-Type": "application/json" }, status: 400 }
      );
    }

    // إنشاء عميل Supabase
    const supabase = createClient(supabaseUrl, supabaseAnonKey);

    // بناء بيانات السوق للتحليل
    const marketData = {
      trend: pattern_strength > 70 ? 'up' : pattern_strength < 30 ? 'down' : 'neutral',
      confidence: pattern_strength / 100,
      pattern_name: pattern_name || 'undefined',
      current_price: price_levels?.current || 0
    };

    // استدعاء وظيفة قاعدة البيانات لتوليد التوصية
    const { data, error } = await supabase.rpc(
      'generate_smart_recommendation',
      {
        user_id,
        timeframe,
        market_data: marketData
      }
    );

    if (error) throw error;

    // جلب التوصية المنشأة
    const { data: recommendationData, error: fetchError } = await supabase
      .from('smart_recommendations')
      .select('*')
      .eq('id', data)
      .single();

    if (fetchError) throw fetchError;

    return new Response(
      JSON.stringify({
        success: true,
        message: "تم إنشاء توصية جديدة بنجاح",
        recommendation: recommendationData
      }),
      { headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message || "حدث خطأ أثناء إنشاء التوصية" }),
      { headers: { "Content-Type": "application/json" }, status: 500 }
    );
  }
})
