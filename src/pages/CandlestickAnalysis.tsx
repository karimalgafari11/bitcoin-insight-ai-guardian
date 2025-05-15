
import { useState } from "react";
import { AppSidebar } from "@/components/AppSidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import TimeframeSelector from "@/components/TimeframeSelector";
import CandlestickChart from "@/components/CandlestickChart";
import PatternList from "@/components/PatternList";
import SymbolSelector from "@/components/SymbolSelector";
import CandleDetail, { CandleData } from "@/components/CandleDetail";
import PatternDetail from "@/components/chart/PatternDetail";
import { useLanguage } from "@/contexts/LanguageContext";

const CandlestickAnalysis = () => {
  const { t } = useLanguage();
  const [timeframe, setTimeframe] = useState("1d");
  const [symbol, setSymbol] = useState("BTC/USD");
  const [activeTab, setActiveTab] = useState("chart");
  const [selectedCandle, setSelectedCandle] = useState<CandleData | null>(null);
  const [selectedPattern, setSelectedPattern] = useState<{ type: string; index: number } | null>(null);

  const handleTimeframeChange = (tf: any) => {
    setTimeframe(tf);
  };

  const handleSymbolChange = (sym: string) => {
    setSymbol(sym);
  };

  const handleSelectCandle = (candle: CandleData | null) => {
    setSelectedCandle(candle);
  };

  return (
    <div className="min-h-screen flex w-full">
      <AppSidebar />
      <div className="flex-1 overflow-auto">
        <div className="p-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
            <h1 className="text-2xl font-semibold">{t("تحليل الشموع", "Candlestick Analysis")}</h1>
            <div className="flex flex-col md:flex-row items-stretch md:items-center gap-4 w-full md:w-auto">
              <SymbolSelector onSymbolChange={handleSymbolChange} symbol={symbol} />
              <TimeframeSelector 
                onTimeframeChange={handleTimeframeChange}
                className="justify-end"
              />
              <SidebarTrigger className="md:ml-2" />
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="mb-4">
                  <TabsTrigger value="chart">{t("الرسم البياني", "Chart")}</TabsTrigger>
                  <TabsTrigger value="patterns">{t("الأنماط المكتشفة", "Detected Patterns")}</TabsTrigger>
                </TabsList>
                
                <TabsContent value="chart">
                  <Card className="border-zinc-800">
                    <CardHeader>
                      <CardTitle>{symbol} - {timeframe}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <CandlestickChart 
                        symbol={symbol} 
                        timeframe={timeframe} 
                        onSelectCandle={handleSelectCandle}
                      />
                      
                      <div className="text-xs text-muted-foreground mt-2 text-center">
                        {t("انقر على أي شمعة أو نمط في الرسم البياني لعرض تفاصيلها", 
                          "Click on any candle or pattern in the chart to view details")}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="patterns">
                  <Card className="border-zinc-800">
                    <CardHeader>
                      <CardTitle>{t("الأنماط المكتشفة", "Detected Patterns")}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <PatternList symbol={symbol} timeframe={timeframe} />
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
            
            <div className="lg:col-span-1 space-y-6">
              <CandleDetail 
                selectedCandle={selectedCandle}
                timeframe={timeframe}
              />
              
              <PatternDetail 
                pattern={selectedPattern} 
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CandlestickAnalysis;
