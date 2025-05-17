
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowDown, ArrowUp, Loader2, LineChart, RefreshCw } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useSmartRecommendation } from "@/hooks/useSmartRecommendation";
import { useState, useEffect } from "react";
import { toast } from "@/components/ui/use-toast";

type TradingRecommendationProps = {
  className?: string;
};

const TradingRecommendation = ({ className }: TradingRecommendationProps) => {
  const { t } = useLanguage();
  const [selectedTimeframe, setSelectedTimeframe] = useState('1d');
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { recommendation, loading, error, regenerate } = useSmartRecommendation(selectedTimeframe);
  
  // Format price to fixed 2 decimals with dollar sign
  const formatPrice = (price?: number) => {
    if (!price) return "-";
    return `$${price.toFixed(2)}`;
  };
  
  // Determine if recommendation is a sell
  const isSell = recommendation?.recommendation_type === 'بيع' || recommendation?.recommendation_type === 'Sell';
  
  // Handle timeframe change
  const handleTimeframeChange = (timeframe: string) => {
    setSelectedTimeframe(timeframe);
  };
  
  // Handle refresh button click
  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await regenerate();
      setLastUpdated(new Date());
      toast({
        title: t("تم التحديث", "Updated"),
        description: t("تم تحديث التوصية بنجاح", "Recommendation updated successfully")
      });
    } catch (err) {
      toast({
        title: t("خطأ", "Error"),
        description: t("حدث خطأ أثناء تحديث التوصية", "An error occurred while updating the recommendation"),
        variant: "destructive"
      });
    } finally {
      setIsRefreshing(false);
    }
  };
  
  // Update lastUpdated when recommendation changes
  useEffect(() => {
    if (recommendation) {
      setLastUpdated(new Date());
    }
  }, [recommendation]);
  
  return (
    <Card className={`${className} border-zinc-800`}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">
            {t("توصية اليوم", "Today's Recommendation")}
          </CardTitle>
          <div className="flex items-center gap-2">
            <div className="flex border rounded-md overflow-hidden">
              {['1h', '4h', '1d', '1w'].map((timeframe) => (
                <button
                  key={timeframe}
                  className={`px-2 py-1 text-xs ${selectedTimeframe === timeframe 
                    ? 'bg-primary text-primary-foreground' 
                    : 'bg-background hover:bg-muted'}`}
                  onClick={() => handleTimeframeChange(timeframe)}
                >
                  {timeframe}
                </button>
              ))}
            </div>
            <Button 
              variant="ghost" 
              size="sm"
              disabled={loading || isRefreshing}
              onClick={handleRefresh}
              className="h-8 w-8 p-0"
              title={t("تحديث", "Refresh")}
            >
              {isRefreshing || loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
            </Button>
          </div>
        </div>
        {lastUpdated && (
          <div className="text-xs text-muted-foreground">
            {t("آخر تحديث", "Last updated")}: {lastUpdated.toLocaleTimeString()}
          </div>
        )}
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

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <div className="text-sm text-muted-foreground mb-1">{t("وقف الخسارة المقترح", "Suggested Stop Loss")}</div>
                <div className="font-medium">{formatPrice(recommendation.stop_loss)}</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground mb-1">{t("هدف الربح المقترح", "Suggested Take Profit")}</div>
                <div className="font-medium">{formatPrice(recommendation.take_profit)}</div>
              </div>
            </div>

            {recommendation.technical_indicators && (
              <div className="border-t pt-3 mt-3">
                <div className="text-sm text-muted-foreground mb-2">{t("المؤشرات الفنية", "Technical Indicators")}</div>
                <div className="grid grid-cols-2 gap-3">
                  {recommendation.technical_indicators.rsi !== undefined && (
                    <div className="flex items-center gap-2">
                      <LineChart className="h-4 w-4 text-muted-foreground" />
                      <span className="text-xs">RSI: {recommendation.technical_indicators.rsi.toFixed(1)}</span>
                      <span className={`text-xs ${
                        recommendation.technical_indicators.rsi > 70 ? 'text-bitcoin-red' :
                        recommendation.technical_indicators.rsi < 30 ? 'text-bitcoin-green' :
                        'text-muted-foreground'
                      }`}>
                        ({
                          recommendation.technical_indicators.rsi > 70 ? t('ذروة الشراء', 'Overbought') :
                          recommendation.technical_indicators.rsi < 30 ? t('ذروة البيع', 'Oversold') :
                          t('محايد', 'Neutral')
                        })
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </>
        ) : error ? (
          <div className="py-6 text-center text-bitcoin-red">
            <p className="mb-2">{t("حدث خطأ أثناء جلب التوصية", "Error fetching recommendation")}</p>
            <p className="text-sm text-muted-foreground">{error}</p>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleRefresh} 
              className="mt-3"
              disabled={isRefreshing}
            >
              {isRefreshing ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <RefreshCw className="mr-2 h-4 w-4" />
              )}
              {t("إعادة المحاولة", "Try Again")}
            </Button>
          </div>
        ) : (
          <div className="py-8 text-center text-muted-foreground">
            {t("لا توجد توصيات متاحة حاليا", "No recommendations available right now")}
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleRefresh} 
              className="mt-3 mx-auto block"
              disabled={isRefreshing}
            >
              {isRefreshing ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <RefreshCw className="mr-2 h-4 w-4" />
              )}
              {t("إنشاء توصية", "Generate Recommendation")}
            </Button>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" className="w-full">
          <LineChart className="mr-2 h-4 w-4" />
          {t("عرض التحليل الكامل", "View Full Analysis")}
        </Button>
        <Button variant="outline" className="w-full ml-2">
          {t("تعيين تنبيه", "Set Alert")}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default TradingRecommendation;
