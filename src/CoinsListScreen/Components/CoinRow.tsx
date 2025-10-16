import {memo} from 'react';
import {View, Text, StyleSheet} from 'react-native';

// Memoized coin row component - CRITICAL for performance

interface CoinRowProps {
  coin: {symbol: any; name: string};
  price: number;
  change24h: number;
  volume: any;
}
const CoinRow = memo(
  ({coin, price, change24h, volume}: CoinRowProps) => {
    if (price === 0) return null;
    const isPositive = change24h >= 0;
    const changeColor = isPositive ? '#16a34a' : '#dc2626';
    console.log('volume>>', volume);
    return (
      <View style={styles.row}>
        <View style={styles.coinInfo}>
          <View style={styles.iconContainer}>
            <Text style={styles.iconText}>{coin?.symbol.slice(0, 2)}</Text>
          </View>
          <View>
            <Text style={styles.symbol}>{coin?.symbol}</Text>
            <Text style={styles.name}>{coin?.name}</Text>
          </View>
        </View>

        <View style={styles.priceInfo}>
          <Text style={styles.price}>
            $
            {price?.toLocaleString('en-US', {
              minimumFractionDigits: 2,
              maximumFractionDigits: price < 1 ? 4 : 2,
            })}
          </Text>
          <Text style={[styles.change, {color: changeColor}]}>
            {isPositive ? '+' : ''}
            {change24h?.toFixed(2)}%
          </Text>
          {volume ? (
            <Text style={styles.volume}>
              Vol: ${(volume / 1000000)?.toFixed(1)}M
            </Text>
          ) : null}
        </View>
      </View>
    );
  },
  (
    prevProps: {price: any; change24h: any; volume: any},
    nextProps: {price: any; change24h: any; volume: any},
  ) => {
    // Custom comparison - only re-render if data actually changed
    return (
      prevProps.price === nextProps.price &&
      prevProps.change24h === nextProps.change24h &&
      prevProps.volume === nextProps.volume
    );
  },
);

export default CoinRow;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f9fafb',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#6b7280',
  },
  header: {
    backgroundColor: '#ffffff',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 2,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  statusText: {
    fontSize: 14,
    color: '#6b7280',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  coinInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#3b82f6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  iconText: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  symbol: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  name: {
    fontSize: 13,
    color: '#6b7280',
    marginTop: 2,
  },
  priceInfo: {
    alignItems: 'flex-end',
  },
  price: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  change: {
    fontSize: 14,
    fontWeight: '500',
    marginTop: 2,
  },
  volume: {
    fontSize: 12,
    color: '#9ca3af',
    marginTop: 2,
  },
  separator: {
    height: 1,
    backgroundColor: '#f3f4f6',
  },
  infoPanel: {
    backgroundColor: '#eff6ff',
    borderTopWidth: 1,
    borderTopColor: '#bfdbfe',
    padding: 16,
  },
  infoTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1e40af',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 13,
    color: '#1e3a8a',
    marginBottom: 4,
  },
});
