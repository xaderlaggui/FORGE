import React, { useEffect } from 'react';
import { View, Image } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { MascotImages } from '../../../../features/sprites/mascotImages';

export function ChatTypingIndicator({ s }: { s: any }) {
  const dot1 = useSharedValue(0);
  const dot2 = useSharedValue(0);
  const dot3 = useSharedValue(0);
  
  useEffect(() => {
    dot1.value = withRepeat(withSequence(withTiming(-5, { duration: 300 }), withTiming(0, { duration: 300 })), -1, true);
    setTimeout(() => { dot2.value = withRepeat(withSequence(withTiming(-5, { duration: 300 }), withTiming(0, { duration: 300 })), -1, true); }, 100);
    setTimeout(() => { dot3.value = withRepeat(withSequence(withTiming(-5, { duration: 300 }), withTiming(0, { duration: 300 })), -1, true); }, 200);
  }, []);
  
  const dot1Style = useAnimatedStyle(() => ({ transform: [{ translateY: dot1.value }] }));
  const dot2Style = useAnimatedStyle(() => ({ transform: [{ translateY: dot2.value }] }));
  const dot3Style = useAnimatedStyle(() => ({ transform: [{ translateY: dot3.value }] }));

  return (
    <View style={s.typingWrap}>
      <View style={[s.avatarWrap, { backgroundColor: 'transparent' }]}>
        <Image source={MascotImages.coach} style={{ width: 40, height: 35, resizeMode: 'contain', position: 'absolute', bottom: -5, left: -8 }} />
      </View>
      <View style={[s.bubble, s.bubbleAi, { minHeight: 38, justifyContent: 'center', paddingVertical: 0 }]}>
        <View style={{ flexDirection: 'row', gap: 5, alignItems: 'center' }}>
          <Animated.View style={[s.typingDot, dot1Style]} />
          <Animated.View style={[s.typingDot, dot2Style]} />
          <Animated.View style={[s.typingDot, dot3Style]} />
        </View>
      </View>
    </View>
  );
}
