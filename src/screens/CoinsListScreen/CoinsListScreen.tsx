import React, {useState, useEffect, useCallback, useRef, memo} from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  StatusBar,
  ActivityIndicator,
  Animated,
} from 'react-native';
import SearchBar from '../../components/Searchbar/Searchbar';
import {usePrices} from '../../context/PriceContext';
import CoinRow from './Components/CoinRow';
import Header from './Components/Header';
import LoaderComponent from './Components/LoaderComponent';
import useBianceSocket from './hooks/useBianceSocket';
import useCoinsSearchHook from './hooks/useCoinsSearchHook';
import useFetchInitialCoins from './hooks/useFetchInitialCoins';
import useHeaderAnimateHook from './hooks/useHeaderAnimateHook';

CoinRow.displayName = 'CoinRow';

export default function CoinListScreen() {
  const [coins, setCoins] = useState([]);
  const [filteredCoins, setFilteredCoins] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const {prices, setPrices} = usePrices();
  const {animatedHeight, handleScroll} = useHeaderAnimateHook();

  const {loadMore, paginationLoading} = useFetchInitialCoins({
    setCoins,
    setFilteredCoins,
    setPrices,
    setIsLoading,
  });

  useBianceSocket({
    coins,
    setIsConnected,
    setPrices,
  });

  const {onChangeText} = useCoinsSearchHook({
    coins,
    setFilteredCoins,
    setSearchText,
  });

  const renderItem = useCallback(
    ({item}: any) => {
      const priceData: any = prices[item.symbol] || {
        price: 0,
        change24h: 0,
        volume: 0,
      };

      return (
        <CoinRow
          coin={item}
          price={priceData.price}
          change24h={priceData.change24h}
          volume={priceData.volume}
        />
      );
    },
    [prices],
  );

  const keyExtractor = useCallback((item: {id: any}) => item.id, []);

  const ItemSeparator = useCallback(
    () => <View style={styles.separator} />,
    [],
  );

  if (isLoading) {
    return <LoaderComponent />;
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />

      <Animated.View
        style={{
          height: animatedHeight,
          overflow: 'hidden',
          zIndex: 10,
        }}>
        <Header isConnected={isConnected} />
      </Animated.View>

      <SearchBar value={searchText} onChangeText={onChangeText} />

      <Animated.FlatList
        data={filteredCoins}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        ItemSeparatorComponent={ItemSeparator}
        windowSize={10}
        maxToRenderPerBatch={10}
        updateCellsBatchingPeriod={50}
        initialNumToRender={10}
        removeClippedSubviews={true}
        // onEndReached={searchText?.length > 0 ? null : loadMore}
        contentContainerStyle={{paddingBottom: 40}}
        ListFooterComponent={
          paginationLoading ? (
            <ActivityIndicator size="large" color="#3b82f6" />
          ) : null
        }
        onScroll={handleScroll}
        scrollEventThrottle={16}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  separator: {
    height: 1,
    backgroundColor: '#f3f4f6',
  },
});
