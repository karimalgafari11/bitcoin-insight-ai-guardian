
import { Card, CardContent } from "@/components/ui/card";

type BitcoinStatsProps = {
  className?: string;
};

const BitcoinStats = ({ className }: BitcoinStatsProps) => {
  const stats = [
    { title: "24h تغير", value: "0.05%", positive: true },
    { title: "24h أعلى", value: "$57,832" },
    { title: "24h أدنى", value: "$56,421" },
    { title: "24h حجم التداول", value: "$24.3B" },
    { title: "القيمة السوقية", value: "$1.12T" },
  ];

  return (
    <Card className={`${className} border-zinc-800`}>
      <CardContent className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 p-4">
        {stats.map((stat) => (
          <div key={stat.title} className="flex flex-col">
            <span className="text-sm text-muted-foreground mb-1">{stat.title}</span>
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
