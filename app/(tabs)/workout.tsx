import { useQuery } from '@tanstack/react-query';
import dayjs from 'dayjs';
import { useRouter } from 'expo-router';
import { collection, getDocs } from 'firebase/firestore';
import React, { useEffect, useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import { ForgeButton } from '../../components/forge/ForgeButton';
import { ForgeSegment } from '../../components/forge/ForgeSegment';
import { ForgeSkeleton } from '../../components/forge/ForgeSkeleton';
import { ForgeTheme } from '../../constants/ForgeTheme';
import { useWorkouts } from '../../hooks/useWorkouts';
import { db } from '../../services/firebase';
import type { Exercise } from '../../types';

// ─────────────────────────────────────────────────────────────────────────────
// Skeleton Components
// ─────────────────────────────────────────────────────────────────────────────
function SkeletonPlanner() {
  return (
    <View style={styles.todayCard}>
      <ForgeSkeleton width="40%" height={12} radius={4} style={{ marginBottom: 10 }} />
      <ForgeSkeleton width="70%" height={24} radius={6} style={{ marginBottom: 8 }} />
      <ForgeSkeleton width="55%" height={14} radius={4} style={{ marginBottom: 32 }} />
      <ForgeSkeleton width="100%" height={52} radius={ForgeTheme.radii.md} />
    </View>
  );
}

function SkeletonLibrary() {
  return (
    <View style={{ gap: 12 }}>
      {[1, 2, 3, 4, 5].map((i) => (
        <View key={i} style={styles.card}>
          <ForgeSkeleton width="50%" height={16} radius={4} style={{ marginBottom: 8 }} />
          <ForgeSkeleton width="30%" height={12} radius={4} />
        </View>
      ))}
    </View>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Main Screen
// ─────────────────────────────────────────────────────────────────────────────
export default function WorkoutScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('Planner');
  
  // Dynamic weekly dates starting from Monday
  const today = dayjs();
  const startOfWeek = today.startOf('week').add(1, 'day'); // Monday
  const days = Array.from({ length: 7 }).map((_, i) => {
    const d = startOfWeek.add(i, 'day');
    return { label: d.format('dd').charAt(0), date: d.date(), fullDate: d.format('YYYY-MM-DD') };
  });
  
  const [activeDayIdx, setActiveDayIdx] = useState(today.day() === 0 ? 6 : today.day() - 1);
  const activeDateStr = days[activeDayIdx].fullDate;

  // Exercise Library
  const { data: exercises, isLoading: isLoadingExercises } = useQuery({
    queryKey: ['exercises'],
    queryFn: async () => {
      const snap = await getDocs(collection(db, 'exercises'));
      return snap.docs.map(doc => doc.data() as Exercise);
    }
  });

  // Dynamic Workouts
  const { workouts, isLoading: isLoadingWorkouts } = useWorkouts();
  
  // Filter workout for selected day
  const todayWorkout = useMemo(() => {
    return workouts?.find(w => w.date.startsWith(activeDateStr));
  }, [workouts, activeDateStr]);

  const dotOpacity = useSharedValue(0.6);

  useEffect(() => {
    dotOpacity.value = withRepeat(
      withTiming(1, { duration: ForgeTheme.motion.duration.pulse, easing: ForgeTheme.motion.easing.standard }), 
      -1, 
      true
    );
  }, []);

  const dotOpacityStyle = useAnimatedStyle(() => ({
    opacity: dotOpacity.value,
  }));

  return (
    <View style={styles.container}>
      {/* ── Header ───────────────────────────────────────────────────────── */}
      <View style={styles.header}>
        <Text style={styles.title} maxFontSizeMultiplier={1.2}>Workout Planner</Text>
        
        <ForgeSegment
          options={['Planner', 'Library']}
          value={activeTab}
          onChange={setActiveTab}
        />
      </View>

      {/* ── Content ──────────────────────────────────────────────────────── */}
      {activeTab === 'Library' ? (
        // --- EXERCISE LIBRARY VIEW ---
        <ScrollView contentContainerStyle={styles.list} showsVerticalScrollIndicator={false}>
          {isLoadingExercises ? (
             <SkeletonLibrary />
          ) : exercises?.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyText} maxFontSizeMultiplier={1.2}>
                No exercises found. Go to Settings and click Seed!
              </Text>
            </View>
          ) : (
            exercises?.map((item) => (
              <View key={item.id} style={styles.card}>
                <Text style={styles.cardTitle} maxFontSizeMultiplier={1.2}>{item.name}</Text>
                <Text style={styles.cardSub} maxFontSizeMultiplier={1.2}>
                  {item.muscleGroups.join(', ')} • {item.equipment}
                </Text>
              </View>
            ))
          )}
        </ScrollView>
      ) : (
        // --- WORKOUT PLANNER VIEW ---
        <ScrollView contentContainerStyle={styles.plannerContainer} showsVerticalScrollIndicator={false}>
          <View style={styles.weekRow}>
            {days.map((day, idx) => {
              const isActive = idx === activeDayIdx;
              return (
                <TouchableOpacity 
                  key={idx} 
                  onPress={() => setActiveDayIdx(idx)}
                  style={styles.weekDotCol}
                  activeOpacity={0.7}
                >
                  <Text style={styles.dayLabel} maxFontSizeMultiplier={1.2}>{day.label}</Text>
                  {isActive ? (
                    <Animated.View style={[styles.weekDot, styles.weekDotActive, dotOpacityStyle]} />
                  ) : (
                    <View style={styles.weekDot} />
                  )}
                </TouchableOpacity>
              )
            })}
          </View>

          {isLoadingWorkouts ? (
            <SkeletonPlanner />
          ) : todayWorkout ? (
            <View style={styles.todayCard}>
              <Text style={styles.todayTitle} maxFontSizeMultiplier={1.2}>Scheduled Routine</Text>
              <Text style={styles.todaySub} maxFontSizeMultiplier={1.2}>{todayWorkout.notes || 'Custom Workout'}</Text>
              <Text style={styles.todayMeta} maxFontSizeMultiplier={1.2}>
                {todayWorkout.exercises.length} Exercises Planned
              </Text>
              <ForgeButton 
                label="▶ Start Workout" 
                onPress={() => router.push({ pathname: '/activeWorkout', params: { id: todayWorkout.id } })} 
                pulse 
              />
            </View>
          ) : (
            <View style={[styles.todayCard, styles.todayCardEmpty]}>
              <Text style={styles.todaySub} maxFontSizeMultiplier={1.2}>Rest Day</Text>
              <Text style={styles.todayMetaCenter} maxFontSizeMultiplier={1.2}>
                No workout scheduled for this day.
              </Text>
              
              <ForgeButton 
                label="+ New Workout" 
                onPress={() => router.push({ pathname: '/activeWorkout', params: { date: activeDateStr } })}
                variant="secondary"
              />
            </View>
          )}
        </ScrollView>
      )}
    </View>
  );
}

const { colors, radii, spacing, typography } = ForgeTheme;

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: colors.bg0 
  },
  header: { 
    paddingHorizontal: spacing.page,
    paddingTop: 60,
    paddingBottom: spacing.px4,
    backgroundColor: colors.bg0, 
    borderBottomWidth: 0.5, 
    borderBottomColor: colors.b1 
  },
  title: { 
    fontSize: typography.sizes.h1, 
    fontWeight: '700', 
    color: colors.t1, 
    marginBottom: spacing.px4 
  },
  
  list: { 
    padding: spacing.page, 
    paddingBottom: 100 
  },
  card: { 
    backgroundColor: colors.bg1, 
    padding: spacing.px4, 
    borderRadius: radii.lg, 
    marginBottom: spacing.px3, 
    borderWidth: 0.5, 
    borderColor: colors.b1 
  },
  cardTitle: { 
    fontSize: typography.sizes.body, 
    fontWeight: '600', 
    color: colors.t1, 
    letterSpacing: 0.2 
  },
  cardSub: { 
    fontSize: typography.sizes.label, 
    color: colors.t3, 
    marginTop: spacing.px1, 
    textTransform: 'uppercase', 
    fontWeight: '600', 
    letterSpacing: 0.8 
  },
  emptyState: {
    padding: spacing.px7,
    alignItems: 'center',
  },
  emptyText: { 
    textAlign: 'center', 
    color: colors.t3, 
    fontWeight: '500',
    fontSize: typography.sizes.bodyS,
    lineHeight: typography.sizes.bodyS * 1.5,
  },

  plannerContainer: { 
    padding: spacing.page, 
    paddingBottom: 100 
  },
  weekRow: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    marginBottom: spacing.px6, 
    backgroundColor: colors.bg1, 
    padding: spacing.px4, 
    borderRadius: radii.lg, 
    borderWidth: 0.5, 
    borderColor: colors.b1 
  },
  weekDotCol: { 
    alignItems: 'center', 
    gap: 6 
  },
  dayLabel: { 
    fontSize: typography.sizes.caption, 
    color: colors.t3, 
    fontWeight: '600' 
  },
  weekDot: { 
    width: 8, 
    height: 8, 
    borderRadius: radii.xs, 
    backgroundColor: colors.bg3 
  },
  weekDotActive: { 
    backgroundColor: colors.forge, 
    shadowColor: colors.forge, 
    shadowOffset: { width: 0, height: 0 }, 
    shadowOpacity: 0.5, 
    shadowRadius: 6, 
    elevation: 3 
  },

  todayCard: { 
    backgroundColor: colors.bg1, 
    padding: spacing.px6, 
    borderRadius: radii.xl, 
    borderWidth: 0.5, 
    borderColor: colors.b1 
  },
  todayCardEmpty: {
    alignItems: 'center', 
    paddingVertical: 40 
  },
  todayTitle: { 
    fontSize: typography.sizes.label, 
    color: colors.t3, 
    marginBottom: 6, 
    fontWeight: '600', 
    letterSpacing: 1, 
    textTransform: 'uppercase' 
  },
  todaySub: { 
    fontSize: typography.sizes.h2, 
    fontWeight: '700', 
    color: colors.t1, 
    marginBottom: spacing.px2 
  },
  todayMeta: { 
    color: colors.t2, 
    marginBottom: spacing.px6, 
    fontSize: typography.sizes.bodyS 
  },
  todayMetaCenter: {
    color: colors.t2, 
    marginBottom: spacing.px6, 
    fontSize: typography.sizes.bodyS,
    textAlign: 'center'
  }
});
