import {useCallback, useEffect, useState} from 'react';
import {Alert} from 'react-native';
import {watchlistStorage} from '../../../constants/mmkvConstants';

interface WatchlistCoin {
  id: string;
  symbol: string;
  name: string;
  addedAt: number;
}
export const useWatchlist = () => {
  const [watchlist, setWatchlist] = useState<WatchlistCoin[]>([]);

  useEffect(() => {
    loadWatchlist();
  }, []);

  const loadWatchlist = useCallback(() => {
    try {
      const saved = watchlistStorage.getString('watchlist');
      if (saved) {
        setWatchlist(JSON.parse(saved));
      }
    } catch (error) {
      console.error('Error loading watchlist:', error);
    }
  }, []);

  const addToWatchlist = useCallback(
    (coin: any) => {
      try {
        const exists = watchlist.some(w => w.id === coin.id);
        if (exists) {
          Alert.alert('Already in watchlist', `${coin.name} is already saved`);
          return false;
        }

        const newCoin: WatchlistCoin = {
          id: coin.id,
          symbol: coin.symbol,
          name: coin.name,
          addedAt: Date.now(),
        };

        const updated = [...watchlist, newCoin];
        setWatchlist(updated);
        watchlistStorage.set('watchlist', JSON.stringify(updated));
        return true;
      } catch (error) {
        console.error('Error adding to watchlist:', error);
        return false;
      }
    },
    [watchlist],
  );

  const removeFromWatchlist = useCallback(
    (coinId: string) => {
      try {
        const updated = watchlist.filter(w => w.id !== coinId);
        setWatchlist(updated);
        watchlistStorage.set('watchlist', JSON.stringify(updated));
      } catch (error) {
        console.error('Error removing from watchlist:', error);
      }
    },
    [watchlist],
  );

  const isInWatchlist = useCallback(
    (coinId: string) => {
      return watchlist.some(w => w.id === coinId);
    },
    [watchlist],
  );

  return {
    watchlist,
    addToWatchlist,
    removeFromWatchlist,
    isInWatchlist,
    loadWatchlist,
  };
};
