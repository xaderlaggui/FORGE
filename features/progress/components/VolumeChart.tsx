import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { BarChart } from 'react-native-gifted-charts';
import { TrendingDown, TrendingUp, Activity } from 'lucide-react-native';
import { useForgeTheme } from "@/hooks/useForgeTheme";

const SCREEN_W = Dimensions.get('window').width;

interface VolumeChartProps {
  volumeLineData: { value: number; label: string }[];
  currentVolume: number;
  volumeDiff: number;
  minVol: number;
  maxVol: number;
}

export function VolumeChart({
  volumeLineData, currentVolume, volumeDiff, minVol, maxVol
}: VolumeChartProps) {
    const { T } = useForgeTheme();
    const s = useS(T);
  // If there's no real data yet, don't render an empty chart
  if (volumeLineData.length === 0 || (volumeLineData.length === 1 && volumeLineData[0].label === 'No Data')) {
    return null;
  }

  // Determine delta direction
  const isUp = volumeDiff >= 0;

  return (
    <View style={s.section}>
      <Text style={s.sectionLabel} maxFontSizeMultiplier={1.2}>Progressive Overload</Text>
      
      <View style={s.chartCard}>
        <View style={s.chartHeader}>
          <View>
            <Text style={s.chartTitle} maxFontSizeMultiplier={1.2}>Total Volume</Text>
            <Text style={s.chartSub} maxFontSizeMultiplier={1.2}>{currentVolume.toLocaleString()} lbs in latest session</Text>
          </View>
          <View style={[s.deltaBadge, isUp ? s.deltaBadgeUp : s.deltaBadgeDown]}>
            {isUp ? <TrendingUp size={12} color={T.colors.forge} /> : <TrendingDown size={12} color={T.colors.t3} />}
            <Text style={[s.deltaBadgeText, isUp ? { color: T.colors.forge } : { color: T.colors.t3 }]} maxFontSizeMultiplier={1.2}>
              {isUp ? '+' : ''}{volumeDiff.toLocaleString()}
            </Text>
          </View>
        </View>
        <View style={{ marginTop: 24, alignItems: 'center' }}>
          <BarChart
            data={volumeLineData.map((d, i) => ({
              value: d.value,
              label: d.label,
              frontColor: i === volumeLineData.length - 1 ? T.colors.forge : T.colors.bg3,
              topLabelComponent: () => (
                <Text style={{ color: T.colors.t3, fontSize: 10, marginBottom: 4 }}>
                  {d.value >= 1000 ? `${(d.value / 1000).toFixed(1)}k` : d.value}
                </Text>
              ),
            }))}
            barWidth={28}
            spacing={24}
            roundedTop
            roundedBottom
            hideRules
            xAxisThickness={0}
            yAxisThickness={0}
            hideYAxisText
            xAxisLabelTextStyle={{ color: T.colors.t3, fontSize: 11, fontWeight: '600' }}
            noOfSections={3}
            maxValue={maxVol * 1.2}
            height={160}
          />
        </View>
      </View>
    </View>
  );
}

const useS = (T: any) => StyleSheet.create({
          section: { marginHorizontal: T.spacing.page, marginBottom: T.spacing.px6 },
          sectionLabel: {
            fontSize: T.typography.sizes.label, fontWeight: '600', color: T.colors.t3,
            textTransform: 'uppercase', letterSpacing: 0.7, marginBottom: T.spacing.px3,
          },
          chartCard: {
            backgroundColor: T.colors.bg1, borderRadius: T.radii.xl, borderWidth: 0.5,
            borderColor: T.colors.b1, padding: T.spacing.px4, overflow: 'hidden',
          },
          chartHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
          chartTitle: { fontSize: T.typography.sizes.body, fontWeight: '700', color: T.colors.t1, marginBottom: 2 },
          chartSub:   { fontSize: 12, color: T.colors.t3 },
          
          deltaBadge: {
            flexDirection: 'row', alignItems: 'center', gap: 4,
            paddingHorizontal: 8, paddingVertical: 4, borderRadius: T.radii.full, backgroundColor: T.colors.bg2,
            borderWidth: 0.5, borderColor: T.colors.b1
          },
          deltaBadgeUp:   { backgroundColor: T.colors.forgeDim, borderColor: 'transparent' },
          deltaBadgeDown: { backgroundColor: T.colors.bg2 },
          deltaBadgeText: { fontSize: T.typography.sizes.label, fontWeight: '700' },
        });
