import { doc, setDoc } from 'firebase/firestore';
import { db } from '../services/firebase';
import type { Exercise } from '../types';

const SAMPLE_EXERCISES: Omit<Exercise, 'id'>[] = [
  {
    name: 'Push-up',
    category: 'chest',
    muscleGroups: ['chest', 'triceps', 'shoulders'],
    equipment: 'bodyweight',
    difficulty: 'beginner',
    instructions: ['Start in a plank position', 'Lower your body', 'Push back up'],
  },
  {
    name: 'Barbell Squat',
    category: 'legs',
    muscleGroups: ['quads', 'glutes', 'hamstrings'],
    equipment: 'barbell',
    difficulty: 'intermediate',
    instructions: ['Rest bar on upper back', 'Squat down until thighs are parallel to floor', 'Drive back up'],
  },
  {
    name: 'Bench Press',
    category: 'chest',
    muscleGroups: ['chest', 'triceps', 'shoulders'],
    equipment: 'barbell',
    difficulty: 'intermediate',
    instructions: ['Lie on bench', 'Lower bar to chest', 'Press bar up'],
  },
  {
    name: 'Pull-up',
    category: 'back',
    muscleGroups: ['lats', 'biceps', 'upper_back'],
    equipment: 'pull_up_bar',
    difficulty: 'intermediate',
    instructions: ['Hang from bar', 'Pull chin over bar', 'Lower under control'],
  },
  {
    name: 'Dumbbell Curl',
    category: 'arms',
    muscleGroups: ['biceps'],
    equipment: 'dumbbell',
    difficulty: 'beginner',
    instructions: ['Hold dumbbells at sides', 'Curl weights up', 'Lower slowly'],
  },
  {
    name: 'Plank',
    category: 'core',
    muscleGroups: ['abs', 'obliques'],
    equipment: 'bodyweight',
    difficulty: 'beginner',
    instructions: ['Rest on forearms and toes', 'Keep body straight', 'Hold position'],
  }
];

export async function seedExercises() {
  let count = 0;
  for (const ex of SAMPLE_EXERCISES) {
    const id = ex.name.toLowerCase().replace(/[^a-z0-9]/g, '-');
    const docRef = doc(db, 'exercises', id);
    
    await setDoc(docRef, {
      ...ex,
      id
    });
    count++;
  }
  return count;
}

export async function seedMockUser(uid: string) {
  if (!uid) return;
  const userRef = doc(db, 'users', uid);
  await setDoc(userRef, {
    displayName: 'Mock Athlete',
    weight: 186,
    bmi: 24.5,
    streak: 14,
    weightHistory: [
      { value: 195, date: 'May 1' },
      { value: 193, date: 'May 8' },
      { value: 191, date: 'May 10' },
      { value: 190, date: 'May 15' },
      { value: 188, date: 'May 20' },
      { value: 186, date: 'May 29' },
    ],
    measurements: [
      { chest: 41.5, waist: 33.0, arms: 15.2, legs: 24.8 }
    ],
    progressPhotos: [
      { url: 'https://images.unsplash.com/photo-1507398941214-572c25f4b1dc?auto=format&fit=crop&w=800&q=80', date: '2026-01-01' },
      { url: 'https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?auto=format&fit=crop&w=800&q=80', date: new Date().toISOString() },
    ]
  }, { merge: true });

  // Add a sample recent workout
  const workoutRef = doc(db, `users/${uid}/workouts/mock_workout_1`);
  await setDoc(workoutRef, {
    id: 'mock_workout_1',
    date: new Date().toISOString().split('T')[0], // Today
    notes: 'Heavy Push Day',
    exercises: [
      {
        exerciseId: 'bench-press',
        name: 'Bench Press',
        muscleGroups: ['chest', 'triceps'],
        sets: [
          { id: '1', weight: 225, reps: 5, completed: true },
          { id: '2', weight: 225, reps: 5, completed: true },
        ]
      }
    ]
  });
}
