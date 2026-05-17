import dayjs from 'dayjs';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { AiCoachCard } from '../../components/forge/AiCoachCard';
import { ForgeButton } from '../../components/forge/ForgeButton';
import { MacroDonutRing } from '../../components/forge/MacroDonutRing';
import {
  SkeletonHeroCard,
  SkeletonMetricRow,
} from '../../components/forge/ForgeSkeleton';
import { StreakWidget } from '../../components/forge/StreakWidget';
import { MuscleTagChip, WorkoutListItem } from '../../components/forge/WorkoutAtoms';
import { ForgeTheme } from '../../constants/ForgeTheme';
import { useAiCoach } from '../../hooks/useAiCoach';
import { useNutrition } from '../../hooks/useNutrition';
import { useWorkouts } from '../../hooks/useWorkouts';
import { useAuthStore } from '../../stores/authStore';

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 18) return 'Good afternoon';
  return 'Good evening';
}

function getInitial(name?: string | null) {
  return name?.charAt(0)?.toUpperCase() ?? 'A';
}

// ─────────────────────────────────────────────────────────────────────────────
// HomeScreen
// ─────────────────────────────────────────────────────────────────────────────

export default function HomeScreen() {
  const router    = useRouter();
  const { user }  = useAuthStore();

  const { data: nutrition, isLoading: isNutritionLoading } = useNutrition();
  const { workouts, isLoading: isWorkoutsLoading }         = useWorkouts();
  const { data: aiTip, isLoading: isAiLoading }            = useAiCoach();

  const isLoading = isNutritionLoading || isWorkoutsLoading;

  // ── Derived data ──────────────────────────────────────────────────────────

  const waterLiters  = (nutrition?.waterMl    ?? 0) / 1000;
  const activeCals   = nutrition?.totalCalories ?? 0;
  const waterGoal    = 2.4;
  const calGoal      = 2500;

  const todayDate    = dayjs().format('YYYY-MM-DD');
  const todayWorkout = workouts?.find(w => w.date === todayDate);

  const muscleTags: string[] = todayWorkout
    ? [...new Set(todayWorkout.exercises.flatMap(ex => (ex as any).muscleGroups ?? []))]
    : [];

  const recentWorkouts = [...(workouts ?? [])]
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 2);

  const startOfWeek = dayjs().startOf('week').add(1, 'day');
  const weekActivity = Array.from({ length: 7 }).map((_, i) => {
    const d = startOfWeek.add(i, 'day').format('YYYY-MM-DD');
    return !!(workouts ?? []).find(w => w.date === d);
  });

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >

      {/* ── Top Bar ───────────────────────────────────────────────────────── */}
      <View style={styles.topBar}>
        <Text style={styles.wordmark}>FORGE</Text>
        <View
          style={styles.avatar}
          accessibilityLabel={`Profile: ${user?.displayName ?? 'Athlete'}`}
          accessibilityRole="button"
        >
          <Text style={styles.avatarText}>{getInitial(user?.displayName)}</Text>
        </View>
      </View>

      {/* ── Greeting ──────────────────────────────────────────────────────── */}
      <View style={styles.greetingWrap}>
        <Text style={styles.greetingSub} maxFontSizeMultiplier={1.3}>
          {getGreeting()} · {dayjs().format('dddd')}
        </Text>
        <Text style={styles.greetingName} maxFontSizeMultiplier={1.3}>
          {user?.displayName ?? 'Athlete'}
        </Text>
      </View>

      {/* ── Today's Plan Card ─────────────────────────────────────────────── */}
      {isLoading ? (
        <SkeletonHeroCard />
      ) : (
        <View style={styles.todayCard}>
          <LinearGradient
            colors={['#1C1C22', '#0E0E11']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={StyleSheet.absoluteFillObject}
          />
          {/* Decorative accent blob */}
          <View style={styles.blobDecor} />

          <View style={styles.todayCardContent}>
            <Text style={styles.todayTag}>📅 Today's Plan</Text>
            <Text style={styles.todayWorkoutName}>
              {todayWorkout ? (todayWorkout.notes ?? 'Custom Workout') : 'Rest Day'}
            </Text>
            <Text style={styles.todayMeta}>
              {todayWorkout
                ? `${todayWorkout.exercises.length} exercises · Ready to train?`
                : 'Time to recover and hydrate.'}
            </Text>

            {/* Muscle chips */}
            {muscleTags.length > 0 && (
              <View style={styles.chipRow}>
                {muscleTags.slice(0, 4).map(tag => (
                  <MuscleTagChip key={tag} label={tag} />
                ))}
              </View>
            )}

            {/* CTA — primary action for screen */}
            <ForgeButton
              label={todayWorkout ? '▶  Start Workout' : '+  Add Workout'}
              onPress={() =>
                router.push(todayWorkout ? '/activeWorkout' : '/(tabs)/workout')
              }
              variant="primary"
              size="md"
              pulse
              style={styles.ctaButton}
              accessibilityLabel={
                todayWorkout ? 'Start today\'s workout' : 'Add a new workout'
              }
              testID="home-cta-button"
            />
          </View>
        </View>
      )}

      {/* ── Metrics Row (Rings + Streak) ──────────────────────────────────── */}
      {isLoading ? (
        <SkeletonMetricRow />
      ) : (
        <View style={styles.metricsRow}>
          <View style={styles.metricCard}>
            <MacroDonutRing
              calories={activeCals}
              calorieGoal={calGoal}
              waterLiters={waterLiters}
              waterGoal={waterGoal}
            />
          </View>
          <View style={styles.metricCard}>
            <StreakWidget
              streak={(user as any)?.streak ?? 0}
              weekActivity={weekActivity}
            />
          </View>
        </View>
      )}

      {/* ── AI Coach Card ─────────────────────────────────────────────────── */}
      <View style={styles.section}>
        <AiCoachCard
          tip={aiTip}
          isLoading={isAiLoading}
          onChatPress={() => router.push('/chat')}
        />
      </View>

      {/* ── Recent Workouts ───────────────────────────────────────────────── */}
      <View style={styles.section}>
        <Text style={styles.sectionLabel}>Recent Workouts</Text>
        <View style={styles.card}>
          {recentWorkouts.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyIcon}>🏋️</Text>
              <Text style={styles.emptyTitle}>No workouts yet</Text>
              <Text style={styles.emptyBody}>
                Log your first session to start tracking progress.
              </Text>
              <ForgeButton
                label="+ Add Workout"
                onPress={() => router.push('/(tabs)/workout')}
                variant="secondary"
                size="sm"
                style={{ marginTop: 16 }}
                testID="home-add-workout-empty"
              />
            </View>
          ) : (
            recentWorkouts.map((workout, idx) => {
              const daysAgo = dayjs().diff(dayjs(workout.date), 'day');
              const dateLabel =
                daysAgo === 0 ? 'Today' :
                daysAgo === 1 ? 'Yesterday' :
                dayjs(workout.date).format('ddd, MMM D');
              return (
                <WorkoutListItem
                  key={workout.id ?? `workout-${idx}`}
                  title={workout.notes ?? 'Custom Workout'}
                  date={dateLabel}
                  icon={idx === 0 ? '🦵' : '🔥'}
                  stat={
                    workout.exercises.length > 3
                      ? `${workout.exercises.length} exercises`
                      : undefined
                  }
                  isLast={idx === recentWorkouts.length - 1}
                  onPress={() =>
                    router.push({
                      pathname: '/activeWorkout',
                      params: { id: workout.id },
                    })
                  }
                />
              );
            })
          )}
        </View>
      </View>

    </ScrollView>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Styles
// ─────────────────────────────────────────────────────────────────────────────

const { colors, spacing, radii, typography } = ForgeTheme;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg0,
  },
  scrollContent: {
    paddingBottom: 110,
  },

  // ── Top bar ──────────────────────────────────────────────────────────────
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.page,
    paddingTop: 60,
    paddingBottom: spacing.px4,
  },
  wordmark: {
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: 2.5,
    color: colors.forge,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: radii.full,
    backgroundColor: colors.forge,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.forge,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 4,
  },
  avatarText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#fff',
  },

  // ── Greeting ─────────────────────────────────────────────────────────────
  greetingWrap: {
    paddingHorizontal: spacing.page,
    marginBottom: spacing.px5,
  },
  greetingSub: {
    fontSize: typography.sizes.label,
    fontWeight: '500',
    color: colors.t2,
    marginBottom: 2,
  },
  greetingName: {
    fontSize: typography.sizes.h1,
    fontWeight: '700',
    color: colors.t1,
  },

  // ── Today card ────────────────────────────────────────────────────────────
  todayCard: {
    marginHorizontal: spacing.page,
    marginBottom: spacing.px5,
    borderRadius: radii.xl,
    borderWidth: 0.5,
    borderColor: colors.b1,
    overflow: 'hidden',
  },
  blobDecor: {
    position: 'absolute',
    top: -24,
    right: -20,
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: colors.forgeDim,
  },
  todayCardContent: {
    padding: spacing.px5,
    zIndex: 1,
  },
  todayTag: {
    fontSize: typography.sizes.caption,
    fontWeight: '600',
    color: colors.forge,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  todayWorkoutName: {
    fontSize: typography.sizes.h2,
    fontWeight: '700',
    color: colors.t1,
    marginBottom: 4,
  },
  todayMeta: {
    fontSize: typography.sizes.bodyS,
    color: colors.t2,
    marginBottom: spacing.px4,
    lineHeight: typography.sizes.bodyS * 1.5,
  },
  chipRow: {
    flexDirection: 'row',
    gap: 6,
    flexWrap: 'wrap',
    marginBottom: spacing.px4,
  },
  ctaButton: {
    // ForgeButton fills width by default in a View context
  },

  // ── Metrics row ───────────────────────────────────────────────────────────
  metricsRow: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: spacing.page,
    marginBottom: spacing.px5,
  },
  metricCard: {
    flex: 1,
    backgroundColor: colors.bg1,
    borderRadius: radii.xl,
    borderWidth: 0.5,
    borderColor: colors.b1,
    padding: spacing.px4,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // ── Section ───────────────────────────────────────────────────────────────
  section: {
    paddingHorizontal: spacing.page,
    marginBottom: spacing.px5,
  },
  sectionLabel: {
    fontSize: typography.sizes.label,
    fontWeight: '600',
    color: colors.t3,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: spacing.px2,
  },
  card: {
    backgroundColor: colors.bg1,
    borderRadius: radii.xl,
    borderWidth: 0.5,
    borderColor: colors.b1,
    overflow: 'hidden',
  },

  // ── Empty state ───────────────────────────────────────────────────────────
  emptyState: {
    alignItems: 'center',
    paddingVertical: spacing.px7,
    paddingHorizontal: spacing.px6,
  },
  emptyIcon: {
    fontSize: 36,
    marginBottom: spacing.px3,
  },
  emptyTitle: {
    fontSize: typography.sizes.h3,
    fontWeight: '700',
    color: colors.t1,
    marginBottom: 6,
  },
  emptyBody: {
    fontSize: typography.sizes.bodyS,
    color: colors.t3,
    textAlign: 'center',
    lineHeight: typography.sizes.bodyS * 1.5,
  },
});
