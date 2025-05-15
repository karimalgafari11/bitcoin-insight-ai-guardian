
import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from '@/components/ui/use-toast';
import { useLanguage } from './LanguageContext';

interface WatchlistContextType {
  watchlist: string[];
  addToWatchlist: (coin: string) => void;
  removeFromWatchlist: (coin: string) => void;
  isInWatchlist: (coin: string) => boolean;
}

const WatchlistContext = createContext<WatchlistContextType | undefined>(undefined);

export function WatchlistProvider({ children }: { children: React.ReactNode }) {
  const { t } = useLanguage();
  const [watchlist, setWatchlist] = useState<string[]>([]);

  // Load watchlist from localStorage on initial render
  useEffect(() => {
    const savedWatchlist = localStorage.getItem('crypto-watchlist');
    if (savedWatchlist) {
      try {
        setWatchlist(JSON.parse(savedWatchlist));
      } catch (error) {
        console.error('Failed to parse watchlist from localStorage:', error);
        localStorage.removeItem('crypto-watchlist');
      }
    }
  }, []);

  // Save watchlist to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('crypto-watchlist', JSON.stringify(watchlist));
  }, [watchlist]);

  const addToWatchlist = (coin: string) => {
    if (!watchlist.includes(coin)) {
      setWatchlist((prev) => [...prev, coin]);
      toast({
        title: t('تمت الإضافة للمراقبة', 'Added to Watchlist'),
        description: t(`تمت إضافة ${coin} إلى قائمة المراقبة`, `${coin} has been added to your watchlist`),
      });
    }
  };

  const removeFromWatchlist = (coin: string) => {
    setWatchlist((prev) => prev.filter((item) => item !== coin));
    toast({
      title: t('تمت الإزالة من المراقبة', 'Removed from Watchlist'),
      description: t(`تمت إزالة ${coin} من قائمة المراقبة`, `${coin} has been removed from your watchlist`),
    });
  };

  const isInWatchlist = (coin: string) => {
    return watchlist.includes(coin);
  };

  return (
    <WatchlistContext.Provider value={{ watchlist, addToWatchlist, removeFromWatchlist, isInWatchlist }}>
      {children}
    </WatchlistContext.Provider>
  );
}

export function useWatchlist() {
  const context = useContext(WatchlistContext);
  if (context === undefined) {
    throw new Error('useWatchlist must be used within a WatchlistProvider');
  }
  return context;
}
