
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    // Parse request data
    const { coinId = "bitcoin", days = "7", currency = "usd" } = await req.json();
    
    console.log(`Fetching data for: ${coinId}, days: ${days}, currency: ${currency}`);
    
    // Get the CoinMarketCap API key from Supabase secrets
    const coinmarketcapApiKey = Deno.env.get("Coinmarketcup_api_key") || "";
    
    if (!coinmarketcapApiKey) {
      console.error("CoinMarketCap API key not found");
      return new Response(
        JSON.stringify({ error: "CoinMarketCap API key not found" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
      );
    }

    // Map our internal coin IDs to CoinMarketCap symbols
    const coinSymbolMap: Record<string, string> = {
      'bitcoin': 'BTC',
      'ethereum': 'ETH',
      'binancecoin': 'BNB',
      'ripple': 'XRP',
      'cardano': 'ADA',
      'solana': 'SOL',
    };

    const symbol = coinSymbolMap[coinId] || coinId.toUpperCase();
    
    // Convert days to hours for CMC API (they use hours)
    const hours = parseInt(days) * 24;
    
    // Fetch cryptocurrency data from CoinMarketCap
    // We'll use the /v2/cryptocurrency/quotes/latest for latest price
    // and /v2/cryptocurrency/quotes/historical for historical data
    const intervalMap: Record<string, string> = {
      '1': '1h',  // 1 day = hourly data
      '7': '4h',  // 7 days = 4 hour intervals
      '30': '1d', // 30 days = daily data
      '90': '1d', // 90 days = daily data
    };
    
    const interval = intervalMap[days] || '1d';
    
    // Get current price data
    const quoteUrl = `https://pro-api.coinmarketcap.com/v2/cryptocurrency/quotes/latest?symbol=${symbol}&convert=${currency.toUpperCase()}`;
    console.log(`Making quote request to: ${quoteUrl}`);
    
    const quoteResponse = await fetch(quoteUrl, {
      headers: {
        "X-CMC_PRO_API_KEY": coinmarketcapApiKey,
        "Accept": "application/json",
      },
    });
    
    if (!quoteResponse.ok) {
      const errorText = await quoteResponse.text();
      console.error(`CoinMarketCap Quote API error: ${quoteResponse.status} - ${errorText}`);
      return new Response(
        JSON.stringify({ error: `CoinMarketCap API error: ${quoteResponse.status}`, details: errorText }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: quoteResponse.status }
      );
    }
    
    const quoteData = await quoteResponse.json();
    
    // Get historical data for the requested timeframe
    // For CoinMarketCap, we need to get the coin ID first
    const idLookupUrl = `https://pro-api.coinmarketcap.com/v1/cryptocurrency/map?symbol=${symbol}`;
    console.log(`Looking up ID for ${symbol} at: ${idLookupUrl}`);
    
    const idLookupResponse = await fetch(idLookupUrl, {
      headers: {
        "X-CMC_PRO_API_KEY": coinmarketcapApiKey,
        "Accept": "application/json",
      },
    });
    
    if (!idLookupResponse.ok) {
      const errorText = await idLookupResponse.text();
      console.error(`CoinMarketCap ID Lookup API error: ${idLookupResponse.status} - ${errorText}`);
      return new Response(
        JSON.stringify({ error: `CoinMarketCap ID Lookup API error: ${idLookupResponse.status}`, details: errorText }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: idLookupResponse.status }
      );
    }
    
    const idLookupData = await idLookupResponse.json();
    
    if (!idLookupData.data || idLookupData.data.length === 0) {
      console.error(`No ID found for symbol: ${symbol}`);
      return new Response(
        JSON.stringify({ error: `No ID found for symbol: ${symbol}` }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 404 }
      );
    }
    
    const coinId = idLookupData.data[0].id;
    
    // Get historical OHLCV data from CMC
    const count = days === '1' ? 24 : days === '7' ? 42 : days === '30' ? 30 : 90;
    const historicalUrl = `https://pro-api.coinmarketcap.com/v2/cryptocurrency/ohlcv/historical?id=${coinId}&time_period=${interval}&count=${count}&convert=${currency.toUpperCase()}`;
    console.log(`Making historical request to: ${historicalUrl}`);
    
    const historicalResponse = await fetch(historicalUrl, {
      headers: {
        "X-CMC_PRO_API_KEY": coinmarketcapApiKey,
        "Accept": "application/json",
      },
    });
    
    if (!historicalResponse.ok) {
      const errorText = await historicalResponse.text();
      console.error(`CoinMarketCap Historical API error: ${historicalResponse.status} - ${errorText}`);
      return new Response(
        JSON.stringify({ error: `CoinMarketCap Historical API error: ${historicalResponse.status}`, details: errorText }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: historicalResponse.status }
      );
    }
    
    const historicalData = await historicalResponse.json();
    
    // Format the data to match the CryptoMarketData interface expected by our frontend
    const formatData = () => {
      // Process historical quotes data from CMC to match our expected format
      if (!historicalData.data || 
          !historicalData.data.quotes || 
          historicalData.data.quotes.length === 0) {
        console.error("Invalid historical data format received");
        return {
          prices: [],
          market_caps: [],
          total_volumes: [],
        };
      }
      
      const quotes = historicalData.data.quotes;
      
      // Sort by timestamp ascending
      quotes.sort((a: any, b: any) => {
        return new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime();
      });
      
      const prices: [number, number][] = [];
      const market_caps: [number, number][] = [];
      const total_volumes: [number, number][] = [];
      
      quotes.forEach((quote: any) => {
        const timestamp = new Date(quote.timestamp).getTime();
        const quoteData = quote.quote[currency.toUpperCase()];
        
        if (quoteData) {
          prices.push([timestamp, quoteData.close]);
          if (quoteData.market_cap) {
            market_caps.push([timestamp, quoteData.market_cap]);
          }
          if (quoteData.volume) {
            total_volumes.push([timestamp, quoteData.volume]);
          }
        }
      });
      
      return {
        prices,
        market_caps,
        total_volumes,
      };
    };
    
    const formattedData = formatData();
    
    // Add current price from quotes endpoint to ensure we have the latest price
    if (quoteData.data && 
        quoteData.data[symbol] && 
        quoteData.data[symbol][0] && 
        quoteData.data[symbol][0].quote && 
        quoteData.data[symbol][0].quote[currency.toUpperCase()]) {
      
      const latestQuote = quoteData.data[symbol][0].quote[currency.toUpperCase()];
      const now = Date.now();
      
      // Add current price to the prices array if we have historical data
      if (formattedData.prices.length > 0) {
        formattedData.prices.push([now, latestQuote.price]);
      }
      
      // Add metadata to response
      formattedData.metadata = {
        name: quoteData.data[symbol][0].name,
        symbol: symbol,
        current_price: latestQuote.price,
        market_cap: latestQuote.market_cap,
        volume_24h: latestQuote.volume_24h,
        percent_change_24h: latestQuote.percent_change_24h,
        percent_change_7d: latestQuote.percent_change_7d,
        last_updated: latestQuote.last_updated,
      };
    }
    
    console.log("Successfully processed CoinMarketCap data");
    
    // Return the formatted data
    return new Response(
      JSON.stringify(formattedData),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error in crypto-data function:", error.message);
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
    );
  }
});
