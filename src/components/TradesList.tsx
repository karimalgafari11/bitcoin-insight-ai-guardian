
import { useState } from "react";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";
import { Edit, Trash2 } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { Trade } from "@/types/trade";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";

interface TradesListProps {
  trades: Trade[];
  onTradeDeleted: () => void;
}

export const TradesList = ({ trades, onTradeDeleted }: TradesListProps) => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [deleting, setDeleting] = useState(false);

  // تنسيق العلامات للعرض
  const formatTags = (tags: string[] | undefined) => {
    if (!tags || tags.length === 0) return "-";
    return tags.join(", ");
  };

  // تنسيق التاريخ للعرض
  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return "-";
    try {
      return format(new Date(dateString), "yyyy-MM-dd HH:mm");
    } catch (error) {
      console.error("Invalid date:", dateString);
      return "-";
    }
  };

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

  // تحديد لون الربح/الخسارة
  const getProfitLossColor = (value: number | undefined) => {
    if (value === undefined) return "text-muted-foreground";
    return value >= 0 ? "text-green-500" : "text-red-500";
  };

  // تنسيق الربح/الخسارة للعرض
  const formatProfitLoss = (value: number | undefined) => {
    if (value === undefined) return "-";
    return `${value >= 0 ? "+" : ""}${value.toFixed(2)}`;
  };

  return (
    <div className="w-full overflow-auto">
      <Table className="min-w-[800px]">
        <TableHeader>
          <TableRow>
            <TableHead>{t("الزوج", "Symbol")}</TableHead>
            <TableHead>{t("النوع", "Type")}</TableHead>
            <TableHead>{t("تاريخ الدخول", "Entry Date")}</TableHead>
            <TableHead>{t("سعر الدخول", "Entry Price")}</TableHead>
            <TableHead>{t("الحجم", "Size")}</TableHead>
            <TableHead>{t("الربح/الخسارة", "Profit/Loss")}</TableHead>
            <TableHead>{t("الحالة", "Status")}</TableHead>
            <TableHead>{t("إجراءات", "Actions")}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {trades.length > 0 ? (
            trades.map((trade) => (
              <TableRow key={trade.id} className="cursor-pointer hover:bg-muted/50">
                <TableCell className="font-medium">{trade.symbol}</TableCell>
                <TableCell>
                  <span className={trade.direction === "long" ? "text-green-500" : "text-red-500"}>
                    {trade.direction === "long" ? t("شراء", "Long") : t("بيع", "Short")}
                  </span>
                </TableCell>
                <TableCell>{formatDate(trade.entry_date)}</TableCell>
                <TableCell>{trade.entry_price}</TableCell>
                <TableCell>{trade.size}</TableCell>
                <TableCell className={getProfitLossColor(trade.profit_loss)}>
                  {formatProfitLoss(trade.profit_loss)}
                </TableCell>
                <TableCell>
                  <span
                    className={`px-2 py-1 rounded-md text-xs ${
                      trade.status === "open"
                        ? "bg-blue-500/20 text-blue-500"
                        : trade.status === "closed"
                        ? "bg-green-500/20 text-green-500"
                        : "bg-gray-500/20 text-gray-500"
                    }`}
                  >
                    {trade.status === "open"
                      ? t("مفتوحة", "Open")
                      : trade.status === "closed"
                      ? t("مغلقة", "Closed")
                      : t("ملغاة", "Canceled")}
                  </span>
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/trading-journal/edit/${trade.id}`);
                      }}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-red-500 hover:text-red-700"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>
                            {t("هل أنت متأكد؟", "Are you sure?")}
                          </AlertDialogTitle>
                          <AlertDialogDescription>
                            {t(
                              "هذا الإجراء لا يمكن التراجع عنه. سيتم حذف الصفقة بشكل نهائي.",
                              "This action cannot be undone. This will permanently delete the trade."
                            )}
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>
                            {t("إلغاء", "Cancel")}
                          </AlertDialogCancel>
                          <AlertDialogAction
                            disabled={deleting}
                            onClick={() => deleteTrade(trade.id)}
                            className="bg-red-500 hover:bg-red-600"
                          >
                            {deleting
                              ? t("جارٍ الحذف...", "Deleting...")
                              : t("حذف", "Delete")}
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={8} className="h-24 text-center">
                {t("لا توجد صفقات لعرضها.", "No trades to display.")}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};
