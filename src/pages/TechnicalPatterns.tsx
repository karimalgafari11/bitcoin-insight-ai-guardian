
import { useState } from "react";
import AppSidebar from "@/components/AppSidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SidebarTrigger } from "@/components/ui/sidebar";
import BitcoinChart from "@/components/BitcoinChart";
import TimeframeSelector from "@/components/TimeframeSelector";
import TechnicalPatternsList from "@/components/TechnicalPatternsList";
import PatternDescription from "@/components/PatternDescription";
import { PatternData, PatternType } from "@/components/TechnicalPatternCard";
import { useLanguage } from "@/contexts/LanguageContext";

// Demo data for technical patterns
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
  const { t } = useLanguage();

  const handleTimeframeChange = (newTimeframe: string) => {
    setTimeframe(newTimeframe);
  };

  const patternTypes = [
    { ar: "رأس وكتفين", en: "Head & Shoulders" }, 
    { ar: "مثلث صاعد", en: "Ascending Triangle" }, 
    { ar: "مثلث هابط", en: "Descending Triangle" }, 
    { ar: "مثلث متماثل", en: "Symmetrical Triangle" },
    { ar: "قناة سعرية", en: "Price Channel" },
    { ar: "قاع مزدوج", en: "Double Bottom" },
    { ar: "قمة مزدوجة", en: "Double Top" },
    { ar: "نموذج علم", en: "Flag Pattern" }
  ];

  return (
    <div className="min-h-screen flex w-full">
      <AppSidebar />
      <div className="flex-1 overflow-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-semibold">{t("الأنماط الفنية", "Technical Patterns")}</h1>
            <div className="flex items-center gap-4">
              <TimeframeSelector onTimeframeChange={handleTimeframeChange} className="flex-row-reverse" />
              <SidebarTrigger />
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Main chart */}
            <BitcoinChart timeframe={timeframe} className="lg:col-span-8" />
            
            {/* Discovered patterns section */}
            <div className="lg:col-span-4 flex flex-col gap-6">
              <TechnicalPatternsList patterns={demoPatterns} />
            </div>
            
            {/* Selected pattern information */}
            <PatternDescription patternType={selectedPattern} className="lg:col-span-12" />
            
            {/* Examples of different patterns */}
            <Card className="lg:col-span-12 border-zinc-800">
              <CardHeader>
                <CardTitle className="text-lg">{t("أنماط فنية للتعلم", "Technical Patterns to Learn")}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {patternTypes.map((pattern) => (
                    <button
                      key={pattern.ar}
                      className={`p-3 text-sm rounded-md border transition-colors ${
                        selectedPattern === pattern.ar 
                          ? "border-primary bg-primary/10" 
                          : "border-zinc-800 hover:bg-zinc-800/50"
                      }`}
                      onClick={() => setSelectedPattern(pattern.ar as PatternType)}
                    >
                      {t(pattern.ar, pattern.en)}
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
