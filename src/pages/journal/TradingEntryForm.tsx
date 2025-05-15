
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { ArrowLeft } from "lucide-react";
import { TradeEntryForm } from "@/components/TradeEntryForm";
import { useTrades } from "@/hooks/useTrades";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import AppSidebar from "@/components/AppSidebar";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Skeleton } from "@/components/ui/skeleton";

const TradingEntryFormPage = () => {
  const { id } = useParams<{ id: string }>();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { fetchTrade } = useTrades();
  const [loading, setLoading] = useState(!!id);
  const [tradeData, setTradeData] = useState<any>(null);

  const isEditing = !!id;

  useEffect(() => {
    const loadTrade = async () => {
      if (id) {
        setLoading(true);
        const trade = await fetchTrade(id);
        setTradeData(trade);
        setLoading(false);
      }
    };
    loadTrade();
  }, [id, fetchTrade]);

  return (
    <div className="min-h-screen flex w-full">
      <AppSidebar />
      <div className="flex-1 overflow-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate("/trading-journal")}
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <h1 className="text-2xl font-semibold">
                {isEditing
                  ? t("تحرير الصفقة", "Edit Trade")
                  : t("صفقة جديدة", "New Trade")}
              </h1>
            </div>
            <div className="flex items-center gap-4">
              <SidebarTrigger />
            </div>
          </div>

          <Card className="border-zinc-800">
            <CardHeader>
              <CardTitle>
                {isEditing
                  ? t("تحرير تفاصيل الصفقة", "Edit Trade Details")
                  : t("أدخل تفاصيل الصفقة", "Enter Trade Details")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="space-y-5">
                  <Skeleton className="h-10 w-full" />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                  </div>
                  <Skeleton className="h-24 w-full" />
                  <div className="flex gap-4">
                    <Skeleton className="h-10 w-36" />
                    <Skeleton className="h-10 w-36" />
                  </div>
                </div>
              ) : (
                <TradeEntryForm
                  initialData={tradeData}
                  isEditing={isEditing}
                  tradeId={id}
                  onSuccess={() => navigate("/trading-journal")}
                />
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default TradingEntryFormPage;
