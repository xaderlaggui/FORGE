import { useState } from 'react';
import { Alert } from 'react-native';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { useAuthStore } from '../../../stores/authStore';
import { calculateBMI } from '../../../utils/bmi';
import { supabase } from '../../../services/supabase';

export const GENDER_OPTIONS = ['Male', 'Female', 'Prefer not to say'];
export const GOAL_OPTIONS = [
  { label: 'Lose Weight', value: 'cut' },
  { label: 'Maintain Weight', value: 'maintain' },
  { label: 'Build Muscle', value: 'bulk' }
];

export function useEditProfile() {
  const router = useRouter();
  const { user, setUser } = useAuthStore();

  const [displayName, setDisplayName] = useState(user?.displayName || '');
  const [handle, setHandle] = useState((user as any)?.handle || '');
  const [dob, setDob] = useState((user as any)?.dateOfBirth || '');
  const initialWeightUnit = user?.weight_unit || 'kg';
  const initialHeightUnit = user?.height_unit || 'cm';

  const initialWeight = initialWeightUnit === 'lbs' && user?.weight
    ? Math.round(user.weight * 2.20462).toString()
    : user?.weight?.toString() || '';

  const initialHeight = initialHeightUnit === 'ft' && user?.height
    ? (user.height / 30.48).toFixed(2)
    : user?.height?.toString() || '';

  const [height, setHeight] = useState(initialHeight);
  const [weight, setWeight] = useState(initialWeight);
  const [heightUnit, setHeightUnit] = useState<'cm' | 'ft'>(initialHeightUnit);
  const [weightUnit, setWeightUnit] = useState<'kg' | 'lbs'>(initialWeightUnit);
  const [gender, setGender] = useState(GENDER_OPTIONS[0]);
  const [goal, setGoal] = useState((user as any)?.fitness_goal || user?.fitnessGoal || 'maintain');

  const [photoUri, setPhotoUri] = useState<string | null>(user?.photoURL || null);
  const [saving, setSaving] = useState(false);

  const handleWeightUnitChange = (newUnit: 'kg' | 'lbs') => {
    if (newUnit === weightUnit) return;
    setWeightUnit(newUnit);
    if (weight) {
      const val = parseFloat(weight);
      if (!isNaN(val)) {
        if (newUnit === 'lbs') setWeight(Math.round(val * 2.20462).toString());
        else setWeight((val / 2.20462).toFixed(1));
      }
    }
  };

  const handleHeightUnitChange = (newUnit: 'cm' | 'ft') => {
    if (newUnit === heightUnit) return;
    setHeightUnit(newUnit);
    if (height) {
      const val = parseFloat(height);
      if (!isNaN(val)) {
        if (newUnit === 'ft') setHeight((val / 30.48).toFixed(2));
        else setHeight(Math.round(val * 30.48).toString());
      }
    }
  };

  const pickAvatar = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });
    if (!result.canceled && result.assets[0]) {
      setPhotoUri(result.assets[0].uri);
    }
  };

  const handleSave = async () => {
    if (!user?.uid) return;
    setSaving(true);
    try {
      const heightVal = heightUnit === 'ft'
        ? Math.round(parseFloat(height) * 30.48)
        : parseFloat(height) || 0;
      const weightVal = weightUnit === 'lbs'
        ? Math.round(parseFloat(weight) * 0.453592)
        : parseFloat(weight) || 0;

      const { bmi } = (heightVal > 0 && weightVal > 0)
        ? calculateBMI(weightVal, heightVal)
        : { bmi: 0 };

      const baseWeightKg = weightVal;

      const existingWeightHistory = (user as any)?.weight_history || (user as any)?.weightHistory || [];
      const updatedWeightHistory = [
        ...existingWeightHistory,
        { value: baseWeightKg, date: new Date().toISOString() }
      ];

      const existingBmiHistory = (user as any)?.bmi_history || (user as any)?.bmiHistory || [];
      const updatedBmiHistory = [
        ...existingBmiHistory,
        { value: bmi, date: new Date().toISOString() }
      ];

      const updated = {
        ...user,
        displayName,
        display_name: displayName,
        handle,
        dateOfBirth: dob,
        date_of_birth: dob,
        height: heightVal,
        weight: weightVal,
        bmi,
        weight_history: updatedWeightHistory,
        bmi_history: updatedBmiHistory,
        photoURL: photoUri || user.photoURL,
        photo_url: photoUri || user.photoURL,
        weight_unit: weightUnit,
        height_unit: heightUnit,
        fitness_goal: goal,
        fitnessGoal: goal,
      };

      const { error } = await supabase
        .from('profiles')
        .update({
          display_name: displayName,
          handle,
          date_of_birth: dob,
          height: heightVal,
          weight: weightVal,
          bmi,
          weight_history: updatedWeightHistory,
          bmi_history: updatedBmiHistory,
          photo_url: photoUri || (user as any).photoURL,
          weight_unit: weightUnit,
          height_unit: heightUnit,
          fitness_goal: goal,
        })
        .eq('id', user.uid);
      if (error) throw error;
      setUser(updated);
      Alert.alert('Saved', 'Profile updated successfully.');
      router.back();
    } catch (e: any) {
      Alert.alert('Error', e.message);
    } finally {
      setSaving(false);
    }
  };

  return {
    displayName, setDisplayName,
    handle, setHandle,
    dob, setDob,
    height, setHeight,
    weight, setWeight,
    heightUnit,
    weightUnit,
    gender, setGender,
    goal, setGoal,
    photoUri,
    saving,
    handleWeightUnitChange,
    handleHeightUnitChange,
    pickAvatar,
    handleSave,
  };
}
