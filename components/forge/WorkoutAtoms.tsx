import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Flame } from 'lucide-react-native';
import { useForgeTheme } from "@/hooks/useForgeTheme";

// ── MuscleTagChip ─────────────────────────────────────────────────────────

interface MuscleTagChipProps {
  label: string;
}

export function MuscleTagChip({ label }: MuscleTagChipProps) {
  const { T } = useForgeTheme();
  const styles = useStyles(T);
  return (
    <View style={styles.chip}>
      <Text style={styles.chipText}>{label}</Text>
    </View>
  );
}

// ── WorkoutListItem ───────────────────────────────────────────────────────

interface WorkoutListItemProps {
  title: string;
  date: string;
  icon?: React.ReactNode;
  stat?: string;
  isLast?: boolean;
  onPress?: () => void;
}

export function WorkoutListItem({ title, date, icon, stat, isLast, onPress }: WorkoutListItemProps) {
  const { T } = useForgeTheme();
  const styles = useStyles(T);
  const iconEl = icon ?? <Flame size={18} color={T.colors.forge} />;

  return (
    <TouchableOpacity
      style={[styles.row, !isLast && styles.rowBorder]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.iconWrap}>
        {iconEl}
      </View>
      <View style={styles.textWrap}>
        <Text style={styles.title} numberOfLines={1}>{title}</Text>
        <Text style={styles.date}>{date}</Text>
      </View>
      {!!stat && <Text style={styles.stat}>{stat}</Text>}
    </TouchableOpacity>
  );
}

// ── Styles ────────────────────────────────────────────────────────────────

const useStyles = (T: any) => StyleSheet.create({
  // MuscleTagChip
  chip: {
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 100,
    backgroundColor: T.colors.bg3,
  },
  chipText: { color: T.colors.t1, fontSize: 11, fontWeight: '500' },

  // WorkoutListItem
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  rowBorder: { borderBottomWidth: 0.5, borderBottomColor: T.colors.b1 },
  iconWrap: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: T.colors.forgeDim,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    overflow: 'hidden',
  },
  textWrap: { flex: 1 },
  title: { fontSize: 14, fontWeight: '500', color: T.colors.t1 },
  date: { fontSize: 11, color: T.colors.t3, marginTop: 2 },
  stat: { fontSize: 11, fontWeight: '600', color: '#34C759' },
});
