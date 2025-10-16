import {useCallback, useEffect, useRef, useState} from 'react';

interface InitialProps {
  setCoins: (val: any) => void;
  setFilteredCoins: (val: any) => void;
  setPrices: (val: any) => void;
  setIsLoading: (val: any) => void;
}

const useFetchInitialCoins = ({
  setCoins,
  setFilteredCoins,
  setPrices,
  setIsLoading,
}: InitialProps) => {
  const [page, setPage] = useState(1);
  const [hasMore, setHasmore] = useState(true);
  const [paginationLoading, setPaginationLoading] = useState(false);

  // Use ref to track page without affecting dependencies
  const pageRef = useRef(1);
  const hasMoreRef = useRef(true);

  // Update refs whenever state changes
  useEffect(() => {
    pageRef.current = page;
  }, [page]);

  useEffect(() => {
    hasMoreRef.current = hasMore;
  }, [hasMore]);

  // fetchCoins NEVER needs to change - no dependencies!
  const fetchCoins = useCallback(async () => {
    if (!hasMoreRef.current) return;

    try {
      const response = await fetch(
        `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=20&page=${pageRef.current}&sparkline=false`,
      );
      const data = await response.json();
      console.log('Fetching page:', pageRef.current, 'Count:', data.length);

      if (data.length === 0) {
        setHasmore(false);
        return;
      }

      const coinList = data.map(
        (coin: {id: any; symbol: any; name: string}) => ({
          id: coin.id,
          symbol: coin.symbol.toUpperCase(),
          name: coin.name,
        }),
      );

      const initialPrices: any = {};
      data.forEach((coin: any) => {
        initialPrices[coin.symbol.toUpperCase()] = {
          price: coin.current_price,
          change24h: coin.price_change_percentage_24h || 0,
          volume: coin.total_volume,
        };
      });

      setCoins((prev: any[]) => {
        const merged = [...prev, ...coinList];
        const unique = Array.from(
          new Map(merged.map(item => [item.id, item])).values(),
        );
        setFilteredCoins(unique);
        return unique;
      });

      setPrices((prev: any) => ({...prev, ...initialPrices}));

      // Increment page for next load
      setPage(prev => prev + 1);

      if (data.length < 20) {
        setHasmore(false);
      }

      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching coins:', error);
      setIsLoading(false);
    }
  }, []); // ✅ EMPTY dependencies - function never recreates!

  const loadMore = useCallback(() => {
    setPaginationLoading(true);
    try {
      fetchCoins();
    } catch (error) {
    } finally {
      setPaginationLoading(false);
    }
  }, [fetchCoins]);

  useEffect(() => {
    fetchCoins(); // Only runs once on mount
  }, []);

  return {
    loadMore,
    paginationLoading,
  };
};

export default useFetchInitialCoins;
