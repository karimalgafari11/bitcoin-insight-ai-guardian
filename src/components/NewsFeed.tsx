
import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ExternalLink, TrendingUp, TrendingDown, MessageSquare } from "lucide-react";

type NewsArticle = {
  titleAr: string;
  titleEn: string;
  sourceAr: string;
  sourceEn: string;
  dateAr: string;
  dateEn: string;
  commentsCount: number;
  sentiment: "positive" | "neutral" | "negative";
  url: string;
};

const NewsFeed = () => {
  const { language, t } = useLanguage();
  
  const newsArticles: NewsArticle[] = [
    {
      titleAr: "خبراء: البيتكوين قد يصل إلى 100,000 دولار بحلول نهاية العام",
      titleEn: "Experts: Bitcoin Could Reach $100,000 by Year End",
      sourceAr: "كوين تيليجراف",
      sourceEn: "CoinTelegraph",
      dateAr: "منذ يومين",
      dateEn: "2 days ago",
      commentsCount: 156,
      sentiment: "positive",
      url: "#"
    },
    {
      titleAr: "تحليل فني: البيتكوين يشكل نموذج مثلث متماثل",
      titleEn: "Technical Analysis: Bitcoin Forms Symmetrical Triangle Pattern",
      sourceAr: "كريبتو نيوز",
      sourceEn: "CryptoNews",
      dateAr: "منذ 3 أيام",
      dateEn: "3 days ago",
      commentsCount: 89,
      sentiment: "neutral",
      url: "#"
    },
    {
      titleAr: "البنك المركزي الأمريكي يرفع أسعار الفائدة، وتأثيره على البيتكوين",
      titleEn: "Fed Raises Interest Rates, Impact on Bitcoin",
      sourceAr: "بلومبرج",
      sourceEn: "Bloomberg",
      dateAr: "منذ 4 أيام",
      dateEn: "4 days ago",
      commentsCount: 237,
      sentiment: "negative",
      url: "#"
    },
    {
      titleAr: "صناديق ETF للبيتكوين تسجل تدفقات بقيمة 500 مليون دولار",
      titleEn: "Bitcoin ETFs Record $500 Million in Inflows",
      sourceAr: "كوين ديسك",
      sourceEn: "CoinDesk",
      dateAr: "منذ 5 أيام",
      dateEn: "5 days ago",
      commentsCount: 124,
      sentiment: "positive",
      url: "#"
    },
    {
      titleAr: "دراسة: 30% من المستثمرين المؤسسيين يخططون للاستثمار في البيتكوين",
      titleEn: "Study: 30% of Institutional Investors Plan to Invest in Bitcoin",
      sourceAr: "فوربس كريبتو",
      sourceEn: "Forbes Crypto",
      dateAr: "منذ أسبوع",
      dateEn: "1 week ago",
      commentsCount: 93,
      sentiment: "positive",
      url: "#"
    },
    {
      titleAr: "تحذير من هجمات التصيد الاحتيالي التي تستهدف مستثمري البيتكوين",
      titleEn: "Warning About Phishing Attacks Targeting Bitcoin Investors",
      sourceAr: "بيتكوين ماجازين",
      sourceEn: "Bitcoin Magazine",
      dateAr: "منذ 8 أيام",
      dateEn: "8 days ago",
      commentsCount: 76,
      sentiment: "negative",
      url: "#"
    }
  ];
  
  const getSentimentIcon = (sentiment: "positive" | "neutral" | "negative") => {
    switch (sentiment) {
      case "positive":
        return <TrendingUp className="h-4 w-4 text-bitcoin-green" />;
      case "negative":
        return <TrendingDown className="h-4 w-4 text-bitcoin-red" />;
      default:
        return null;
    }
  };
  
  const getSentimentClass = (sentiment: "positive" | "neutral" | "negative") => {
    switch (sentiment) {
      case "positive":
        return "text-bitcoin-green";
      case "negative":
        return "text-bitcoin-red";
      default:
        return "";
    }
  };
  
  return (
    <Card className="border-zinc-800">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{t("العنوان", "Title")}</TableHead>
            <TableHead className="w-[150px]">{t("المصدر", "Source")}</TableHead>
            <TableHead className="w-[100px]">{t("التاريخ", "Date")}</TableHead>
            <TableHead className="w-[80px] text-center">{t("تعليقات", "Comments")}</TableHead>
            <TableHead className="w-[60px]">{t("المعنويات", "Sentiment")}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {newsArticles.map((article, index) => (
            <TableRow key={index} className="group cursor-pointer hover:bg-muted/50">
              <TableCell>
                <a href={article.url} target="_blank" rel="noopener noreferrer" className="flex items-center">
                  <span>{language === 'ar' ? article.titleAr : article.titleEn}</span>
                  <ExternalLink className="h-3 w-3 ms-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                </a>
              </TableCell>
              <TableCell>{language === 'ar' ? article.sourceAr : article.sourceEn}</TableCell>
              <TableCell>{language === 'ar' ? article.dateAr : article.dateEn}</TableCell>
              <TableCell className="text-center">
                <div className="flex items-center justify-center gap-1">
                  <MessageSquare className="h-3 w-3" />
                  <span>{article.commentsCount}</span>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex justify-center">
                  {getSentimentIcon(article.sentiment)}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  );
};

export default NewsFeed;
