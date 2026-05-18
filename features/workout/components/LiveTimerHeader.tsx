import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { ChevronLeft, MoreHorizontal } from 'lucide-react-native';
import { useForgeTheme } from "@/hooks/useForgeTheme";

interface LiveTimerHeaderProps {
  timerLabel: string;
  totalExercises: number;
  doneExercises: number;
  onBack: () => void;
}

export function LiveTimerHeader({ timerLabel, totalExercises, doneExercises, onBack }: LiveTimerHeaderProps) {
    const { T } = useForgeTheme();
    const styles = useStyles(T);
    <View style={styles.header}>
      <TouchableOpacity style={styles.backBtn} onPress={onBack}>
        <ChevronLeft size={20} color={T.colors.t2} />
      </TouchableOpacity>

      <View style={{ alignItems: 'center' }}>
        <Text style={styles.subtitle}>EXERCISE {doneExercises + 1} OF {totalExercises}</Text>
        <View style={styles.timerBadge}>
          <View style={styles.timerDot} />
          <Text style={styles.timerText} maxFontSizeMultiplier={1.2}>{timerLabel}</Text>
        </View>
      </View>

      <TouchableOpacity style={styles.backBtn}>
        <MoreHorizontal size={20} color={T.colors.t2} />
      </TouchableOpacity>
    </View>
  );
}

          header: {
            flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
            paddingTop: 60, paddingBottom: T.spacing.px4, paddingHorizontal: T.spacing.page,
            backgroundColor: T.colors.bg0,
            borderBottomWidth: 0.5, borderBottomColor: T.colors.b1,
          },
          backBtn: {
            width: 40, height: 40, borderRadius: 20,
            backgroundColor: T.colors.bg2,
            alignItems: 'center', justifyContent: 'center',
          },
          subtitle: {
            fontSize: 10, fontWeight: '800', color: T.colors.t3,
            letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 4,
          },
          timerBadge: {
            flexDirection: 'row', alignItems: 'center', gap: 8,
            paddingHorizontal: 12, paddingVertical: 6,
            backgroundColor: 'rgba(255,92,46,0.1)',
            borderRadius: T.radii.full,
          },
          timerDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: T.colors.forge },
          timerText: { fontSize: 14, fontWeight: '700', color: T.colors.forge, fontFamily: T.typography.families.mono },
        });
