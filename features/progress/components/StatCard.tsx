import { useForgeTheme } from "@/hooks/useForgeTheme";
import { Minus, TrendingDown, TrendingUp } from 'lucide-react-native';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { StatCardProps } from '../types';

export function StatCard({ label, value, unit, delta, subText, valueColor, Icon, onPress }: StatCardProps) {
  const { T } = useForgeTheme();
  const sc = useSc(T);
  const isDown = delta !== undefined && delta < 0;
  const isUp = delta !== undefined && delta > 0;
  return (
    <TouchableOpacity style={sc.card} onPress={onPress} activeOpacity={0.75}>
      <Text style={sc.label} maxFontSizeMultiplier={1.2}>{label}</Text>
      <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: 3, marginTop: 6 }}>
        <Text style={[sc.value, valueColor ? { color: valueColor } : undefined]} maxFontSizeMultiplier={1.2}>{value}</Text>
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
      {subText !== undefined && (
        valueColor ? (
          <View style={[sc.categoryBadge, { backgroundColor: valueColor + '22', borderColor: valueColor + '55', gap: 4 }]}>
            {Icon && <Icon size={11} color={valueColor} />}
            <Text style={[sc.categoryText, { color: valueColor }]} maxFontSizeMultiplier={1.2}>{subText}</Text>
          </View>
        ) : (
          <Text style={{ fontSize: 11, color: T.colors.t3, marginTop: 6, fontWeight: '600', textAlign: 'center' }} maxFontSizeMultiplier={1.2}>
            {subText}
          </Text>
        )
      )}
    </TouchableOpacity>
  );
}

const useSc = (T: any) => StyleSheet.create({
  card: {
    flex: 1, backgroundColor: T.colors.bg1,
    borderRadius: T.radii.lg, borderWidth: 0.5, borderColor: T.colors.b1, padding: 14,
    alignItems: 'center',
  },
  label: { fontSize: T.typography.sizes.caption, fontWeight: '600', color: T.colors.t3, textTransform: 'uppercase', letterSpacing: 0.7, textAlign: 'center' },
  value: { fontSize: 22, fontWeight: '800', color: T.colors.t1 },
  unit: { fontSize: T.typography.sizes.bodyS, color: T.colors.t2, fontWeight: '500' },
  badge: {
    flexDirection: 'row', alignItems: 'center', gap: 3, marginTop: 6,
    alignSelf: 'center',
    paddingHorizontal: 7, paddingVertical: 3, borderRadius: T.radii.full,
    backgroundColor: T.colors.bg2,
  },
  badgeDown: { backgroundColor: T.colors.greenDim },
  badgeUp: { backgroundColor: T.colors.redDim },
  badgeText: { fontSize: T.typography.sizes.caption, fontWeight: '800', color: T.colors.t3 },
  categoryBadge: {
    flexDirection: 'row', alignItems: 'center', marginTop: 6,
    alignSelf: 'center',
    paddingHorizontal: 7, paddingVertical: 3, borderRadius: T.radii.full,
  },
  categoryText: { fontSize: T.typography.sizes.caption, fontWeight: '800', },
});
