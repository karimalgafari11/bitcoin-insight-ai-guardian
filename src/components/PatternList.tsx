
import { useEffect, useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AlertTriangle, ArrowDown, ArrowUp, ChartCandlestick } from "lucide-react";

type Pattern = {
  id: number;
  name: string;
  date: string;
  type: "bullish" | "bearish" | "neutral";
  reliability: number;
  icon: React.ReactNode;
};

type PatternListProps = {
  symbol: string;
  timeframe: string;
};

const PatternList = ({ symbol, timeframe }: PatternListProps) => {
  const { t, language } = useLanguage();
  const [patterns, setPatterns] = useState<Pattern[]>([]);
  
  useEffect(() => {
    // In a real app, this would be an API call
    // For now, generate some demo patterns
    setTimeout(() => {
      const demoPatterns: Pattern[] = [
        {
          id: 1,
          name: t("إنغولفينغ هبوطي", "Bearish Engulfing"),
          date: "May 15, 2023",
          type: "bearish",
          reliability: 85,
          icon: <ArrowDown className="h-5 w-5 text-bitcoin-red" />
        },
        {
          id: 2,
          name: t("المطرقة", "Hammer"),
          date: "May 12, 2023",
          type: "bullish",
          reliability: 70,
          icon: <ArrowUp className="h-5 w-5 text-bitcoin-green" />
        },
        {
          id: 3,
          name: t("دوجي", "Doji"),
          date: "May 10, 2023",
          type: "neutral",
          reliability: 50,
          icon: <AlertTriangle className="h-5 w-5 text-yellow-500" />
        },
        {
          id: 4,
          name: t("نجمة الصباح", "Morning Star"),
          date: "May 8, 2023",
          type: "bullish",
          reliability: 90,
          icon: <ArrowUp className="h-5 w-5 text-bitcoin-green" />
        },
        {
          id: 5,
          name: t("ثلاثة غربان سوداء", "Three Black Crows"),
          date: "May 5, 2023",
          type: "bearish",
          reliability: 75,
          icon: <ArrowDown className="h-5 w-5 text-bitcoin-red" />
        }
      ];
      
      setPatterns(demoPatterns);
    }, 500);
  }, [symbol, timeframe, t]);
  
  const getReliabilityColor = (reliability: number) => {
    if (reliability >= 80) return "text-green-500";
    if (reliability >= 60) return "text-yellow-500";
    return "text-red-500";
  };
  
  const getTypeColor = (type: string) => {
    if (type === "bullish") return "text-bitcoin-green";
    if (type === "bearish") return "text-bitcoin-red";
    return "text-yellow-500";
  };

  return (
    <div>
      {patterns.length > 0 ? (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t("النمط", "Pattern")}</TableHead>
              <TableHead>{t("التاريخ", "Date")}</TableHead>
              <TableHead>{t("النوع", "Type")}</TableHead>
              <TableHead className="text-right">{t("الموثوقية", "Reliability")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {patterns.map((pattern) => (
              <TableRow key={pattern.id} className="cursor-pointer hover:bg-slate-800/50">
                <TableCell className="flex items-center gap-2">
                  {pattern.icon}
                  {pattern.name}
                </TableCell>
                <TableCell>{pattern.date}</TableCell>
                <TableCell className={getTypeColor(pattern.type)}>
                  {t(
                    pattern.type === "bullish" ? "صعودي" : 
                    pattern.type === "bearish" ? "هبوطي" : "محايد",
                    pattern.type === "bullish" ? "Bullish" : 
                    pattern.type === "bearish" ? "Bearish" : "Neutral"
                  )}
                </TableCell>
                <TableCell className={`text-right ${getReliabilityColor(pattern.reliability)}`}>
                  {pattern.reliability}%
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : (
        <div className="text-center py-10">
          <ChartCandlestick className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <p className="text-lg font-medium">
            {t("لا توجد أنماط مكتشفة", "No patterns detected")}
          </p>
          <p className="text-muted-foreground">
            {t(
              "جرب تغيير الإطار الزمني أو الرمز", 
              "Try changing the timeframe or symbol"
            )}
          </p>
        </div>
      )}
    </div>
  );
};

export default PatternList;
