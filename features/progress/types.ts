export interface WeightEntry {
  value: number;
  date: string;
}

export interface MeasurementEntry {
  chest?: number;
  waist?: number;
  arms?: number;
  legs?: number;
}

export interface StatCardProps {
  label: string;
  value: string | number;
  unit?: string;
  delta?: number;
  subText?: string;
  onPress?: () => void;
}

export interface MeasCardProps {
  label: string;
  value?: number;
  prevValue?: number;
  onPress: () => void;
}
