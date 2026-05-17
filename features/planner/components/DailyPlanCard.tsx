import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { ForgeButton } from '../../../components/forge/ForgeButton';
import { ForgeSkeleton } from '../../../components/forge/ForgeSkeleton';
import { ForgeTheme as T } from '../../../constants/ForgeTheme';

function SkeletonPlanner() {
  return (
    <View style={s.todayCard}>
      <ForgeSkeleton width="40%" height={12} radius={4} style={{ marginBottom: 10 }} />
      <ForgeSkeleton width="70%" height={24} radius={6} style={{ marginBottom: 8 }} />
      <ForgeSkeleton width="55%" height={14} radius={4} style={{ marginBottom: 32 }} />
      <ForgeSkeleton width="100%" height={52} radius={T.radii.md} />
    </View>
  );
}

interface DailyPlanCardProps {
  isLoading: boolean;
  loggedWorkout?: any;
  plannedWorkout?: any;
  activeDateStr: string;
}

export function DailyPlanCard({ isLoading, loggedWorkout, plannedWorkout, activeDateStr }: DailyPlanCardProps) {
  const router = useRouter();

  if (isLoading) {
    return <SkeletonPlanner />;
  }

  const isRestDay = !plannedWorkout || plannedWorkout.dayType === 'Rest';
  const isCompleted = !!loggedWorkout;

  if (isCompleted) {
    return (
      <View style={s.todayCard}>
        <Text style={s.todayTitle} maxFontSizeMultiplier={1.2}>✅ Completed</Text>
        <Text style={s.todaySub} maxFontSizeMultiplier={1.2}>{loggedWorkout.notes || 'Workout Logged'}</Text>
        <Text style={s.todayMeta} maxFontSizeMultiplier={1.2}>
          {loggedWorkout.exercises?.length ?? 0} Exercises Completed
        </Text>
        <ForgeButton
          label="View Details"
          onPress={() => router.push({ pathname: '/activeWorkout', params: { id: loggedWorkout.id } })}
          variant="secondary"
        />
      </View>
    );
  }

  if (!isRestDay) {
    return (
      <View style={s.todayCard}>
        <Text style={s.todayTitle} maxFontSizeMultiplier={1.2}>Scheduled Routine</Text>
        <Text style={s.todaySub} maxFontSizeMultiplier={1.2}>{plannedWorkout.title}</Text>
        <Text style={s.todayMeta} maxFontSizeMultiplier={1.2}>
          {plannedWorkout.exercises?.length ?? 0} Exercises Prescribed
        </Text>
        <ForgeButton
          label="▶ Start Routine"
          onPress={() => router.push({ pathname: '/activeWorkout', params: { date: activeDateStr } })}
          pulse
        />
      </View>
    );
  }

  return (
    <View style={[s.todayCard, s.todayCardEmpty]}>
      <Text style={s.todaySub} maxFontSizeMultiplier={1.2}>Active Recovery</Text>
      <Text style={s.todayMetaCenter} maxFontSizeMultiplier={1.2}>
        No formal training scheduled. Rest up or do light cardio.
      </Text>
      <ForgeButton
        label="+ Log Extra Workout"
        onPress={() => router.push({ pathname: '/activeWorkout', params: { date: activeDateStr } })}
        variant="secondary"
      />
    </View>
  );
}

const s = StyleSheet.create({
  todayCard: {
    backgroundColor: T.colors.bg1, padding: T.spacing.px6, borderRadius: T.radii.xl,
    borderWidth: 0.5, borderColor: T.colors.b1,
  },
  todayCardEmpty: { alignItems: 'center', paddingVertical: 40 },
  todayTitle: {
    fontSize: T.typography.sizes.label, color: T.colors.t3, marginBottom: 6,
    fontWeight: '600', letterSpacing: 1, textTransform: 'uppercase',
  },
  todaySub: { fontSize: T.typography.sizes.h2, fontWeight: '700', color: T.colors.t1, marginBottom: T.spacing.px2 },
  todayMeta: { color: T.colors.t2, marginBottom: T.spacing.px6, fontSize: T.typography.sizes.bodyS },
  todayMetaCenter: { color: T.colors.t2, marginBottom: T.spacing.px6, fontSize: T.typography.sizes.bodyS, textAlign: 'center' },
});
