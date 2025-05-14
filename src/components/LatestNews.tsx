
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ExternalLink } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

type NewsItem = {
  titleAr: string;
  titleEn: string;
  source: string;
  timeAgoAr: string;
  timeAgoEn: string;
  isPositive?: boolean;
};

type LatestNewsProps = {
  className?: string;
};

const LatestNews = ({ className }: LatestNewsProps) => {
  const { language, t } = useLanguage();
  
  const news: NewsItem[] = [
    { 
      titleAr: "سعر البيتكوين ينخفض تحت مستوى $57,000 مع حذر المتداولين",
      titleEn: "Bitcoin price falls below $57,000 as traders remain cautious", 
      source: "CoinDesk", 
      timeAgoAr: "3 ساعات",
      timeAgoEn: "3 hours ago",
      isPositive: false
    },
    { 
      titleAr: "المستثمرون المؤسسيون يزيدون من استثماراتهم في البيتكوين رغم الهبوط",
      titleEn: "Institutional investors increase Bitcoin holdings despite dip", 
      source: "Bloomberg", 
      timeAgoAr: "5 ساعات",
      timeAgoEn: "5 hours ago",
      isPositive: true
    },
    { 
      titleAr: "تحليل فني: البيتكوين يشكل نموذج مثلث، تحرك حاسم متوقع",
      titleEn: "Technical Analysis: Bitcoin forms triangle pattern, decisive move expected", 
      source: "CryptoAnalyst", 
      timeAgoAr: "8 ساعات",
      timeAgoEn: "8 hours ago"
    }
  ];

  return (
    <Card className={`${className} border-zinc-800`}>
      <CardHeader>
        <CardTitle className="text-lg">{t("أحدث الأخبار", "Latest News")}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {news.map((item, index) => (
          <div key={index} className="flex border-s-4 ps-4 border-zinc-700 hover:border-primary cursor-pointer">
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <div className="text-sm text-muted-foreground">{item.source}</div>
                <div className="text-xs text-muted-foreground">{language === 'ar' ? item.timeAgoAr : item.timeAgoEn}</div>
              </div>
              <div className="mt-1 font-medium group flex items-center">
                <span className={item.isPositive !== undefined 
                  ? item.isPositive 
                    ? "text-bitcoin-green" 
                    : "text-bitcoin-red" 
                  : ""}>
                  {language === 'ar' ? item.titleAr : item.titleEn}
                </span>
                <ExternalLink className="h-3 w-3 ms-1 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default LatestNews;
