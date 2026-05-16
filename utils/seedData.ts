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
    // Generate an ID based on the name (e.g., 'push-up')
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
