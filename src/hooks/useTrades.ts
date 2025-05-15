
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Trade } from "@/types/trade";
import { toast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";

export const useTrades = () => {
  const [trades, setTrades] = useState<Trade[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { t } = useLanguage();

  const fetchTrades = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from("trading_entries")
        .select("*")
        .order("entry_date", { ascending: false });

      if (error) throw error;
      
      // حساب الربح/الخسارة للصفقات المغلقة إذا كانت غير محسوبة
      const processedTrades = data.map((trade: any) => {
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
            // صفقة بيع
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
      });
      
      setTrades(processedTrades as Trade[]);
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

  useEffect(() => {
    fetchTrades();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

  return {
    trades,
    loading,
    error,
    refetch: fetchTrades,
    fetchTrade,
  };
};
