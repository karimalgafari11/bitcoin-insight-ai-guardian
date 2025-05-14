
import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { ChartContainer } from "@/components/ui/chart";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

type SentimentData = {
  date: string;
  bullish: number;
  neutral: number;
  bearish: number;
};

const SentimentAnalysis = () => {
  const { language, t } = useLanguage();
  
  const sentimentData: SentimentData[] = [
    { date: "01/05", bullish: 65, neutral: 25, bearish: 10 },
    { date: "02/05", bullish: 60, neutral: 28, bearish: 12 },
    { date: "03/05", bullish: 55, neutral: 30, bearish: 15 },
    { date: "04/05", bullish: 50, neutral: 35, bearish: 15 },
    { date: "05/05", bullish: 45, neutral: 35, bearish: 20 },
    { date: "06/05", bullish: 40, neutral: 30, bearish: 30 },
    { date: "07/05", bullish: 42, neutral: 28, bearish: 30 },
    { date: "08/05", bullish: 45, neutral: 30, bearish: 25 },
    { date: "09/05", bullish: 50, neutral: 30, bearish: 20 },
    { date: "10/05", bullish: 55, neutral: 25, bearish: 20 },
    { date: "11/05", bullish: 60, neutral: 25, bearish: 15 },
    { date: "12/05", bullish: 63, neutral: 22, bearish: 15 },
    { date: "13/05", bullish: 55, neutral: 25, bearish: 20 },
    { date: "14/05", bullish: 50, neutral: 30, bearish: 20 },
  ];
  
  const chartConfig = {
    bullish: {
      label: t("إيجابي", "Bullish"),
      color: "#0ecb81"
    },
    neutral: {
      label: t("محايد", "Neutral"),
      color: "#f1b90c"
    },
    bearish: {
      label: t("سلبي", "Bearish"),
      color: "#f6465d"
    }
  };
  
  const marketSentiment = sentimentData[sentimentData.length - 1];
  const sentimentMood = marketSentiment.bullish > 50 ? 
    t("إيجابي", "Bullish") : 
    marketSentiment.bearish > 30 ? 
      t("سلبي", "Bearish") : 
      t("محايد", "Neutral");
  
  const sentimentColor = marketSentiment.bullish > 50 ? 
    "text-bitcoin-green" : 
    marketSentiment.bearish > 30 ? 
      "text-bitcoin-red" : 
      "text-yellow-500";
  
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="col-span-1 border-zinc-800">
          <CardHeader>
            <CardTitle className="text-lg">{t("معنويات السوق الحالية", "Current Market Sentiment")}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center gap-4">
              <div className={`text-4xl font-bold ${sentimentColor}`}>{sentimentMood}</div>
              <div className="flex w-full justify-between text-sm">
                <div>
                  <div className="text-bitcoin-green">{t("إيجابي", "Bullish")}: {marketSentiment.bullish}%</div>
                </div>
                <div>
                  <div className="text-yellow-500">{t("محايد", "Neutral")}: {marketSentiment.neutral}%</div>
                </div>
                <div>
                  <div className="text-bitcoin-red">{t("سلبي", "Bearish")}: {marketSentiment.bearish}%</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="col-span-1 md:col-span-2 border-zinc-800">
          <CardHeader>
            <CardTitle className="text-lg">{t("اتجاهات المعنويات", "Sentiment Trends")}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ChartContainer config={chartConfig} className="h-full">
                <AreaChart data={sentimentData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Area type="monotone" dataKey="bullish" stackId="1" stroke="#0ecb81" fill="#0ecb81" fillOpacity={0.6} />
                  <Area type="monotone" dataKey="neutral" stackId="1" stroke="#f1b90c" fill="#f1b90c" fillOpacity={0.6} />
                  <Area type="monotone" dataKey="bearish" stackId="1" stroke="#f6465d" fill="#f6465d" fillOpacity={0.6} />
                </AreaChart>
              </ChartContainer>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card className="border-zinc-800">
        <CardHeader>
          <CardTitle className="text-lg">{t("تأثير الأخبار على سعر البيتكوين", "News Impact on Bitcoin Price")}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              {t(
                "تظهر البيانات التاريخية أن الأخبار الإيجابية عادة ما تسبق ارتفاع سعر البيتكوين بمتوسط 2.3%، بينما تؤدي الأخبار السلبية إلى انخفاض بمتوسط 1.8%. حاليًا، المعنويات الإيجابية تشكل 55% من إجمالي الأخبار، مما قد يشير إلى اتجاه صعودي محتمل.",
                "Historical data shows that positive news typically precedes Bitcoin price increases by an average of 2.3%, while negative news leads to an average decline of 1.8%. Currently, bullish sentiment makes up 55% of total news, which may indicate a potential upward trend."
              )}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
              <div className="border border-zinc-800 rounded-md p-4 text-center">
                <div className="text-sm text-muted-foreground">{t("تأثير الأخبار الإيجابية", "Positive News Impact")}</div>
                <div className="text-2xl font-bold text-bitcoin-green">+2.3%</div>
              </div>
              <div className="border border-zinc-800 rounded-md p-4 text-center">
                <div className="text-sm text-muted-foreground">{t("تأثير الأخبار المحايدة", "Neutral News Impact")}</div>
                <div className="text-2xl font-bold text-yellow-500">±0.4%</div>
              </div>
              <div className="border border-zinc-800 rounded-md p-4 text-center">
                <div className="text-sm text-muted-foreground">{t("تأثير الأخبار السلبية", "Negative News Impact")}</div>
                <div className="text-2xl font-bold text-bitcoin-red">-1.8%</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SentimentAnalysis;
