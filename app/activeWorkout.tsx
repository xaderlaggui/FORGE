import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, Alert, ActivityIndicator } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Check, Clock } from 'lucide-react-native';
import { useWorkouts } from '../hooks/useWorkouts';
import dayjs from 'dayjs';

export default function ActiveWorkoutScreen() {
  const router = useRouter();
  const { id, date } = useLocalSearchParams();
  const { workouts, saveWorkout } = useWorkouts();
  
  const [timer, setTimer] = useState(0);
  const [isResting, setIsResting] = useState(false);
  const [restTime, setRestTime] = useState(60);
  const [workoutTitle, setWorkoutTitle] = useState('CUSTOM WORKOUT');
  
  // Track exercises state
  const [exercises, setExercises] = useState<any[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (!isLoaded) {
      if (id) {
        const existing = workouts.find(w => w.id === id);
        if (existing) {
          setWorkoutTitle(existing.notes || 'SCHEDULED ROUTINE');
          // Map to local UI state
          setExercises(existing.exercises.map(ex => ({
            name: ex.name,
            sets: ex.sets.map((s, idx) => ({ id: idx, weight: s.weight.toString(), reps: s.reps.toString(), done: false }))
          })));
        }
      } else {
        // Blank Template
        setExercises([
          { name: 'Add Exercise...', sets: [{ id: 1, weight: '0', reps: '0', done: false }] }
        ]);
      }
      setIsLoaded(true);
    }
  }, [id, workouts, isLoaded]);

  useEffect(() => {
    let interval: any;
    if (isResting && restTime > 0) {
      interval = setInterval(() => setRestTime(t => t - 1), 1000);
    } else if (isResting && restTime === 0) {
      setIsResting(false);
      Alert.alert("Rest Complete", "Back to work!");
      setRestTime(60);
    }
    return () => clearInterval(interval);
  }, [isResting, restTime]);

  const toggleSet = (exIdx: number, setIdx: number) => {
    const newExercises = [...exercises];
    const isDone = newExercises[exIdx].sets[setIdx].done;
    newExercises[exIdx].sets[setIdx].done = !isDone;
    setExercises(newExercises);
    
    if (!isDone && !isResting) {
      setIsResting(true);
      setRestTime(60);
    }
  };

  const finishWorkout = async () => {
    try {
      await saveWorkout({
        id: id ? (id as string) : `workout_${Date.now()}`,
        date: date ? (date as string) : dayjs().format('YYYY-MM-DD'),
        exercises: exercises.map(ex => ({
          exerciseId: 'custom',
          name: ex.name,
          sets: ex.sets.filter((s: any) => s.done).map((s: any) => ({ weight: Number(s.weight), reps: Number(s.reps) }))
        })),
        durationMin: Math.floor(timer / 60),
        calories: 300, // mock calculation
        notes: workoutTitle
      });
      Alert.alert("Great Job!", "Workout saved to your history.");
      router.back();
    } catch (e) {
      Alert.alert("Error", "Failed to save workout");
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.subtitle}>CURRENT WORKOUT</Text>
          <Text style={styles.title}>{workoutTitle}</Text>
        </View>
        <Text style={styles.timer}>{Math.floor(timer / 60)}:{(timer % 60).toString().padStart(2, '0')}</Text>
      </View>

      {isResting && (
        <View style={styles.restTimerContainer}>
          <View style={styles.restBanner}>
            <Clock size={20} color="#D2FF00" />
            <Text style={styles.restText}>00:{restTime.toString().padStart(2, '0')}</Text>
          </View>
          <TouchableOpacity onPress={() => setIsResting(false)} style={styles.skipButton}>
            <Text style={styles.skipText}>SKIP</Text>
          </TouchableOpacity>
        </View>
      )}

      <ScrollView contentContainerStyle={styles.content}>
        {exercises.map((ex, exIdx) => (
          <View key={exIdx} style={styles.exerciseCard}>
            <Text style={styles.exName}>{ex.name.toUpperCase()}</Text>
            
            <View style={styles.tableHeader}>
              <Text style={styles.colSet}>SET</Text>
              <Text style={styles.colKg}>LBS</Text>
              <Text style={styles.colReps}>REPS</Text>
              <Text style={styles.colCheck}>DONE</Text>
            </View>

            {ex.sets.map((set, setIdx) => (
              <View key={setIdx} style={[styles.row, set.done && styles.rowDone]}>
                <Text style={styles.colSetValue}>{setIdx + 1}</Text>
                <TextInput style={[styles.input, styles.colKgValue]} keyboardType="numeric" defaultValue={set.weight} />
                <TextInput style={[styles.input, styles.colRepsValue]} keyboardType="numeric" defaultValue={set.reps} />
                <View style={styles.colCheckValue}>
                  <TouchableOpacity 
                    style={[styles.checkBtn, set.done && styles.checkBtnDone]} 
                    onPress={() => toggleSet(exIdx, setIdx)}
                  >
                    <Check size={16} color={set.done ? '#000' : 'transparent'} strokeWidth={4} />
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        ))}
      </ScrollView>

      <TouchableOpacity style={styles.finishBtn} onPress={finishWorkout}>
        <Text style={styles.finishText}>FINISH WORKOUT</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0C0C0E', paddingTop: 48 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 24, paddingBottom: 16 },
  subtitle: { color: '#8A8A93', fontSize: 12, fontWeight: '800', letterSpacing: 1, marginBottom: 4 },
  title: { fontSize: 24, fontWeight: '900', color: '#FFF', letterSpacing: -0.5 },
  timer: { fontSize: 24, fontWeight: '900', color: '#D2FF00' },
  
  restTimerContainer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginHorizontal: 24, marginBottom: 16, backgroundColor: '#16161A', padding: 16, borderRadius: 16, borderWidth: 1, borderColor: '#242429' },
  restBanner: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  restText: { color: '#FFF', fontWeight: '900', fontSize: 24, letterSpacing: 1 },
  skipButton: { backgroundColor: '#242429', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 8 },
  skipText: { color: '#FFF', fontWeight: '800', fontSize: 12, letterSpacing: 1 },

  content: { padding: 24 },
  exerciseCard: { backgroundColor: '#16161A', borderRadius: 16, marginBottom: 24, borderWidth: 1, borderColor: '#242429', overflow: 'hidden' },
  exName: { fontSize: 18, fontWeight: '900', color: '#FFF', padding: 20, letterSpacing: 0.5 },
  
  tableHeader: { flexDirection: 'row', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#242429', backgroundColor: 'rgba(12, 12, 14, 0.5)' },
  colSet: { flex: 1, fontSize: 10, fontWeight: '800', color: '#8A8A93', textAlign: 'center', letterSpacing: 1 },
  colKg: { flex: 2, fontSize: 10, fontWeight: '800', color: '#8A8A93', textAlign: 'center', letterSpacing: 1 },
  colReps: { flex: 2, fontSize: 10, fontWeight: '800', color: '#8A8A93', textAlign: 'center', letterSpacing: 1 },
  colCheck: { flex: 1, fontSize: 10, fontWeight: '800', color: '#8A8A93', textAlign: 'center', letterSpacing: 1 },
  
  row: { flexDirection: 'row', alignItems: 'center', paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: '#242429' },
  rowDone: { backgroundColor: 'rgba(210,255,0,0.05)' },
  
  colSetValue: { flex: 1, fontWeight: '800', color: '#8A8A93', textAlign: 'center', fontSize: 16 },
  colKgValue: { flex: 2, textAlign: 'center', color: '#FFF', fontWeight: '900', fontSize: 18 },
  colRepsValue: { flex: 2, textAlign: 'center', color: '#FFF', fontWeight: '900', fontSize: 18 },
  colCheckValue: { flex: 1, alignItems: 'center' },
  
  input: { backgroundColor: 'transparent', marginHorizontal: 4 },
  checkBtn: { width: 32, height: 32, backgroundColor: '#0C0C0E', borderRadius: 8, borderWidth: 1, borderColor: '#242429', alignItems: 'center', justifyContent: 'center' },
  checkBtnDone: { backgroundColor: '#D2FF00', borderColor: '#D2FF00', shadowColor: '#D2FF00', shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.4, shadowRadius: 10, elevation: 5 },

  finishBtn: { backgroundColor: '#D2FF00', margin: 24, padding: 18, borderRadius: 12, alignItems: 'center', shadowColor: '#D2FF00', shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.4, shadowRadius: 12, elevation: 6 },
  finishText: { color: '#000', fontSize: 16, fontWeight: '900', letterSpacing: 1 }
});
