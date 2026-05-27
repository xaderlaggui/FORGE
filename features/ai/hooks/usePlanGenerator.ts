import { useState, useMemo } from 'react';
import { Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useQueryClient } from '@tanstack/react-query';
import dayjs from 'dayjs';
import { supabase } from '../../../services/supabase';
import { GeneratedPlan, generateWorkoutPlanOnly } from '../../../services/GeneratorEngine';
import { useAuthStore } from '../../../stores/authStore';
import { ActivityLevel, calculateNutritionTargets, Goal } from '../../../utils/nutritionEngine';

export function usePlanGenerator() {
  const router = useRouter();
  const { user } = useAuthStore();
  const queryClient = useQueryClient();

  // -- Form State --
  const [goal, setGoal] = useState<Goal>('maintain');
  const [activity, setActivity] = useState<ActivityLevel>('active');
  const [days, setDays] = useState<3 | 4 | 5 | 6>(4);
  const [injuries, setInjuries] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  // -- Preview State --
  const [plan, setPlan] = useState<GeneratedPlan | null>(null);
  const [activeDayIdx, setActiveDayIdx] = useState(0);
  const [showPicker, setShowPicker] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const weekDays = useMemo(() => {
    const now = new Date();
    const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
    const todayPH = new Date(utc + (3600000 * 8));

    const dayOfWeek = todayPH.getDay();
    const currentIdx = dayOfWeek === 0 ? 6 : dayOfWeek - 1;

    const startOfWeek = new Date(todayPH);
    startOfWeek.setDate(todayPH.getDate() - currentIdx);

    return Array.from({ length: 7 }).map((_, i) => {
      const d = new Date(startOfWeek);
      d.setDate(startOfWeek.getDate() + i);
      const label = ['M', 'T', 'W', 'T', 'F', 'S', 'S'][i];
      const fullNames = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
      return {
        label,
        date: d.getDate(),
        fullDate: `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`,
        dayName: fullNames[i]
      };
    });
  }, []);

  const handleGenerate = async () => {
    if (!user?.uid) return;
    setIsGenerating(true);

    try {
      const weightLbs = (user as any)?.weight || 175;
      const heightCm = (user as any)?.height || 170;
      const age = (user as any)?.age || 25;
      const nutritionTargets = calculateNutritionTargets(weightLbs, 175, 30, 'male', activity, goal);

      const generated = await generateWorkoutPlanOnly({
        uid: user.uid,
        weightKg: weightLbs / 2.20462,
        heightCm: heightCm,
        ageYears: age,
        fitnessGoal: goal,
        dietPreference: 'anything',
        equipmentAccess: 'full',
        experienceLevel: 'Intermediate',
        daysPerWeek: days,
        customGoals: injuries ? [`Injuries/Limitations: ${injuries}`] : []
      });

      await supabase.from('profiles').update({ targets_nutrition: nutritionTargets }).eq('id', user.uid);

      setPlan(generated);
    } catch (err: any) {
      Alert.alert('Error Generating Plan', err.message);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleAddExercise = (exercise: any) => {
    if (!plan) return;
    const currentDayName = weekDays[activeDayIdx].dayName;

    const updatedWeek = plan.workoutWeek.map(dayObj => {
      if (dayObj.day === currentDayName) {
        return {
          ...dayObj,
          exercises: [...dayObj.exercises, { name: exercise.name, sets: 3, reps: '8-12', restSec: 90 }]
        };
      }
      return dayObj;
    });

    setPlan({ ...plan, workoutWeek: updatedWeek });
    setShowPicker(false);
  };

  const handleRemoveExercise = (exIndex: number) => {
    if (!plan) return;
    const currentDayName = weekDays[activeDayIdx].dayName;

    const updatedWeek = plan.workoutWeek.map(dayObj => {
      if (dayObj.day === currentDayName) {
        return {
          ...dayObj,
          exercises: dayObj.exercises.filter((_, i) => i !== exIndex)
        };
      }
      return dayObj;
    });

    setPlan({ ...plan, workoutWeek: updatedWeek });
  };

  const handleSaveToDatabase = async () => {
    if (!plan || !user?.uid) return;
    setIsSaving(true);
    try {
      const dateKey = dayjs().format('YYYY-MM-DD');

      const { error } = await supabase.from('generated_workout_plan_weekly').upsert({
        user_id: user.uid,
        date: dateKey,
        plan: plan,
        saved_at: new Date().toISOString(),
      }, { onConflict: 'user_id,date' });

      if (error) throw error;

      await queryClient.invalidateQueries({ queryKey: ['activeWorkoutPlan', user.uid] });

      Alert.alert('Plan Applied!', 'Your dynamic routine is now active in the Planner.', [
        { text: 'Awesome', onPress: () => router.back() }
      ]);
    } catch (e: any) {
      Alert.alert('Save Failed', e.message);
    } finally {
      setIsSaving(false);
    }
  };

  return {
    goal, setGoal,
    activity, setActivity,
    days, setDays,
    injuries, setInjuries,
    isGenerating,
    plan, setPlan,
    activeDayIdx, setActiveDayIdx,
    showPicker, setShowPicker,
    isSaving,
    weekDays,
    handleGenerate,
    handleAddExercise,
    handleRemoveExercise,
    handleSaveToDatabase
  };
}
