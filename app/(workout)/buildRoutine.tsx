import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';
import { X } from 'lucide-react-native';
import { useForgeTheme } from "@/hooks/useForgeTheme";
import { ExerciseLibrary, ExercisePreviewModal } from '../../features/planner/components/ExerciseLibrary';
import { useBuildRoutine } from '../../features/workout/hooks/useBuildRoutine';
import { Step1NameSplit, Step2Purpose, Step3Exercises, Step4Review } from '../../features/workout/components/RoutineBuilder/RoutineBuilderSteps';

export default function BuildRoutineScreen() {
  const { T } = useForgeTheme();
  const s = useS(T);
  const router = useRouter();

  const routineState = useBuildRoutine();
  const {
    step, showPicker, previewEx, splitExercises, dbExercises,
    setShowPicker, setPreviewEx, handleAddExercise
  } = routineState;

  return (
    <View style={s.container}>
      {/* Header */}
      <View style={s.header}>
        <TouchableOpacity onPress={() => router.back()} style={s.iconBtn}>
          <X size={24} color={T.colors.t1} />
        </TouchableOpacity>
        <Text style={s.title}>CREATE ROUTINE</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={s.content} showsVerticalScrollIndicator={false} bounces={false}>
        {/* Step dots */}
        <View style={s.stepDots}>
          {[1, 2, 3, 4].map(i => (
            <View key={i} style={[s.dot, step === i && s.dotActive, step > i && s.dotDone]} />
          ))}
        </View>

        {step === 1 && <Step1NameSplit s={s} T={T} {...routineState} />}
        {step === 2 && <Step2Purpose s={s} T={T} {...routineState} />}
        {step === 3 && <Step3Exercises s={s} T={T} {...routineState} />}
        {step === 4 && <Step4Review s={s} T={T} {...routineState} />}

      </ScrollView>

      {/* Exercise Picker Modal */}
      <Modal visible={showPicker} animationType="slide" presentationStyle="pageSheet" onRequestClose={() => setShowPicker(false)}>
        <SafeAreaView style={{ flex: 1, backgroundColor: T.colors.bg0 }}>
          <View style={[s.header, { paddingTop: 16 }]}>
            <TouchableOpacity onPress={() => setShowPicker(false)} style={s.iconBtn}>
              <X size={24} color={T.colors.t1} />
            </TouchableOpacity>
            <Text style={s.title}>SELECT EXERCISE</Text>
            <View style={{ width: 40 }} />
          </View>
          <ExerciseLibrary exercises={splitExercises} isLoading={!dbExercises} onSelect={handleAddExercise} />
        </SafeAreaView>
      </Modal>

      {/* Preview Modal */}
      <ExercisePreviewModal exercise={previewEx} onClose={() => setPreviewEx(null)} />
    </View>
  );
}

const useS = (T: any) => StyleSheet.create({
  container: { flex: 1, backgroundColor: T.colors.bg0 },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: T.spacing.page, paddingTop: 60, paddingBottom: 16,
    borderBottomWidth: 0.5, borderBottomColor: T.colors.b1, backgroundColor: T.colors.bg0,
  },
  iconBtn: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: 16, fontWeight: '800', color: T.colors.t1, letterSpacing: 1 },
  content: { padding: T.spacing.page, paddingBottom: 80 },

  stepDots: { flexDirection: 'row', justifyContent: 'center', gap: 8, marginBottom: 24 },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: T.colors.bg3 },
  dotActive: { width: 20, backgroundColor: T.colors.forge },
  dotDone: { backgroundColor: T.colors.forge },

  stepLabel: { color: T.colors.t3, fontSize: 11, fontWeight: '800', letterSpacing: 0.6, textAlign: 'center', marginBottom: 24 },
  fieldLabel: { color: T.colors.t3, fontSize: 10, fontWeight: '800', letterSpacing: 0.8, marginBottom: 8 },

  input: {
    backgroundColor: T.colors.bg1, borderWidth: 0.5, borderColor: T.colors.b1,
    borderRadius: 12, padding: 16, color: T.colors.t1, fontSize: 16, fontWeight: '600', marginBottom: 24,
  },

  splitGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginBottom: 32 },
  splitCard: {
    width: '48%', backgroundColor: T.colors.bg1, borderWidth: 0.5, borderColor: T.colors.b1,
    borderRadius: 16, padding: 16, alignItems: 'center', justifyContent: 'center', minHeight: 100,
  },
  scName: { fontSize: 14, fontWeight: '800', color: T.colors.t1, marginTop: 8, marginBottom: 2 },
  scHint: { fontSize: 10, color: T.colors.t3, textAlign: 'center' },

  // Purpose cards – compact 2-col grid
  purposeGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginBottom: 16 },
  purposeCard: {
    width: '47.5%', backgroundColor: T.colors.bg1, borderWidth: 1.5, borderColor: T.colors.b1,
    borderRadius: 16, padding: 14, position: 'relative', overflow: 'hidden',
  },
  purposeIconWrap: { width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginBottom: 10 },
  purposeLabel: { fontSize: 13, fontWeight: '800', color: T.colors.t1, letterSpacing: 0.4, marginBottom: 3 },
  purposeHint: { fontSize: 10, color: T.colors.t3, fontWeight: '600', lineHeight: 14, marginBottom: 10 },
  presetPreview: { flexDirection: 'row', gap: 5, flexWrap: 'wrap' },
  presetTag: {
    paddingHorizontal: 7, paddingVertical: 3, borderRadius: 5,
    borderWidth: 0.5, borderColor: T.colors.b1, backgroundColor: T.colors.bg2,
  },
  presetTagText: { fontSize: 10, fontWeight: '700', color: T.colors.t3 },
  activeCheck: {
    position: 'absolute', top: 10, right: 10,
    width: 18, height: 18, borderRadius: 9,
    alignItems: 'center', justifyContent: 'center',
  },
  // Selected purpose description card
  purposeDescCard: {
    borderWidth: 1, borderRadius: 12, padding: 12, marginBottom: 24,
  },
  purposeDescText: { fontSize: 12, fontWeight: '600', lineHeight: 18 },

  // Purpose banner in step 3
  purposeBanner: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    borderWidth: 1, borderRadius: 10, paddingHorizontal: 12, paddingVertical: 8,
    marginBottom: 16,
  },
  purposeBannerText: { fontSize: 12, fontWeight: '800', letterSpacing: 0.6 },

  nextBtn: { backgroundColor: T.colors.forge, padding: 16, borderRadius: 14, alignItems: 'center' },
  nextBtnText: { color: '#000', fontSize: 16, fontWeight: '800' },

  warnCard: {
    backgroundColor: T.colors.goldDim, borderWidth: 0.5, borderColor: T.colors.gold,
    borderRadius: 12, padding: 12, flexDirection: 'row', gap: 10, marginBottom: 20,
  },
  warnText: { color: T.colors.t1, fontSize: 13, lineHeight: 18, flex: 1, fontWeight: '500' },

  exItem: { backgroundColor: T.colors.bg1, borderWidth: 0.5, borderColor: T.colors.b1, borderRadius: 14, padding: 14, marginBottom: 10 },
  exItemTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 },
  exItemName: { color: T.colors.t1, fontSize: 15, fontWeight: '700', marginBottom: 2 },
  exPurposeBadge: { fontSize: 10, fontWeight: '800', letterSpacing: 0.6 },

  presetRow: { flexDirection: 'row', gap: 6 },
  presetPill: { backgroundColor: T.colors.bg2, borderWidth: 0.5, borderColor: T.colors.b1, borderRadius: 8, paddingHorizontal: 12, paddingVertical: 8 },
  presetPillOn: { backgroundColor: 'rgba(255, 92, 46, 0.08)', borderColor: T.colors.forge },
  presetPillText: { color: T.colors.t3, fontSize: 12, fontWeight: '700' },

  addExBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    borderWidth: 1, borderStyle: 'dashed', borderColor: T.colors.forge,
    borderRadius: 14, padding: 16, marginBottom: 24,
  },
  addExText: { color: T.colors.forge, fontSize: 15, fontWeight: '700' },

  navRow: { flexDirection: 'row', gap: 12 },
  navBack: { flex: 1, borderWidth: 0.5, borderColor: T.colors.b1, borderRadius: 14, padding: 16, alignItems: 'center' },
  navBackText: { color: T.colors.t2, fontSize: 15, fontWeight: '700' },
  navNext: { flex: 2, backgroundColor: T.colors.forge, borderRadius: 14, padding: 16, alignItems: 'center' },
  navNextText: { color: '#000', fontSize: 15, fontWeight: '800' },

  reviewCard: { backgroundColor: T.colors.bg1, borderWidth: 0.5, borderColor: T.colors.b1, borderRadius: 14, padding: 16 },
  rvRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 8 },
  rvBorder: { borderBottomWidth: 0.5, borderBottomColor: T.colors.b1 },
  rvName: { color: T.colors.t1, fontSize: 15, fontWeight: '600' },
  rvPreset: { color: T.colors.t3, fontSize: 13, fontWeight: '600' },

  badge: { borderRadius: 6, paddingHorizontal: 8, paddingVertical: 3 },
  badgeText: { fontSize: 10, fontWeight: '800', letterSpacing: 0.5 },

  // AI Generation empty state
  emptyExState: { alignItems: 'center', paddingVertical: 32, gap: 12 },
  aiGenBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10,
    backgroundColor: T.colors.forge, paddingVertical: 16, paddingHorizontal: 32,
    borderRadius: 14, width: '100%',
    shadowColor: T.colors.forge, shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.4, shadowRadius: 12, elevation: 8,
  },
  aiGenBtnText: { color: '#000', fontSize: 16, fontWeight: '900', letterSpacing: 0.5 },
  autoFillBtn: { paddingVertical: 12, paddingHorizontal: 24 },
  autoFillText: { color: T.colors.t3, fontSize: 14, fontWeight: '600' },
  aiLoadingWrap: { alignItems: 'center', gap: 16, paddingVertical: 20 },
  aiLoadingText: { color: T.colors.t3, fontSize: 14, fontWeight: '600', textAlign: 'center' },
});
