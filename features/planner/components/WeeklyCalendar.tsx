import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useForgeTheme } from "@/hooks/useForgeTheme";

interface WeeklyCalendarProps {
  days: { label: string; date: number; fullDate: string }[];
  activeDayIdx: number;
  onSelectDay: (idx: number) => void;
}

export function WeeklyCalendar({ days, activeDayIdx, onSelectDay }: WeeklyCalendarProps) {
  const { T } = useForgeTheme();
  const s = useS(T);

  return (
    <ScrollView 
      horizontal 
      showsHorizontalScrollIndicator={false} 
      style={s.scrollView}
      contentContainerStyle={s.contentContainer}
    >
      {days.map((day, idx) => {
        const isActive = idx === activeDayIdx;
        return (
          <TouchableOpacity
            key={idx}
            onPress={() => onSelectDay(idx)}
            style={[s.dayCard, isActive && s.dayCardActive]}
            activeOpacity={0.7}
          >
            <Text style={[s.dayLabel, isActive && s.dayLabelActive]} maxFontSizeMultiplier={1.2}>
              {day.label}
            </Text>
            {/* Optional day number can go here if day.date is provided */}
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}

const useS = (T: any) => StyleSheet.create({
  scrollView: {
    marginBottom: T.spacing.px6,
  },
  contentContainer: {
    paddingHorizontal: T.spacing.page,
    gap: 8,
  },
  dayCard: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: T.radii.lg,
    backgroundColor: T.colors.bg1,
    borderWidth: 0.5,
    borderColor: T.colors.b1,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 64,
  },
  dayCardActive: {
    backgroundColor: T.colors.forge,
    borderColor: T.colors.forge,
  },
  dayLabel: {
    fontSize: T.typography.sizes.bodyS,
    color: T.colors.t3,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  dayLabelActive: {
    color: '#FFF',
    fontWeight: '800',
  },
});
