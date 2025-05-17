
// Follow this setup guide to integrate the Supabase Edge Functions with your Lovable project:
// https://docs.lovable.dev/integrations/supabase

import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY') || '';

// API Keys for services - using the provided keys
const BINANCE_API_KEY = 'khxTWPTHtCMIa9JLD3PtZel206oXBvgiy8GWztOBJYmqFKk5XXuYnpjwQDXioCB3';
const BINANCE_SECRET_KEY = 'N1u5JTcJZBQlGOVkkLSDfxwTi6pehQbjt9L6LvnxDuLEA30ChKuTwkeHmaUmgPui';
const COINAPI_KEY = '52d3f36d-bdb3-4653-86c3-08284eeeed63';
const COINDESK_KEY = 'a1767cfd2957079cad70abd9850f473d0d033e55851bfe550c15b74bd83d8eaf';

serve(async (req) => {
  try {
    // Setup CORS headers
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    };
    
    // Handle CORS preflight requests
    if (req.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    // التحقق من أن الطلب هو POST
    if (req.method !== 'POST') {
      return new Response(
        JSON.stringify({ error: "يجب أن تكون الطلبات من نوع POST" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 405 }
      );
    }

    // تحليل بيانات الطلب
    const { user_id, timeframe, pattern_name, pattern_strength, price_levels } = await req.json();
    
    // التحقق من البيانات المطلوبة
    if (!user_id || !timeframe) {
      return new Response(
        JSON.stringify({ error: "يجب تقديم معرف المستخدم والإطار الزمني" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 }
      );
    }

    // إنشاء عميل Supabase
    const supabase = createClient(supabaseUrl, supabaseAnonKey);

    // Fetch live market data from Binance using provided API keys
    let marketData;
    try {
      // Set up the parameters for Binance API call
      const symbol = "BTCUSDT"; // Default to BTC/USDT
      const timestamp = Date.now().toString();
      const queryString = `symbol=${symbol}&timestamp=${timestamp}`;
      
      // Create signature for Binance authentication
      const signature = await createHmacSignature(queryString, BINANCE_SECRET_KEY);
      
      // Make the API call to get current market data
      const binanceResponse = await fetch(
        `https://api.binance.com/api/v3/ticker/24hr?${queryString}&signature=${signature}`,
        {
          headers: {
            'X-MBX-APIKEY': BINANCE_API_KEY
          }
        }
      );

      if (!binanceResponse.ok) {
        throw new Error(`Binance API Error: ${binanceResponse.status}`);
      }

      const binanceData = await binanceResponse.json();
      
      // Extract the relevant data from Binance response
      marketData = {
        trend: parseFloat(binanceData.priceChangePercent) > 0 ? 'up' : parseFloat(binanceData.priceChangePercent) < 0 ? 'down' : 'neutral',
        confidence: Math.min(Math.abs(parseFloat(binanceData.priceChangePercent)) / 10, 1),
        pattern_name: pattern_name || detectPattern(binanceData),
        current_price: parseFloat(binanceData.lastPrice) || price_levels?.current || 0
      };
      
      console.log("Fetched live Binance data:", JSON.stringify(marketData));
    } catch (binanceError) {
      console.error("Error fetching from Binance:", binanceError);
      
      // Fallback to provided data if Binance fetch fails
      marketData = {
        trend: pattern_strength > 70 ? 'up' : pattern_strength < 30 ? 'down' : 'neutral',
        confidence: pattern_strength / 100,
        pattern_name: pattern_name || 'undefined',
        current_price: price_levels?.current || 0
      };
      
      console.log("Using fallback data:", JSON.stringify(marketData));
    }

    // Use CoinAPI for technical indicators if needed
    let technicalIndicators = {};
    try {
      const coinApiResponse = await fetch(
        `https://rest.coinapi.io/v1/indicators/rsi/BITSTAMP_SPOT_BTC_USD?period=14&time_period=1DAY&limit=1`,
        {
          headers: { 'X-CoinAPI-Key': COINAPI_KEY }
        }
      );
      
      if (coinApiResponse.ok) {
        const indicatorData = await coinApiResponse.json();
        technicalIndicators = {
          rsi: indicatorData[0]?.rsi || 50,
          // Add more indicators as needed
        };
        
        // Adjust confidence based on RSI
        if (technicalIndicators.rsi > 70) {
          marketData.trend = 'down';  // Potentially overbought
          marketData.confidence = Math.max(marketData.confidence, 0.7);
        } else if (technicalIndicators.rsi < 30) {
          marketData.trend = 'up';   // Potentially oversold
          marketData.confidence = Math.max(marketData.confidence, 0.7);
        }
      }
    } catch (coinApiError) {
      console.error("Error fetching from CoinAPI:", coinApiError);
      // Continue without technical indicators
    }

    // تحديد نوع التوصية بناءً على قوة النمط واتجاه السوق
    let recommendationType = 'انتظار';
    let stopLoss = 0;
    let takeProfit = 0;
    let reason = 'عدم وضوح الاتجاه، ينصح بالانتظار';
    
    if (marketData.trend === 'up' && marketData.confidence > 0.6) {
      recommendationType = 'شراء';
      stopLoss = marketData.current_price * 0.97; // 3% below current price
      takeProfit = marketData.current_price * 1.05; // 5% above current price
      reason = `نمط ${marketData.pattern_name} مع اتجاه صعودي قوي`;
    } else if (marketData.trend === 'down' && marketData.confidence > 0.6) {
      recommendationType = 'بيع';
      stopLoss = marketData.current_price * 1.03; // 3% above current price
      takeProfit = marketData.current_price * 0.95; // 5% below current price
      reason = `نمط ${marketData.pattern_name} مع اتجاه هبوطي قوي`;
    }

    // إنشاء توصية جديدة
    const { data, error } = await supabase
      .from('smart_recommendations')
      .insert([
        {
          user_id: user_id,
          recommendation_type: recommendationType,
          confidence_level: marketData.confidence,
          reason: reason,
          stop_loss: stopLoss,
          take_profit: takeProfit,
          timeframe: timeframe,
          is_active: true,
          technical_indicators: technicalIndicators
        }
      ])
      .select('*')
      .single();

    if (error) throw error;

    return new Response(
      JSON.stringify({
        success: true,
        message: "تم إنشاء توصية جديدة بنجاح",
        recommendation: data,
        market_data: marketData
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message || "حدث خطأ أثناء إنشاء التوصية" }),
      { headers: { "Content-Type": "application/json" }, status: 500 }
    );
  }
});

// Helper function to create HMAC signature for Binance API
async function createHmacSignature(queryString: string, secretKey: string): Promise<string> {
  const encoder = new TextEncoder();
  const key = encoder.encode(secretKey);
  const message = encoder.encode(queryString);
  
  const cryptoKey = await crypto.subtle.importKey(
    'raw',
    key,
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  
  const signature = await crypto.subtle.sign('HMAC', cryptoKey, message);
  return Array.from(new Uint8Array(signature))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

// Function to detect patterns based on candlestick data
function detectPattern(data: any): string {
  // Simple pattern detection based on price change
  const priceChange = parseFloat(data.priceChangePercent);
  const highLowDiff = parseFloat(data.highPrice) - parseFloat(data.lowPrice);
  const openCloseDiff = Math.abs(parseFloat(data.openPrice) - parseFloat(data.lastPrice));
  
  // Calculate pattern type based on price movement
  if (priceChange > 5) {
    return 'نموذج انطلاق صعودي قوي';
  } else if (priceChange < -5) {
    return 'نموذج هبوطي قوي';
  } else if (highLowDiff > openCloseDiff * 3) {
    return 'نموذج تذبذب مرتفع';
  } else if (openCloseDiff < highLowDiff * 0.2) {
    return 'نموذج دوجي';
  } else if (priceChange > 0 && priceChange < 2) {
    return 'نموذج صعودي معتدل';
  } else if (priceChange < 0 && priceChange > -2) {
    return 'نموذج هبوطي معتدل';
  } else {
    return 'نموذج غير محدد';
  }
}
