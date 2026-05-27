import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, Modal, SafeAreaView, StyleSheet } from 'react-native';
import { ChevronLeft, Plus, X } from 'lucide-react-native';
import { WeeklyCalendar } from '../../../../features/planner/components/WeeklyCalendar';
import { ForgeButton } from '../../../../components/forge/ForgeButton';
import { ExerciseLibrary } from '../../../../features/planner/components/ExerciseLibrary';
import { GeneratedPlan } from '../../../../services/GeneratorEngine';

export function PlanGeneratorPreview({
  T, s, plan, setPlan, weekDays, activeDayIdx, setActiveDayIdx,
  showPicker, setShowPicker, isSaving, handleAddExercise,
  handleRemoveExercise, handleSaveToDatabase
}: any) {
  if (!plan) return null;

  const currentDayName = weekDays[activeDayIdx].dayName;
  const currentDayPlan = plan.workoutWeek.find((d: any) => d.day === currentDayName);
  const isRest = !currentDayPlan || currentDayPlan.exercises.length === 0;

  return (
    <View style={s.container}>
      <View style={[s.header, { paddingBottom: 8 }]}>
        <TouchableOpacity onPress={() => setPlan(null)} style={s.backBtn}>
          <ChevronLeft color={T.colors.t1} size={24} />
        </TouchableOpacity>
        <Text style={s.headerTitle}>Review Schedule</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={{ paddingHorizontal: 16, paddingTop: 16, backgroundColor: T.colors.bg0 }}>
        <WeeklyCalendar
          days={weekDays}
          activeDayIdx={activeDayIdx}
          onSelectDay={setActiveDayIdx}
        />
      </View>

      <ScrollView style={s.scroll} contentContainerStyle={{ padding: 16, paddingBottom: 120 }}>
        <View style={{ marginBottom: 20 }}>
          <Text style={{ fontSize: 20, fontWeight: '800', color: T.colors.t1 }}>
            {currentDayName}
          </Text>
          <Text style={{ fontSize: 14, color: T.colors.forge, fontWeight: '700', marginTop: 4 }}>
            {currentDayPlan?.focus || 'Active Recovery / Rest'}
          </Text>
        </View>

        {isRest ? (
          <View style={s.emptyState}>
            <Text style={s.emptyText}>Rest day! Enjoy your recovery.</Text>
          </View>
        ) : (
          currentDayPlan.exercises.map((ex: any, i: number) => (
            <View key={i} style={s.exCard}>
              <View style={s.exIconWrap}>
                <Text style={s.exInitial}>{ex.name.substring(0, 3).toUpperCase()}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={s.exName}>{ex.name}</Text>
                <Text style={s.exMeta}>{ex.sets} Sets • {ex.reps}</Text>
              </View>
              <TouchableOpacity onPress={() => handleRemoveExercise(i)} style={{ padding: 8 }}>
                <X size={18} color={T.colors.t3} />
              </TouchableOpacity>
            </View>
          ))
        )}

        <TouchableOpacity style={s.addBtn} onPress={() => setShowPicker(true)}>
          <Plus size={20} color={T.colors.forge} />
          <Text style={s.addBtnText}>Add Exercise</Text>
        </TouchableOpacity>
      </ScrollView>

      <View style={s.footer}>
        <ForgeButton
          label="Apply to Planner"
          onPress={handleSaveToDatabase}
          loading={isSaving}
          pulse
        />
      </View>

      {/* Exercise Picker Modal */}
      <Modal visible={showPicker} animationType="slide" presentationStyle="pageSheet" onRequestClose={() => setShowPicker(false)}>
        <SafeAreaView style={{ flex: 1, backgroundColor: T.colors.bg0 }}>
          <View style={[s.header, { paddingTop: 16 }]}>
            <TouchableOpacity onPress={() => setShowPicker(false)} style={s.iconBtn}>
              <X size={24} color={T.colors.t1} />
            </TouchableOpacity>
            <Text style={s.headerTitle}>Select Exercise</Text>
            <View style={{ width: 40 }} />
          </View>
          <ExerciseLibrary exercises={[]} isLoading={false} onSelect={handleAddExercise} />
        </SafeAreaView>
      </Modal>
    </View>
  );
}
