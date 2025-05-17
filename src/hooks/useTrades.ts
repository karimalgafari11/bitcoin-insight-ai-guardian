
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Trade } from "@/types/trade";
import { toast } from "@/components/ui/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";

/**
 * Hook for managing trades data
 * Provides functionality to fetch, get, and refetch trades
 */
export const useTrades = () => {
  const [trades, setTrades] = useState<Trade[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { t } = useLanguage();

  /**
   * Creates mock trade data for development when user is not authenticated
   */
  const createMockTradeData = (): Trade[] => {
    const currentDate = new Date();
    const yesterdayDate = new Date(currentDate.getTime() - 86400000);
    
    return [
      {
        id: '1',
        user_id: 'mock-user',
        symbol: 'BTC/USD',
        direction: 'long' as const,
        entry_date: currentDate.toISOString(),
        exit_date: null,
        entry_price: 50000,
        exit_price: null,
        stop_loss: 48000,
        take_profit: 55000,
        size: 0.5,
        status: 'open' as const,
        profit_loss: null,
        strategy: 'Breakout',
        setup_type: 'Trend Following',
        timeframe: '4h',
        notes: 'Test trade',
        tags: ['test', 'bitcoin'],
        created_at: currentDate.toISOString(),
        updated_at: currentDate.toISOString()
      },
      {
        id: '2',
        user_id: 'mock-user',
        symbol: 'ETH/USD',
        direction: 'short' as const,
        entry_date: yesterdayDate.toISOString(),
        exit_date: currentDate.toISOString(),
        entry_price: 3000,
        exit_price: 2800,
        stop_loss: 3100,
        take_profit: 2700,
        size: 2,
        status: 'closed' as const,
        profit_loss: 400,
        strategy: 'Reversal',
        setup_type: 'Counter Trend',
        timeframe: '1d',
        notes: 'Successful short',
        tags: ['ethereum', 'reversal'],
        created_at: yesterdayDate.toISOString(),
        updated_at: currentDate.toISOString()
      }
    ];
  };

  /**
   * Calculate profit/loss for trades if not already calculated
   */
  const processTrades = (tradesData: any[]): Trade[] => {
    return tradesData.map((trade: any) => {
      if (
        trade.status === "closed" &&
        trade.exit_price &&
        (trade.profit_loss === null || trade.profit_loss === undefined)
      ) {
        const entryPrice = parseFloat(trade.entry_price);
        const exitPrice = parseFloat(trade.exit_price);
        const size = parseFloat(trade.size);
        
        let profitLoss: number;
        if (trade.direction === "long") {
          profitLoss = (exitPrice - entryPrice) * size;
        } else {
          profitLoss = (entryPrice - exitPrice) * size;
        }
        
        const profitLossPercentage = 
          trade.direction === "long"
            ? ((exitPrice - entryPrice) / entryPrice) * 100
            : ((entryPrice - exitPrice) / entryPrice) * 100;
        
        return {
          ...trade,
          profit_loss: profitLoss,
          profit_loss_percentage: profitLossPercentage,
        };
      }
      return trade;
    }) as Trade[];
  };

  /**
   * Fetch all trades for the authenticated user
   */
  const fetchTrades = async () => {
    try {
      setLoading(true);
      setError(null);

      // Get the current user
      const { data: authData } = await supabase.auth.getUser();
      
      if (!authData?.user) {
        // Use mock data if user is not authenticated (for development)
        const mockTrades = createMockTradeData();
        setTrades(mockTrades);
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from("trading_entries")
        .select("*")
        .eq("user_id", authData.user.id)
        .order("entry_date", { ascending: false });

      if (error) throw error;
      
      // Process the fetched trades
      const processedTrades = processTrades(data);
      setTrades(processedTrades);
    } catch (err: any) {
      console.error("Error fetching trades:", err);
      setError(err.message);
      toast({
        title: t("خطأ في جلب البيانات", "Error fetching data"),
        description: err.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  /**
   * Fetch a single trade by ID
   */
  const fetchTrade = async (id: string): Promise<Trade | null> => {
    try {
      const { data, error } = await supabase
        .from("trading_entries")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;
      return data as Trade;
    } catch (err: any) {
      console.error("Error fetching trade:", err);
      toast({
        title: t("خطأ في جلب الصفقة", "Error fetching trade"),
        description: err.message,
        variant: "destructive",
      });
      return null;
    }
  };

  // Fetch trades on initial mount
  useEffect(() => {
    fetchTrades();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    trades,
    loading,
    error,
    refetch: fetchTrades,
    fetchTrade,
  };
};
