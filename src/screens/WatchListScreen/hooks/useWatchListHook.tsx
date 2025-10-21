import {useCallback, useEffect, useState, useRef} from 'react';
import {Alert} from 'react-native';
import {createMMKV} from 'react-native-mmkv';

export const watchlistStorage = createMMKV();

interface WatchlistCoin {
  id: string;
  symbol: string;
  name: string;
  addedAt: number;
}

export const useWatchlist = ({setCoins, setFilteredCoins}: any) => {
  const [watchlist, setWatchlist] = useState<any[]>([]);
  const isInitialized = useRef(false);

  // // ✅ Add to watchlist
  const addToWatchlist = useCallback(
    (coin: any) => {
      try {
        const exists = watchlist.some(w => w.id === coin.id);
        setCoins((prev: any) => {
          let temp = prev?.map((item: any) =>
            item?.id === coin.id ? {...item, isWatched: true} : {...item},
          );
          setFilteredCoins(temp);
          return temp;
        });
        const newCoin: WatchlistCoin = {
          id: coin.id,
          symbol: coin.symbol,
          name: coin.name,
          addedAt: Date.now(),
        };

        setWatchlist((prev: any) => {
          let temp = [...prev, {...newCoin}];
          watchlistStorage.set('watchlist', JSON.stringify(temp));
          return temp;
        });

        return true;
      } catch (error) {
        console.error('Error adding to watchlist:', error);
        return false;
      }
    },
    [watchlist, setCoins, setFilteredCoins], // ✅ Correct dependency
  );

  // // ✅ Remove from watchlist
  const removeFromWatchlist = useCallback(
    (coinId: string) => {
      try {
        const updated = watchlist.filter(w => w.id !== coinId);
        setCoins((prev: any) => {
          let temp = prev?.map((item: any) =>
            item?.id === coinId ? {...item, isWatched: true} : item,
          );
          setFilteredCoins(temp);
          return temp;
        });

        setWatchlist((prev: any[]) => {
          let temp = prev?.filter((item: any) => item?.id !== coinId);
          watchlistStorage.set('watchlist', JSON.stringify(temp));
          return temp;
        });
      } catch (error) {
        console.error('Error removing from watchlist:', error);
      }
    },
    [watchlist], // ✅ Correct dependency
  );

  // // ✅ Check if in watchlist
  const isInWatchlist = useCallback(
    (coinId: string) => {
      return watchlist?.some(w => w.id === coinId);
    },
    [watchlist], // ✅ Correct dependency
  );

  // // ✅ Handle toggle (correct dependencies)
  const handleWatchlistPress = useCallback(
    (coin: any, isWatched: boolean) => {
      if (isWatched) {
        removeFromWatchlist(coin.id);
      } else {
        addToWatchlist(coin);
      }
    },
    [addToWatchlist, removeFromWatchlist], // ✅ Include all used functions
  );

  useEffect(() => {
    setTimeout(() => {
      if (isInitialized.current) return;

      try {
        const saved = watchlistStorage.getString('watchlist');
        if (saved) {
          const parsed = JSON.parse(saved);
          const newRef = JSON.parse(JSON.stringify(parsed));
          setWatchlist(newRef);
        }
        isInitialized.current = true;
      } catch (error) {
        console.error('Error loading watchlist:', error);
      }
    }, 500);
  }, []);

  return {
    handleWatchlistPress,
  };
};

export default useWatchlist;
