
import { 
  ArrowUpRight, 
  ChevronDown, 
  ChevronUp 
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";

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
            <span>{pattern.name}</span>
            <Badge className={getStrengthColor(pattern.strength)}>{pattern.strength}</Badge>
          </CardTitle>
          <Badge className={getSignalColor(pattern.signal)}>{pattern.signal}</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-x-4 gap-y-2 mb-3 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">الإطار الزمني:</span>
            <span className="font-medium">{pattern.timeframe}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">الثقة:</span>
            <span className="font-medium">{pattern.confidence}%</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">الهدف السعري:</span>
            <span className="font-medium text-bitcoin-green">{pattern.targetPrice}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">وقف الخسارة:</span>
            <span className="font-medium text-bitcoin-red">{pattern.stopLoss}</span>
          </div>
        </div>
        
        <button 
          className="w-full flex items-center justify-center text-sm p-1 hover:bg-zinc-800 rounded transition-colors"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          {isExpanded ? (
            <>
              <span>عرض أقل</span>
              <ChevronUp className="h-4 w-4 mr-1" />
            </>
          ) : (
            <>
              <span>عرض المزيد</span>
              <ChevronDown className="h-4 w-4 mr-1" />
            </>
          )}
        </button>
        
        {isExpanded && (
          <div className="mt-3 pt-3 border-t border-zinc-800 text-sm">
            <p className="text-muted-foreground">{pattern.description}</p>
            <div className="mt-3 flex justify-between items-center">
              <span className="text-muted-foreground text-xs">
                تم اكتشافه في: {pattern.detectedAt}
              </span>
              <button className="flex items-center text-primary text-xs">
                <span>عرض تفاصيل كاملة</span>
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
