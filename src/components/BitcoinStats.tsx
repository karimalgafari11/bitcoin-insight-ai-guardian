
import { Card, CardContent } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";
import { useCryptoData } from "@/hooks/useCryptoData";
import { Skeleton } from "@/components/ui/skeleton";

type BitcoinStatsProps = {
  className?: string;
};

const BitcoinStats = ({ className }: BitcoinStatsProps) => {
  const { t } = useLanguage();
  const { data, loading, error } = useCryptoData("bitcoin", "1");
  
  // Format currency values
  const formatCurrency = (value?: number) => {
    if (!value) return "-";
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(value);
  };
  
  // Format large numbers for volume and market cap
  const formatLargeNumber = (num?: number) => {
    if (!num) return "-";
    if (num >= 1e12) {
      return `$${(num / 1e12).toFixed(2)}T`;
    } else if (num >= 1e9) {
      return `$${(num / 1e9).toFixed(2)}B`;
    } else if (num >= 1e6) {
      return `$${(num / 1e6).toFixed(2)}M`;
    } else if (num >= 1e3) {
      return `$${(num / 1e3).toFixed(2)}K`;
    }
    return `$${num.toString()}`;
  };
  
  // Format percentage values
  const formatPercent = (value?: number) => {
    if (value === undefined) return "-";
    return `${value > 0 ? '+' : ''}${value.toFixed(2)}%`;
  };
  
  if (loading) {
    return (
      <Card className={`${className} border-zinc-800`}>
        <CardContent className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 p-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex flex-col">
              <Skeleton className="h-4 w-16 mb-2" />
              <Skeleton className="h-6 w-20" />
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }
  
  let price_24h_high = 0;
  let price_24h_low = 0;
  
  if (data && data.prices && data.prices.length > 0) {
    // Extract 24h high and low from price data
    price_24h_high = Math.max(...data.prices.map(p => p[1]));
    price_24h_low = Math.min(...data.prices.map(p => p[1]));
  }
  
  const metadata = data?.metadata;
  
  const stats = [
    { 
      titleAr: "24h تغير", 
      titleEn: "24h Change", 
      value: formatPercent(metadata?.percent_change_24h),
      positive: metadata?.percent_change_24h ? metadata.percent_change_24h > 0 : undefined 
    },
    { 
      titleAr: "24h أعلى", 
      titleEn: "24h High", 
      value: formatCurrency(price_24h_high || undefined) 
    },
    { 
      titleAr: "24h أدنى", 
      titleEn: "24h Low", 
      value: formatCurrency(price_24h_low || undefined) 
    },
    { 
      titleAr: "24h حجم التداول", 
      titleEn: "24h Volume", 
      value: formatLargeNumber(metadata?.volume_24h) 
    },
    { 
      titleAr: "القيمة السوقية", 
      titleEn: "Market Cap", 
      value: formatLargeNumber(metadata?.market_cap) 
    },
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
