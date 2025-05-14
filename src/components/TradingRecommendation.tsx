
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowDown, ArrowUp } from "lucide-react";

type TradingRecommendationProps = {
  className?: string;
};

const TradingRecommendation = ({ className }: TradingRecommendationProps) => {
  // Example recommendation - in a real app, this would be determined by analysis
  const recommendation = {
    action: "بيع", // buy or sell
    confidence: "عالية (90%)", // confidence level
    reason: "نموذج إنغولفينغ هبوطي في اتجاه هبوطي", // primary reason
    stopLoss: "$58,200", // recommended stop loss
    takeProfit: "$54,500", // recommended take profit
  };

  const isSell = recommendation.action === "بيع";

  return (
    <Card className={`${className} border-zinc-800`}>
      <CardHeader>
        <CardTitle className="text-lg">توصية اليوم</CardTitle>
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
              الثقة: {recommendation.confidence}
            </div>
          </div>
        </div>

        <div className="mb-4">
          <div className="text-sm text-muted-foreground mb-1">السبب الرئيسي</div>
          <div className="font-medium">{recommendation.reason}</div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="text-sm text-muted-foreground mb-1">وقف الخسارة المقترح</div>
            <div className="font-medium">{recommendation.stopLoss}</div>
          </div>
          <div>
            <div className="text-sm text-muted-foreground mb-1">هدف الربح المقترح</div>
            <div className="font-medium">{recommendation.takeProfit}</div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" className="w-full">عرض التحليل الكامل</Button>
        <Button variant="outline" className="w-full mr-2">تعيين تنبيه</Button>
      </CardFooter>
    </Card>
  );
};

export default TradingRecommendation;
