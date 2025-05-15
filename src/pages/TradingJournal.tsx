
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Filter, FileDown, BarChart4 } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import AppSidebar from "@/components/AppSidebar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { TradesList } from "@/components/TradesList";
import { useTrades } from "@/hooks/useTrades";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const TradingJournal = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { trades, loading, error, refetch } = useTrades();
  const [activeTab, setActiveTab] = useState("all");

  // فلترة الصفقات بناءً على العلامة التبويب النشطة
  const filteredTrades = trades.filter(trade => {
    if (activeTab === "all") return true;
    if (activeTab === "open") return trade.status === "open";
    if (activeTab === "closed") return trade.status === "closed";
    return true;
  });

  // استخراج بعض الإحصاءات البسيطة
  const stats = {
    total: trades.length,
    open: trades.filter(t => t.status === "open").length,
    closed: trades.filter(t => t.status === "closed").length,
    profitable: trades.filter(t => t.status === "closed" && (t.profit_loss || 0) > 0).length,
    unprofitable: trades.filter(t => t.status === "closed" && (t.profit_loss || 0) < 0).length,
  };

  // حساب معدل النجاح
  const winRate = stats.closed > 0 
    ? ((stats.profitable / stats.closed) * 100).toFixed(1)
    : "0";

  // حساب إجمالي الربح/الخسارة
  const totalProfitLoss = trades
    .filter(t => t.profit_loss !== null && t.profit_loss !== undefined)
    .reduce((sum, trade) => sum + (trade.profit_loss || 0), 0);

  return (
    <div className="min-h-screen flex w-full">
      <AppSidebar />
      <div className="flex-1 overflow-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-semibold">{t("دفتر التداول", "Trading Journal")}</h1>
            <div className="flex items-center gap-4">
              <SidebarTrigger />
            </div>
          </div>
          
          {/* بطاقة الإحصاءات */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
            <Card className="border-zinc-800">
              <CardHeader className="py-3 px-4">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {t("إجمالي الصفقات", "Total Trades")}
                </CardTitle>
              </CardHeader>
              <CardContent className="py-0 px-4 pb-3">
                <div className="text-2xl font-bold">
                  {loading ? <Skeleton className="h-8 w-16" /> : stats.total}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {t("مفتوحة:", "Open:")}{" "}
                  {loading ? <Skeleton className="inline-block h-3 w-5" /> : stats.open} | {t("مغلقة:", "Closed:")}{" "}
                  {loading ? <Skeleton className="inline-block h-3 w-5" /> : stats.closed}
                </p>
              </CardContent>
            </Card>

            <Card className="border-zinc-800">
              <CardHeader className="py-3 px-4">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {t("معدل الأرباح", "Win Rate")}
                </CardTitle>
              </CardHeader>
              <CardContent className="py-0 px-4 pb-3">
                <div className="text-2xl font-bold">
                  {loading ? <Skeleton className="h-8 w-16" /> : `${winRate}%`}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {t("رابحة:", "Profitable:")}{" "}
                  {loading ? <Skeleton className="inline-block h-3 w-5" /> : stats.profitable} | {t("خاسرة:", "Losing:")}{" "}
                  {loading ? <Skeleton className="inline-block h-3 w-5" /> : stats.unprofitable}
                </p>
              </CardContent>
            </Card>

            <Card className="border-zinc-800">
              <CardHeader className="py-3 px-4">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {t("الربح/الخسارة", "Profit/Loss")}
                </CardTitle>
              </CardHeader>
              <CardContent className="py-0 px-4 pb-3">
                <div className={`text-2xl font-bold ${totalProfitLoss >= 0 ? "text-green-500" : "text-red-500"}`}>
                  {loading ? (
                    <Skeleton className="h-8 w-16" />
                  ) : (
                    `${totalProfitLoss >= 0 ? "+" : ""}${totalProfitLoss.toFixed(2)}`
                  )}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {t("من الصفقات المغلقة", "From closed trades")}
                </p>
              </CardContent>
            </Card>

            <Card className="border-zinc-800">
              <CardHeader className="py-3 px-4">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {t("إجراءات سريعة", "Quick Actions")}
                </CardTitle>
              </CardHeader>
              <CardContent className="py-0 px-4 pb-3 flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8"
                  onClick={() => navigate("/trading-journal/new")}
                >
                  <Plus className="h-3 w-3 mr-1" />
                  {t("جديد", "New")}
                </Button>
                <Button variant="outline" size="sm" className="h-8">
                  <BarChart4 className="h-3 w-3 mr-1" />
                  {t("تحليل", "Analysis")}
                </Button>
              </CardContent>
            </Card>
          </div>
          
          {/* بطاقة جدول الصفقات */}
          <Card className="border-zinc-800">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-center">
                <CardTitle>{t("سجل الصفقات", "Trade Entries")}</CardTitle>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigate("/trading-journal/new")}
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    {t("صفقة جديدة", "New Trade")}
                  </Button>
                  <Button variant="outline" size="sm">
                    <Filter className="h-4 w-4 mr-1" />
                    {t("تصفية", "Filter")}
                  </Button>
                  <Button variant="outline" size="sm">
                    <FileDown className="h-4 w-4 mr-1" />
                    {t("تصدير", "Export")}
                  </Button>
                </div>
              </div>
              <CardDescription>
                {t("سجل وتتبع صفقاتك لتحسين أدائك", "Record and track your trades to improve performance")}
              </CardDescription>
              
              <Tabs 
                defaultValue="all" 
                value={activeTab}
                onValueChange={setActiveTab}
                className="mt-3"
              >
                <TabsList>
                  <TabsTrigger value="all">{t("الكل", "All")}</TabsTrigger>
                  <TabsTrigger value="open">{t("المفتوحة", "Open")}</TabsTrigger>
                  <TabsTrigger value="closed">{t("المغلقة", "Closed")}</TabsTrigger>
                </TabsList>
              </Tabs>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="space-y-4">
                  <Skeleton className="h-12 w-full" />
                  <Skeleton className="h-12 w-full" />
                  <Skeleton className="h-12 w-full" />
                </div>
              ) : error ? (
                <div className="text-center py-8 text-red-500">
                  {t("حدث خطأ في تحميل البيانات", "Error loading data")}
                </div>
              ) : (
                <TradesList trades={filteredTrades} onTradeDeleted={refetch} />
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default TradingJournal;
