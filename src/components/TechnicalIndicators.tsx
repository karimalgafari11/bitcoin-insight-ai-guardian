
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/contexts/LanguageContext";

type IndicatorItem = {
  nameAr: string;
  nameEn: string;
  value: string | number;
  signalAr: "بيع" | "شراء" | "محايد";
  signalEn: "Sell" | "Buy" | "Neutral";
};

type TechnicalIndicatorsProps = {
  className?: string;
};

const TechnicalIndicators = ({ className }: TechnicalIndicatorsProps) => {
  const { t, language } = useLanguage();
  
  const indicators: IndicatorItem[] = [
    { 
      nameAr: "مؤشر القوة النسبية RSI (14)",
      nameEn: "RSI (14)", 
      value: "42.5", 
      signalAr: "محايد",
      signalEn: "Neutral" 
    },
    { 
      nameAr: "MACD",
      nameEn: "MACD", 
      value: "-120.5", 
      signalAr: "بيع",
      signalEn: "Sell" 
    },
    { 
      nameAr: "المتوسط المتحرك (50)",
      nameEn: "Moving Average (50)", 
      value: "$58,450", 
      signalAr: "بيع",
      signalEn: "Sell" 
    },
    { 
      nameAr: "المتوسط المتحرك (200)",
      nameEn: "Moving Average (200)", 
      value: "$52,120", 
      signalAr: "شراء",
      signalEn: "Buy" 
    },
    { 
      nameAr: "مستويات فيبوناتشي",
      nameEn: "Fibonacci Levels", 
      value: "61.8%", 
      signalAr: "محايد",
      signalEn: "Neutral" 
    }
  ];

  const getSignalColor = (signalAr: string, signalEn: string) => {
    const signal = language === 'ar' ? signalAr : signalEn;
    
    switch (signal) {
      case "بيع":
      case "Sell":
        return "bg-bitcoin-red text-white";
      case "شراء":
      case "Buy":
        return "bg-bitcoin-green text-white";
      default:
        return "bg-zinc-700 text-white";
    }
  };

  return (
    <Card className={`${className} border-zinc-800`}>
      <CardHeader>
        <CardTitle className="text-lg">{t("المؤشرات الفنية", "Technical Indicators")}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col space-y-3">
          {indicators.map((indicator, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex flex-col">
                <span className="font-medium">{language === 'ar' ? indicator.nameAr : indicator.nameEn}</span>
                <span className="text-sm text-muted-foreground">{indicator.value}</span>
              </div>
              <Badge className={`${getSignalColor(indicator.signalAr, indicator.signalEn)} font-normal`}>
                {language === 'ar' ? indicator.signalAr : indicator.signalEn}
              </Badge>
            </div>
          ))}
        </div>
        
        <div className="mt-6">
          <div className="text-sm text-muted-foreground mb-2">{t("الإشارة الكلية", "Overall Signal")}</div>
          <Badge className="bg-zinc-700 text-white font-normal">{t("محايد", "Neutral")}</Badge>
        </div>
      </CardContent>
    </Card>
  );
};

export default TechnicalIndicators;
