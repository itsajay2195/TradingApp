import React, {useState, useEffect, useCallback, useRef, memo} from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  StatusBar,
  ActivityIndicator,
} from 'react-native';
import CoinRow from './Components/CoinRow';
import Header from './Components/Header';
import LoaderComponent from './Components/LoaderComponent';
import useBianceSocket from './hooks/useBianceSocket';
import useFetchInitialCoins from './hooks/useFetchInitialCoins';

CoinRow.displayName = 'CoinRow';

export default function CoinListScreen() {
  const [coins, setCoins] = useState([]);
  const [prices, setPrices] = useState<any>({});
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const wsRef = useRef<WebSocket | null>(null);
  const priceBufferRef: any = useRef({});
  const batchTimeoutRef: any = useRef(null);
  const reconnectTimeoutRef: any = useRef(null);

  // Batch update mechanism - KEY OPTIMIZATION
  // Collects multiple price updates and applies them once
  const scheduleBatchUpdate = useCallback(() => {
    if (batchTimeoutRef.current) return;

    batchTimeoutRef.current = setTimeout(() => {
      if (Object.keys(priceBufferRef.current).length > 0) {
        setPrices((prev: any[]) => ({
          ...prev,
          ...priceBufferRef.current,
        }));
        priceBufferRef.current = {};
      }
      batchTimeoutRef.current = null;
    }, 100); // Batch updates every 100ms - prevents excessive re-renders
  }, []);

  // Fetch initial coin list
  const {loadMore, paginationLoading} = useFetchInitialCoins({
    setCoins,
    setPrices,
    setIsLoading,
  });

  // WebSocket connection for real-time updates
  useBianceSocket({
    coins,
    wsRef,
    setIsConnected,
    priceBufferRef,
    scheduleBatchUpdate,
    reconnectTimeoutRef,
    batchTimeoutRef,
  });

  // Render item callback - wrapped in useCallback for performance
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

  // Item separator
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

      {/* Header */}
      <Header isConnected={isConnected} />

      {/* Coin List with FlatList optimizations */}
      <FlatList
        data={coins}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        ItemSeparatorComponent={ItemSeparator}
        // PERFORMANCE OPTIMIZATIONS
        windowSize={10} // Number of items to render outside visible area
        maxToRenderPerBatch={10} // Max items rendered per batch
        updateCellsBatchingPeriod={50} // Delay between batch renders
        initialNumToRender={10} // Items to render initially
        removeClippedSubviews={true} // Unmount off-screen items (Android)
        onEndReached={loadMore}
        contentContainerStyle={{paddingBottom: 40}}
        ListFooterComponent={
          paginationLoading ? (
            <ActivityIndicator size="large" color="#3b82f6" />
          ) : null
        }
        // getItemLayout can be added if all items have fixed height
      />

      {/* Info Panel */}
      {/* <View style={styles.infoPanel}>
        <Text style={styles.infoTitle}>⚡ Performance Optimizations</Text>
        <Text style={styles.infoText}>
          ✓ React.memo() with custom comparison
        </Text>
        <Text style={styles.infoText}>✓ Batch updates every 100ms</Text>
        <Text style={styles.infoText}>✓ FlatList windowing (10 items)</Text>
        <Text style={styles.infoText}>✓ Real Binance WebSocket stream</Text>
        <Text style={styles.infoText}>✓ Auto-reconnect on disconnect</Text>
      </View> */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  separator: {
    height: 1,
    backgroundColor: '#f3f4f6',
  },
});
