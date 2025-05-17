
import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { TableCell, TableRow } from "@/components/ui/table";

export const TradesEmptyState: React.FC = () => {
  const { t } = useLanguage();
  
  return (
    <TableRow>
      <TableCell colSpan={8} className="h-24 text-center">
        {t("لا توجد صفقات لعرضها.", "No trades to display.")}
      </TableCell>
    </TableRow>
  );
};
