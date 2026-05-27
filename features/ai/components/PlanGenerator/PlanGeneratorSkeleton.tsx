import React from 'react';
import { View } from 'react-native';
import { ForgeSkeleton } from '../../../../components/forge/ForgeSkeleton';

export function PlanGeneratorSkeleton({ T }: { T: any }) {
  return (
    <View style={{ padding: 16 }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 30 }}>
        {Array.from({ length: 7 }).map((_, i) => (
          <ForgeSkeleton key={i} width={38} height={52} radius={12} />
        ))}
      </View>
      <ForgeSkeleton width={160} height={28} radius={8} style={{ marginBottom: 20 }} />
      {Array.from({ length: 4 }).map((_, i) => (
        <View key={i} style={{ backgroundColor: T.colors.bg1, borderRadius: 16, padding: 16, marginBottom: 12, borderWidth: 0.5, borderColor: T.colors.b1 }}>
          <View style={{ flexDirection: 'row', gap: 12, alignItems: 'center' }}>
            <ForgeSkeleton circle size={48} />
            <View style={{ flex: 1, gap: 8 }}>
              <ForgeSkeleton width="70%" height={16} radius={4} />
              <ForgeSkeleton width="40%" height={12} radius={4} />
            </View>
          </View>
          <View style={{ marginTop: 16, flexDirection: 'row', gap: 8 }}>
            <ForgeSkeleton width={60} height={24} radius={12} />
            <ForgeSkeleton width={60} height={24} radius={12} />
            <ForgeSkeleton width={60} height={24} radius={12} />
          </View>
        </View>
      ))}
    </View>
  );
}
