
import React, { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { AppSidebar } from "@/components/AppSidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import LatestNews from "@/components/LatestNews";
import SentimentAnalysis from "@/components/SentimentAnalysis";
import NewsFeed from "@/components/NewsFeed";
import LanguageSwitcher from "@/components/LanguageSwitcher";

const NewsSentiment = () => {
  const { language, t } = useLanguage();
  const [activeTab, setActiveTab] = useState("latest");
  const { toast } = useToast();

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    toast({
      title: t("تم تغيير التبويب", "Tab changed"),
      description: t("تم الانتقال إلى " + value, "Navigated to " + value)
    });
  };

  return (
    <div className="min-h-screen flex w-full">
      <AppSidebar />
      <div className="flex-1 overflow-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-semibold">{t("الأخبار والمعنويات", "News & Sentiment")}</h1>
            <div className="flex items-center gap-4">
              <LanguageSwitcher />
              <SidebarTrigger />
            </div>
          </div>
          
          <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
            <TabsList className="grid grid-cols-3 mb-6">
              <TabsTrigger value="latest">{t("أحدث الأخبار", "Latest News")}</TabsTrigger>
              <TabsTrigger value="sentiment">{t("تحليل المعنويات", "Sentiment Analysis")}</TabsTrigger>
              <TabsTrigger value="feed">{t("مقالات متنوعة", "News Feed")}</TabsTrigger>
            </TabsList>
            
            <TabsContent value="latest" className="space-y-6">
              <LatestNews className="w-full" />
            </TabsContent>
            
            <TabsContent value="sentiment" className="space-y-6">
              <SentimentAnalysis />
            </TabsContent>
            
            <TabsContent value="feed" className="space-y-6">
              <NewsFeed />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default NewsSentiment;
