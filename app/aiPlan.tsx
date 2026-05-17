import React, { useState } from 'react';
import {
  ActivityIndicator, Alert, ScrollView,
  StyleSheet, Text, TouchableOpacity, View,
} from 'react-native';
import { useRouter } from 'expo-router';
import { doc, setDoc, Timestamp } from 'firebase/firestore';
import { Dumbbell, Flame, Sparkles, ChevronDown, ChevronUp, Check } from 'lucide-react-native';
import dayjs from 'dayjs';
import { ForgeTheme as T } from '../constants/ForgeTheme';
import { useAuthStore } from '../stores/authStore';
import { generateFullPlan, GeneratedPlan, GeneratedWorkoutDay } from '../services/GeneratorEngine';
import { db } from '../services/firebase';

// ─── Workout Day Card ─────────────────────────────────────────────────────────

function WorkoutDayCard({ day }: { day: GeneratedWorkoutDay }) {
  const [expanded, setExpanded] = useState(false);
  const hasExercises = day.exercises.length > 0;

  return (
    <View style={s.card}>
      <TouchableOpacity
        style={s.cardHeader}
        onPress={() => hasExercises && setExpanded(e => !e)}
        activeOpacity={hasExercises ? 0.7 : 1}
      >
        <View style={s.dayBadge}>
          <Text style={s.dayText}>{day.day.slice(0, 3).toUpperCase()}</Text>
        </View>
        <View style={s.cardHeaderText}>
          <Text style={s.cardTitle}>{day.focus}</Text>
          {hasExercises
            ? <Text style={s.cardSub}>{day.exercises.length} exercises</Text>
            : <Text style={[s.cardSub, { color: T.colors.t3 }]}>Rest Day</Text>
          }
        </View>
        {hasExercises && (
          expanded
            ? <ChevronUp size={18} color={T.colors.t3} />
            : <ChevronDown size={18} color={T.colors.t3} />
        )}
      </TouchableOpacity>

      {expanded && hasExercises && (
        <View style={s.exerciseList}>
          {day.exercises.map((ex: GeneratedWorkoutDay['exercises'][0], i: number) => (
            <View key={i} style={s.exerciseRow}>
              <View style={s.exDot} />
              <View style={{ flex: 1 }}>
                <Text style={s.exName}>{ex.name}</Text>
                <Text style={s.exDetail}>{ex.sets} sets × {ex.reps} reps • {ex.restSec}s rest</Text>
              </View>
            </View>
          ))}
        </View>
      )}
    </View>
  );
}

// ─── Macro Row ────────────────────────────────────────────────────────────────

function MacroRow({ label, value, unit, color }: { label: string; value: number; unit: string; color: string }) {
  return (
    <View style={s.macroRow}>
      <View style={[s.macroDot, { backgroundColor: color }]} />
      <Text style={s.macroLabel}>{label}</Text>
      <Text style={[s.macroValue, { color }]}>{value}{unit}</Text>
    </View>
  );
}

// ─── Main Screen ──────────────────────────────────────────────────────────────

export default function AIPlanScreen() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [plan, setPlan] = useState<GeneratedPlan | null>(null);
  const [generating, setGenerating] = useState(false);
  const [accepting, setAccepting] = useState(false);

  const handleGenerate = async () => {
    if (!user) return;
    try {
      setGenerating(true);
      const result = await generateFullPlan({
        uid:             user.uid,
        weightKg:        (user as any).weight   ?? 70,
        heightCm:        (user as any).height   ?? 170,
        ageYears:        (user as any).age      ?? 25,
        fitnessGoal:     (user as any).fitnessGoal     ?? 'maintain',
        dietPreference:  (user as any).dietPreference  ?? 'anything',
        equipmentAccess: (user as any).equipmentAccess ?? 'full',
      });
      setPlan(result);
    } catch (e: any) {
      Alert.alert('Generation Failed', e.message);
    } finally {
      setGenerating(false);
    }
  };

  const handleAccept = async () => {
    if (!plan || !user) return;
    try {
      setAccepting(true);
      // Write the accepted plan as a special "active" document so other screens can pick it up
      await setDoc(
        doc(db, `users/${user.uid}/generatedPlans/active`),
        { ...plan, activatedAt: Timestamp.now() }
      );
      Alert.alert('Plan Activated! 🎉', 'Your personalized workout and meal plan is live.', [
        { text: 'Let\'s go!', onPress: () => router.back() }
      ]);
    } catch (e: any) {
      Alert.alert('Error', e.message);
    } finally {
      setAccepting(false);
    }
  };

  return (
    <View style={s.container}>
      {/* Header */}
      <View style={s.header}>
        <TouchableOpacity onPress={() => router.back()} style={s.backBtn}>
          <Text style={s.backText}>← Back</Text>
        </TouchableOpacity>
        <View style={s.headerTitle}>
          <Sparkles size={18} color={T.colors.forge} />
          <Text style={s.headerTitleText}>AI Plan Generator</Text>
        </View>
        <View style={{ width: 60 }} />
      </View>

      <ScrollView style={s.scroll} contentContainerStyle={s.scrollContent} showsVerticalScrollIndicator={false}>

        {/* Hero Card */}
        <View style={s.heroCard}>
          <Sparkles size={32} color={T.colors.forge} />
          <Text style={s.heroTitle}>Your Personalized Plan</Text>
          <Text style={s.heroSub}>
            Powered by the Hybrid Forge Engine — mathematically calibrated macros,
            AI-selected exercises tailored to your goal and equipment.
          </Text>
          {!plan && (
            <TouchableOpacity
              style={[s.generateBtn, generating && { opacity: 0.6 }]}
              onPress={handleGenerate}
              disabled={generating}
              activeOpacity={0.8}
            >
              {generating
                ? <ActivityIndicator color={T.colors.bg0} />
                : <Text style={s.generateBtnText}>✦ Generate My Plan</Text>
              }
            </TouchableOpacity>
          )}
          {generating && (
            <Text style={s.generatingHint}>
              Crunching your macros and curating exercises… ~15s
            </Text>
          )}
        </View>

        {plan && (
          <>
            {/* Meal Plan Summary */}
            <View style={s.section}>
              <View style={s.sectionRow}>
                <Flame size={18} color={T.colors.gold} />
                <Text style={s.sectionTitle}>Daily Nutrition Target</Text>
              </View>
              <View style={s.macroCard}>
                <View style={s.calRow}>
                  <Text style={s.calValue}>{plan.mealPlan.targetCalories}</Text>
                  <Text style={s.calUnit}>kcal / day</Text>
                </View>
                <MacroRow label="Protein" value={plan.mealPlan.targetProtein} unit="g" color={T.colors.blue} />
                <MacroRow label="Carbs"   value={plan.mealPlan.targetCarbs}   unit="g" color={T.colors.forge} />
                <MacroRow label="Fat"     value={plan.mealPlan.targetFat}     unit="g" color={T.colors.gold} />
              </View>

              <Text style={s.subsectionTitle}>Sample Day Menu</Text>
              {plan.mealPlan.meals.map((meal: GeneratedPlan['mealPlan']['meals'][0], i: number) => (
                <View key={i} style={s.mealCard}>
                  <View style={s.mealHeader}>
                    <Text style={s.mealName}>{meal.name}</Text>
                    <Text style={s.mealCal}>{meal.calories} kcal</Text>
                  </View>
                  <Text style={s.mealDesc}>{meal.description}</Text>
                  <View style={s.mealMacros}>
                    <Text style={s.mealMacro}>P {meal.protein}g</Text>
                    <Text style={s.mealMacro}>C {meal.carbs}g</Text>
                    <Text style={s.mealMacro}>F {meal.fat}g</Text>
                  </View>
                </View>
              ))}
            </View>

            {/* Workout Week */}
            <View style={s.section}>
              <View style={s.sectionRow}>
                <Dumbbell size={18} color={T.colors.forge} />
                <Text style={s.sectionTitle}>7-Day Workout Split</Text>
              </View>
              {plan.workoutWeek.map((day: GeneratedWorkoutDay, i: number) => (
                <WorkoutDayCard key={i} day={day} />
              ))}
            </View>

            {/* Accept Button */}
            <TouchableOpacity
              style={[s.acceptBtn, accepting && { opacity: 0.6 }]}
              onPress={handleAccept}
              disabled={accepting}
              activeOpacity={0.8}
            >
              {accepting
                ? <ActivityIndicator color={T.colors.bg0} />
                : <>
                    <Check size={18} color={T.colors.bg0} />
                    <Text style={s.acceptBtnText}>Activate This Plan</Text>
                  </>
              }
            </TouchableOpacity>

            <TouchableOpacity style={s.regenBtn} onPress={handleGenerate} disabled={generating}>
              <Text style={s.regenText}>↺ Regenerate</Text>
            </TouchableOpacity>

            <View style={{ height: 48 }} />
          </>
        )}
      </ScrollView>
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const s = StyleSheet.create({
  container:  { flex: 1, backgroundColor: T.colors.bg0 },
  header:     { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingTop: 56, paddingBottom: 12 },
  backBtn:    { width: 60 },
  backText:   { color: T.colors.t2, fontSize: 14 },
  headerTitle:{ flexDirection: 'row', alignItems: 'center', gap: 6 },
  headerTitleText: { color: T.colors.t1, fontSize: 16, fontWeight: '700' },

  scroll: { flex: 1 },
  scrollContent: { paddingHorizontal: 20, paddingTop: 8 },

  heroCard: {
    backgroundColor: T.colors.bg1,
    borderRadius: T.radii.xl,
    padding: 24,
    alignItems: 'center',
    marginBottom: 24,
    borderWidth: 1,
    borderColor: T.colors.b1,
    ...T.shadows.card,
  },
  heroTitle: { color: T.colors.t1, fontSize: 20, fontWeight: '800', marginTop: 12, marginBottom: 8, textAlign: 'center' },
  heroSub:   { color: T.colors.t2, fontSize: 13, textAlign: 'center', lineHeight: 20 },
  generateBtn: {
    marginTop: 20,
    backgroundColor: T.colors.forge,
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: T.radii.full,
    ...T.shadows.forge,
  },
  generateBtnText: { color: T.colors.bg0, fontWeight: '800', fontSize: 15 },
  generatingHint: { color: T.colors.t3, fontSize: 12, marginTop: 12, textAlign: 'center' },

  section: { marginBottom: 24 },
  sectionRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 14 },
  sectionTitle: { color: T.colors.t1, fontSize: 18, fontWeight: '700' },
  subsectionTitle: { color: T.colors.t2, fontSize: 13, fontWeight: '600', marginTop: 16, marginBottom: 10, letterSpacing: 1, textTransform: 'uppercase' },

  macroCard: {
    backgroundColor: T.colors.bg1,
    borderRadius: T.radii.lg,
    padding: 20,
    borderWidth: 1,
    borderColor: T.colors.b1,
  },
  calRow:    { flexDirection: 'row', alignItems: 'flex-end', gap: 4, marginBottom: 16 },
  calValue:  { color: T.colors.forge, fontSize: 42, fontWeight: '800', lineHeight: 44 },
  calUnit:   { color: T.colors.t2, fontSize: 14, paddingBottom: 6 },
  macroRow:  { flexDirection: 'row', alignItems: 'center', paddingVertical: 8, borderTopWidth: 0.5, borderTopColor: T.colors.b0 },
  macroDot:  { width: 8, height: 8, borderRadius: 4, marginRight: 10 },
  macroLabel:{ flex: 1, color: T.colors.t2, fontSize: 14 },
  macroValue:{ fontSize: 15, fontWeight: '700' },

  mealCard: {
    backgroundColor: T.colors.bg1,
    borderRadius: T.radii.lg,
    padding: 16,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: T.colors.b1,
  },
  mealHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
  mealName:   { color: T.colors.t1, fontSize: 15, fontWeight: '700' },
  mealCal:    { color: T.colors.forge, fontSize: 14, fontWeight: '600' },
  mealDesc:   { color: T.colors.t2, fontSize: 13, marginBottom: 8 },
  mealMacros: { flexDirection: 'row', gap: 12 },
  mealMacro:  { color: T.colors.t3, fontSize: 12, fontWeight: '500' },

  card: {
    backgroundColor: T.colors.bg1,
    borderRadius: T.radii.lg,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: T.colors.b1,
    overflow: 'hidden',
  },
  cardHeader: { flexDirection: 'row', alignItems: 'center', padding: 16, gap: 12 },
  dayBadge: { width: 44, height: 44, borderRadius: T.radii.sm, backgroundColor: T.colors.bg2, alignItems: 'center', justifyContent: 'center' },
  dayText:   { color: T.colors.forge, fontSize: 11, fontWeight: '800', letterSpacing: 1 },
  cardHeaderText: { flex: 1 },
  cardTitle: { color: T.colors.t1, fontSize: 14, fontWeight: '600' },
  cardSub:   { color: T.colors.t2, fontSize: 12, marginTop: 2 },
  exerciseList: { paddingHorizontal: 16, paddingBottom: 16, gap: 10 },
  exerciseRow:  { flexDirection: 'row', alignItems: 'flex-start', gap: 10 },
  exDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: T.colors.forge, marginTop: 5 },
  exName:   { color: T.colors.t1, fontSize: 14, fontWeight: '500' },
  exDetail: { color: T.colors.t3, fontSize: 12, marginTop: 2 },

  acceptBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: T.colors.forge,
    borderRadius: T.radii.md,
    paddingVertical: 16,
    marginTop: 8,
    ...T.shadows.forge,
  },
  acceptBtnText: { color: T.colors.bg0, fontSize: 16, fontWeight: '800' },

  regenBtn: { alignItems: 'center', paddingVertical: 14, marginTop: 8 },
  regenText: { color: T.colors.t3, fontSize: 14 },
});
