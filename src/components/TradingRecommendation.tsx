
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowDown, ArrowUp } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

type TradingRecommendationProps = {
  className?: string;
};

const TradingRecommendation = ({ className }: TradingRecommendationProps) => {
  const { t } = useLanguage();
  
  // Example recommendation - in a real app, this would be determined by analysis
  const recommendation = {
    action: t("بيع", "Sell"), 
    confidence: t("عالية (90%)", "High (90%)"), 
    reason: t(
      "نموذج إنغولفينغ هبوطي في اتجاه هبوطي", 
      "Bearish engulfing pattern in a downtrend"
    ),
    stopLoss: "$58,200", 
    takeProfit: "$54,500", 
  };

  const isSell = recommendation.action === t("بيع", "Sell");

  return (
    <Card className={`${className} border-zinc-800`}>
      <CardHeader>
        <CardTitle className="text-lg">{t("توصية اليوم", "Today's Recommendation")}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className={`mb-6 p-4 rounded-lg flex items-center gap-3 ${isSell ? 'bg-red-950/20' : 'bg-green-950/20'}`}>
          <div className={`p-2 rounded-full ${isSell ? 'bg-red-600/20' : 'bg-green-600/20'}`}>
            {isSell ? (
              <ArrowDown className="h-6 w-6 text-bitcoin-red" />
            ) : (
              <ArrowUp className="h-6 w-6 text-bitcoin-green" />
            )}
          </div>
          <div>
            <div className={`text-xl font-semibold ${isSell ? 'text-bitcoin-red' : 'text-bitcoin-green'}`}>
              {recommendation.action}
            </div>
            <div className="text-sm text-muted-foreground">
              {t("الثقة:", "Confidence:")} {recommendation.confidence}
            </div>
          </div>
        </div>

        <div className="mb-4">
          <div className="text-sm text-muted-foreground mb-1">{t("السبب الرئيسي", "Primary Reason")}</div>
          <div className="font-medium">{recommendation.reason}</div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="text-sm text-muted-foreground mb-1">{t("وقف الخسارة المقترح", "Suggested Stop Loss")}</div>
            <div className="font-medium">{recommendation.stopLoss}</div>
          </div>
          <div>
            <div className="text-sm text-muted-foreground mb-1">{t("هدف الربح المقترح", "Suggested Take Profit")}</div>
            <div className="font-medium">{recommendation.takeProfit}</div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" className="w-full">{t("عرض التحليل الكامل", "View Full Analysis")}</Button>
        <Button variant="outline" className="w-full mr-2">{t("تعيين تنبيه", "Set Alert")}</Button>
      </CardFooter>
    </Card>
  );
};

export default TradingRecommendation;
