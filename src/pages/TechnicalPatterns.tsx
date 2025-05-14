
import { useState } from "react";
import AppSidebar from "@/components/AppSidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SidebarTrigger } from "@/components/ui/sidebar";
import BitcoinChart from "@/components/BitcoinChart";
import TimeframeSelector from "@/components/TimeframeSelector";
import TechnicalPatternsList from "@/components/TechnicalPatternsList";
import PatternDescription from "@/components/PatternDescription";
import { PatternData, PatternType } from "@/components/TechnicalPatternCard";

// بيانات تجريبية للأنماط الفنية
const demoPatterns: PatternData[] = [
  {
    id: "1",
    name: "رأس وكتفين",
    timeframe: "يوم",
    strength: "قوي",
    confidence: 85,
    signal: "بيع",
    targetPrice: "$54,200",
    stopLoss: "$64,800",
    description: "نموذج رأس وكتفين مكتمل مع كسر لخط العنق. يشير إلى احتمالية قوية لانعكاس هبوطي في السوق.",
    detectedAt: "15 مايو 2025 - 10:30"
  },
  {
    id: "2",
    name: "مثلث متماثل",
    timeframe: "4 ساعات",
    strength: "متوسط",
    confidence: 70,
    signal: "انتظار",
    targetPrice: "$62,500",
    stopLoss: "$59,800",
    description: "نموذج مثلث متماثل في تشكل. يقترب السعر من رأس المثلث، مما قد يشير إلى حركة قوية قادمة في أي من الاتجاهين.",
    detectedAt: "14 مايو 2025 - 18:45"
  },
  {
    id: "3",
    name: "قاع مزدوج",
    timeframe: "أسبوع",
    strength: "قوي جداً",
    confidence: 92,
    signal: "شراء",
    targetPrice: "$68,300",
    stopLoss: "$56,700",
    description: "نموذج قاع مزدوج واضح مع اختراق لخط العنق، مدعوم بحجم تداول متزايد وتباعد إيجابي في مؤشر القوة النسبية.",
    detectedAt: "10 مايو 2025 - 22:15"
  }
];

const TechnicalPatterns = () => {
  const [timeframe, setTimeframe] = useState("1d");
  const [selectedPattern, setSelectedPattern] = useState<PatternType | null>("رأس وكتفين");

  const handleTimeframeChange = (newTimeframe: string) => {
    setTimeframe(newTimeframe);
  };

  return (
    <div className="min-h-screen flex w-full">
      <AppSidebar />
      <div className="flex-1 overflow-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-semibold">الأنماط الفنية</h1>
            <div className="flex items-center gap-4">
              <TimeframeSelector onTimeframeChange={handleTimeframeChange} className="flex-row-reverse" />
              <SidebarTrigger />
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* الرسم البياني الرئيسي */}
            <BitcoinChart timeframe={timeframe} className="lg:col-span-8" />
            
            {/* قسم الأنماط المكتشفة */}
            <div className="lg:col-span-4 flex flex-col gap-6">
              <TechnicalPatternsList patterns={demoPatterns} />
            </div>
            
            {/* معلومات عن النمط المحدد */}
            <PatternDescription patternType={selectedPattern} className="lg:col-span-12" />
            
            {/* أمثلة على أنماط مختلفة */}
            <Card className="lg:col-span-12 border-zinc-800">
              <CardHeader>
                <CardTitle className="text-lg">أنماط فنية للتعلم</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {[
                    "رأس وكتفين", 
                    "مثلث صاعد", 
                    "مثلث هابط", 
                    "مثلث متماثل",
                    "قناة سعرية",
                    "قاع مزدوج",
                    "قمة مزدوجة",
                    "نموذج علم"
                  ].map((pattern) => (
                    <button
                      key={pattern}
                      className={`p-3 text-sm rounded-md border transition-colors ${
                        selectedPattern === pattern 
                          ? "border-primary bg-primary/10" 
                          : "border-zinc-800 hover:bg-zinc-800/50"
                      }`}
                      onClick={() => setSelectedPattern(pattern as PatternType)}
                    >
                      {pattern}
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TechnicalPatterns;
