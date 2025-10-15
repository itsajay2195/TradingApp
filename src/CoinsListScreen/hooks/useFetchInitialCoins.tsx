import {StyleSheet, Text, View} from 'react-native';
import React, {useEffect} from 'react';

interface InitialProps {
  setCoins: (val: any) => void;
  setPrices: (val: any) => void;
  setIsLoading: (val: any) => void;
}
const useFetchInitialCoins = ({
  setCoins,
  setPrices,
  setIsLoading,
}: InitialProps) => {
  useEffect(() => {
    const fetchCoins = async () => {
      try {
        // Fetch top 20 coins by market cap
        const response = await fetch(
          'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=20&page=1&sparkline=false',
        );
        const data = await response.json();

        const coinList = data.map(
          (coin: {id: any; symbol: any; name: string}) => ({
            id: coin.id,
            symbol: coin.symbol.toUpperCase(),
            name: coin.name,
          }),
        );

        // Initialize prices with current data
        const initialPrices: any = {};
        data.forEach((coin: any) => {
          initialPrices[coin.symbol.toUpperCase()] = {
            price: coin.current_price,
            change24h: coin.price_change_percentage_24h || 0,
            volume: coin.total_volume,
          };
        });

        setCoins(coinList);
        setPrices(initialPrices);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching coins:', error);
        setIsLoading(false);
      }
    };

    fetchCoins();
  }, []);
};

export default useFetchInitialCoins;

const styles = StyleSheet.create({});
