import React, { useEffect } from 'react';
import { Image, ImageStyle, StyleProp, ViewStyle } from 'react-native';
import Animated, { Easing, useAnimatedStyle, useSharedValue, withRepeat, withSequence, withTiming } from 'react-native-reanimated';
import { BEAR, BearKey } from '../../constants/bearAssets';

interface BearMascotProps {
  variant: BearKey;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  style?: StyleProp<ViewStyle>;
  imageStyle?: StyleProp<ImageStyle>;
  animate?: boolean;
}

const SIZE_MAP = {
  sm: 64,
  md: 96,
  lg: 144,
  xl: 208,
};

export const BearMascot: React.FC<BearMascotProps> = ({
  variant,
  size = 'md',
  style,
  imageStyle,
  animate = false,
}) => {
  const src = BEAR[variant];
  const dimension = SIZE_MAP[size];

  const translateY = useSharedValue(0);
  const opacity = useSharedValue(0);

  useEffect(() => {
    // Fade in on variant change
    opacity.value = 0;
    opacity.value = withTiming(1, { duration: 300 });

    if (animate) {
      translateY.value = withRepeat(
        withSequence(
          withTiming(-8, { duration: 1200, easing: Easing.inOut(Easing.quad) }),
          withTiming(0, { duration: 1200, easing: Easing.inOut(Easing.quad) })
        ),
        -1,
        true
      );
    } else {
      translateY.value = withTiming(0);
    }
  }, [variant, animate]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));

  // Special handling for the wide HIGH_FIVE image
  const isWide = variant === 'HIGH_FIVE';

  return (
    <Animated.View style={[
      { width: isWide ? '100%' : dimension, height: isWide ? undefined : dimension, maxWidth: 320, aspectRatio: isWide ? 885 / 384 : undefined },
      animatedStyle,
      style
    ]}>
      <Image
        source={src}
        style={[{ width: '100%', height: '100%', resizeMode: 'contain' }, imageStyle]}
      />
    </Animated.View>
  );
};
