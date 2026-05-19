import { useEffect, useMemo } from 'react';
import { supabase } from '../services/supabase';
import { useAuthStore } from '../stores/authStore';
import { useWorkouts } from './useWorkouts';

/**
 * Calculates a smart streak that:
 * - Counts consecutive days where the user either logged a workout OR the day was a rest day.
 * - Continues across week boundaries indefinitely.
 * - Uses Manila time (UTC+8) for day boundaries.
 *
 * @param restDayIndices  0-indexed Mon–Sun (0=Mon, 6=Sun) days that are scheduled rest days.
 */
export function useStreak(restDayIndices: number[] = []) {
  const { user, setUser } = useAuthStore();
  const { workouts } = useWorkouts();

  const streak = useMemo(() => {
    // ── 1. Build a set of worked-out dates (YYYY-MM-DD) ──────────────────
    const activeDays = new Set((workouts ?? []).map((w) => w.date.slice(0, 10)));
    const restSet = new Set(restDayIndices);

    // ── 2. Helpers ────────────────────────────────────────────────────────
    const toManilaDate = (ts: number): Date => {
      const utc = ts + new Date(ts).getTimezoneOffset() * 60000;
      return new Date(utc + 3600000 * 8); // UTC+8
    };

    const formatDate = (d: Date): string => {
      const y = d.getFullYear();
      const mo = String(d.getMonth() + 1).padStart(2, '0');
      const da = String(d.getDate()).padStart(2, '0');
      return `${y}-${mo}-${da}`;
    };

    // Mon-based day index (0=Mon, 6=Sun) from a JS Date
    const toMonIdx = (d: Date): number => {
      const dow = d.getDay(); // 0=Sun
      return dow === 0 ? 6 : dow - 1;
    };

    // ── 3. Walk backwards from today ──────────────────────────────────────
    let cursor = toManilaDate(Date.now());

    // If today hasn't been worked out yet, decide whether to start counting
    // from today (rest day = still alive) or yesterday.
    const todayStr = formatDate(cursor);
    if (!activeDays.has(todayStr)) {
      if (!restSet.has(toMonIdx(cursor))) {
        // Not a rest day and not done yet — look from yesterday
        cursor.setDate(cursor.getDate() - 1);
      }
    }

    let count = 0;
    let pendingRestDays = 0; // rest days we've passed but not yet confirmed

    for (let i = 0; i < 365; i++) {
      const dateStr = formatDate(cursor);
      const isWorkoutDay = activeDays.has(dateStr);
      const isRestDay = restSet.has(toMonIdx(cursor));

      if (isWorkoutDay) {
        // Confirm any pending rest days that were bridging toward this workout
        count += 1 + pendingRestDays;
        pendingRestDays = 0;
        cursor.setDate(cursor.getDate() - 1);
      } else if (isRestDay) {
        // Tentatively hold this rest day — only confirm it if a workout follows
        pendingRestDays++;
        cursor.setDate(cursor.getDate() - 1);
      } else {
        break; // Missed a non-rest workout day → streak ends
        // Note: pendingRestDays are intentionally discarded here (trailing rest days don't count)
      }
    }

    return count;
  }, [workouts, restDayIndices]);

  // ── Persist to Supabase whenever streak changes ───────────────────────
  useEffect(() => {
    if (!user?.uid) return;
    const currentStreak = (user as any).streak ?? 0;
    if (streak === currentStreak) return;
    setUser({ ...(user as any), streak } as any);
    supabase
      .from('profiles')
      .update({ streak })
      .eq('id', user.uid)
      .then(({ error }) => {
        if (error) console.error('Streak update error:', error);
      });
  }, [streak, user?.uid]);

  return streak;
}
