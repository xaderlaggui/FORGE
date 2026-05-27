import React from 'react';
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Activity, AlertTriangle, CalendarDays, Target } from 'lucide-react-native';
import { useForgeTheme } from "@/hooks/useForgeTheme";
import { ForgeButton } from '../../components/forge/ForgeButton';
import { PlanGeneratorSkeleton } from '../../features/ai/components/PlanGenerator/PlanGeneratorSkeleton';
import { PlanGeneratorPreview } from '../../features/ai/components/PlanGenerator/PlanGeneratorPreview';
import { usePlanGenerator } from '../../features/ai/hooks/usePlanGenerator';

export default function PlanGeneratorScreen() {
  const { T } = useForgeTheme();
  const s = useS(T);

  const {
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
  } = usePlanGenerator();

  const renderOption = (label: string, isSelected: boolean, onPress: () => void) => (
    <TouchableOpacity
      style={[s.optionCard, isSelected && s.optionCardActive]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Text style={[s.optionText, isSelected && s.optionTextActive]}>{label}</Text>
    </TouchableOpacity>
  );

  if (plan) {
    return (
      <PlanGeneratorPreview
        T={T} s={s} plan={plan} setPlan={setPlan} weekDays={weekDays}
        activeDayIdx={activeDayIdx} setActiveDayIdx={setActiveDayIdx}
        showPicker={showPicker} setShowPicker={setShowPicker} isSaving={isSaving}
        handleAddExercise={handleAddExercise} handleRemoveExercise={handleRemoveExercise}
        handleSaveToDatabase={handleSaveToDatabase}
      />
    );
  }

  return (
    <View style={s.container}>
      <ScrollView style={s.scroll} contentContainerStyle={s.content} bounces={false}>
        {isGenerating ? (
          <PlanGeneratorSkeleton T={T} />
        ) : (
          <>
            <View style={s.hero}>
              <Text style={s.heroTitle}>Build Your Routine</Text>
              <Text style={s.heroSubtitle}>Let the AI pick specific exercises from the library tailored to your goals.</Text>
            </View>

            <View style={s.section}>
              <View style={s.sectionHeader}>
                <Target size={18} color={T.colors.t2} />
                <Text style={s.sectionTitle}>Primary Goal</Text>
              </View>
              <View style={s.row}>
                {renderOption('Shred Fat', goal === 'cut', () => setGoal('cut'))}
                {renderOption('Recomp', goal === 'maintain', () => setGoal('maintain'))}
                {renderOption('Build Muscle', goal === 'bulk', () => setGoal('bulk'))}
              </View>
            </View>

            <View style={s.section}>
              <View style={s.sectionHeader}>
                <Activity size={18} color={T.colors.t2} />
                <Text style={s.sectionTitle}>Daily Activity Level</Text>
              </View>
              <View style={s.row}>
                {renderOption('Desk Job', activity === 'sedentary', () => setActivity('sedentary'))}
                {renderOption('Light Activity', activity === 'light', () => setActivity('light'))}
              </View>
              <View style={s.row}>
                {renderOption('Active', activity === 'active', () => setActivity('active'))}
                {renderOption('Very Active', activity === 'very_active', () => setActivity('very_active'))}
              </View>
            </View>

            <View style={s.section}>
              <View style={s.sectionHeader}>
                <CalendarDays size={18} color={T.colors.t2} />
                <Text style={s.sectionTitle}>Training Frequency</Text>
              </View>
              <View style={s.freqRow}>
                {[3, 4, 5, 6].map(num => (
                  <TouchableOpacity
                    key={num}
                    style={[s.freqCircle, days === num && s.freqCircleActive]}
                    onPress={() => setDays(num as any)}
                  >
                    <Text style={[s.freqText, days === num && s.freqTextActive]}>{num}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={s.section}>
              <View style={s.sectionHeader}>
                <AlertTriangle size={18} color={T.colors.t2} />
                <Text style={s.sectionTitle}>Injuries or Limitations (Optional)</Text>
              </View>
              <TextInput
                style={s.textarea}
                value={injuries}
                onChangeText={setInjuries}
                placeholder="e.g. bad lower back, shoulder impingement..."
                placeholderTextColor={T.colors.t3}
                multiline
                numberOfLines={3}
                textAlignVertical="top"
              />
            </View>
          </>
        )}
      </ScrollView>

      <View style={s.footer}>
        <ForgeButton
          label="Generate AI Routine"
          onPress={handleGenerate}
          loading={isGenerating}
          pulse
        />
      </View>
    </View>
  );
}

const useS = (T: any) => StyleSheet.create({
  container: { flex: 1, backgroundColor: T.colors.bg0 },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingTop: 50, paddingBottom: 10, paddingHorizontal: T.spacing.page,
    backgroundColor: T.colors.bg1,
    borderBottomWidth: 0.5, borderBottomColor: T.colors.b1,
  },
  backBtn: { padding: 4, marginLeft: -4 },
  iconBtn: { padding: 8, marginLeft: -8 },
  headerTitle: { fontSize: T.typography.sizes.h3, fontWeight: '700', color: T.colors.t1 },

  scroll: { flex: 1 },
  content: { padding: T.spacing.page, paddingBottom: 100 },

  hero: { alignItems: 'center', marginVertical: 16 },
  heroTitle: { fontSize: 28, fontWeight: '800', color: T.colors.t1, marginTop: 30, marginBottom: 8 },
  heroSubtitle: { fontSize: 15, color: T.colors.t2, textAlign: 'center', lineHeight: 22, paddingHorizontal: 20 },

  section: { marginBottom: 20 },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 },
  sectionTitle: { fontSize: 14, fontWeight: '700', color: T.colors.t2, textTransform: 'uppercase', letterSpacing: 1 },
  hintText: { fontSize: 13, color: T.colors.t3, marginBottom: 16 },

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

  freqRow: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 20 },
  freqCircle: {
    width: 50, height: 50, borderRadius: 25,
    backgroundColor: T.colors.bg2, borderWidth: 1, borderColor: T.colors.b1,
    alignItems: 'center', justifyContent: 'center'
  },
  freqCircleActive: {
    backgroundColor: T.colors.forge,
    borderColor: T.colors.forge,
  },
  freqText: { fontSize: 24, fontWeight: '700', color: T.colors.t2 },
  freqTextActive: { color: '#000000' },

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
  },

  // Preview Styles
  exCard: {
    backgroundColor: T.colors.bg1, ...T.shadows.lift, borderRadius: 16,
    padding: 16, borderWidth: 0.5, borderColor: T.colors.b1,
    flexDirection: 'row', alignItems: 'center', gap: 14,
    marginBottom: 12,
  },
  exIconWrap: {
    width: 44, height: 44, borderRadius: 10,
    backgroundColor: T.colors.forgeDim,
    alignItems: 'center', justifyContent: 'center',
  },
  exInitial: { fontSize: 11, fontWeight: '800', letterSpacing: 0.5, color: T.colors.forge },
  exName: { fontSize: 15, fontWeight: '700', color: T.colors.t1 },
  exMeta: { fontSize: 12, fontWeight: '600', color: T.colors.t3, marginTop: 4 },

  emptyState: { padding: 40, alignItems: 'center', backgroundColor: T.colors.bg2, borderRadius: 16, marginBottom: 12 },
  emptyText: { color: T.colors.t3, fontWeight: '600' },

  addBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    backgroundColor: T.colors.forgeDim, padding: 16, borderRadius: 16,
    borderWidth: 1, borderColor: 'rgba(255,92,46,0.3)', marginTop: 8
  },
  addBtnText: { fontSize: 15, fontWeight: '700', color: T.colors.forge }
});

