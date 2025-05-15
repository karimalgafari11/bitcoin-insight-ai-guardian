
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";
import { BarChart, ArrowUpRight, TrendingUp, ArrowDownRight } from "lucide-react";

const DashboardNewsPanel = () => {
  const { t } = useLanguage();

  const newsItems = [
    {
      title: 'Bitcoin regains momentum after central bank policy shift',
      sentiment: 'positive',
      time: '2 hours ago'
    },
    {
      title: 'Ethereum protocol upgrade scheduled for next month',
      sentiment: 'neutral',
      time: '4 hours ago'
    },
    {
      title: 'New regulations could impact crypto markets',
      sentiment: 'negative',
      time: '6 hours ago'
    },
    {
      title: 'Trading volume hits new quarterly high',
      sentiment: 'positive',
      time: '12 hours ago'
    }
  ];

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle>{t('آخر الأخبار', 'Latest News')}</CardTitle>
        <CardDescription>
          {t('أحدث الأخبار والتحليلات', 'Recent news and analysis')}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {newsItems.map((news, index) => (
            <div key={index} className="flex items-start pb-3 border-b last:border-0 last:pb-0 border-gray-100 dark:border-gray-800">
              <div className={`p-2 rounded-full text-white mr-3 ${
                news.sentiment === 'positive' ? 'bg-green-500' :
                news.sentiment === 'negative' ? 'bg-red-500' : 'bg-gray-500'
              }`}>
                {news.sentiment === 'positive' ? <ArrowUpRight className="h-4 w-4" /> :
                 news.sentiment === 'negative' ? <ArrowDownRight className="h-4 w-4" /> :
                 <TrendingUp className="h-4 w-4" />}
              </div>
              <div className="flex-1 space-y-1">
                <p className="text-sm font-medium">{news.title}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">{news.time}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default DashboardNewsPanel;
