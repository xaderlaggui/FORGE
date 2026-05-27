import { useForgeTheme } from "@/hooks/useForgeTheme";
import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import { ScrollView, Text, View } from 'react-native';

export default function RoutinePreviewScreen() {
  const { title, exercises } = useLocalSearchParams();
  const router = useRouter();
  const { T } = useForgeTheme();

  const parsedExercises = exercises ? JSON.parse(exercises as string) : [];

  return (
    <View style={{ flex: 1, backgroundColor: T.colors.bg0 }}>
      <View style={{
        paddingHorizontal: 20,
        paddingTop: 20,
        paddingBottom: 24,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottomWidth: 0.5,
        borderBottomColor: T.colors.b1
      }}>
        <Text style={{ fontSize: 23, fontWeight: '800', color: T.colors.t1, flex: 1 }}>{title}</Text>
      </View>
      <ScrollView contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 50, paddingBottom: 0 }} showsVerticalScrollIndicator={false}>
        <Text style={{ fontSize: 12, color: T.colors.t3, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 20 }}>
          Exercise List ({parsedExercises.length})
        </Text>
        {parsedExercises.map((ex: any, idx: number) => (
          <View key={idx} style={{
            flexDirection: 'row',
            alignItems: 'center',
            padding: 16,
            backgroundColor: T.colors.bg1,
            borderRadius: 12,
            marginBottom: 10,
            borderWidth: 0.5,
            borderColor: T.colors.b1,
            ...T.shadows.lift
          }}>
            <View style={{ width: 28, height: 28, borderRadius: 14, backgroundColor: T.colors.forgeDim, alignItems: 'center', justifyContent: 'center', marginRight: 12 }}>
              <Text style={{ fontSize: 13, fontWeight: '800', color: T.colors.forge }}>{idx + 1}</Text>
            </View>
            <Text style={{ fontSize: 16, fontWeight: '700', color: T.colors.t1, flex: 1 }}>{ex.name || ex.exerciseName}</Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

