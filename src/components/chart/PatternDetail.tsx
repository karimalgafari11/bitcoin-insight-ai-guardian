
import { useLanguage } from "@/contexts/LanguageContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, ArrowDown, ArrowUp, Info } from "lucide-react";

interface PatternDetailProps {
  pattern: {
    type: string;
    index: number;
  } | null;
}

const PatternDetail = ({ pattern }: PatternDetailProps) => {
  const { t } = useLanguage();
  
  if (!pattern) {
    return (
      <Card className="border-zinc-800">
        <CardHeader>
          <CardTitle className="text-lg">{t("تفاصيل النمط", "Pattern Details")}</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center py-6 text-center">
          <Info className="h-16 w-16 text-muted-foreground mb-3" />
          <p className="text-muted-foreground">
            {t("اضغط على نمط في الرسم البياني لعرض التفاصيل", "Click on a pattern in the chart to view details")}
          </p>
        </CardContent>
      </Card>
    );
  }

  const patternDetails = getPatternDetails(pattern.type);

  return (
    <Card className="border-zinc-800">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center justify-between">
          <div className="flex items-center gap-2">
            {patternDetails.icon}
            {patternDetails.name}
          </div>
          <Badge className={patternDetails.signalClass}>
            {patternDetails.signal}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <h4 className="font-medium mb-1">{t("الوصف", "Description")}</h4>
            <p className="text-sm text-muted-foreground">{patternDetails.description}</p>
          </div>
          
          <div>
            <h4 className="font-medium mb-1">{t("الدلالة", "Significance")}</h4>
            <div className="flex items-center gap-2">
              <Badge className={
                patternDetails.significance === "high" ? "bg-bitcoin-green" :
                patternDetails.significance === "medium" ? "bg-yellow-500" : "bg-bitcoin-red"
              }>
                {t(
                  patternDetails.significance === "high" ? "عالية" : 
                  patternDetails.significance === "medium" ? "متوسطة" : "منخفضة",
                  patternDetails.significance === "high" ? "High" : 
                  patternDetails.significance === "medium" ? "Medium" : "Low"
                )}
              </Badge>
            </div>
          </div>
          
          <div>
            <h4 className="font-medium mb-1">{t("الإستراتيجية المقترحة", "Suggested Strategy")}</h4>
            <p className="text-sm text-muted-foreground">{patternDetails.strategy}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

function getPatternDetails(type: string) {
  const { t } = useLanguage();
  
  switch(type) {
    case "bullish-engulfing":
      return {
        name: t("ابتلاع صعودي", "Bullish Engulfing"),
        icon: <ArrowUp className="h-5 w-5 text-bitcoin-green" />,
        signal: t("إشارة شراء", "Buy Signal"),
        signalClass: "bg-bitcoin-green",
        description: t(
          "نمط يشير إلى انعكاس محتمل للاتجاه الهبوطي. يحدث عندما يكون جسم الشمعة الثانية أكبر من جسم الشمعة الأولى وتحيط بها بالكامل.",
          "A pattern indicating a potential reversal of the downtrend. Occurs when the body of the second candle is larger than the first candle's body and completely engulfs it."
        ),
        significance: "high",
        strategy: t(
          "فكر في الدخول في مركز شراء مع وضع وقف خسارة أسفل الشمعة الكبيرة.",
          "Consider entering a long position with a stop loss below the large candle."
        )
      };
    case "hammer":
      return {
        name: t("المطرقة", "Hammer"),
        icon: <ArrowUp className="h-5 w-5 text-bitcoin-green" />,
        signal: t("إشارة شراء", "Buy Signal"),
        signalClass: "bg-bitcoin-green",
        description: t(
          "نمط انعكاسي صعودي يحدث في نهاية الاتجاه الهبوطي. يتميز بظل سفلي طويل وظل علوي صغير أو معدوم.",
          "A bullish reversal pattern that occurs at the end of a downtrend. Characterized by a long lower shadow and little or no upper shadow."
        ),
        significance: "high",
        strategy: t(
          "انتظر تأكيداً من الشمعة التالية، ثم فكر في الدخول في مركز شراء مع وضع وقف خسارة أسفل الظل السفلي.",
          "Wait for confirmation from the next candle, then consider entering a long position with a stop loss below the lower shadow."
        )
      };
    case "bearish-engulfing":
      return {
        name: t("ابتلاع هبوطي", "Bearish Engulfing"),
        icon: <ArrowDown className="h-5 w-5 text-bitcoin-red" />,
        signal: t("إشارة بيع", "Sell Signal"),
        signalClass: "bg-bitcoin-red",
        description: t(
          "نمط يشير إلى انعكاس محتمل للاتجاه الصعودي. يحدث عندما يكون جسم الشمعة الثانية أكبر من جسم الشمعة الأولى وتحيط بها بالكامل.",
          "A pattern indicating a potential reversal of the uptrend. Occurs when the body of the second candle is larger than the first candle's body and completely engulfs it."
        ),
        significance: "high",
        strategy: t(
          "فكر في الدخول في مركز بيع مع وضع وقف خسارة فوق الشمعة الكبيرة.",
          "Consider entering a short position with a stop loss above the large candle."
        )
      };
    case "doji":
      return {
        name: t("دوجي", "Doji"),
        icon: <AlertTriangle className="h-5 w-5 text-yellow-500" />,
        signal: t("حيادي", "Neutral"),
        signalClass: "bg-yellow-500",
        description: t(
          "يظهر عندما تكون أسعار الافتتاح والإغلاق متساوية تقريبًا، مما يشير إلى تردد السوق.",
          "Appears when opening and closing prices are virtually equal, indicating market indecision."
        ),
        significance: "medium",
        strategy: t(
          "انتظر مزيداً من التأكيدات قبل اتخاذ أي إجراء. يمكن أن يكون الدوجي علامة على توقف مؤقت في الاتجاه الحالي أو بداية انعكاس.",
          "Wait for further confirmation before taking action. A doji can be a sign of a temporary pause in the current trend or the beginning of a reversal."
        )
      };
    default:
      return {
        name: type,
        icon: <Info className="h-5 w-5 text-muted-foreground" />,
        signal: t("غير محدد", "Undefined"),
        signalClass: "bg-muted",
        description: t(
          "لم يتم توفير وصف لهذا النمط.",
          "No description provided for this pattern."
        ),
        significance: "medium",
        strategy: t(
          "لم يتم توفير استراتيجية مقترحة لهذا النمط.",
          "No suggested strategy provided for this pattern."
        )
      };
  }
}

export default PatternDetail;
