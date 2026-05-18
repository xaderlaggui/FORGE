import { useQuery } from '@tanstack/react-query';
import { supabase } from '../services/supabase';
import { useAuthStore } from '../stores/authStore';
import type { NutritionLog } from '../types';

/**
 * Fetches ALL nutrition logs for the current user (across all dates).
 * Used by the unified Activity History feed.
 */
export function useAllNutritionLogs() {
  const { user } = useAuthStore();

  const query = useQuery({
    queryKey: ['all-nutrition-logs', user?.uid],
    queryFn: async () => {
      if (!user?.uid) return [];
      const { data, error } = await supabase
        .from('nutrition_logs')
        .select('*')
        .eq('user_id', user.uid)
        .order('date', { ascending: false });
      if (error) throw error;
      return (data || []) as NutritionLog[];
    },
    enabled: !!user?.uid,
  });

  return {
    nutritionLogs: query.data || [],
    isLoading: query.isLoading,
  };
}
