import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { TrendingDown, TrendingUp, Minus } from 'lucide-react-native';
import { StatCardProps } from '../types';
import { useForgeTheme } from "@/hooks/useForgeTheme";

export function StatCard({ label, value, unit, delta, onPress }: StatCardProps) {
    const { T } = useForgeTheme();
    const sc = useSc(T);
  const isDown = delta !== undefined && delta < 0;
  const isUp   = delta !== undefined && delta > 0;
  return (
    <TouchableOpacity style={sc.card} onPress={onPress} activeOpacity={0.75}>
      <Text style={sc.label} maxFontSizeMultiplier={1.2}>{label}</Text>
      <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: 3, marginTop: 6 }}>
        <Text style={sc.value} maxFontSizeMultiplier={1.2}>{value}</Text>
        {unit && <Text style={sc.unit} maxFontSizeMultiplier={1.2}>{unit}</Text>}
      </View>
      {delta !== undefined && (
        <View style={[sc.badge, isDown && sc.badgeDown, isUp && sc.badgeUp]}>
          {isDown ? <TrendingDown size={10} color={T.colors.green} /> : isUp ? <TrendingUp size={10} color={T.colors.red} /> : <Minus size={10} color={T.colors.t3} />}
          <Text style={[sc.badgeText, isDown && { color: T.colors.green }, isUp && { color: T.colors.red }]} maxFontSizeMultiplier={1.2}>
            {Math.abs(delta)} lbs
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

const useSc = (T: any) => StyleSheet.create({
          card: {
            flex: 1, backgroundColor: T.colors.bg1,
            borderRadius: T.radii.lg, borderWidth: 0.5, borderColor: T.colors.b1, padding: 14,
          },
          label: { fontSize: T.typography.sizes.caption, fontWeight: '600', color: T.colors.t3, textTransform: 'uppercase', letterSpacing: 0.7 },
          value: { fontSize: 22, fontWeight: '800', color: T.colors.t1 },
          unit: { fontSize: T.typography.sizes.bodyS, color: T.colors.t2, fontWeight: '500' },
          badge: {
            flexDirection: 'row', alignItems: 'center', gap: 3, marginTop: 6,
            alignSelf: 'flex-start',
            paddingHorizontal: 7, paddingVertical: 3, borderRadius: T.radii.full,
            backgroundColor: T.colors.bg2,
          },
          badgeDown: { backgroundColor: T.colors.greenDim },
          badgeUp:   { backgroundColor: T.colors.redDim  },
          badgeText: { fontSize: T.typography.sizes.caption, fontWeight: '600', color: T.colors.t3 },
        });
