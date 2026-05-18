import React, { useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { ChevronLeft, ChevronRight } from 'lucide-react-native';
import dayjs from 'dayjs';
import { useWorkouts } from '../hooks/useWorkouts';
import { BearMascot } from '../components/forge/BearMascot';
import { useForgeTheme } from "@/hooks/useForgeTheme";
import { Activity, Dumbbell } from 'lucide-react-native';

export default function WorkoutHistoryScreen() {
  const { T } = useForgeTheme();
  const s = useS(T);
  const router = useRouter();
  const { workouts } = useWorkouts();

  const sortedWorkouts = useMemo(() => {
    return [...workouts].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [workouts]);

  const getVolume = (workout: any) => {
    let vol = 0;
    workout.exercises?.forEach((ex: any) => {
      ex.sets?.forEach((s: any) => { vol += (s.weight || 0) * (s.reps || 0); });
    });
    return vol;
  };

  const isCardio = (w: any) => w.type === 'run' || w.type === 'walk' || w.type === 'cardio';

  return (
    <View style={s.container}>
      {/* Header */}
      <View style={s.header}>
        <TouchableOpacity style={s.backBtn} onPress={() => router.back()}>
          <ChevronLeft size={22} color={T.colors.t1} />
        </TouchableOpacity>
        <View>
          <Text style={s.headerSub}>Activity</Text>
          <Text style={s.headerTitle}>Workout History</Text>
        </View>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>
        {sortedWorkouts.length === 0 ? (
          <View style={s.emptyState}>
            <BearMascot variant="THINKING" size="xl" animate style={{ marginBottom: 20 }} />
            <Text style={s.emptyTitle}>No workouts yet</Text>
            <Text style={s.emptySub}>Complete a workout to see it here.</Text>
          </View>
        ) : (
          sortedWorkouts.map((session, idx) => {
            const vol = getVolume(session);
            const cardio = isCardio(session);
            return (
              <TouchableOpacity
                key={session.id || idx}
                style={s.card}
                activeOpacity={0.75}
                onPress={() => router.push({ pathname: '/workoutDetail', params: { id: session.id } })}
              >
                {/* Left icon */}
                <View style={s.iconWrap}>
                  {cardio
                    ? <Activity size={20} color={T.colors.forge} />
                    : <Dumbbell size={20} color={T.colors.forge} />
                  }
                </View>

                {/* Content */}
                <View style={s.cardBody}>
                  <Text style={s.cardTitle} numberOfLines={1}>
                    {session.notes || (cardio ? 'Cardio Session' : 'Strength Workout')}
                  </Text>
                  <Text style={s.cardDate}>
                    {dayjs(session.date).format('ddd, MMM D YYYY')}
                  </Text>
                  <View style={s.pillRow}>
                    <View style={s.pill}>
                      <Text style={s.pillText}>{session.durationMin ?? 0} min</Text>
                    </View>
                    {cardio
                      ? <View style={s.pill}><Text style={s.pillText}>{session.distanceKm || 0} km</Text></View>
                      : vol > 0
                        ? <View style={s.pill}><Text style={s.pillText}>{vol.toLocaleString()} lbs</Text></View>
                        : null
                    }
                    {(session.exercises?.length ?? 0) > 0 && !cardio && (
                      <View style={s.pill}>
                        <Text style={s.pillText}>{session.exercises!.length} exercises</Text>
                      </View>
                    )}
                  </View>
                </View>

                {/* Chevron */}
                <ChevronRight size={18} color={T.colors.t3} />
              </TouchableOpacity>
            );
          })
        )}
      </ScrollView>
    </View>
  );
}

const useS = (T: any) => StyleSheet.create({
  container: { flex: 1, backgroundColor: T.colors.bg0 },

  header: {
    flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between',
    paddingTop: 60, paddingBottom: 16, paddingHorizontal: T.spacing.page,
    backgroundColor: T.colors.bg0, borderBottomWidth: 0.5, borderBottomColor: T.colors.b1,
  },
  backBtn: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: T.colors.bg2, alignItems: 'center', justifyContent: 'center',
  },
  headerSub: { fontSize: 12, fontWeight: '500', color: T.colors.t3, marginBottom: 2 },
  headerTitle: { fontSize: 24, fontWeight: '800', color: T.colors.t1 },

  content: { padding: T.spacing.page, paddingBottom: 60 },

  emptyState: { alignItems: 'center', marginTop: 60, paddingHorizontal: 24 },
  emptyTitle: { fontSize: 20, fontWeight: '800', color: T.colors.t1, marginBottom: 8 },
  emptySub: { fontSize: 14, color: T.colors.t3, textAlign: 'center' },

  card: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: T.colors.bg1, borderRadius: T.radii.xl,
    borderWidth: 0.5, borderColor: T.colors.b1,
    padding: 16, marginBottom: 12,
    gap: 14,
  },
  iconWrap: {
    width: 44, height: 44, borderRadius: 22,
    backgroundColor: T.colors.forgeDim,
    alignItems: 'center', justifyContent: 'center',
    flexShrink: 0,
  },
  cardBody: { flex: 1 },
  cardTitle: { fontSize: 15, fontWeight: '700', color: T.colors.t1, marginBottom: 3 },
  cardDate: { fontSize: 12, fontWeight: '500', color: T.colors.t3, marginBottom: 8 },
  pillRow: { flexDirection: 'row', gap: 6, flexWrap: 'wrap' },
  pill: {
    backgroundColor: T.colors.bg2, borderRadius: T.radii.full,
    paddingHorizontal: 8, paddingVertical: 3,
    borderWidth: 0.5, borderColor: T.colors.b1,
  },
  pillText: { fontSize: 11, fontWeight: '600', color: T.colors.t2 },
});
