import React from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import Animated from 'react-native-reanimated';
import { Camera, Share2 } from 'lucide-react-native';
import dayjs from 'dayjs';
import { useForgeTheme } from '@/hooks/useForgeTheme';
import { useStyles } from './InteractivePhotoCardStyles';
import { StickerTheme } from './InteractivePhotoCardTypes';

interface StatsPanelProps {
  workout: any;
  stickerTheme: StickerTheme;
  setStickerTheme: (theme: StickerTheme) => void;
  pickImage: () => void;
  shareImage: () => void;
  isUploading: boolean;
  animatedStatsStyle: any;
}

export function StatsPanel({
  workout,
  stickerTheme,
  setStickerTheme,
  pickImage,
  shareImage,
  isUploading,
  animatedStatsStyle,
}: StatsPanelProps) {
  const { T, isDark } = useForgeTheme();
  const styles = useStyles(T, isDark);

  return (
    <Animated.View style={[styles.statsPanel, animatedStatsStyle]}>
      <Text style={styles.workoutDate}>{dayjs(workout.date).format('dddd, MMM D, YYYY')}</Text>

      {/* Sticker Style Selector */}
      <View style={styles.selectorContainer}>
        <Text style={styles.selectorLabel}>Sticker Theme Style</Text>
        <View style={styles.selectorRow}>
          {(['white', 'dark', 'orange'] as const).map((theme) => (
            <TouchableOpacity
              key={theme}
              style={[
                styles.selectorPill,
                stickerTheme === theme && styles.selectorPillActive,
              ]}
              onPress={() => setStickerTheme(theme)}
            >
              <View
                style={[
                  styles.colorDot,
                  {
                    backgroundColor:
                      theme === 'white'
                        ? '#FFFFFF'
                        : theme === 'dark'
                          ? '#111113'
                          : '#FF5C2E',
                    borderWidth: theme === 'white' ? 0.5 : 0,
                    borderColor: '#CCCCCC',
                  },
                ]}
              />
              <Text
                style={[
                  styles.selectorPillText,
                  stickerTheme === theme && styles.selectorPillTextActive,
                ]}
              >
                {theme === 'white' ? 'White' : theme === 'dark' ? 'Slate' : 'Orange'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Premium CTA Action Buttons */}
      <View style={styles.actionRow}>
        <TouchableOpacity style={styles.actionBtnSecondary} onPress={pickImage} disabled={isUploading}>
          {isUploading ? (
            <ActivityIndicator size="small" color={T.colors.forge} />
          ) : (
            <>
              <Camera size={16} color={T.colors.forge} style={{ marginRight: 6 }} />
              <Text style={styles.btnTextSecondary}>Change Photo</Text>
            </>
          )}
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionBtnPrimary} onPress={shareImage}>
          <Share2 size={16} color="#000" style={{ marginRight: 6 }} />
          <Text style={styles.btnTextPrimary}>Share Sticker</Text>
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
}
