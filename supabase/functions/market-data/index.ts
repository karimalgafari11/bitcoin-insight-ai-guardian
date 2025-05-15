
// Follow this setup guide to integrate the Supabase Edge Functions with your Lovable project:
// https://docs.lovable.dev/integrations/supabase

import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const CRYPTOCOMPARE_API_KEY = Deno.env.get('CRYPTOCOMPARE_API_KEY') || '';
const COINMARKETCAP_API_KEY = Deno.env.get('coinmarketcap') || '';

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

    // التحقق من وجود مفتاح API ل CoinMarketCap وتجربته أولاً
    if (COINMARKETCAP_API_KEY) {
      try {
        console.log("Attempting to fetch data from CoinMarketCap");
        
        // استخدام API الخاص بـ CoinMarketCap
        const cmcResponse = await fetch(
          `https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest?symbol=${symbol}&convert=${currency}`,
          {
            headers: {
              'X-CMC_PRO_API_KEY': COINMARKETCAP_API_KEY,
              'Accept': 'application/json'
            }
          }
        );
        
        if (cmcResponse.ok) {
          const cmcData = await cmcResponse.json();
          
          if (cmcData.data && cmcData.data[symbol]) {
            const cryptoData = cmcData.data[symbol];
            const quote = cryptoData.quote[currency];
            
            // تحويل البيانات إلى الصيغة المطلوبة
            const marketData: MarketDataResponse = {
              price: quote.price,
              volume24h: quote.volume_24h,
              change24h: quote.percent_change_24h,
              marketCap: quote.market_cap,
              lastUpdate: quote.last_updated
            };
            
            // تخزين البيانات في قاعدة البيانات
            const { error: supabaseError } = await supabaseAdmin
              .from("btc_market_data")
              .insert({
                timestamp: marketData.lastUpdate,
                price: marketData.price,
                volume: marketData.volume24h,
                source: "coinmarketcap"
              });

            if (supabaseError) {
              console.error("Error storing market data:", supabaseError);
            }
            
            return new Response(
              JSON.stringify({ ...marketData, source: "coinmarketcap" }),
              { headers: { "Content-Type": "application/json" } },
            );
          }
        } else {
          console.error("CoinMarketCap API error:", await cmcResponse.text());
        }
      } catch (cmcError) {
        console.error("Error fetching from CoinMarketCap:", cmcError);
        // فشل CoinMarketCap، سنجرب CryptoCompare كخيار بديل
      }
    }
    
    // التحقق من وجود مفتاح API ل CryptoCompare كخيار بديل
    if (!CRYPTOCOMPARE_API_KEY) {
      return new Response(
        JSON.stringify({
          error: "API key is not configured. Please set the CRYPTOCOMPARE_API_KEY environment variable."
        }),
        { headers: { "Content-Type": "application/json" }, status: 500 }
      );
    }

    // جلب بيانات السوق من CryptoCompare كخيار بديل
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
        volume: marketData.volume24h,
        source: "cryptocompare"
      });

    if (supabaseError) {
      console.error("Error storing market data:", supabaseError);
    }

    return new Response(
      JSON.stringify({ ...marketData, source: "cryptocompare" }),
      { headers: { "Content-Type": "application/json" } },
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message || "حدث خطأ أثناء جلب بيانات السوق" }),
      { headers: { "Content-Type": "application/json" }, status: 500 },
    )
  }
})
