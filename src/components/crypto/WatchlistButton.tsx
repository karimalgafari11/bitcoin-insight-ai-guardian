
import React from 'react';
import { Star, StarOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useWatchlist } from '@/contexts/WatchlistContext';
import { useLanguage } from '@/contexts/LanguageContext';

interface WatchlistButtonProps {
  coinId: string;
  size?: 'sm' | 'default' | 'lg' | 'icon';
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  className?: string;
}

const WatchlistButton = ({ coinId, size = 'icon', variant = 'ghost', className = '' }: WatchlistButtonProps) => {
  const { isInWatchlist, addToWatchlist, removeFromWatchlist } = useWatchlist();
  const { t } = useLanguage();
  
  const isWatched = isInWatchlist(coinId);
  
  const handleToggleWatchlist = () => {
    if (isWatched) {
      removeFromWatchlist(coinId);
    } else {
      addToWatchlist(coinId);
    }
  };
  
  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleToggleWatchlist}
      className={className}
      title={isWatched 
        ? t('إزالة من المفضلة', 'Remove from watchlist')
        : t('إضافة للمفضلة', 'Add to watchlist')
      }
    >
      {isWatched ? (
        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
      ) : (
        <Star className="h-4 w-4" />
      )}
    </Button>
  );
};

export default WatchlistButton;
