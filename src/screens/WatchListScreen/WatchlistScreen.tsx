import {StyleSheet, FlatList, View} from 'react-native';
import React, {useCallback} from 'react';
import useWatchlist from './hooks/useWatchListHook';
import CoinRow from '../CoinsListScreen/Components/CoinRow';
import {usePrices} from '../../context/PriceContext';

const WatchlistScreen = () => {
  const {watchlist} = useWatchlist({});
  const {prices} = usePrices();
  const keyExtractor = useCallback(
    (item: {id: any}, index: any) => `${item.id}-${index}`,
    [],
  );
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
          onWatchlistPress={() => {}}
        />
      );
    },
    [prices],
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={watchlist}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        extraData={watchlist}
        // ItemSeparatorComponent={ItemSeparator}
        windowSize={10}
        maxToRenderPerBatch={10}
        updateCellsBatchingPeriod={50}
        initialNumToRender={10}
        removeClippedSubviews={true}
        // onEndReached={searchText?.length > 0 ? null : loadMore}
        contentContainerStyle={{paddingBottom: 40}}
        scrollEventThrottle={16}
      />
    </View>
  );
};

export default WatchlistScreen;

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: 'white'},
});
