import {memo, useCallback, useState} from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import Icon from '../../../components/IconComponent/IconComponent';
import {formatPrice, formatVolume} from '../../../utils/coinlistUtils';
import {useWatchlist} from '../../WatchListScreen/hooks/useWatchListHook';
import {useNavigation} from '@react-navigation/native';

// Memoized coin row component - CRITICAL for performance

interface CoinRowProps {
  coin: {symbol: any; name: string; id?: any; isWatched: boolean};
  price: number;
  change24h: number;
  volume: any;
  onWatchlistPress?: any;
  showFavIcon?: boolean;
}
const CoinRow = memo(
  ({
    coin,
    price,
    change24h,
    volume,
    onWatchlistPress,
    showFavIcon = false,
  }: CoinRowProps) => {
    const navigation: any = useNavigation();
    const [isInWatchList, setIsInWatchlist] = useState(coin?.isWatched);
    const onFavPress = useCallback(() => {
      setIsInWatchlist((prev: boolean) => !prev);
      try {
        // onWatchlistPress();
        onWatchlistPress(coin, isInWatchList);
      } catch (error) {
        setIsInWatchlist((prev: boolean) => !prev);
      }
    }, [isInWatchList]);

    const onPress = useCallback(() => {
      navigation.navigate('COIN_DETAILS_SCREEN', {coin});
    }, [coin]);
    if (price === 0) return null;
    const isPositive = change24h >= 0;
    const changeColor = isPositive ? '#16a34a' : '#dc2626';

    return (
      <TouchableOpacity
        style={styles.coinRow}
        onPress={onPress}
        activeOpacity={0.7}>
        {/* Left: Icon + Name */}
        <View style={styles.coinInfo}>
          <View style={styles.iconContainer}>
            <Text style={styles.iconText}>{coin?.symbol.slice(0, 2)}</Text>
          </View>
          <View>
            <Text style={styles.symbol}>{coin?.symbol}</Text>
            <Text style={styles.name}>{coin?.name}</Text>
          </View>
        </View>

        {/* Right: Price + Change + Heart */}
        <View style={styles.coinRight}>
          <View style={styles.priceContainer}>
            <Text style={styles.coinPrice}>${formatPrice(price)}</Text>
            <View style={[styles.changeContainer]}>
              <Text style={[styles.changeText, {color: changeColor}]}>
                {isPositive ? '↑' : '↓'} {Math.abs(change24h).toFixed(2)}%
              </Text>
            </View>
            {volume > 0 && (
              <Text style={styles.volumeText}>
                Vol: ${formatVolume(volume)}
              </Text>
            )}
          </View>

          {/* Heart Icon */}
          {showFavIcon ? (
            <TouchableOpacity
              onPress={onFavPress}
              style={styles.heartButton}
              hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}>
              <Icon
                library={'Entypo'}
                name={isInWatchList ? 'heart' : 'heart-outlined'}
                size={20}
                //  color={isWatched ? "blue":}
              />
            </TouchableOpacity>
          ) : null}
        </View>
      </TouchableOpacity>
    );
  },
  (
    prevProps: {
      price: any;
      change24h: any;
      volume: any;
      coin: {symbol: any; name: string; id?: any; isWatched?: boolean};
    },
    nextProps: {
      price: any;
      change24h: any;
      volume: any;
      coin: {symbol: any; name: string; id?: any; isWatched?: boolean};
    },
  ) => {
    // Custom comparison - only re-render if data actually changed
    return (
      prevProps.price === nextProps.price &&
      prevProps.change24h === nextProps.change24h &&
      prevProps.volume === nextProps.volume &&
      prevProps.coin.isWatched === nextProps.coin.isWatched
    );
  },
);

export default CoinRow;

const styles = StyleSheet.create({
  coinRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  coinLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  coinIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  coinIconText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
  },
  coinInfo: {
    flex: 1,
    flexDirection: 'row',
  },
  coinSymbol: {
    fontSize: 17,
    fontWeight: '700',
    color: '#111827',
    letterSpacing: 0.2,
  },
  coinName: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 2,
  },

  // Price Section
  coinRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  priceContainer: {
    alignItems: 'flex-end',
  },
  coinPrice: {
    fontSize: 17,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  changeContainer: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    marginBottom: 2,
  },
  changeText: {
    fontSize: 13,
    fontWeight: '700',
  },
  volumeText: {
    fontSize: 11,
    color: '#9ca3af',
    marginTop: 2,
  },

  // Heart Button
  heartButton: {
    padding: 4,
  },
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
    gap: 10,
    flexDirection: 'row',
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
