// screens/CoinDetailScreen/CoinDetailScreen.tsx
import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import {
  VictoryLine,
  VictoryChart,
  VictoryAxis,
  VictoryTheme,
} from 'victory-native';
import Icon from '../../components/IconComponent/IconComponent';

interface CoinDetailProps {
  route: any;
  navigation: any;
}

const CoinDetailScreen = ({route, navigation}: CoinDetailProps) => {
  const {coin} = route.params;
  const [chartData, setChartData] = useState([]);
  const [timeframe, setTimeframe] = useState('7');
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    high24h: 0,
    low24h: 0,
    marketCap: 0,
    volume: 0,
  });

  useEffect(() => {
    fetchChartData();
  }, [timeframe]);

  const fetchChartData = async () => {
    setLoading(true);
    try {
      // Fetch from CoinGecko Market Chart API
      const response = await fetch(
        `https://api.coingecko.com/api/v3/coins/${coin.id}/market_chart?vs_currency=usd&days=${timeframe}`,
      );
      const data = await response.json();

      // Transform data for Victory chart
      const prices = data.prices.map((item: any) => ({
        x: new Date(item[0]),
        y: item[1],
      }));

      setChartData(prices);

      // Calculate stats
      const priceValues = prices.map((p: any) => p.y);
      setStats({
        high24h: Math.max(...priceValues),
        low24h: Math.min(...priceValues),
        marketCap: data.market_caps?.[data.market_caps.length - 1]?.[1] || 0,
        volume: data.total_volumes?.[data.total_volumes.length - 1]?.[1] || 0,
      });

      setLoading(false);
    } catch (error) {
      console.error('Error fetching chart data:', error);
      setLoading(false);
    }
  };

  const formatPrice = (price: number) => {
    if (price >= 1000) {
      return `$${price.toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}`;
    }
    return `$${price.toFixed(price < 1 ? 4 : 2)}`;
  };

  const formatMarketCap = (value: number) => {
    if (value >= 1e12) return `$${(value / 1e12).toFixed(2)}T`;
    if (value >= 1e9) return `$${(value / 1e9).toFixed(2)}B`;
    if (value >= 1e6) return `$${(value / 1e6).toFixed(2)}M`;
    return `$${value.toFixed(0)}`;
  };

  const timeframes = [
    {label: '24H', value: '1'},
    {label: '7D', value: '7'},
    {label: '30D', value: '30'},
    {label: '1Y', value: '365'},
    {label: 'ALL', value: 'max'},
  ];

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}>
          <Icon library={'FontAwesome6'} name={'arrow-left'} size={20} />
        </TouchableOpacity>
        <View style={styles.headerInfo}>
          <Text style={styles.symbol}>{coin.symbol}</Text>
          <Text style={styles.name}>{coin.name}</Text>
        </View>
      </View>

      {/* Chart */}
      <View style={styles.chartContainer}>
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#3b82f6" />
          </View>
        ) : (
          <VictoryChart
            height={250}
            padding={{top: 20, bottom: 40, left: 50, right: 20}}>
            <VictoryAxis
              style={{
                axis: {stroke: '#e5e7eb'},
                tickLabels: {fill: '#9ca3af', fontSize: 10},
              }}
            />
            <VictoryAxis
              dependentAxis
              style={{
                axis: {stroke: '#e5e7eb'},
                tickLabels: {fill: '#9ca3af', fontSize: 10},
                grid: {stroke: '#f3f4f6'},
              }}
            />
            <VictoryLine
              data={chartData}
              style={{
                data: {stroke: '#3b82f6', strokeWidth: 2},
              }}
              interpolation="monotoneX"
            />
          </VictoryChart>
        )}
      </View>

      {/* Timeframe Selector */}
      <View style={styles.timeframeContainer}>
        {timeframes.map(tf => (
          <TouchableOpacity
            key={tf.value}
            style={[
              styles.timeframeButton,
              timeframe === tf.value && styles.timeframeButtonActive,
            ]}
            onPress={() => setTimeframe(tf.value)}>
            <Text
              style={[
                styles.timeframeText,
                timeframe === tf.value && styles.timeframeTextActive,
              ]}>
              {tf.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Stats */}
      <View style={styles.statsContainer}>
        <Text style={styles.statsTitle}>Market Stats</Text>

        <View style={styles.statRow}>
          <Text style={styles.statLabel}>24h High</Text>
          <Text style={styles.statValue}>{formatPrice(stats.high24h)}</Text>
        </View>

        <View style={styles.statRow}>
          <Text style={styles.statLabel}>24h Low</Text>
          <Text style={styles.statValue}>{formatPrice(stats.low24h)}</Text>
        </View>

        <View style={styles.statRow}>
          <Text style={styles.statLabel}>Market Cap</Text>
          <Text style={styles.statValue}>
            {formatMarketCap(stats.marketCap)}
          </Text>
        </View>

        <View style={styles.statRow}>
          <Text style={styles.statLabel}>24h Volume</Text>
          <Text style={styles.statValue}>{formatMarketCap(stats.volume)}</Text>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  backButton: {
    padding: 8,
    marginRight: 12,
  },
  headerInfo: {
    flex: 1,
  },
  symbol: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
  },
  name: {
    fontSize: 16,
    color: '#6b7280',
    marginTop: 2,
  },
  chartContainer: {
    backgroundColor: '#f9fafb',
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 12,
    overflow: 'hidden',
  },
  loadingContainer: {
    height: 250,
    justifyContent: 'center',
    alignItems: 'center',
  },
  timeframeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  timeframeButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: '#f3f4f6',
  },
  timeframeButtonActive: {
    backgroundColor: '#3b82f6',
  },
  timeframeText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6b7280',
  },
  timeframeTextActive: {
    color: '#ffffff',
  },
  statsContainer: {
    marginHorizontal: 16,
    marginTop: 8,
    marginBottom: 24,
    padding: 16,
    backgroundColor: '#f9fafb',
    borderRadius: 12,
  },
  statsTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 16,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  statLabel: {
    fontSize: 15,
    color: '#6b7280',
  },
  statValue: {
    fontSize: 15,
    fontWeight: '600',
    color: '#111827',
  },
});

export default CoinDetailScreen;

// import React, {useState, useEffect} from 'react';
// import {
//   View,
//   Text,
//   StyleSheet,
//   ScrollView,
//   TouchableOpacity,
//   ActivityIndicator,
// } from 'react-native';
// // import {VictoryLine, VictoryChart, VictoryAxis} from 'victory-native';
// import Icon from '../../components/IconComponent/IconComponent';

// import * as Victory from 'victory-native';

// interface CoinDetailProps {
//   route: any;
//   navigation: any;
// }

// const CoinDetailScreen = ({route, navigation}: CoinDetailProps) => {
//   console.log('victory>>', Victory);
//   const {coin} = route.params;
//   const [chartData, setChartData] = useState([]);
//   const [timeframe, setTimeframe] = useState('7');
//   const [loading, setLoading] = useState(true);
//   const [stats, setStats] = useState({
//     high24h: 0,
//     low24h: 0,
//     marketCap: 0,
//     volume: 0,
//   });

//   useEffect(() => {
//     fetchChartData();
//   }, [timeframe]);

//   const fetchChartData = async () => {
//     setLoading(true);
//     try {
//       const response = await fetch(
//         `https://api.coingecko.com/api/v3/coins/${coin.id}/market_chart?vs_currency=usd&days=${timeframe}`,
//       );
//       const data = await response.json();

//       // Transform data for Victory chart
//       const prices = data.prices.map((item: any) => ({
//         x: new Date(item[0]),
//         y: item[1],
//       }));

//       setChartData(prices);

//       // Calculate stats
//       const priceValues = prices.map((p: any) => p.y);
//       setStats({
//         high24h: Math.max(...priceValues),
//         low24h: Math.min(...priceValues),
//         marketCap: data.market_caps?.[data.market_caps.length - 1]?.[1] || 0,
//         volume: data.total_volumes?.[data.total_volumes.length - 1]?.[1] || 0,
//       });

//       setLoading(false);
//     } catch (error) {
//       console.error('Error fetching chart data:', error);
//       setLoading(false);
//     }
//   };

//   const formatPrice = (price: number) => {
//     if (price >= 1000) {
//       return `$${price.toLocaleString('en-US', {
//         minimumFractionDigits: 2,
//         maximumFractionDigits: 2,
//       })}`;
//     }
//     return `$${price.toFixed(price < 1 ? 4 : 2)}`;
//   };

//   const formatMarketCap = (value: number) => {
//     if (value >= 1e12) return `$${(value / 1e12).toFixed(2)}T`;
//     if (value >= 1e9) return `$${(value / 1e9).toFixed(2)}B`;
//     if (value >= 1e6) return `$${(value / 1e6).toFixed(2)}M`;
//     return `$${value.toFixed(0)}`;
//   };

//   const timeframes = [
//     {label: '24H', value: '1'},
//     {label: '7D', value: '7'},
//     {label: '30D', value: '30'},
//     {label: '1Y', value: '365'},
//     {label: 'ALL', value: 'max'},
//   ];

//   return (
//     <ScrollView style={styles.container}>
//       {/* Header */}
//       <View style={styles.header}>
//         <TouchableOpacity
//           onPress={() => navigation.goBack()}
//           style={styles.backButton}>
//           <Icon
//             library={'AntDesign'}
//             name={'arrowleft'}
//             size={24}
//             color="#111827"
//           />
//         </TouchableOpacity>
//         <View style={styles.headerInfo}>
//           <Text style={styles.symbol}>{coin.symbol}</Text>
//           <Text style={styles.name}>{coin.name}</Text>
//         </View>
//       </View>

//       {/* Chart */}
//       {/* <View style={styles.chartContainer}>
//         {loading ? (
//           <View style={styles.loadingContainer}>
//             <ActivityIndicator size="large" color="#3b82f6" />
//           </View>
//         ) : (
//           <VictoryChart
//             height={250}
//             padding={{top: 20, bottom: 40, left: 60, right: 20}}>
//             <VictoryAxis
//               style={{
//                 axis: {stroke: '#e5e7eb'},
//                 tickLabels: {fill: '#9ca3af', fontSize: 10, padding: 5},
//               }}
//               tickCount={5}
//             />
//             <VictoryAxis
//               dependentAxis
//               style={{
//                 axis: {stroke: '#e5e7eb'},
//                 tickLabels: {fill: '#9ca3af', fontSize: 10, padding: 5},
//                 grid: {stroke: '#f3f4f6', strokeDasharray: '3,3'},
//               }}
//               tickFormat={t => {
//                 if (t >= 1000) return `$${(t / 1000).toFixed(0)}K`;
//                 return `$${t.toFixed(0)}`;
//               }}
//             />
//             <VictoryLine
//               data={chartData}
//               style={{
//                 data: {stroke: '#3b82f6', strokeWidth: 2.5},
//               }}
//               interpolation="monotoneX"
//             />
//           </VictoryChart>
//         )}
//       </View> */}

//       {/* Timeframe Selector */}
//       <View style={styles.timeframeContainer}>
//         {timeframes.map(tf => (
//           <TouchableOpacity
//             key={tf.value}
//             style={[
//               styles.timeframeButton,
//               timeframe === tf.value && styles.timeframeButtonActive,
//             ]}
//             onPress={() => setTimeframe(tf.value)}>
//             <Text
//               style={[
//                 styles.timeframeText,
//                 timeframe === tf.value && styles.timeframeTextActive,
//               ]}>
//               {tf.label}
//             </Text>
//           </TouchableOpacity>
//         ))}
//       </View>

//       {/* Stats */}
//       <View style={styles.statsContainer}>
//         <Text style={styles.statsTitle}>Market Stats</Text>

//         <View style={styles.statRow}>
//           <Text style={styles.statLabel}>24h High</Text>
//           <Text style={styles.statValue}>{formatPrice(stats.high24h)}</Text>
//         </View>

//         <View style={styles.statRow}>
//           <Text style={styles.statLabel}>24h Low</Text>
//           <Text style={styles.statValue}>{formatPrice(stats.low24h)}</Text>
//         </View>

//         <View style={styles.statRow}>
//           <Text style={styles.statLabel}>Market Cap</Text>
//           <Text style={styles.statValue}>
//             {formatMarketCap(stats.marketCap)}
//           </Text>
//         </View>

//         <View style={styles.statRow}>
//           <Text style={styles.statLabel}>24h Volume</Text>
//           <Text style={styles.statValue}>{formatMarketCap(stats.volume)}</Text>
//         </View>
//       </View>
//     </ScrollView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#ffffff',
//   },
//   header: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     padding: 16,
//     borderBottomWidth: 1,
//     borderBottomColor: '#f3f4f6',
//   },
//   backButton: {
//     padding: 8,
//     marginRight: 12,
//   },
//   headerInfo: {
//     flex: 1,
//   },
//   symbol: {
//     fontSize: 24,
//     fontWeight: '700',
//     color: '#111827',
//   },
//   name: {
//     fontSize: 16,
//     color: '#6b7280',
//     marginTop: 2,
//   },
//   chartContainer: {
//     backgroundColor: '#f9fafb',
//     marginHorizontal: 16,
//     marginTop: 16,
//     borderRadius: 12,
//     overflow: 'hidden',
//   },
//   loadingContainer: {
//     height: 250,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   timeframeContainer: {
//     flexDirection: 'row',
//     justifyContent: 'space-around',
//     paddingHorizontal: 16,
//     paddingVertical: 16,
//   },
//   timeframeButton: {
//     paddingVertical: 8,
//     paddingHorizontal: 16,
//     borderRadius: 8,
//     backgroundColor: '#f3f4f6',
//   },
//   timeframeButtonActive: {
//     backgroundColor: '#3b82f6',
//   },
//   timeframeText: {
//     fontSize: 14,
//     fontWeight: '600',
//     color: '#6b7280',
//   },
//   timeframeTextActive: {
//     color: '#ffffff',
//   },
//   statsContainer: {
//     marginHorizontal: 16,
//     marginTop: 8,
//     marginBottom: 24,
//     padding: 16,
//     backgroundColor: '#f9fafb',
//     borderRadius: 12,
//   },
//   statsTitle: {
//     fontSize: 18,
//     fontWeight: '700',
//     color: '#111827',
//     marginBottom: 16,
//   },
//   statRow: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     paddingVertical: 12,
//     borderBottomWidth: 1,
//     borderBottomColor: '#e5e7eb',
//   },
//   statLabel: {
//     fontSize: 15,
//     color: '#6b7280',
//   },
//   statValue: {
//     fontSize: 15,
//     fontWeight: '600',
//     color: '#111827',
//   },
// });

// export default CoinDetailScreen;
