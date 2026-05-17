import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { ForgeButton } from '../../../components/forge/ForgeButton';
import { ForgeTheme as T } from '../../../constants/ForgeTheme';
import { useRoutines, RoutineTemplate } from '../../../hooks/useRoutines';
import { ForgeSkeleton } from '../../../components/forge/ForgeSkeleton';

export function RoutineList() {
  const router = useRouter();
  const { routines, isLoading } = useRoutines();

  if (isLoading) {
    return (
      <View style={s.list}>
        <ForgeSkeleton width="100%" height={80} radius={T.radii.lg} style={{ marginBottom: 12 }} />
        <ForgeSkeleton width="100%" height={80} radius={T.radii.lg} />
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={s.list} showsVerticalScrollIndicator={false}>
      <ForgeButton 
        label="+ Create Custom Routine" 
        onPress={() => router.push('/buildRoutine')} 
        style={{ marginBottom: T.spacing.px6 }}
      />

      {routines.length === 0 ? (
        <View style={s.emptyState}>
          <Text style={s.emptyText} maxFontSizeMultiplier={1.2}>
            You haven't built any custom routines yet.
          </Text>
        </View>
      ) : (
        routines.map(routine => (
          <TouchableOpacity 
            key={routine.id} 
            style={s.card}
            onPress={() => router.push({ pathname: '/activeWorkout', params: { routineId: routine.id } })}
          >
            <Text style={s.cardTitle}>{routine.name}</Text>
            <Text style={s.cardSub}>
              {routine.exercises.length} exercises • Tap to start
            </Text>
          </TouchableOpacity>
        ))
      )}
    </ScrollView>
  );
}

const s = StyleSheet.create({
  list: { padding: T.spacing.page, paddingBottom: 100 },
  card: {
    backgroundColor: T.colors.bg1, padding: T.spacing.px5,
    borderRadius: T.radii.lg, marginBottom: T.spacing.px3,
    borderWidth: 0.5, borderColor: T.colors.b1,
  },
  cardTitle: { fontSize: T.typography.sizes.h2, fontWeight: '700', color: T.colors.t1, marginBottom: 4 },
  cardSub: { fontSize: T.typography.sizes.caption, color: T.colors.t3, textTransform: 'uppercase' },
  emptyState: { padding: T.spacing.px7, alignItems: 'center' },
  emptyText: {
    textAlign: 'center', color: T.colors.t3, fontWeight: '500',
    fontSize: T.typography.sizes.bodyS, lineHeight: T.typography.sizes.bodyS * 1.5,
  },
});
