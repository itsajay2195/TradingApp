import {StyleSheet} from 'react-native';
import {useCallback, useEffect, useRef} from 'react';
import {current} from '@reduxjs/toolkit';

interface PriceBufferItem {
  price: number;
  change24h: number;
  volume: number;
}

interface UseBianceProps {
  coins: {symbol: string}[]; // tighten if you have a better coin type
  wsRef?: React.MutableRefObject<WebSocket | null>;
  priceBufferRef?: React.MutableRefObject<Record<string, PriceBufferItem>>;
  reconnectTimeoutRef?: React.MutableRefObject<ReturnType<
    typeof setTimeout
  > | null>;
  batchTimeoutRef?: React.MutableRefObject<ReturnType<
    typeof setTimeout
  > | null>;
  setIsConnected: (val: boolean) => void;
  setPrices: any;
}

const useBianceSocket = ({
  coins,
  setIsConnected,
  setPrices,
}: UseBianceProps): void => {
  // Keep coins in ref to avoid dependency issues with pagination
  const priceBufferRef: any = useRef({});
  const batchTimeoutRef: any = useRef(null);
  const reconnectTimeoutRef: any = useRef(null);
  const wsRef = useRef<WebSocket | null>(null);
  const coinsRef = useRef<any[]>([]);
  const retryCountRef = useRef(0);

  const scheduleBatchUpdate = useCallback(() => {
    if (batchTimeoutRef.current) return;

    batchTimeoutRef.current = setTimeout(() => {
      if (Object.keys(priceBufferRef.current).length > 0) {
        setPrices((prev: any) => ({
          ...prev,
          ...priceBufferRef.current,
        }));
        priceBufferRef.current = {};
      }
      batchTimeoutRef.current = null;
    }, 100);
  }, []);

  // Update coins ref whenever coins change (pagination)
  useEffect(() => {
    coinsRef.current = coins;
  }, [coins]);

  useEffect(() => {
    if (coinsRef?.current?.length === 0) return;

    const connectWebSocket = () => {
      try {
        const ws = new WebSocket(
          'wss://stream.binance.com:9443/ws/!ticker@arr',
        );
        wsRef.current = ws;

        ws.onopen = () => {
          console.log('WebSocket Connected');
          setIsConnected(true);
          retryCountRef.current = 0; // Reset retry count on success
        };

        ws.onmessage = event => {
          try {
            const tickers = JSON.parse(event.data);

            // Process only USDT pairs for coins we're tracking
            tickers.forEach(
              (ticker: {s: string; c: string; P: string; q: string}) => {
                if (ticker.s.endsWith('USDT')) {
                  const symbol = ticker.s.replace('USDT', '');

                  // Check if this coin is in our list (using ref, not props)
                  if (
                    coinsRef.current.some((coin: any) => coin.symbol === symbol)
                  ) {
                    // Add to buffer instead of immediate state update
                    priceBufferRef.current[symbol] = {
                      price: parseFloat(ticker.c),
                      change24h: parseFloat(ticker.P),
                      volume: parseFloat(ticker.q),
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

        ws.onclose = event => {
          console.log('WebSocket Disconnected - Code:', event.code);
          setIsConnected(false);

          // Don't reconnect on normal closure (1000)
          if (event.code === 1000) {
            return;
          }

          // Exponential backoff reconnection
          const delay = Math.min(
            1000 * Math.pow(2, retryCountRef.current),
            30000,
          );
          retryCountRef.current++;

          console.log(
            `Reconnecting in ${delay}ms (attempt ${retryCountRef.current})`,
          );

          reconnectTimeoutRef.current = setTimeout(() => {
            if (retryCountRef.current < 10) {
              connectWebSocket();
            } else {
              console.error('Max reconnection attempts reached');
              setIsConnected(false);
            }
          }, delay);
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
    // Only depend on scheduleBatchUpdate - coins changes won't disconnect socket
  }, [coinsRef.current, scheduleBatchUpdate]);
};

export default useBianceSocket;
const styles = StyleSheet.create({});
