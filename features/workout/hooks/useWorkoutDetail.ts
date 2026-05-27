import React from 'react';
import { useRef, useState } from 'react';
import { Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import * as FileSystem from 'expo-file-system/legacy';
import * as ImagePicker from 'expo-image-picker';
import * as Sharing from 'expo-sharing';
import ViewShot from 'react-native-view-shot';
import { supabase } from '../../../services/supabase';
import { useAuthStore } from '../../../stores/authStore';
import { useWorkouts } from './useWorkouts';
import { StickerTheme } from '../../progress/components/InteractivePhotoCard/InteractivePhotoCardTypes';

export function useWorkoutDetail() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { workouts, updateWorkout } = useWorkouts();
  const { user } = useAuthStore();

  const workout = workouts.find((w) => w.id === id);
  const viewShotRef = useRef<ViewShot>(null);
  const shareViewShotRef = useRef<ViewShot>(null);

  const [photoUri, setPhotoUri] = useState<string | null>(workout?.photoUrl || null);
  const [useLbs, setUseLbs] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [stickerTheme, setStickerTheme] = useState<StickerTheme>('white');
  const [isShareModalVisible, setIsShareModalVisible] = useState(false);
  const [isSharing, setIsSharing] = useState(false);

  const isCardio = workout?.type === 'run' || workout?.type === 'walk' || workout?.type === 'cardio';

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: false,
      quality: 1,
    });
    if (!result.canceled && result.assets[0]) {
      const uri = result.assets[0].uri;
      setPhotoUri(uri);

      if (user?.uid) {
        setIsUploading(true);
        try {
          const base64 = await FileSystem.readAsStringAsync(uri, {
            encoding: FileSystem.EncodingType.Base64,
          });
          const binaryStr = atob(base64);
          const bytes = new Uint8Array(binaryStr.length);
          for (let i = 0; i < binaryStr.length; i++) {
            bytes[i] = binaryStr.charCodeAt(i);
          }
          const path = `workouts/${user.uid}/${Date.now()}.jpg`;
          const { error: uploadError } = await supabase.storage
            .from('progress')
            .upload(path, bytes, { contentType: 'image/jpeg' });

          if (uploadError) throw uploadError;

          const { data: { publicUrl } } = supabase.storage
            .from('progress')
            .getPublicUrl(path);

          setPhotoUri(publicUrl);
          if (updateWorkout && workout) {
            await updateWorkout({ ...workout, photoUrl: publicUrl });
          }
        } catch (e) {
          console.error('Error uploading photo to Supabase:', e);
          alert('Failed to save to cloud. Saved locally instead.');
          if (updateWorkout && workout) {
            updateWorkout({ ...workout, photoUrl: uri });
          }
        } finally {
          setIsUploading(false);
        }
      } else {
        if (updateWorkout && workout) {
          updateWorkout({ ...workout, photoUrl: uri });
        }
      }
    }
  };

  const openShareModal = () => setIsShareModalVisible(true);

  const handleShareExport = async (): Promise<void> => {
    setIsSharing(true);
    try {
      await new Promise(resolve => requestAnimationFrame(resolve));
      if (!shareViewShotRef.current?.capture) return;
      const uri = await shareViewShotRef.current.capture();
      await Sharing.shareAsync(uri, { dialogTitle: 'Share Workout' });
    } catch (e) {
      console.error('Share failed:', e);
    } finally {
      setIsSharing(false);
    }
  };

  const getActivityPlaceholder = (type?: string, notes?: string) => {
    const n = (notes || '').toLowerCase();
    const t = (type || '').toLowerCase();
    if (t === 'run' || n.includes('run')) return 'https://images.unsplash.com/photo-1552674605-db6ffd4facb5?q=80&w=1000&auto=format&fit=crop';
    if (t === 'cycle' || t === 'ride' || n.includes('cycle') || n.includes('bike')) return 'https://images.unsplash.com/photo-1517649763962-0c623066013b?q=80&w=1000&auto=format&fit=crop';
    if (n.includes('yoga') || n.includes('stretch')) return 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=1000&auto=format&fit=crop';
    if (t === 'walk' || n.includes('walk')) return 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?q=80&w=1000&auto=format&fit=crop';
    return 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=1000&auto=format&fit=crop';
  };

  // Calc volume
  let totalVolumeKg = 0;
  workout?.exercises?.forEach(ex => {
    ex.sets.forEach(set => {
      totalVolumeKg += (set.weight || 0) * (set.reps || 0);
    });
  });
  const totalVolume = useLbs ? Math.round(totalVolumeKg * 2.20462) : totalVolumeKg;

  const displayPhotoUri = photoUri || getActivityPlaceholder(workout?.type, workout?.notes);

  return {
    workout,
    router,
    photoUri,
    useLbs, setUseLbs,
    isUploading,
    stickerTheme, setStickerTheme,
    isShareModalVisible, setIsShareModalVisible,
    isSharing,
    isCardio,
    viewShotRef,
    shareViewShotRef,
    totalVolume,
    displayPhotoUri,
    pickImage,
    openShareModal,
    handleShareExport,
  };
}
