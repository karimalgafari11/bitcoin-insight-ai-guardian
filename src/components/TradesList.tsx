
import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import { Trade } from "@/types/trade";

import {
  Table,
  TableBody
} from "@/components/ui/table";
import { TradesTableHeader } from "./trades/TradesTableHeader";
import { TradeRow } from "./trades/TradeRow";
import { TradesEmptyState } from "./trades/TradesEmptyState";

interface TradesListProps {
  trades: Trade[];
  onTradeDeleted: () => void;
}

export const TradesList = ({ trades, onTradeDeleted }: TradesListProps) => {
  const { t } = useLanguage();
  const [deleting, setDeleting] = useState(false);
  
  // حذف صفقة
  const deleteTrade = async (id: string) => {
    try {
      setDeleting(true);
      const { error } = await supabase
        .from("trading_entries")
        .delete()
        .eq("id", id);

      if (error) throw error;

      toast({
        title: t("تم حذف الصفقة بنجاح", "Trade deleted successfully"),
      });
      onTradeDeleted();
    } catch (error: any) {
      console.error("Error deleting trade:", error);
      toast({
        title: t("حدث خطأ", "Error occurred"),
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="w-full overflow-auto">
      <Table className="min-w-[800px]">
        <TradesTableHeader />
        <TableBody>
          {trades.length > 0 ? (
            trades.map((trade) => (
              <TradeRow 
                key={trade.id} 
                trade={trade} 
                onDelete={deleteTrade} 
                deleting={deleting} 
              />
            ))
          ) : (
            <TradesEmptyState />
          )}
        </TableBody>
      </Table>
    </div>
  );
};
