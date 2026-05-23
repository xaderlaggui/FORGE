import { useIsFocused, useNavigationState } from '@react-navigation/native';
import React, { useEffect, useRef } from 'react';
import { Animated, Easing, StyleProp, ViewStyle } from 'react-native';

export function FadeTabWrapper({ children, style }: { children: React.ReactNode, style?: StyleProp<ViewStyle> }) {
  const isFocused = useIsFocused();

  // Get the tab navigator's active index
  const tabIndex = useNavigationState(state => state?.type === 'tab' ? state.index : null);
  const prevTabIndex = useRef(tabIndex);

  const opacity = useRef(new Animated.Value(1)).current;
  const scale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // We only animate if we are coming into focus AND the actual tab changed!
    // If tabIndex is the same as before, it means we are just returning from a modal.
    if (isFocused && tabIndex !== prevTabIndex.current) {
      opacity.setValue(0.5);
      scale.setValue(0.97);

      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 200,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(scale, {
          toValue: 1,
          duration: 250,
          easing: Easing.out(Easing.back(1.5)),
          useNativeDriver: true,
        }),
      ]).start();
    }

    // Always update the prev index tracker
    if (isFocused) {
      prevTabIndex.current = tabIndex;
    }
  }, [isFocused, tabIndex]);

  return (
    <Animated.View style={[{ flex: 1, opacity, transform: [{ scale }] }, style]}>
      {children}
    </Animated.View>
  );
}
