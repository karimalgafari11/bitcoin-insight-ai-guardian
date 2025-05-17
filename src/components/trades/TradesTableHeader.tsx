
import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { TableHead, TableHeader, TableRow } from "@/components/ui/table";

export const TradesTableHeader: React.FC = () => {
  const { t } = useLanguage();
  
  return (
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
  );
};
