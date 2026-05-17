import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, Alert, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Trash2 } from 'lucide-react-native';
import { ForgeButton } from '../components/forge/ForgeButton';
import { ExercisePickerModal } from '../components/forge/ExercisePickerModal';
import { ForgeTheme as T } from '../constants/ForgeTheme';
import { useRoutines } from '../hooks/useRoutines';

export default function BuildRoutineScreen() {
  const router = useRouter();
  const { saveRoutine } = useRoutines();
  const [name, setName] = useState('');
  const [exercises, setExercises] = useState<{ exerciseId: string; name: string; sets: number; reps: number }[]>([]);
  const [pickerVisible, setPickerVisible] = useState(false);

  const handleSave = async () => {
    if (!name.trim()) return Alert.alert('Error', 'Please enter a routine name.');
    if (exercises.length === 0) return Alert.alert('Error', 'Add at least one exercise.');
    
    await saveRoutine({
      id: `routine_${Date.now()}`,
      name: name.trim(),
      exercises
    });
    
    Alert.alert('Success', 'Routine saved!');
    router.back();
  };

  return (
    <View style={s.container}>
      <View style={s.header}>
        <ForgeButton label="Cancel" variant="ghost" onPress={() => router.back()} size="sm" />
        <Text style={s.title}>Build Routine</Text>
        <ForgeButton label="Save" variant="primary" onPress={handleSave} size="sm" />
      </View>

      <ScrollView contentContainerStyle={s.content}>
        <TextInput
          style={s.input}
          placeholder="Routine Name (e.g., Pull Day Beta)"
          placeholderTextColor={T.colors.t3}
          value={name}
          onChangeText={setName}
        />

        <Text style={s.sectionTitle}>Exercises</Text>

        {exercises.map((ex, i) => (
          <View key={i} style={s.exCard}>
            <View style={{ flex: 1 }}>
              <Text style={s.exName}>{ex.name}</Text>
              <Text style={s.exMeta}>{ex.sets} sets × {ex.reps} reps</Text>
            </View>
            <TouchableOpacity onPress={() => setExercises(prev => prev.filter((_, idx) => idx !== i))}>
              <Trash2 size={20} color={T.colors.t3} />
            </TouchableOpacity>
          </View>
        ))}

        <ForgeButton 
          label="+ Add Exercise" 
          variant="secondary" 
          onPress={() => setPickerVisible(true)} 
          style={{ marginTop: 12 }}
        />
      </ScrollView>

      <ExercisePickerModal 
        visible={pickerVisible}
        onClose={() => setPickerVisible(false)}
        onSelect={(ex, preset) => {
          setExercises(prev => [
            ...prev,
            {
              exerciseId: ex.id,
              name: ex.name,
              sets: preset?.sets || 1,
              reps: preset?.reps || 10
            }
          ]);
        }}
      />
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: T.colors.bg0 },
  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: T.spacing.page, paddingTop: 60, paddingBottom: 16,
    backgroundColor: T.colors.bg1, borderBottomWidth: 0.5, borderBottomColor: T.colors.b1,
  },
  title: { fontSize: T.typography.sizes.h2, fontWeight: '700', color: T.colors.t1 },
  content: { padding: T.spacing.page },
  input: {
    backgroundColor: T.colors.bg2, borderRadius: T.radii.lg, padding: 16,
    color: T.colors.t1, fontSize: 18, fontWeight: '600', marginBottom: 32,
    borderWidth: 1, borderColor: T.colors.b1,
  },
  sectionTitle: { fontSize: T.typography.sizes.label, color: T.colors.t3, textTransform: 'uppercase', marginBottom: 12, fontWeight: '600', letterSpacing: 0.5 },
  exCard: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: T.colors.bg1,
    padding: 16, borderRadius: T.radii.md, marginBottom: 8,
    borderWidth: 0.5, borderColor: T.colors.b1,
  },
  exName: { color: T.colors.t1, fontSize: 16, fontWeight: '600', marginBottom: 4 },
  exMeta: { color: T.colors.forge, fontSize: 13, fontWeight: '700' },
});
