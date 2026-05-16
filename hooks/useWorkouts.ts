import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { collection, query, where, getDocs, setDoc, doc } from 'firebase/firestore';
import { db } from '../services/firebase';
import { useAuthStore } from '../stores/authStore';
import type { Workout } from '../types';

export function useWorkouts() {
  const { user } = useAuthStore();
  const queryClient = useQueryClient();

  const workoutsQuery = useQuery({
    queryKey: ['workouts', user?.uid],
    queryFn: async () => {
      if (!user?.uid) return [];
      const q = query(collection(db, `users/${user.uid}/workouts`));
      const snap = await getDocs(q);
      return snap.docs.map(doc => doc.data() as Workout);
    },
    enabled: !!user?.uid,
  });

  const saveWorkout = useMutation({
    mutationFn: async (workout: Workout) => {
      if (!user?.uid) return;
      const ref = doc(db, `users/${user.uid}/workouts/${workout.id}`);
      await setDoc(ref, workout, { merge: true });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workouts', user?.uid] });
    }
  });

  return {
    workouts: workoutsQuery.data || [],
    isLoading: workoutsQuery.isLoading,
    saveWorkout: saveWorkout.mutateAsync
  };
}
