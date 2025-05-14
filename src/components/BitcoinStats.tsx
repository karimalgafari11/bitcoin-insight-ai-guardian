
import { Card, CardContent } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";

type BitcoinStatsProps = {
  className?: string;
};

const BitcoinStats = ({ className }: BitcoinStatsProps) => {
  const { t } = useLanguage();
  
  const stats = [
    { titleAr: "24h تغير", titleEn: "24h Change", value: "0.05%", positive: true },
    { titleAr: "24h أعلى", titleEn: "24h High", value: "$57,832" },
    { titleAr: "24h أدنى", titleEn: "24h Low", value: "$56,421" },
    { titleAr: "24h حجم التداول", titleEn: "24h Volume", value: "$24.3B" },
    { titleAr: "القيمة السوقية", titleEn: "Market Cap", value: "$1.12T" },
  ];

  return (
    <Card className={`${className} border-zinc-800`}>
      <CardContent className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 p-4">
        {stats.map((stat) => (
          <div key={stat.titleEn} className="flex flex-col">
            <span className="text-sm text-muted-foreground mb-1">{t(stat.titleAr, stat.titleEn)}</span>
            <span className={
              stat.positive !== undefined
                ? stat.positive
                  ? "text-bitcoin-green"
                  : "text-bitcoin-red"
                : ""
            }>
              {stat.value}
            </span>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default BitcoinStats;
