import {Animated, StyleSheet, Text, View} from 'react-native';
import React, {useCallback, useRef} from 'react';

const HEADER_HEIGHT = 80;
const SCROLL_DELTA_THRESHOLD = 20;
const TOGGLE_DEBOUNCE_MS = 200;
const ANIMATION_DURATION = 240;

const useHeaderAnimateHook = () => {
  const scrollY = useRef(new Animated.Value(0)).current;
  const animatedHeight = useRef(new Animated.Value(HEADER_HEIGHT)).current;
  const prevY = useRef(0);
  const isCollapsed = useRef(false);
  const lastToggleAt = useRef(0);
  const toggleHeader = useCallback(
    (collapse: boolean) => {
      const now = Date.now();
      if (now - lastToggleAt.current < TOGGLE_DEBOUNCE_MS) return;
      lastToggleAt.current = now;

      isCollapsed.current = collapse;
      const toValue = collapse ? 0 : HEADER_HEIGHT;

      Animated.timing(animatedHeight, {
        toValue,
        duration: ANIMATION_DURATION,
        useNativeDriver: false,
      }).start();
    },
    [animatedHeight],
  );

  const handleScroll = Animated.event(
    [{nativeEvent: {contentOffset: {y: scrollY}}}],
    {
      useNativeDriver: true,
      listener: (event: any) => {
        const currentY = event.nativeEvent.contentOffset.y;
        const delta = currentY - prevY.current;

        if (delta > SCROLL_DELTA_THRESHOLD && !isCollapsed.current) {
          toggleHeader(true);
        } else if (delta < -SCROLL_DELTA_THRESHOLD && isCollapsed.current) {
          toggleHeader(false);
        }

        prevY.current = currentY;
      },
    },
  );

  return {
    animatedHeight,

    handleScroll,
  };
};

export default useHeaderAnimateHook;

const styles = StyleSheet.create({});
