import {StyleSheet} from 'react-native';
import {useEffect} from 'react';

interface PriceBufferItem {
  price: number;
  change24h: number;
  volume: number;
}

interface UseBianceProps {
  coins: {symbol: string}[]; // tighten if you have a better coin type
  wsRef: React.MutableRefObject<WebSocket | null>;
  priceBufferRef: React.MutableRefObject<Record<string, PriceBufferItem>>;
  reconnectTimeoutRef: React.MutableRefObject<ReturnType<
    typeof setTimeout
  > | null>;
  batchTimeoutRef: React.MutableRefObject<ReturnType<typeof setTimeout> | null>;
  setIsConnected: (val: boolean) => void;
  scheduleBatchUpdate: () => void;
}

const useBianceSocket = ({
  coins,
  wsRef,
  setIsConnected,
  priceBufferRef,
  scheduleBatchUpdate,
  reconnectTimeoutRef,
  batchTimeoutRef,
}: UseBianceProps): void => {
  useEffect(() => {
    if (coins.length === 0) return;

    const connectWebSocket = () => {
      try {
        // Binance WebSocket - streams all ticker data
        // This provides real-time price updates for all trading pairs
        const ws = new WebSocket(
          'wss://stream.binance.com:9443/ws/!ticker@arr',
        );
        wsRef.current = ws;

        ws.onopen = () => {
          // console.log('WebSocket Connected');
          setIsConnected(true);
        };

        ws.onmessage = event => {
          try {
            const tickers = JSON.parse(event.data);
            // console.log('tickers>>>', tickers);
            // Process only USDT pairs for coins we're tracking
            console.log('ticker>>', tickers);
            tickers.forEach(
              (ticker: {s: string; symbol: any; c: any; P: any; q: any}) => {
                if (ticker.s.endsWith('USDT')) {
                  const symbol = ticker.s.replace('USDT', '');

                  // Check if this coin is in our list
                  if (coins.some((coin: any) => coin.symbol === symbol)) {
                    // Add to buffer instead of immediate state update
                    priceBufferRef.current[symbol] = {
                      price: parseFloat(ticker.c), // Current price
                      change24h: parseFloat(ticker.P), // 24h price change percentage
                      volume: parseFloat(ticker.q), // 24h volume
                    };
                  }
                }
              },
            );

            // Schedule batch update
            scheduleBatchUpdate();
          } catch (error) {
            console.error('Error parsing WebSocket message:', error);
          }
        };

        ws.onerror = error => {
          console.error('WebSocket error:', error);
          setIsConnected(false);
        };

        ws.onclose = () => {
          console.log('WebSocket Disconnected');
          setIsConnected(false);

          // Reconnect after 5 seconds
          reconnectTimeoutRef.current = setTimeout(() => {
            console.log('Reconnecting...');
            connectWebSocket();
          }, 5000);
        };
      } catch (error) {
        console.error('Error creating WebSocket:', error);
      }
    };

    connectWebSocket();

    // Cleanup
    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
      if (batchTimeoutRef.current) {
        clearTimeout(batchTimeoutRef.current);
      }
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
    };
  }, [coins, scheduleBatchUpdate]);
};

export default useBianceSocket;

const styles = StyleSheet.create({});
