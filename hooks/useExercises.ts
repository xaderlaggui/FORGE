import { useQuery } from '@tanstack/react-query';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../services/firebase';
import type { Exercise } from '../types';

export function useExercises() {
  return useQuery({
    queryKey: ['exercises'],
    queryFn: async () => {
      const snap = await getDocs(collection(db, 'exercises'));
      return snap.docs.map(doc => doc.data() as Exercise);
    },
    staleTime: 1000 * 60 * 60, // Cache for an hour
  });
}
