import { useForgeTheme } from '@/hooks/useForgeTheme';
import { useQueryClient } from '@tanstack/react-query';
import dayjs from 'dayjs';
import { useRouter } from 'expo-router';
import { AlertTriangle, Apple, Check, ChevronLeft, Sparkles, Target } from 'lucide-react-native';
import React, { useState } from 'react';
import { ActivityIndicator, Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { MascotImage } from '../components/common/MascotImage';
import { ForgeButton } from '../components/forge/ForgeButton';
import { ForgeSkeleton } from '../components/forge/ForgeSkeleton';
import { WeeklyCalendar } from '../features/planner/components/WeeklyCalendar';
import { GeneratedPlan, generateMealPlanOnly } from '../services/GeneratorEngine';
import { supabase } from '../services/supabase';
import { useAuthStore } from '../stores/authStore';

function MealGeneratorSkeleton({ T }: { T: any }) {
  return (
    <View style={{ paddingTop: 16 }}>
      {/* Skeleton for Coach Message */}
      <View style={{ flexDirection: 'row', backgroundColor: T.colors.bg1, borderRadius: 16, borderWidth: 1, borderColor: T.colors.b1, marginBottom: 24, overflow: 'hidden', height: 120 }}>
        <View style={{ width: 90, backgroundColor: T.colors.forgeDim, padding: 16 }} />
        <View style={{ flex: 1, padding: 16 }}>
          <ForgeSkeleton width={80} height={14} radius={4} style={{ marginBottom: 12 }} />
          <ForgeSkeleton width="90%" height={10} radius={4} style={{ marginBottom: 8 }} />
          <ForgeSkeleton width="80%" height={10} radius={4} style={{ marginBottom: 8 }} />
          <ForgeSkeleton width="95%" height={10} radius={4} />
        </View>
      </View>

      {/* Skeleton for Weekly Calendar */}
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 }}>
        {Array.from({ length: 7 }).map((_, i) => (
          <ForgeSkeleton key={i} width={38} height={52} radius={12} />
        ))}
      </View>

      {/* Skeleton for Meals */}
      {Array.from({ length: 3 }).map((_, i) => (
        <View key={i} style={{ marginBottom: 16 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
            <ForgeSkeleton width={100} height={16} radius={4} />
            <ForgeSkeleton width={60} height={16} radius={4} />
          </View>
          <View style={{ backgroundColor: T.colors.bg1, borderRadius: 16, borderWidth: 0.5, borderColor: T.colors.b1, padding: 16 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
              <View style={{ gap: 6, flex: 1 }}>
                <ForgeSkeleton width="70%" height={14} radius={4} />
                <ForgeSkeleton width="40%" height={10} radius={4} />
              </View>
              <ForgeSkeleton width={40} height={14} radius={4} />
            </View>
            <View style={{ borderTopWidth: 0.5, borderTopColor: T.colors.b0, marginTop: 12, paddingTop: 12, flexDirection: 'row', gap: 12 }}>
              <ForgeSkeleton width={40} height={12} radius={4} />
              <ForgeSkeleton width={40} height={12} radius={4} />
              <ForgeSkeleton width={40} height={12} radius={4} />
            </View>
          </View>
        </View>
      ))}
    </View>
  );
}

// ─── AI Rationale Card ────────────────────────────────────────────────────────
function CoachMessageCard({ message, T }: { message: string, T: any }) {

  return (
    <View style={{ flexDirection: 'row', marginBottom: 24, marginTop: 16, alignItems: 'center' }}>
      <View style={{ marginRight: 12, zIndex: 2, alignItems: 'center', justifyContent: 'center', width: 76 }}>
        <MascotImage mascot="nutrition" width={100} height={100} accessibilityLabel="Nutrition Coach Mascot" />
      </View>

      <View style={{ flex: 1, position: 'relative' }}>
        <View style={{
          position: 'absolute', left: -9, top: 23, width: 0, height: 0,
          backgroundColor: 'transparent', borderStyle: 'solid', borderTopWidth: 9, borderBottomWidth: 9, borderRightWidth: 10,
          borderTopColor: 'transparent', borderBottomColor: 'transparent', borderRightColor: T.colors.b1, zIndex: 0,
        }} />
        <View style={{
          position: 'absolute', left: -7, top: 24, width: 0, height: 0,
          backgroundColor: 'transparent', borderStyle: 'solid', borderTopWidth: 8, borderBottomWidth: 8, borderRightWidth: 9,
          borderTopColor: 'transparent', borderBottomColor: 'transparent', borderRightColor: T.colors.bg1, zIndex: 2,
        }} />
        <View style={{
          backgroundColor: T.colors.bg1, ...T.shadows.lift, borderRadius: 16, padding: 16,
          borderWidth: 1, borderColor: T.colors.b1, zIndex: 1,
        }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 6 }}>
            <Sparkles size={14} color={T.colors.forge} />
            <Text style={{ fontSize: 12, fontWeight: '800', color: T.colors.t1, letterSpacing: 0.5 }}>AI COACH TIP</Text>
          </View>
          <Text style={{ fontSize: 13, color: T.colors.t2, lineHeight: 18 }}>{message}</Text>
        </View>
      </View>
    </View>
  );
}

// ─── Generated Plan Preview ───────────────────────────────────────────────────
function PlanPreview({ plan, onApply, onSaveDraft, isApplying, isSavingDraft, T }: {
  plan: GeneratedPlan;
  onApply: () => void;
  onSaveDraft: () => void;
  isApplying: boolean;
  isSavingDraft: boolean;
  T: any;
}) {
  const isWeekly = Array.isArray(plan.mealPlan.days) && plan.mealPlan.days.length > 0;

  // Generate 7 days starting from Monday
  const weekDays = React.useMemo(() => {
    const now = new Date();
    const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
    const todayPH = new Date(utc + (3600000 * 8)); // UTC+8

    const dayOfWeek = todayPH.getDay();
    const currentIdx = dayOfWeek === 0 ? 6 : dayOfWeek - 1; // Mon=0, Sun=6

    const startOfWeek = new Date(todayPH);
    startOfWeek.setDate(todayPH.getDate() - currentIdx);

    return Array.from({ length: 7 }).map((_, i) => {
      const d = new Date(startOfWeek);
      d.setDate(startOfWeek.getDate() + i);
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const date = String(d.getDate()).padStart(2, '0');
      const label = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][i];
      const fullName = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'][i];
      return { label, fullName, date: d.getDate(), fullDate: `${year}-${month}-${date}` };
    });
  }, []);

  const [selectedDayIdx, setSelectedDayIdx] = React.useState(() => {
    // Start with today's index
    const now = new Date();
    const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
    const todayPH = new Date(utc + (3600000 * 8));
    const dayOfWeek = todayPH.getDay();
    return dayOfWeek === 0 ? 6 : dayOfWeek - 1;
  });

  const selectedDayName = weekDays[selectedDayIdx].fullName;
  const currentDay = isWeekly
    ? plan.mealPlan.days.find((d: any) => d.dayOfWeek === selectedDayName)
    : { dayOfWeek: 'Preview', meals: plan.mealPlan.meals };

  return (
    <View style={{ flex: 1 }}>
      {/* Header matching Weekly Meal Plan */}
      <View style={{
        flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between',
        paddingTop: 60, paddingBottom: 16, paddingHorizontal: 16,
        backgroundColor: T.colors.bg1, ...T.shadows.lift, borderBottomWidth: 0.5, borderBottomColor: T.colors.b1,
      }}>
        <TouchableOpacity
          style={{ width: 40, height: 40, alignItems: 'center', justifyContent: 'center', marginLeft: -8 }}
          onPress={onSaveDraft}
          disabled={isSavingDraft || isApplying}
        >
          {isSavingDraft ? <ActivityIndicator color={T.colors.t1} /> : <ChevronLeft size={28} color={T.colors.t1} />}
        </TouchableOpacity>

        <View style={{ alignItems: 'center', paddingBottom: 8 }}>
          <Text style={{ fontSize: 18, fontWeight: '700', color: T.colors.t1 }}>Generated Plan</Text>
        </View>

        <TouchableOpacity
          style={{ width: 40, height: 40, alignItems: 'center', justifyContent: 'center', marginRight: -8 }}
          onPress={onApply}
          disabled={isApplying || isSavingDraft}
        >
          {isApplying ? <ActivityIndicator color={T.colors.forge} /> : <Check size={28} color={T.colors.forge} />}
        </TouchableOpacity>
      </View>

      {isWeekly && (
        <View style={{ paddingHorizontal: 16, paddingTop: 16, backgroundColor: T.colors.bg0, borderBottomWidth: 0.5, borderBottomColor: T.colors.b1, paddingBottom: 12 }}>
          <WeeklyCalendar
            days={weekDays}
            activeDayIdx={selectedDayIdx}
            onSelectDay={setSelectedDayIdx}
          />
        </View>
      )}

      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 100 }} showsVerticalScrollIndicator={false}>
        <Text style={{ fontSize: 14, color: T.colors.t2, marginBottom: 8, fontWeight: '600' }}>
          Targets: {plan.mealPlan.targetCalories} kcal • {plan.mealPlan.targetProtein}g P • {plan.mealPlan.targetCarbs}g C • {plan.mealPlan.targetFat}g F
        </Text>

        {(currentDay?.meals || []).map((meal: any, i: number) => (
          <View
            key={i}
            style={{
              backgroundColor: T.colors.bg1, ...T.shadows.lift, borderRadius: 14,
              padding: 16, borderWidth: 0.5, borderColor: T.colors.b1,
              flexDirection: 'row', alignItems: 'center', gap: 14,
              marginBottom: 12,
            }}
          >
            <View style={{
              width: 44, height: 44, borderRadius: 10,
              backgroundColor: T.colors.forgeDim,
              alignItems: 'center', justifyContent: 'center',
            }}>
              <Text style={{
                fontSize: 11, fontWeight: '800', letterSpacing: 0.5,
                color: T.colors.forge,
              }}>{meal.name.substring(0, 3).toUpperCase()}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 15, fontWeight: '700', color: T.colors.t1 }}>{meal.name}</Text>
              <Text style={{ fontSize: 13, color: T.colors.t2, marginTop: 2, lineHeight: 18 }}>
                {meal.description}
              </Text>
              <Text style={{ fontSize: 12, fontWeight: '600', color: T.colors.t3, marginTop: 4 }}>
                {meal.calories} kcal • {meal.protein}g P • {meal.carbs}g C • {meal.fat}g F
              </Text>
            </View>
          </View>
        ))}

        {plan.coachMessage && (
          <CoachMessageCard message={plan.coachMessage} T={T} />
        )}

      </ScrollView>
    </View>
  );
}

// ─── Main Screen ──────────────────────────────────────────────────────────────
export default function AIPlanScreen() {
  const router = useRouter();
  const { T } = useForgeTheme();
  const s = useStyles(T);
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
  const planRef = React.useRef<GeneratedPlan | null>(null);
  const appliedRef = React.useRef(false);

  React.useEffect(() => { planRef.current = plan; }, [plan]);

  // Check for existing draft on mount
  React.useEffect(() => {
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

      // Invalidate the activeMealPlan query so the Dashboard and Planner instantly update
      await queryClient.invalidateQueries({ queryKey: ['activeMealPlan', user.uid] });

      appliedRef.current = true; // Mark as applied so unmount doesn't auto-save it as draft again

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

      appliedRef.current = true; // Mark as handled to prevent duplicate auto-save
      Alert.alert('Saved as Draft', 'Your plan has been saved. You can resume it later.', [
        { text: 'OK', onPress: () => router.back() }
      ]);
    } catch (e: any) {
      Alert.alert('Error saving draft', e.message);
    } finally {
      setSavingDraft(false);
    }
  };

  const renderOption = (label: string, isSelected: boolean, onPress: () => void) => (
    <TouchableOpacity
      style={[s.optionCard, isSelected && s.optionCardActive]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Text style={[s.optionText, isSelected && s.optionTextActive]}>{label}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={s.container}>

      {generating ? (
        <ScrollView style={s.scroll} contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>
          <MealGeneratorSkeleton T={T} />
        </ScrollView>
      ) : !plan ? (
        <ScrollView style={s.scroll} contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>
          <>
            <View style={s.hero}>
              <Text style={s.heroTitle}>Build Your Meal Plan</Text>
              <Text style={s.heroSubtitle}>Let the AI craft a personalized nutrition strategy based on your stats.</Text>
            </View>

            <View style={s.section}>
              <View style={s.sectionHeader}>
                <Target size={18} color={T.colors.t2} />
                <Text style={s.sectionTitle}>Primary Goal</Text>
              </View>
              <View style={s.row}>
                {renderOption('Diet (Weight Loss)', selectedGoals.includes('Diet (Weight Loss)'), () => toggleGoal('Diet (Weight Loss)'))}
                {renderOption('Maintain', selectedGoals.includes('Maintain'), () => toggleGoal('Maintain'))}
              </View>
              <View style={s.row}>
                {renderOption('Lean Bulking', selectedGoals.includes('Lean Bulking'), () => toggleGoal('Lean Bulking'))}
                {renderOption('Bulking', selectedGoals.includes('Bulking'), () => toggleGoal('Bulking'))}
              </View>
            </View>

            <View style={s.section}>
              <View style={s.sectionHeader}>
                <Apple size={18} color={T.colors.t2} />
                <Text style={s.sectionTitle}>Dietary Preferences</Text>
              </View>
              <View style={s.row}>
                {renderOption('Anything', selectedDiets.includes('Anything'), () => toggleDiet('Anything'))}
                {renderOption('High Protein', selectedDiets.includes('High Protein'), () => toggleDiet('High Protein'))}
              </View>
              <View style={s.row}>
                {renderOption('Vegan', selectedDiets.includes('Vegan'), () => toggleDiet('Vegan'))}
                {renderOption('Vegetarian', selectedDiets.includes('Vegetarian'), () => toggleDiet('Vegetarian'))}
                {renderOption('Keto', selectedDiets.includes('Keto'), () => toggleDiet('Keto'))}
              </View>
            </View>

            <View style={s.section}>
              <View style={s.sectionHeader}>
                <AlertTriangle size={18} color={T.colors.t2} />
                <Text style={s.sectionTitle}>Allergies or Restrictions (Optional)</Text>
              </View>
              <TextInput
                style={s.textarea}
                value={allergies}
                onChangeText={setAllergies}
                placeholder="e.g. peanut allergy, lactose intolerant..."
                placeholderTextColor={T.colors.t3}
                multiline
                numberOfLines={3}
                textAlignVertical="top"
              />
            </View>
          </>
        </ScrollView>
      ) : (
        <PlanPreview
          plan={plan}
          onApply={handleApply}
          onSaveDraft={handleSaveDraft}
          isApplying={applying}
          isSavingDraft={savingDraft}
          T={T}
        />
      )}

      {!plan && (
        <View style={s.footer}>
          <ForgeButton
            label="Generate AI Meal Plan"
            onPress={handleGenerate}
            loading={generating}
            pulse
          />
        </View>
      )}
    </View>
  );
}

const useStyles = (T: any) => StyleSheet.create({
  container: { flex: 1, backgroundColor: T.colors.bg0 },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingTop: 50, paddingBottom: 10, paddingHorizontal: T.spacing.page,
    backgroundColor: T.colors.bg1,
    borderBottomWidth: 0.5, borderBottomColor: T.colors.b1,
  },
  backBtn: { padding: 4, marginLeft: -4 },
  headerTitle: { fontSize: T.typography.sizes.h3, fontWeight: '700', color: T.colors.t1 },

  scroll: { flex: 1 },
  content: { padding: T.spacing.page, paddingBottom: 100 },

  hero: { alignItems: 'center', marginVertical: 16 },
  heroTitle: { fontSize: 28, fontWeight: '800', color: T.colors.t1, marginTop: 30, marginBottom: 8 },
  heroSubtitle: { fontSize: 15, color: T.colors.t2, textAlign: 'center', lineHeight: 22, paddingHorizontal: 20 },

  section: { marginBottom: 20 },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 },
  sectionTitle: { fontSize: 14, fontWeight: '700', color: T.colors.t2, textTransform: 'uppercase', letterSpacing: 1 },

  row: { flexDirection: 'row', gap: 10, marginBottom: 10 },
  optionCard: {
    flex: 1, backgroundColor: T.colors.bg2, borderRadius: T.radii.lg,
    paddingVertical: 12, paddingHorizontal: 12,
    borderWidth: 1, borderColor: T.colors.b1,
    alignItems: 'center', justifyContent: 'center',
  },
  optionCardActive: {
    backgroundColor: T.colors.forgeDim,
    borderColor: T.colors.forge,
  },
  optionText: { fontSize: 14, fontWeight: '600', color: T.colors.t2, textAlign: 'center' },
  optionTextActive: { color: T.colors.forge },

  textarea: {
    backgroundColor: T.colors.bg2,
    borderRadius: T.radii.lg,
    borderWidth: 1,
    borderColor: T.colors.b1,
    padding: 12,
    fontSize: 15,
    color: T.colors.t1,
    minHeight: 150,
  },
  footer: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    backgroundColor: T.colors.bg1,
    padding: T.spacing.page, paddingBottom: 40,
    borderTopWidth: 0.5, borderTopColor: T.colors.b1,
    shadowColor: '#000', shadowOffset: { width: 0, height: -4 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 10,
  }
});
