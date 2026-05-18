import { useState } from 'react';
import * as ImagePicker from 'expo-image-picker';
import { arrayUnion, doc, updateDoc } from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { db, storage } from '../../../services/firebase';
import { useAuthStore } from '../../../stores/authStore';
import { useWorkouts } from '../../../hooks/useWorkouts';
import { WeightEntry, MeasurementEntry } from '../types';
import dayjs from 'dayjs';

// Aggregate volume PER DAY (sum all exercises/sets on the same date)
function aggregateVolumeByDay(workouts: any[]): Record<string, number> {
  const map: Record<string, number> = {};
  for (const w of workouts) {
    const day = dayjs(w.date).format('YYYY-MM-DD');
    let vol = 0;
    w.exercises?.forEach((ex: any) => {
      ex.sets?.forEach((set: any) => { vol += (set.weight || 0) * (set.reps || 0); });
    });
    map[day] = (map[day] || 0) + vol;
  }
  return map;
}

export function useProgressData() {
  const { user } = useAuthStore();
  const { workouts } = useWorkouts();
  const [timeframe, setTimeframe] = useState<'1W' | '1M'>('1W');
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

  // ── Volume: aggregate per day ──
  const today = dayjs();
  const volumeByDay = aggregateVolumeByDay(workouts || []);
  const activityDates = Object.keys(volumeByDay).sort();

  // Weekly volume data: Sun–Sat of the CURRENT week
  const startOfWeek = today.startOf('week'); // dayjs: week starts Sunday
  const weeklyVolumeData = Array.from({ length: 7 }, (_, i) => {
    const day = startOfWeek.add(i, 'day');
    const key = day.format('YYYY-MM-DD');
    const isFuture = day.isAfter(today, 'day');
    return {
      value: isFuture ? 0 : (volumeByDay[key] || 0),
      label: day.format('ddd').charAt(0), // S M T W T F S
      date: key,
      isToday: day.isSame(today, 'day'),
      isFuture,
    };
  });

  // Monthly volume data: all days of current month
  const startOfMonth = today.startOf('month');
  const daysInMonth  = today.daysInMonth();
  const monthlyVolumeData = Array.from({ length: daysInMonth }, (_, i) => {
    const day = startOfMonth.add(i, 'day');
    const key = day.format('YYYY-MM-DD');
    return {
      value: volumeByDay[key] || 0,
      label: day.format('D'),        // Day number: 1, 2, 3…
      dayName: day.format('ddd'),
      date: key,
      active: !!volumeByDay[key],
      isToday: day.isSame(today, 'day'),
      startOfWeek: day.day() === 0,  // Sunday
    };
  });

  const volumeLineData = timeframe === '1W' ? weeklyVolumeData : monthlyVolumeData;

  const todayKey     = today.format('YYYY-MM-DD');
  const currentVolume = volumeByDay[todayKey] || 0;
  const prevVolume    = weeklyVolumeData.find(d => d.isToday === false && !d.isFuture)?.value || 0;
  const volumeDiff    = currentVolume - prevVolume;

  const allVols = weeklyVolumeData.map(v => v.value);
  const minVol  = Math.min(...allVols);
  const maxVol  = Math.max(...allVols);

  // ── Camera ──
  const uploadPhoto = async (uri: string) => {
    setIsUploading(true);
    try {
      // Use fetch to convert the local file URI to a Blob (works reliably on Hermes)
      const response = await fetch(uri);
      const blob = await response.blob();

      const photoRef = ref(storage, `users/${user?.uid}/progress/${Date.now()}.jpg`);
      await uploadBytes(photoRef, blob, { contentType: 'image/jpeg' });
      const url = await getDownloadURL(photoRef);

      await updateDoc(doc(db, 'users', user?.uid as string), {
        progressPhotos: arrayUnion({ url, date: new Date().toISOString() }),
      });
      alert('Progress photo saved!');
    } catch (err: any) {
      console.error('Upload error:', err);
      const msg = err?.code === 'storage/unauthorized'
        ? 'Storage permission denied. Check Firebase Storage rules.'
        : err?.message || 'Upload failed. Please try again.';
      alert(msg);
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
    volumeLineData, weeklyVolumeData, monthlyVolumeData,
    currentVolume, volumeDiff, minVol, maxVol,
    activityDates,
    latest, prev,
    firstPhoto, lastPhoto,
    isUploading, takePhoto,
  };
}
