import React from 'react';
import { View, Text } from 'react-native';
import Animated from 'react-native-reanimated';
import Svg, { Path } from 'react-native-svg';
import { useForgeTheme } from '@/hooks/useForgeTheme';
import { formatDuration } from '../../../utils/format';
import { useStyles } from './InteractivePhotoCardStyles';
import { StickerTheme, getStickerColors } from './InteractivePhotoCardTypes';

interface LiveStickerOverlayProps {
  workout: any;
  stickerTheme: StickerTheme;
  animatedLiveStickerStyle: any;
}

export function LiveStickerOverlay({ workout, stickerTheme, animatedLiveStickerStyle }: LiveStickerOverlayProps) {
  const { T, isDark } = useForgeTheme();
  const styles = useStyles(T, isDark);
  const stickerColors = getStickerColors(stickerTheme);

  return (
    <Animated.View style={[styles.liveStickerOverlay, animatedLiveStickerStyle]}>
      {/* Header Row: Shoe Icon and Brand Wordmark */}
      <View style={styles.liveHeaderRow}>
        <View style={styles.liveShoeIcon}>
          <Svg width={24} height={15} viewBox="0 0 36 22" fill="none">
            <Path
              d="M2.5 13c0-3.5 2.5-6.5 5.5-6.5h1.5l3.5-4c1-1.2 2.8-1.5 4.2-0.7l6.8 3.7c1.5 0.8 2.5 2.4 2.5 4.1v1.9l4.5 0.5c1.7 0.2 3 1.6 3 3.3v1.2c0 1.9-1.5 3.5-3.4 3.5H7.5C4.7 20 2.5 17.8 2.5 15v-2z"
              stroke={stickerColors.shoe}
              strokeWidth={2.5}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <Path
              d="M8.5 6.5c2 0 4 1.5 5.5 3m-4.5-3c1.5 0 3 1.5 4.5 3M17 2.5l-2.5 4M19.5 4l-2.5 4m9 5H13"
              stroke={stickerColors.shoe}
              strokeWidth={2}
              strokeLinecap="round"
            />
          </Svg>
        </View>
        <Text
          style={[
            styles.liveBrandText,
            {
              color: stickerColors.brand,
              textShadowColor: stickerTheme === 'dark' ? 'rgba(255, 255, 255, 0.15)' : 'rgba(0, 0, 0, 0.35)',
            },
          ]}
        >
          TRACKED WITH FORGE
        </Text>
      </View>

      {/* Title: Activity notes or morning walk */}
      <Text
        style={[
          styles.liveNotes,
          {
            color: stickerColors.text,
            textShadowColor: stickerTheme === 'dark' ? 'rgba(255, 255, 255, 0.15)' : 'rgba(0, 0, 0, 0.4)',
          },
        ]}
      >
        {workout.notes || 'Morning Workout'}
      </Text>

      {/* Stats Area (2-column layout matching Strava layout) */}
      <View style={styles.liveGrid}>
        {/* Left Column: Distance & Steps */}
        <View style={styles.liveColumn}>
          <View style={styles.liveStatBox}>
            <Text
              style={[
                styles.liveStatLbl,
                {
                  color: stickerColors.label,
                  textShadowColor: stickerTheme === 'dark' ? 'rgba(255, 255, 255, 0.15)' : 'rgba(0, 0, 0, 0.3)',
                },
              ]}
            >
              Distance
            </Text>
            <Text
              style={[
                styles.liveStatVal,
                {
                  color: stickerColors.text,
                  textShadowColor: stickerTheme === 'dark' ? 'rgba(255, 255, 255, 0.15)' : 'rgba(0, 0, 0, 0.4)',
                },
              ]}
            >
              {workout.distanceKm || '0.00'}
            </Text>
            <Text
              style={[
                styles.liveStatUnit,
                {
                  color: stickerColors.text,
                  textShadowColor: stickerTheme === 'dark' ? 'rgba(255, 255, 255, 0.15)' : 'rgba(0, 0, 0, 0.3)',
                },
              ]}
            >
              km
            </Text>
          </View>

          {workout.steps ? (
            <View style={[styles.liveStatBox, { marginTop: 16 }]}>
              <Text
                style={[
                  styles.liveStatLbl,
                  {
                    color: stickerColors.label,
                    textShadowColor: stickerTheme === 'dark' ? 'rgba(255, 255, 255, 0.15)' : 'rgba(0, 0, 0, 0.3)',
                  },
                ]}
              >
                Steps
              </Text>
              <Text
                style={[
                  styles.liveStatVal,
                  {
                    color: stickerColors.text,
                    textShadowColor: stickerTheme === 'dark' ? 'rgba(255, 255, 255, 0.15)' : 'rgba(0, 0, 0, 0.4)',
                  },
                ]}
              >
                {Number(workout.steps).toLocaleString()}
              </Text>
            </View>
          ) : null}
        </View>

        {/* Right Column: Time */}
        <View style={styles.liveColumn}>
          <View style={styles.liveStatBox}>
            <Text
              style={[
                styles.liveStatLbl,
                {
                  color: stickerColors.label,
                  textShadowColor: stickerTheme === 'dark' ? 'rgba(255, 255, 255, 0.15)' : 'rgba(0, 0, 0, 0.3)',
                },
              ]}
            >
              Time
            </Text>
            <Text
              style={[
                styles.liveStatVal,
                {
                  color: stickerColors.text,
                  textShadowColor: stickerTheme === 'dark' ? 'rgba(255, 255, 255, 0.15)' : 'rgba(0, 0, 0, 0.4)',
                },
              ]}
            >
              {formatDuration(workout.durationMin)}
            </Text>
          </View>
        </View>
      </View>
    </Animated.View>
  );
}
