import { useForgeTheme } from "@/hooks/useForgeTheme";
import { Flame } from 'lucide-react-native';
import React, { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

// ─────────────────────────────────────────────────────────────────────────────
// StreakWidget v2 — Animated flame + gold streak number + 7-day dots
// ─────────────────────────────────────────────────────────────────────────────

interface StreakWidgetProps {
  streak: number;
  /** 7 booleans — Mon → Sun. true = activity logged that day */
  weekActivity: boolean[];
}

const DAY_LABELS = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

export function StreakWidget({ streak, weekActivity }: StreakWidgetProps) {
  const { T } = useForgeTheme();
  const styles = useStyles(T);
  // Flame flicker — subtle scale + opacity pulse
  const flameScale = useSharedValue(1);
  const flameOpacity = useSharedValue(0.85);

  useEffect(() => {
    flameScale.value = withRepeat(
      withSequence(
        withTiming(1.12, { duration: 600 }),
        withTiming(0.96, { duration: 500 }),
        withTiming(1.08, { duration: 400 }),
        withTiming(1.00, { duration: 500 }),
      ),
      -1,
      false
    );
    flameOpacity.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 600 }),
        withTiming(0.75, { duration: 500 }),
        withTiming(1, { duration: 900 }),
      ),
      -1,
      false
    );
  }, []);

  const flameStyle = useAnimatedStyle(() => ({
    transform: [{ scale: flameScale.value }],
    opacity: flameOpacity.value,
  }));

  const hasStreak = streak > 0;

  return (
    <View style={styles.wrapper}>
      {/* Flame icon with glow ring */}
      <View style={styles.flameRing}>
        <Animated.View style={flameStyle}>
          <Flame
            size={26}
            color={hasStreak ? T.colors.gold : T.colors.t3}
            fill={hasStreak ? T.colors.gold : 'transparent'}
            strokeWidth={1.2}
          />
        </Animated.View>
      </View>

      {/* Streak number */}
      <Text
        style={[styles.streakNum, hasStreak && styles.streakNumActive]}
        maxFontSizeMultiplier={1.2}
      >
        {streak}
      </Text>
      <Text style={styles.streakLabel} maxFontSizeMultiplier={1.2}>
        Day Streak
      </Text>

      {/* 7-day activity dots */}
      <View style={styles.weekRow}>
        {DAY_LABELS.map((label, i) => {
          const active = weekActivity[i] ?? false;
          return (
            <View key={i} style={styles.dayCol}>
              <Text style={styles.dayLabel}>{label}</Text>
              <View
                style={[
                  styles.dayDot,
                  active ? styles.dayDotActive : styles.dayDotEmpty,
                ]}
              />
            </View>
          );
        })}
      </View>
    </View>
  );
}

const useStyles = (T: any) => {
  const { colors, radii, spacing } = T;
  return StyleSheet.create({
    wrapper: {
      alignItems: 'center',
      paddingVertical: spacing.px2,
    },

    // Flame
    flameRing: {
      width: 52,
      height: 52,
      borderRadius: radii.full,
      backgroundColor: colors.goldDim,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: spacing.px2,
      shadowColor: colors.gold,
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0.25,
      shadowRadius: 14,
      elevation: 4,
    },

    // Streak number
    streakNum: {
      fontSize: 30,
      fontWeight: '800',
      color: colors.t3,         // grey when no streak
      lineHeight: 36,
      letterSpacing: -0.5,
    },
    streakNumActive: {
      color: colors.gold,        // gold when streak > 0
    },

    streakLabel: {
      fontSize: 10,
      fontWeight: '600',
      color: colors.t3,
      textTransform: 'uppercase',
      letterSpacing: 0.8,
      marginTop: 2,
      marginBottom: spacing.px3,
    },

    // 7-day row
    weekRow: {
      flexDirection: 'row',
      gap: 5,
    },
    dayCol: {
      alignItems: 'center',
      justifyContent: 'center',
      gap: 6,
      paddingVertical: 8,
      width: 28,
      borderWidth: 1.5,
      borderColor: colors.b2,
      borderRadius: 14,
      backgroundColor: colors.bg1,
    },
    dayLabel: {
      fontSize: 10,
      fontWeight: '700',
      color: colors.t3,
      textTransform: 'uppercase',
    },
    dayDot: {
      width: 10,
      height: 10,
      borderRadius: radii.full,
    },
    dayDotEmpty: {
      backgroundColor: 'transparent',
      borderWidth: 1.5,
      borderColor: colors.t3,
    },
    dayDotActive: {
      backgroundColor: colors.gold,
      shadowColor: colors.gold,
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0.5,
      shadowRadius: 4,
      elevation: 2,
    },
  });
}
