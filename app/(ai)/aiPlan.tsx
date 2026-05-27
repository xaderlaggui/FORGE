import React from 'react';
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { AlertTriangle, Apple, Target } from 'lucide-react-native';
import { useForgeTheme } from '@/hooks/useForgeTheme';
import { ForgeButton } from '../../components/forge/ForgeButton';
import { MealGeneratorSkeleton } from '../../features/ai/components/AIPlan/MealGeneratorSkeleton';
import { PlanPreview } from '../../features/ai/components/AIPlan/PlanPreview';
import { useAIPlan } from '../../features/ai/hooks/useAIPlan';

export default function AIPlanScreen() {
  const { T } = useForgeTheme();
  const s = useStyles(T);

  const {
    selectedGoals, selectedDiets, allergies,
    generating, plan, applying, savingDraft,
    setAllergies, toggleGoal, toggleDiet,
    handleGenerate, handleApply, handleSaveDraft
  } = useAIPlan();

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

