
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ExternalLink } from "lucide-react";

type NewsItem = {
  title: string;
  source: string;
  timeAgo: string;
  isPositive?: boolean;
};

type LatestNewsProps = {
  className?: string;
};

const LatestNews = ({ className }: LatestNewsProps) => {
  const news: NewsItem[] = [
    { 
      title: "سعر البيتكوين ينخفض تحت مستوى $57,000 مع حذر المتداولين", 
      source: "CoinDesk", 
      timeAgo: "3 ساعات",
      isPositive: false
    },
    { 
      title: "المستثمرون المؤسسيون يزيدون من استثماراتهم في البيتكوين رغم الهبوط", 
      source: "Bloomberg", 
      timeAgo: "5 ساعات",
      isPositive: true
    },
    { 
      title: "تحليل فني: البيتكوين يشكل نموذج مثلث، تحرك حاسم متوقع", 
      source: "CryptoAnalyst", 
      timeAgo: "8 ساعات"
    }
  ];

  return (
    <Card className={`${className} border-zinc-800`}>
      <CardHeader>
        <CardTitle className="text-lg">أحدث الأخبار</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {news.map((item, index) => (
          <div key={index} className="flex border-s-4 ps-4 border-zinc-700 hover:border-primary cursor-pointer">
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <div className="text-sm text-muted-foreground">{item.source}</div>
                <div className="text-xs text-muted-foreground">{item.timeAgo}</div>
              </div>
              <div className="mt-1 font-medium group flex items-center">
                <span className={item.isPositive !== undefined 
                  ? item.isPositive 
                    ? "text-bitcoin-green" 
                    : "text-bitcoin-red" 
                  : ""}>
                  {item.title}
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
