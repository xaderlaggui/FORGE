import React from 'react';
import { StyleSheet, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useForgeTheme } from '@/hooks/useForgeTheme';

interface TopFogProps {
  /** The height of the fog effect. Default is 40px */
  height?: number;
  /** Background color to fade from. Defaults to the primary page background (bg0) */
  color?: string;
  /** Adjust the top inset if you have a header */
  top?: number;
}

/**
 * Renders an absolutely positioned gradient fog at the top of a scroll container.
 * Place this inside the same parent View as your ScrollView, AFTER the ScrollView 
 * so it renders on top.
 */
export function TopFog({ height = 60, color, top = 0 }: TopFogProps) {
  const { T } = useForgeTheme();
  const fogColor = color || T.colors.bg0;

  return (
    <View style={[styles.container, { height, top }]} pointerEvents="none">
      <LinearGradient
        colors={[
          fogColor, 
          `${fogColor}E6`, // 90% opacity
          `${fogColor}80`, // 50% opacity
          `${fogColor}00`  // 0% opacity
        ]}
        locations={[0, 0.3, 0.7, 1]}
        style={StyleSheet.absoluteFill}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 0,
    right: 0,
    zIndex: 10,
    // pointerEvents='none' prevents the fog from blocking touches to the scrollview below
  },
});
