
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

type IndicatorItem = {
  name: string;
  value: string | number;
  signal: "بيع" | "شراء" | "محايد";
};

type TechnicalIndicatorsProps = {
  className?: string;
};

const TechnicalIndicators = ({ className }: TechnicalIndicatorsProps) => {
  const indicators: IndicatorItem[] = [
    { 
      name: "مؤشر القوة النسبية RSI (14)", 
      value: "42.5", 
      signal: "محايد" 
    },
    { 
      name: "MACD", 
      value: "-120.5", 
      signal: "بيع" 
    },
    { 
      name: "المتوسط المتحرك (50)", 
      value: "$58,450", 
      signal: "بيع" 
    },
    { 
      name: "المتوسط المتحرك (200)", 
      value: "$52,120", 
      signal: "شراء" 
    },
    { 
      name: "مستويات فيبوناتشي", 
      value: "61.8%", 
      signal: "محايد" 
    }
  ];

  const getSignalColor = (signal: string) => {
    switch (signal) {
      case "بيع":
        return "bg-bitcoin-red text-white";
      case "شراء":
        return "bg-bitcoin-green text-white";
      default:
        return "bg-zinc-700 text-white";
    }
  };

  return (
    <Card className={`${className} border-zinc-800`}>
      <CardHeader>
        <CardTitle className="text-lg">المؤشرات الفنية</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col space-y-3">
          {indicators.map((indicator, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex flex-col">
                <span className="font-medium">{indicator.name}</span>
                <span className="text-sm text-muted-foreground">{indicator.value}</span>
              </div>
              <Badge className={`${getSignalColor(indicator.signal)} font-normal`}>
                {indicator.signal}
              </Badge>
            </div>
          ))}
        </div>
        
        <div className="mt-6">
          <div className="text-sm text-muted-foreground mb-2">الإشارة الكلية</div>
          <Badge className="bg-zinc-700 text-white font-normal">محايد</Badge>
        </div>
      </CardContent>
    </Card>
  );
};

export default TechnicalIndicators;
