
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";
import { useWatchlist } from "@/contexts/WatchlistContext";
import WatchlistButton from "@/components/crypto/WatchlistButton";

const DashboardWatchlistPanel = () => {
  const { t } = useLanguage();
  const { watchlist } = useWatchlist();

  // Sample crypto data for demonstration
  const cryptoData = [
    { id: "bitcoin", name: "Bitcoin", symbol: "BTC", price: 56423.12, change24h: 2.45 },
    { id: "ethereum", name: "Ethereum", symbol: "ETH", price: 3142.86, change24h: 1.85 },
    { id: "solana", name: "Solana", symbol: "SOL", price: 138.74, change24h: -0.32 },
    { id: "cardano", name: "Cardano", symbol: "ADA", price: 0.58, change24h: -1.24 },
    { id: "ripple", name: "XRP", symbol: "XRP", price: 0.51, change24h: 3.65 }
  ];

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle>{t('قائمة المراقبة', 'Watchlist')}</CardTitle>
        <CardDescription>
          {t('العملات المشفرة التي تتابعها', 'Cryptocurrencies you are tracking')}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-1">
          {cryptoData.map((crypto) => (
            <div 
              key={crypto.id} 
              className="flex items-center justify-between py-3 border-b last:border-0 border-gray-100 dark:border-gray-800"
            >
              <div className="flex items-center space-x-3 rtl:space-x-reverse">
                <div className="font-medium">{crypto.name}</div>
                <div className="text-sm text-gray-500 dark:text-gray-400">{crypto.symbol}</div>
              </div>
              <div className="flex items-center space-x-4 rtl:space-x-reverse">
                <div className="text-right">
                  <div className="font-medium">${crypto.price.toLocaleString()}</div>
                  <div className={`text-xs ${crypto.change24h >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                    {crypto.change24h >= 0 ? '+' : ''}{crypto.change24h.toFixed(2)}%
                  </div>
                </div>
                <WatchlistButton coinId={crypto.id} size="sm" />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default DashboardWatchlistPanel;
