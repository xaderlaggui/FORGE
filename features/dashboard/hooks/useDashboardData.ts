import dayjs from 'dayjs';
import { useAiCoach } from '../../../hooks/useAiCoach';
import { useNutrition } from '../../../hooks/useNutrition';
import { useStreak } from '../../../hooks/useStreak';
import { useWorkouts } from '../../../hooks/useWorkouts';
import { useAuthStore } from '../../../stores/authStore';

export function useDashboardData() {
  const { user } = useAuthStore();
  const { data: nutrition, isLoading: isNutritionLoading } = useNutrition();
  const { workouts, isLoading: isWorkoutsLoading } = useWorkouts();
  const { data: aiTip, isLoading: isAiLoading } = useAiCoach();
  const streak = useStreak();

  const isLoading = isNutritionLoading || isWorkoutsLoading;

  // ── Derived data ──
  const waterLiters = (nutrition?.waterMl ?? 0) / 1000;
  const activeCals = nutrition?.totalCalories ?? 0;
  const waterGoal = 2.4;
  const calGoal = (user as any)?.targets?.nutrition?.calories ?? 2500;

  const todayDate = dayjs().format('YYYY-MM-DD');
  const loggedWorkout = workouts?.find(w => w.date === todayDate);

  const todayIdx = dayjs().day() === 0 ? 6 : dayjs().day() - 1; // 0=Mon, 6=Sun
  const plannedWorkout = (user as any)?.plan?.weeklySchedule?.[todayIdx];

  const muscleTags: string[] = plannedWorkout && plannedWorkout.dayType !== 'Rest'
    ? [...new Set<string>(plannedWorkout.exercises.flatMap((ex: any) => ex.muscleGroups ?? []))].filter(Boolean)
    : [];

  const recentWorkouts = [...(workouts ?? [])]
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 2);

  const startOfWeek = dayjs().startOf('week').add(1, 'day');
  let workoutsThisWeek = 0;
  const weekActivity = Array.from({ length: 7 }).map((_, i) => {
    const d = startOfWeek.add(i, 'day').format('YYYY-MM-DD');
    const isDone = !!(workouts ?? []).find(w => w.date === d);
    if (isDone) workoutsThisWeek++;
    return isDone;
  });

  let totalVolumeLbs = 0;
  workouts?.forEach(w => {
    w.exercises?.forEach((ex: any) => {
      ex.sets?.forEach((s: any) => {
        const wt = s.weight || 0;
        const r = s.reps || 0;
        totalVolumeLbs += (wt * r); // Assumes mostly lbs, adjust if needed
      });
    });
  });

  return {
    user,
    isLoading,
    isAiLoading,
    aiTip,
    waterLiters,
    activeCals,
    waterGoal,
    calGoal,
    plannedWorkout,
    loggedWorkout,
    muscleTags: muscleTags as string[],
    recentWorkouts,
    weekActivity,
    workoutsThisWeek,
    totalVolumeLbs,
    streak,
  };
}
