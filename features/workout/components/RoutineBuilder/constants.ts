import { ArrowUpCircle, ArrowDownCircle, PersonStanding, Zap, Dumbbell, Timer, Shuffle } from 'lucide-react-native';

export type SplitType   = 'push' | 'pull' | 'legs' | 'full';
export type PurposeType = 'strength' | 'hypertrophy' | 'endurance' | 'mixed';

export const SPLITS: Record<SplitType, { label: string; icon: any; color: string; hint: string }> = {
  push: { label: 'PUSH',      icon: ArrowUpCircle,   color: '#FF5C2E', hint: 'Chest · Shoulders · Triceps' },
  pull: { label: 'PULL',      icon: ArrowDownCircle, color: '#0A84FF', hint: 'Back · Biceps · Rear Delt'   },
  legs: { label: 'LEGS',      icon: PersonStanding,  color: '#30D158', hint: 'Quads · Hamstrings · Calves' },
  full: { label: 'FULL BODY', icon: PersonStanding,  color: '#BF5AF2', hint: 'All muscle groups'           },
};

export const PURPOSES: Record<PurposeType, {
  label: string; icon: any; color: string;
  hint: string; presets: string[]; description: string;
}> = {
  strength: {
    label: 'STRENGTH', icon: Zap, color: '#FF5C2E',
    hint: 'Heavy compounds, low reps',
    presets: ['3×5', '4×4', '5×3', '5×5'],
    description: 'Focused on maximal force production. Low reps, heavy weight, long rest periods.',
  },
  hypertrophy: {
    label: 'HYPERTROPHY', icon: Dumbbell, color: '#0A84FF',
    hint: 'Moderate weight, high volume',
    presets: ['3×10', '3×12', '4×8', '4×12'],
    description: 'Optimized for muscle growth. Moderate weight, higher reps, shorter rest.',
  },
  endurance: {
    label: 'ENDURANCE', icon: Timer, color: '#30D158',
    hint: 'Light weight, high reps',
    presets: ['3×15', '3×20', '4×15', '2×25'],
    description: 'Build muscular endurance and cardio capacity. Light weight, very high reps.',
  },
  mixed: {
    label: 'MIXED', icon: Shuffle, color: '#BF5AF2',
    hint: 'Balanced approach',
    presets: ['3×8', '3×10', '3×12', '4×8'],
    description: 'Combines strength, hypertrophy and endurance for well-rounded fitness.',
  },
};

export interface ExData {
  name: string;
  preset: string;
  category?: string;
  purpose?: string;
}
