
import { 
  ArrowUpRight, 
  ChevronDown, 
  ChevronUp 
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";

export type PatternType = 
  | "رأس وكتفين" 
  | "مثلث صاعد" 
  | "مثلث هابط"
  | "مثلث متماثل"
  | "قناة سعرية"
  | "قاع مزدوج"
  | "قمة مزدوجة"
  | "نموذج علم"
  | "وتد صاعد" 
  | "وتد هابط";

export type PatternStrength = "ضعيف" | "متوسط" | "قوي" | "قوي جداً";

export type PatternSignal = "شراء" | "بيع" | "انتظار" | "محايد";

export interface PatternData {
  id: string;
  name: PatternType;
  timeframe: string;
  strength: PatternStrength;
  confidence: number;
  signal: PatternSignal;
  targetPrice: string;
  stopLoss: string;
  description: string;
  detectedAt: string;
}

interface TechnicalPatternCardProps {
  pattern: PatternData;
  className?: string;
}

const TechnicalPatternCard = ({ pattern, className }: TechnicalPatternCardProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const { t } = useLanguage();

  const getPatternNameTranslation = (name: PatternType) => {
    const translations: Record<PatternType, string> = {
      "رأس وكتفين": "Head & Shoulders",
      "مثلث صاعد": "Ascending Triangle",
      "مثلث هابط": "Descending Triangle",
      "مثلث متماثل": "Symmetrical Triangle",
      "قناة سعرية": "Price Channel",
      "قاع مزدوج": "Double Bottom",
      "قمة مزدوجة": "Double Top",
      "نموذج علم": "Flag Pattern",
      "وتد صاعد": "Rising Wedge",
      "وتد هابط": "Falling Wedge"
    };
    return translations[name] || name;
  };

  const getStrengthTranslation = (strength: PatternStrength) => {
    const translations: Record<PatternStrength, string> = {
      "ضعيف": "Weak",
      "متوسط": "Medium",
      "قوي": "Strong",
      "قوي جداً": "Very Strong"
    };
    return translations[strength] || strength;
  };

  const getSignalTranslation = (signal: PatternSignal) => {
    const translations: Record<PatternSignal, string> = {
      "شراء": "Buy",
      "بيع": "Sell",
      "انتظار": "Wait",
      "محايد": "Neutral"
    };
    return translations[signal] || signal;
  };

  const getSignalColor = (signal: PatternSignal) => {
    switch (signal) {
      case "شراء":
        return "bg-bitcoin-green text-white";
      case "بيع":
        return "bg-bitcoin-red text-white";
      case "انتظار":
        return "bg-amber-500 text-white";
      default:
        return "bg-zinc-700 text-white";
    }
  };
  
  const getStrengthColor = (strength: PatternStrength) => {
    switch (strength) {
      case "قوي جداً":
        return "bg-emerald-600 text-white";
      case "قوي":
        return "bg-emerald-500 text-white";
      case "متوسط":
        return "bg-amber-500 text-white";
      default:
        return "bg-zinc-500 text-white";
    }
  };

  return (
    <Card className={`${className} border-zinc-800 transition-all`}>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg flex items-center gap-2">
            <span>{t(pattern.name, getPatternNameTranslation(pattern.name))}</span>
            <Badge className={getStrengthColor(pattern.strength)}>
              {t(pattern.strength, getStrengthTranslation(pattern.strength))}
            </Badge>
          </CardTitle>
          <Badge className={getSignalColor(pattern.signal)}>
            {t(pattern.signal, getSignalTranslation(pattern.signal))}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-x-4 gap-y-2 mb-3 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">{t("الإطار الزمني:", "Timeframe:")}</span>
            <span className="font-medium">{pattern.timeframe}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">{t("الثقة:", "Confidence:")}</span>
            <span className="font-medium">{pattern.confidence}%</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">{t("الهدف السعري:", "Price Target:")}</span>
            <span className="font-medium text-bitcoin-green">{pattern.targetPrice}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">{t("وقف الخسارة:", "Stop Loss:")}</span>
            <span className="font-medium text-bitcoin-red">{pattern.stopLoss}</span>
          </div>
        </div>
        
        <button 
          className="w-full flex items-center justify-center text-sm p-1 hover:bg-zinc-800 rounded transition-colors"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          {isExpanded ? (
            <>
              <span>{t("عرض أقل", "Show less")}</span>
              <ChevronUp className="h-4 w-4 mr-1" />
            </>
          ) : (
            <>
              <span>{t("عرض المزيد", "Show more")}</span>
              <ChevronDown className="h-4 w-4 mr-1" />
            </>
          )}
        </button>
        
        {isExpanded && (
          <div className="mt-3 pt-3 border-t border-zinc-800 text-sm">
            <p className="text-muted-foreground">{pattern.description}</p>
            <div className="mt-3 flex justify-between items-center">
              <span className="text-muted-foreground text-xs">
                {t("تم اكتشافه في:", "Detected at:")} {pattern.detectedAt}
              </span>
              <button className="flex items-center text-primary text-xs">
                <span>{t("عرض تفاصيل كاملة", "View full details")}</span>
                <ArrowUpRight className="h-3 w-3 mr-1" />
              </button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TechnicalPatternCard;
