import { useState, useRef, useEffect } from 'react';
import { Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useQueryClient } from '@tanstack/react-query';
import dayjs from 'dayjs';
import { supabase } from '../../../services/supabase';
import { GeneratedPlan, generateMealPlanOnly } from '../../../services/GeneratorEngine';
import { useAuthStore } from '../../../stores/authStore';

export function useAIPlan() {
  const router = useRouter();
  const { user } = useAuthStore();
  const queryClient = useQueryClient();

  // Form state
  const [selectedGoals, setSelectedGoals] = useState<string[]>(['Maintain']);
  const [selectedDiets, setSelectedDiets] = useState<string[]>(['Anything']);
  const [allergies, setAllergies] = useState('');

  // Generation state
  const [generating, setGenerating] = useState(false);
  const [plan, setPlan] = useState<GeneratedPlan | null>(null);
  const [applying, setApplying] = useState(false);
  const [savingDraft, setSavingDraft] = useState(false);

  // Refs for auto-save on unmount
  const planRef = useRef<GeneratedPlan | null>(null);
  const appliedRef = useRef(false);

  useEffect(() => { planRef.current = plan; }, [plan]);

  // Check for existing draft on mount
  useEffect(() => {
    async function checkDraft() {
      if (!user) return;
      const { data } = await supabase
        .from('generated_meal_plan_weekly')
        .select('plan')
        .eq('user_id', user.uid)
        .eq('status', 'draft')
        .order('saved_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (data && data.plan) {
        Alert.alert(
          'Draft Found',
          'You have a saved meal plan draft. Would you like to resume it?',
          [
            { text: 'Start Fresh', style: 'cancel' },
            { text: 'Resume Draft', onPress: () => setPlan(data.plan as GeneratedPlan) }
          ]
        );
      }
    }
    checkDraft();

    // Auto-save draft on unmount if not applied
    return () => {
      const currentPlan = planRef.current;
      const hasApplied = appliedRef.current;

      if (currentPlan && !hasApplied && user) {
        supabase.from('generated_meal_plan_weekly').upsert({
          user_id: user.uid,
          date: dayjs().format('YYYY-MM-DD'),
          plan: currentPlan,
          saved_at: new Date().toISOString(),
          status: 'draft'
        }, { onConflict: 'user_id,date' }).then(() => {
          Alert.alert('Draft Saved', 'Your unapplied plan was automatically saved as a draft.');
        });
      }
    };
  }, [user]);

  const toggleGoal = (g: string) => setSelectedGoals([g]);
  const toggleDiet = (d: string) => setSelectedDiets([d]);

  const handleGenerate = async () => {
    if (!user) { Alert.alert('Not signed in'); return; }
    setGenerating(true);
    setPlan(null);
    try {
      const result = await generateMealPlanOnly({
        uid: user.uid,
        weightKg: (user as any).weight ?? 70,
        heightCm: (user as any).height ?? 170,
        ageYears: (user as any).age ?? 25,
        fitnessGoal: selectedGoals.includes('Bulking') ? 'bulk'
          : selectedGoals.includes('Lean Bulking') ? 'bulk'
            : selectedGoals.includes('Diet (Weight Loss)') ? 'cut'
              : 'maintain',
        dietPreference: selectedDiets.includes('Vegan') ? 'vegan'
          : selectedDiets.includes('Keto') ? 'keto'
            : 'anything',
        equipmentAccess: 'full', // Not needed for meal plans
        customGoals: [...selectedGoals, ...selectedDiets, ...(allergies ? [`Allergies/Restrictions: ${allergies}`] : [])],
      });
      setPlan(result);
    } catch (e: any) {
      Alert.alert('Generation Failed', e.message);
    } finally {
      setGenerating(false);
    }
  };

  const handleApply = async () => {
    if (!plan || !user) return;
    setApplying(true);
    try {
      const { error } = await supabase.from('generated_meal_plan_weekly').upsert({
        user_id: user.uid,
        date: dayjs().format('YYYY-MM-DD'),
        plan: plan,
        saved_at: new Date().toISOString(),
        status: 'active'
      }, { onConflict: 'user_id,date' });
      if (error) throw error;

      await queryClient.invalidateQueries({ queryKey: ['activeMealPlan', user.uid] });
      appliedRef.current = true;

      Alert.alert('Plan Activated!', 'Your personalized plan is now live in the Planner.', [
        { text: "Let's go!", onPress: () => router.back() },
      ]);
    } catch (e: any) {
      Alert.alert('Error', e.message);
    } finally {
      setApplying(false);
    }
  };

  const handleSaveDraft = async () => {
    if (!plan || !user) return;
    setSavingDraft(true);
    try {
      const { error } = await supabase.from('generated_meal_plan_weekly').upsert({
        user_id: user.uid,
        date: dayjs().format('YYYY-MM-DD'),
        plan: plan,
        saved_at: new Date().toISOString(),
        status: 'draft'
      }, { onConflict: 'user_id,date' });
      if (error) throw error;

      appliedRef.current = true;
      Alert.alert('Saved as Draft', 'Your plan has been saved. You can resume it later.', [
        { text: 'OK', onPress: () => router.back() }
      ]);
    } catch (e: any) {
      Alert.alert('Error saving draft', e.message);
    } finally {
      setSavingDraft(false);
    }
  };

  return {
    selectedGoals, selectedDiets, allergies,
    generating, plan, applying, savingDraft,
    setAllergies, toggleGoal, toggleDiet,
    handleGenerate, handleApply, handleSaveDraft
  };
}
