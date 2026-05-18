import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useForgeTheme } from "@/hooks/useForgeTheme";
import { Check, Flame } from 'lucide-react-native';

interface WeeklyProgressDotsProps {
  weekActivity: boolean[]; // Array of 7 booleans (Mon-Sun), true if worked out
  streak: number;
}

const DAYS = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

export function WeeklyProgressDots({ weekActivity, streak }: WeeklyProgressDotsProps) {
  const { T } = useForgeTheme();
  const s = useStyles(T);

  // Approximate what today is based on activity, 
  // or actually we could pass `todayIdx` from the hook. 
  // Let's assume the first false after a series of true or just the current day of week.
  // For UI, we can just say "today" is the first non-completed day, or strictly pass todayIdx.
  // Actually, we can just calculate todayIdx here.
  const todayIdx = new Date().getDay() === 0 ? 6 : new Date().getDay() - 1;

  return (
    <View style={s.container}>
      <View style={s.header}>
        <Text style={s.title}>THIS WEEK</Text>
        <View style={s.streakRow}>
          <Text style={s.streak}>{streak} Day Streak</Text>
          <Flame size={14} color={T.colors.forge} />
        </View>
      </View>
      <View style={s.card}>
        {DAYS.map((dayLabel, idx) => {
          const isDone = weekActivity[idx];
          const isToday = idx === todayIdx;
          const isFuture = idx > todayIdx;

          return (
            <View key={idx} style={s.dayCol}>
              {isDone ? (
                // Filled
                <View style={[s.dot, s.dotDone]}>
                  <Check size={14} color="#000" strokeWidth={3} />
                </View>
              ) : isToday ? (
                // Today (Outline)
                <View style={[s.dot, s.dotToday]}>
                  <View style={s.todayInner} />
                </View>
              ) : (
                // Future / Missed
                <View style={[s.dot, s.dotEmpty]} />
              )}
              <Text style={[
                s.dayLabel, 
                isDone || isToday ? { color: isToday ? T.colors.forge : T.colors.t1 } : { color: T.colors.t3 }
              ]}>
                {dayLabel}
              </Text>
            </View>
          );
        })}
      </View>
    </View>
  );
}

const useStyles = (T: any) => StyleSheet.create({
  container: {
    paddingHorizontal: T.spacing.page,
    marginBottom: T.spacing.px5,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 12,
    fontWeight: '700',
    color: T.colors.t3,
    letterSpacing: 0.8,
  },
  streakRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  streak: {
    fontSize: 12,
    fontWeight: '700',
    color: T.colors.forge,
  },
  card: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: T.colors.bg1,
    padding: 16,
    borderRadius: 16,
    borderWidth: 0.5,
    borderColor: T.colors.b1,
  },
  dayCol: {
    alignItems: 'center',
    gap: 8,
  },
  dot: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dotDone: {
    backgroundColor: T.colors.forge,
    shadowColor: T.colors.forge,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 4,
  },
  dotToday: {
    borderWidth: 2,
    borderColor: T.colors.forge,
    backgroundColor: 'rgba(255,92,46,0.1)',
  },
  todayInner: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: T.colors.forge,
  },
  dotEmpty: {
    backgroundColor: T.colors.bg2,
  },
  dayLabel: {
    fontSize: 10,
    fontWeight: '700',
  },
});
