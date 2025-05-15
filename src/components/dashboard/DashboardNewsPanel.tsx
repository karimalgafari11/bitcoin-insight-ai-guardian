
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";
import { BarChart, ArrowUpRight, TrendingUp, ArrowDownRight, ExternalLink } from "lucide-react";
import { AspectRatio } from "@/components/ui/aspect-ratio";

const DashboardNewsPanel = () => {
  const { t } = useLanguage();

  const newsItems = [
    {
      title: 'Bitcoin regains momentum after central bank policy shift',
      sentiment: 'positive',
      time: '2 hours ago',
      image: 'https://images.unsplash.com/photo-1518546305927-5a555bb7020d?w=200&h=120&fit=crop',
      source: 'CoinDesk'
    },
    {
      title: 'Ethereum protocol upgrade scheduled for next month',
      sentiment: 'neutral',
      time: '4 hours ago',
      image: 'https://images.unsplash.com/photo-1621416894569-0f39ed31d247?w=200&h=120&fit=crop',
      source: 'CryptoNews'
    },
    {
      title: 'New regulations could impact crypto markets',
      sentiment: 'negative',
      time: '6 hours ago',
      image: 'https://images.unsplash.com/photo-1621761191319-c6fb62004040?w=200&h=120&fit=crop',
      source: 'Bloomberg'
    },
    {
      title: 'Trading volume hits new quarterly high',
      sentiment: 'positive',
      time: '12 hours ago',
      image: 'https://images.unsplash.com/photo-1605792657660-596af9009e82?w=200&h=120&fit=crop',
      source: 'Reuters'
    }
  ];

  return (
    <Card className="h-full border-none shadow-md bg-gradient-to-tr from-white to-gray-50 dark:from-gray-800 dark:to-gray-900">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle>{t('آخر الأخبار', 'Latest News')}</CardTitle>
          <button className="text-xs text-primary flex items-center hover:underline">
            {t('عرض الكل', 'View all')} 
            <ExternalLink className="h-3 w-3 ml-1" />
          </button>
        </div>
        <CardDescription>
          {t('أحدث الأخبار والتحليلات', 'Recent news and analysis')}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {newsItems.map((news, index) => (
            <div key={index} className="group cursor-pointer flex items-start pb-4 border-b last:border-0 last:pb-0 border-gray-100 dark:border-gray-800">
              <div className="w-20 h-20 flex-shrink-0 mr-3 overflow-hidden rounded-md border border-gray-200 dark:border-gray-700">
                <AspectRatio ratio={4/3} className="bg-muted">
                  <img 
                    src={news.image} 
                    alt={news.title}
                    className="object-cover w-full h-full transition-all duration-300 group-hover:scale-110"
                  />
                </AspectRatio>
              </div>
              <div className="flex-1 space-y-1">
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${
                    news.sentiment === 'positive' ? 'bg-green-500' :
                    news.sentiment === 'negative' ? 'bg-red-500' : 'bg-gray-500'
                  }`}></div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{news.source}</p>
                </div>
                <p className="text-sm font-medium group-hover:text-primary transition-colors">{news.title}</p>
                <div className="flex justify-between items-center">
                  <p className="text-xs text-gray-500 dark:text-gray-400">{news.time}</p>
                  <div className={`text-xs font-medium flex items-center ${
                    news.sentiment === 'positive' ? 'text-green-500' :
                    news.sentiment === 'negative' ? 'text-red-500' : 'text-gray-500'
                  }`}>
                    {news.sentiment === 'positive' ? <ArrowUpRight className="h-3 w-3 mr-1" /> :
                    news.sentiment === 'negative' ? <ArrowDownRight className="h-3 w-3 mr-1" /> :
                    <TrendingUp className="h-3 w-3 mr-1" />}
                    {news.sentiment}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default DashboardNewsPanel;
