import React from 'react';
import { View } from 'react-native';
import { ForgeSkeleton } from '../../../../components/forge/ForgeSkeleton';

export function MealGeneratorSkeleton({ T }: { T: any }) {
  return (
    <View style={{ paddingTop: 16 }}>
      {/* Skeleton for Coach Message */}
      <View style={{ flexDirection: 'row', backgroundColor: T.colors.bg1, borderRadius: 16, borderWidth: 1, borderColor: T.colors.b1, marginBottom: 24, overflow: 'hidden', height: 120 }}>
        <View style={{ width: 90, backgroundColor: T.colors.forgeDim, padding: 16 }} />
        <View style={{ flex: 1, padding: 16 }}>
          <ForgeSkeleton width={80} height={14} radius={4} style={{ marginBottom: 12 }} />
          <ForgeSkeleton width="90%" height={10} radius={4} style={{ marginBottom: 8 }} />
          <ForgeSkeleton width="80%" height={10} radius={4} style={{ marginBottom: 8 }} />
          <ForgeSkeleton width="95%" height={10} radius={4} />
        </View>
      </View>

      {/* Skeleton for Weekly Calendar */}
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 }}>
        {Array.from({ length: 7 }).map((_, i) => (
          <ForgeSkeleton key={i} width={38} height={52} radius={12} />
        ))}
      </View>

      {/* Skeleton for Meals */}
      {Array.from({ length: 3 }).map((_, i) => (
        <View key={i} style={{ marginBottom: 16 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
            <ForgeSkeleton width={100} height={16} radius={4} />
            <ForgeSkeleton width={60} height={16} radius={4} />
          </View>
          <View style={{ backgroundColor: T.colors.bg1, borderRadius: 16, borderWidth: 0.5, borderColor: T.colors.b1, padding: 16 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
              <View style={{ gap: 6, flex: 1 }}>
                <ForgeSkeleton width="70%" height={14} radius={4} />
                <ForgeSkeleton width="40%" height={10} radius={4} />
              </View>
              <ForgeSkeleton width={40} height={14} radius={4} />
            </View>
            <View style={{ borderTopWidth: 0.5, borderTopColor: T.colors.b0, marginTop: 12, paddingTop: 12, flexDirection: 'row', gap: 12 }}>
              <ForgeSkeleton width={40} height={12} radius={4} />
              <ForgeSkeleton width={40} height={12} radius={4} />
              <ForgeSkeleton width={40} height={12} radius={4} />
            </View>
          </View>
        </View>
      ))}
    </View>
  );
}
