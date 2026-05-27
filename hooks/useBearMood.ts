import { BEAR, BearKey } from '../features/sprites/bearAssets';

export type AppContext =
  | 'welcome'
  | 'home_idle'
  | 'workout_approved'
  | 'workout_complete'
  | 'strength_active'
  | 'lifting_active'
  | 'cardio_active'
  | 'missed_workout'
  | 'streak_warning'
  | 'ai_generating'
  | 'rest_day'
  | 'funny_achievement'
  | 'skipped_session'
  | 'accountability'
  | 'challenge_start'
  | 'buddy_joined'
  | 'ai_tip'
  | 'new_pr'
  | 'milestone';

const MOOD_MAP: Record<AppContext, BearKey> = {
  welcome:           'CONFIDENT',
  home_idle:         'READY',
  workout_approved:  'APPROVING',
  workout_complete:  'HYPED',
  strength_active:   'FLEXING',
  lifting_active:    'LIFTING',
  cardio_active:     'RUNNING',
  missed_workout:    'SHOCKED',
  streak_warning:    'SHOCKED',
  ai_generating:     'THINKING',
  rest_day:          'THINKING',
  funny_achievement: 'LAUGHING',
  skipped_session:   'STERN',
  accountability:    'STERN',
  challenge_start:   'POINTING',
  buddy_joined:      'HIGH_FIVE',
  ai_tip:            'SMUG',
  new_pr:            'PROUD',
  milestone:         'HYPED',
};

export function useBearMood(context: AppContext): BearKey {
  return MOOD_MAP[context];
}
