
import React from 'react';
import { useWatchlist } from '@/contexts/WatchlistContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { StarOff } from 'lucide-react';
import WatchlistButton from './WatchlistButton';
import SymbolSelector from '../SymbolSelector';

interface WatchlistPanelProps {
  onSymbolSelect: (symbol: string) => void;
  currentSymbol: string;
  className?: string;
}

const WatchlistPanel = ({ onSymbolSelect, currentSymbol, className = '' }: WatchlistPanelProps) => {
  const { watchlist, removeFromWatchlist } = useWatchlist();
  const { t } = useLanguage();

  if (watchlist.length === 0) {
    return (
      <Card className={`${className}`}>
        <CardHeader className="pb-3">
          <CardTitle>{t('قائمة المراقبة', 'Watchlist')}</CardTitle>
          <CardDescription>
            {t('أضف رموز العملات المشفرة التي تريد مراقبتها', 'Add crypto symbols you want to track')}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center py-8 text-center text-muted-foreground">
          <StarOff className="h-12 w-12 mb-2 opacity-40" />
          <p>{t('قائمة المراقبة فارغة', 'Your watchlist is empty')}</p>
          <p className="text-sm mt-1">
            {t('استخدم زر النجمة لإضافة العملات المشفرة إلى قائمة المراقبة', 'Use the star button to add cryptocurrencies to your watchlist')}
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={`${className}`}>
      <CardHeader className="pb-2">
        <CardTitle>{t('قائمة المراقبة', 'Watchlist')}</CardTitle>
        <CardDescription>
          {t('عملاتك المفضلة', 'Your favorite cryptocurrencies')}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {watchlist.map((symbol) => (
            <div 
              key={symbol} 
              className={`flex items-center justify-between p-2 rounded-md ${
                symbol === currentSymbol ? 'bg-muted' : 'hover:bg-muted/50'
              }`}
            >
              <Button 
                variant="ghost" 
                className="flex-grow text-left justify-start font-medium"
                onClick={() => onSymbolSelect(symbol)}
              >
                {symbol}
              </Button>
              <WatchlistButton coinId={symbol} />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default WatchlistPanel;
