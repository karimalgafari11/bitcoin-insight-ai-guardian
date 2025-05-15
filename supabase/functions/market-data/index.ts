
// Follow this setup guide to integrate the Supabase Edge Functions with your Lovable project:
// https://docs.lovable.dev/integrations/supabase

import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const CRYPTOCOMPARE_API_KEY = Deno.env.get('CRYPTOCOMPARE_API_KEY') || '';

interface MarketDataResponse {
  price: number;
  volume24h: number;
  change24h: number;
  marketCap: number;
  lastUpdate: string;
  error?: string;
}

serve(async (req) => {
  try {
    // استخراج البارامترات من عنوان URL
    const url = new URL(req.url);
    const symbol = url.searchParams.get('symbol') || 'BTC';
    const currency = url.searchParams.get('currency') || 'USD';

    // التحقق من وجود مفتاح API
    if (!CRYPTOCOMPARE_API_KEY) {
      return new Response(
        JSON.stringify({
          error: "API key is not configured. Please set the CRYPTOCOMPARE_API_KEY environment variable."
        }),
        { headers: { "Content-Type": "application/json" }, status: 500 }
      );
    }

    // جلب بيانات السوق من CryptoCompare
    const apiResponse = await fetch(
      `https://min-api.cryptocompare.com/data/pricemultifull?fsyms=${symbol}&tsyms=${currency}`,
      {
        headers: {
          'authorization': `Apikey ${CRYPTOCOMPARE_API_KEY}`
        }
      }
    );

    const data = await apiResponse.json();
    
    if (data.Response === "Error") {
      throw new Error(data.Message);
    }

    const cryptoData = data.RAW[symbol][currency];
    
    // تحويل البيانات إلى الصيغة المطلوبة
    const marketData: MarketDataResponse = {
      price: cryptoData.PRICE,
      volume24h: cryptoData.VOLUME24HOUR,
      change24h: cryptoData.CHANGEPCT24HOUR,
      marketCap: cryptoData.MKTCAP,
      lastUpdate: new Date(cryptoData.LASTUPDATE * 1000).toISOString()
    };

    // تخزين البيانات في قاعدة البيانات
    const { error: supabaseError } = await supabaseAdmin
      .from("btc_market_data")
      .insert({
        timestamp: marketData.lastUpdate,
        price: marketData.price,
        volume: marketData.volume24h
      });

    if (supabaseError) {
      console.error("Error storing market data:", supabaseError);
    }

    return new Response(
      JSON.stringify(marketData),
      { headers: { "Content-Type": "application/json" } },
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message || "حدث خطأ أثناء جلب بيانات السوق" }),
      { headers: { "Content-Type": "application/json" }, status: 500 },
    )
  }
})
