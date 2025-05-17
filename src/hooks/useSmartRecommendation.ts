
import { useCallback, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useCryptoData } from '@/hooks/crypto';
import { toast } from '@/components/ui/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';

export interface SmartRecommendation {
  id: string;
  recommendation_type: string;
  confidence_level: number;
  reason: string;
  stop_loss: number;
  take_profit: number;
  created_at: string;
  timeframe: string;
  is_active: boolean;
  technical_indicators?: Record<string, number>;
}

// API Keys for service integration - using the provided keys from props
const BINANCE_API_KEY = 'khxTWPTHtCMIa9JLD3PtZel206oXBvgiy8GWztOBJYmqFKk5XXuYnpjwQDXioCB3';
const COINAPI_KEY = '52d3f36d-bdb3-4653-86c3-08284eeeed63';
const COINDESK_KEY = 'a1767cfd2957079cad70abd9850f473d0d033e55851bfe550c15b74bd83d8eaf';

export function useSmartRecommendation(timeframe: string = '1d') {
  const [recommendation, setRecommendation] = useState<SmartRecommendation | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { t } = useLanguage();
  
  // Get the latest crypto data from our hook that uses Binance data
  const { data: cryptoData, dataSource } = useCryptoData('bitcoin', '1', 'usd');
  
  // Function to generate a recommendation based on live market data
  const generateRecommendation = useCallback(async () => {
    if (!cryptoData || !cryptoData.prices || cryptoData.prices.length === 0) {
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      // Get latest price and determine pattern strength based on price movement
      const prices = cryptoData.prices;
      const lastPrice = prices[prices.length - 1][1];
      const prevPrice = prices[prices.length - 2]?.[1] || lastPrice;
      
      // Calculate a simple pattern strength based on recent price movement
      const priceChange = lastPrice - prevPrice;
      const percentChange = (priceChange / prevPrice) * 100;
      const patternStrength = 50 + percentChange * 5; // Simple formula: neutral (50) +/- percentage change
      
      // Determine pattern name based on market movement
      let patternName = 'نمط متعادل';
      if (percentChange > 1) {
        patternName = 'نموذج صعودي';
      } else if (percentChange < -1) {
        patternName = 'نموذج هبوطي';
      }
      
      // Price levels for stop loss and take profit
      const priceLevels = {
        current: lastPrice,
        resistance: lastPrice * 1.03, // Simple 3% above as resistance
        support: lastPrice * 0.97,    // Simple 3% below as support
      };
      
      console.log(`Generating recommendation with pattern: ${patternName}, strength: ${patternStrength.toFixed(2)}`);
      
      // Attempt to fetch additional market data from our new edge function
      let additionalMarketData = {};
      try {
        const marketDataResponse = await fetch(
          `/api/market-data-live?symbol=BTC&currency=USD&source=binance`
        );
        
        if (marketDataResponse.ok) {
          const marketDataResult = await marketDataResponse.json();
          additionalMarketData = {
            binanceData: marketDataResult,
            change24h: marketDataResult.change24h,
            high24h: marketDataResult.high24h,
            low24h: marketDataResult.low24h
          };
          
          console.log("Additional market data from Binance:", additionalMarketData);
        }
      } catch (marketDataError) {
        console.error("Error fetching additional market data:", marketDataError);
        // Continue with the recommendation generation even if this fails
      }
      
      // Call our serverless function to generate a smart recommendation
      const { data, error } = await supabase.functions.invoke('smart-recommendation', {
        body: {
          user_id: 'system',
          timeframe,
          pattern_name: patternName,
          pattern_strength: patternStrength,
          price_levels: priceLevels,
          api_keys: {
            binance: BINANCE_API_KEY,
            coinapi: COINAPI_KEY,
            coindesk: COINDESK_KEY
          },
          additional_market_data: additionalMarketData
        }
      });
      
      if (error) {
        throw new Error(error.message);
      }
      
      if (data?.recommendation) {
        setRecommendation(data.recommendation);
        
        // Show toast notification for new recommendation
        toast({
          title: t('توصية جديدة', 'New Recommendation'),
          description: t(
            `تم إنشاء توصية جديدة بناءً على بيانات بينانس المباشرة: ${data.recommendation.recommendation_type}`,
            `New recommendation based on live Binance data: ${data.recommendation.recommendation_type}`
          ),
        });
      }
    } catch (err) {
      console.error('Error generating recommendation:', err);
      setError(err instanceof Error ? err.message : 'خطأ في إنشاء التوصية');
      
      // Get the most recent recommendation from the database as fallback
      try {
        const { data: latestRec } = await supabase
          .from('smart_recommendations')
          .select('*')
          .eq('is_active', true)
          .order('created_at', { ascending: false })
          .limit(1)
          .single();
        
        if (latestRec) {
          setRecommendation(latestRec);
        }
      } catch (fallbackError) {
        console.error('Fallback recommendation fetch failed:', fallbackError);
      }
    } finally {
      setLoading(false);
    }
  }, [cryptoData, timeframe, t]);
  
  // Generate recommendation when crypto data changes or is refreshed
  useEffect(() => {
    // Only generate a recommendation if we have data from Binance
    if (cryptoData && dataSource === 'binance') {
      generateRecommendation();
    }
  }, [cryptoData, dataSource, generateRecommendation]);
  
  // Set up WebSocket connection for real-time Binance data updates
  useEffect(() => {
    // Connect to Binance WebSocket API using provided API key
    const binanceWsUrl = `wss://stream.binance.com:9443/ws/btcusdt@ticker`;
    
    const ws = new WebSocket(binanceWsUrl);
    
    ws.onopen = () => {
      console.log("Connected to Binance WebSocket for real-time market updates");
    };
    
    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        // Only trigger recommendation update when there's significant price change
        if (Math.abs(parseFloat(data.p)) > 0.5) {
          console.log("Significant price change detected in WebSocket stream, updating recommendation");
          generateRecommendation();
        }
      } catch (e) {
        console.error("Error processing WebSocket message:", e);
      }
    };
    
    ws.onerror = (error) => {
      console.error("WebSocket error:", error);
    };
    
    ws.onclose = () => {
      console.log("Disconnected from Binance WebSocket");
    };
    
    // Clean up WebSocket connection
    return () => {
      ws.close();
    };
  }, [generateRecommendation]);
  
  return { recommendation, loading, error, regenerate: generateRecommendation };
}
