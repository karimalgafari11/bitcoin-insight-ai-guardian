
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/contexts/LanguageContext";
import { ChartCandlestick, ArrowUp, ArrowDown, CircleAlert, Info } from "lucide-react";

export interface CandleData {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  fillColor: string;
}

export interface CandlePattern {
  name: string;
  description: string;
  significance: "high" | "medium" | "low";
  trend: "bullish" | "bearish" | "neutral";
  icon: React.ReactNode;
}

interface CandleDetailProps {
  selectedCandle: CandleData | null;
  timeframe: string;
  className?: string;
}

const CandleDetail = ({ selectedCandle, timeframe, className }: CandleDetailProps) => {
  const { t } = useLanguage();
  const [pattern, setPattern] = useState<CandlePattern | null>(null);
  
  useEffect(() => {
    // In a real app, this would analyze the candle and detect patterns
    // For demo, we'll simulate pattern detection based on candle properties
    if (selectedCandle) {
      const isBullish = selectedCandle.close > selectedCandle.open;
      const bodySize = Math.abs(selectedCandle.close - selectedCandle.open);
      const upperWick = selectedCandle.high - Math.max(selectedCandle.open, selectedCandle.close);
      const lowerWick = Math.min(selectedCandle.open, selectedCandle.close) - selectedCandle.low;
      
      // Simple pattern detection logic
      if (bodySize < 0.1 * selectedCandle.open && (upperWick > bodySize || lowerWick > bodySize)) {
        setPattern({
          name: t("دوجي", "Doji"),
          description: t(
            "الدوجي يشير إلى تردد في السوق وعدم وجود سيطرة واضحة للمشترين أو البائعين",
            "Doji indicates market indecision with neither buyers nor sellers in control"
          ),
          significance: "medium",
          trend: "neutral",
          icon: <CircleAlert className="h-5 w-5 text-yellow-500" />
        });
      } else if (isBullish && lowerWick > 2 * bodySize && upperWick < 0.5 * bodySize) {
        setPattern({
          name: t("المطرقة", "Hammer"),
          description: t(
            "المطرقة هي إشارة انعكاسية صعودية تظهر غالباً في نهاية الاتجاه الهبوطي",
            "Hammer is a bullish reversal pattern that often appears at the end of a downtrend"
          ),
          significance: "high",
          trend: "bullish",
          icon: <ArrowUp className="h-5 w-5 text-bitcoin-green" />
        });
      } else if (isBullish && bodySize > (selectedCandle.high - selectedCandle.low) * 0.6) {
        setPattern({
          name: t("شمعة صعودية قوية", "Strong Bullish Candle"),
          description: t(
            "شمعة ذات جسم كبير تظهر سيطرة المشترين وقوة شرائية كبيرة",
            "Candle with a large body showing buyer control and strong buying pressure"
          ),
          significance: "medium",
          trend: "bullish",
          icon: <ArrowUp className="h-5 w-5 text-bitcoin-green" />
        });
      } else if (!isBullish && bodySize > (selectedCandle.high - selectedCandle.low) * 0.6) {
        setPattern({
          name: t("شمعة هبوطية قوية", "Strong Bearish Candle"),
          description: t(
            "شمعة ذات جسم كبير تظهر سيطرة البائعين وقوة بيعية كبيرة",
            "Candle with a large body showing seller control and strong selling pressure"
          ),
          significance: "medium",
          trend: "bearish",
          icon: <ArrowDown className="h-5 w-5 text-bitcoin-red" />
        });
      } else {
        setPattern(null);
      }
    } else {
      setPattern(null);
    }
  }, [selectedCandle, t]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  };
  
  const formatVolume = (volume: number) => {
    if (volume >= 1000000) {
      return `${(volume / 1000000).toFixed(2)}M`;
    }
    if (volume >= 1000) {
      return `${(volume / 1000).toFixed(2)}K`;
    }
    return volume.toString();
  };

  const getSignificanceBadge = (significance: string) => {
    switch (significance) {
      case "high":
        return <Badge className="bg-bitcoin-green">{t("عالية", "High")}</Badge>;
      case "medium":
        return <Badge className="bg-yellow-500">{t("متوسطة", "Medium")}</Badge>;
      case "low":
        return <Badge className="bg-bitcoin-red">{t("منخفضة", "Low")}</Badge>;
      default:
        return null;
    }
  };

  if (!selectedCandle) {
    return (
      <Card className={`${className} border-zinc-800`}>
        <CardHeader>
          <CardTitle className="text-lg">{t("تفاصيل الشمعة", "Candle Details")}</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center py-6 text-center">
          <ChartCandlestick className="h-16 w-16 text-muted-foreground mb-3" />
          <p className="text-muted-foreground">
            {t("اختر شمعة من الرسم البياني لعرض التفاصيل", "Select a candle from the chart to view details")}
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={`${className} border-zinc-800`}>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center justify-between">
          <div>{t("تفاصيل الشمعة", "Candle Details")}</div>
          <div className="text-sm font-normal text-muted-foreground">{selectedCandle.date}</div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">{t("الافتتاح", "Open")}</p>
            <p className={`text-base font-medium ${selectedCandle.open < selectedCandle.close ? "text-bitcoin-green" : "text-bitcoin-red"}`}>
              {formatPrice(selectedCandle.open)}
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">{t("الإغلاق", "Close")}</p>
            <p className={`text-base font-medium ${selectedCandle.close > selectedCandle.open ? "text-bitcoin-green" : "text-bitcoin-red"}`}>
              {formatPrice(selectedCandle.close)}
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">{t("الأعلى", "High")}</p>
            <p className="text-base font-medium">{formatPrice(selectedCandle.high)}</p>
          </div>
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">{t("الأدنى", "Low")}</p>
            <p className="text-base font-medium">{formatPrice(selectedCandle.low)}</p>
          </div>
        </div>

        <div className="mb-6">
          <p className="text-xs text-muted-foreground mb-1">{t("حجم التداول", "Volume")}</p>
          <div className="flex items-center">
            <div 
              className="h-2 rounded-full bg-purple-500/50" 
              style={{ width: `${Math.min(selectedCandle.volume / 20000, 100)}%` }}
            ></div>
            <span className="ml-2 text-sm">{formatVolume(selectedCandle.volume)}</span>
          </div>
        </div>
        
        <div className="border-t border-zinc-800 pt-4">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-sm font-medium">{t("تحليل النمط", "Pattern Analysis")}</h4>
            <Info className="h-4 w-4 text-muted-foreground" />
          </div>
          
          {pattern ? (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  {pattern.icon}
                  <span className="font-medium">{pattern.name}</span>
                </div>
                {getSignificanceBadge(pattern.significance)}
              </div>
              <p className="text-xs text-muted-foreground">{pattern.description}</p>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              {t("لم يتم اكتشاف أنماط معروفة", "No known patterns detected")}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default CandleDetail;
