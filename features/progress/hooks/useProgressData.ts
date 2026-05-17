import { useState } from 'react';
import * as FileSystem from 'expo-file-system/legacy';
import * as ImagePicker from 'expo-image-picker';
import { arrayUnion, doc, updateDoc } from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { db, storage } from '../../../services/firebase';
import { useAuthStore } from '../../../stores/authStore';
import { WeightEntry, MeasurementEntry } from '../types';

export function useProgressData() {
  const { user } = useAuthStore();
  const [timeframe, setTimeframe] = useState('1M');
  const [isUploading, setIsUploading] = useState(false);

  // ── Weight data ──
  const rawHistory: WeightEntry[] = (user as any)?.weightHistory || [];
    
  const lineData = rawHistory.length > 0 
    ? rawHistory.map(item => ({ value: item.value, label: item.date.slice(0, 5) })) 
    : [{ value: 0, label: 'No Data' }];

  const currentWeight = rawHistory.length > 0 ? rawHistory[rawHistory.length - 1].value : 0;
  const startWeight   = rawHistory.length > 0 ? rawHistory[0].value : 0;
  const weightDiff    = startWeight > 0 ? +(currentWeight - startWeight).toFixed(1) : 0;

  const minVal = rawHistory.length > 0 ? Math.min(...rawHistory.map(r => r.value)) : 0;
  const maxVal = rawHistory.length > 0 ? Math.max(...rawHistory.map(r => r.value)) : 0;

  // ── Measurements ──
  const measurements: MeasurementEntry[] = (user as any)?.measurements || [];
  
  const latest = measurements.length > 0 ? measurements[measurements.length - 1] : {};
  const prev   = measurements.length > 1 ? measurements[measurements.length - 2] : undefined;

  // ── Photos ──
  const photos = (user as any)?.progressPhotos || [];
  
  const firstPhoto = photos.length > 0 ? photos[0] : null;
  const lastPhoto  = photos.length > 0 ? photos[photos.length - 1] : null;

  // ── Camera ──
  const uploadPhoto = async (uri: string) => {
    setIsUploading(true);
    try {
      const base64 = await FileSystem.readAsStringAsync(uri, {
        encoding: 'base64',
      });

      const binaryStr = atob(base64);
      const bytes = new Uint8Array(binaryStr.length);
      for (let i = 0; i < binaryStr.length; i++) {
        bytes[i] = binaryStr.charCodeAt(i);
      }

      const photoRef = ref(storage, `users/${user?.uid}/progress/${Date.now()}.jpg`);
      await uploadBytes(photoRef, bytes, { contentType: 'image/jpeg' });
      const url = await getDownloadURL(photoRef);

      await updateDoc(doc(db, 'users', user?.uid as string), {
        progressPhotos: arrayUnion({ url, date: new Date().toISOString() }),
      });
      alert('Progress photo saved! 🎉');
    } catch (err) {
      console.error('Upload error:', err);
      alert('Failed to save photo. Check your Firebase Storage rules.');
    } finally {
      setIsUploading(false);
    }
  };

  const takePhoto = async () => {
    const perm = await ImagePicker.requestCameraPermissionsAsync();
    if (!perm.granted) { alert('Camera permission required.'); return; }
    const result = await ImagePicker.launchCameraAsync({ allowsEditing: true, aspect: [3, 4], quality: 0.6 });
    if (!result.canceled) uploadPhoto(result.assets[0].uri);
  };

  return {
    user,
    timeframe, setTimeframe,
    lineData, currentWeight, startWeight, weightDiff, minVal, maxVal,
    latest, prev,
    firstPhoto, lastPhoto,
    isUploading, takePhoto
  };
}
