
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowDown, ArrowUp, Loader2 } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useSmartRecommendation } from "@/hooks/useSmartRecommendation";
import React from "react";

type TradingRecommendationProps = {
  className?: string;
};

const TradingRecommendation = ({ className }: TradingRecommendationProps) => {
  const { t } = useLanguage();
  const { recommendation, loading, regenerate } = useSmartRecommendation('1d');
  
  // Format price to fixed 2 decimals with dollar sign
  const formatPrice = (price?: number) => {
    if (!price) return "-";
    return `$${price.toFixed(2)}`;
  };
  
  // Determine if recommendation is a sell
  const isSell = recommendation?.recommendation_type === 'بيع' || recommendation?.recommendation_type === 'Sell';
  
  return (
    <Card className={`${className} border-zinc-800`}>
      <CardHeader>
        <CardTitle className="text-lg flex items-center justify-between">
          {t("توصية اليوم", "Today's Recommendation")}
          <Button 
            variant="ghost" 
            size="sm"
            disabled={loading}
            onClick={regenerate}
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : t("تحديث", "Refresh")}
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : recommendation ? (
          <>
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
                  {t(recommendation.recommendation_type, recommendation.recommendation_type)}
                </div>
                <div className="text-sm text-muted-foreground">
                  {t("الثقة:", "Confidence:")} {(recommendation.confidence_level * 100).toFixed(0)}%
                </div>
              </div>
            </div>

            <div className="mb-4">
              <div className="text-sm text-muted-foreground mb-1">{t("السبب الرئيسي", "Primary Reason")}</div>
              <div className="font-medium">{t(recommendation.reason, recommendation.reason)}</div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-sm text-muted-foreground mb-1">{t("وقف الخسارة المقترح", "Suggested Stop Loss")}</div>
                <div className="font-medium">{formatPrice(recommendation.stop_loss)}</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground mb-1">{t("هدف الربح المقترح", "Suggested Take Profit")}</div>
                <div className="font-medium">{formatPrice(recommendation.take_profit)}</div>
              </div>
            </div>
          </>
        ) : (
          <div className="py-8 text-center text-muted-foreground">
            {t("لا توجد توصيات متاحة حاليا", "No recommendations available right now")}
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" className="w-full">{t("عرض التحليل الكامل", "View Full Analysis")}</Button>
        <Button variant="outline" className="w-full mr-2">{t("تعيين تنبيه", "Set Alert")}</Button>
      </CardFooter>
    </Card>
  );
};

export default TradingRecommendation;
