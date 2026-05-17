import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { LineChart } from 'react-native-gifted-charts';
import * as ImagePicker from 'expo-image-picker';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { doc, updateDoc, arrayUnion } from 'firebase/firestore';
import { useRouter } from 'expo-router';
import { db } from '../../services/firebase';
import { Camera } from 'lucide-react-native';
import { useAuthStore } from '../../stores/authStore';
import { ForgeTheme } from '../../constants/ForgeTheme';

export default function ProgressScreen() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [timeframe, setTimeframe] = useState('7D');

  const rawHistory = user?.weightHistory?.length 
    ? user.weightHistory 
    : [
        { value: 195, date: 'May 1' },
        { value: 193, date: 'May 8' },
        { value: 190, date: 'May 15' },
        { value: 188, date: 'May 22' },
        { value: user?.weight || 185, date: 'May 29' },
      ];

  const lineData = rawHistory.map(item => ({
    value: item.value,
    label: item.date.slice(0, 5)
  }));

  const currentWeight = rawHistory[rawHistory.length - 1].value;
  const startWeight = rawHistory[0].value;
  const weightDiff = currentWeight - startWeight;
  const diffPrefix = weightDiff > 0 ? '+' : '';

  const [isUploading, setIsUploading] = useState(false);

  const takePhoto = async () => {
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
    if (permissionResult.granted === false) {
      alert("Permission to access camera is required!");
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [3, 4],
      quality: 0.5,
    });

    if (!result.canceled) {
      uploadPhoto(result.assets[0].uri);
    }
  };

  const uploadPhoto = async (uri: string) => {
    setIsUploading(true);
    try {
      const response = await fetch(uri);
      const blob = await response.blob();
      const storage = getStorage();
      const photoRef = ref(storage, `users/${user?.uid}/progress/${Date.now()}.jpg`);
      await uploadBytes(photoRef, blob);
      const url = await getDownloadURL(photoRef);

      const userDocRef = doc(db, 'users', user?.uid as string);
      await updateDoc(userDocRef, {
        progressPhotos: arrayUnion({
          url,
          date: new Date().toISOString()
        })
      });
      alert("Progress photo saved!");
    } catch (error) {
      console.error(error);
      alert("Could not save photo.");
    } finally {
      setIsUploading(false);
    }
  };

  const photos = user?.progressPhotos?.length ? user.progressPhotos : [
    { url: 'https://images.unsplash.com/photo-1507398941214-572c25f4b1dc?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', date: '2026-01-01' },
    { url: 'https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', date: new Date().toISOString() }
  ];
  const firstPhoto = photos[0];
  const lastPhoto = photos[photos.length - 1];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Progress</Text>
      </View>

      {/* Timeframe Pills */}
      <View style={styles.timeframePills}>
        {["7D", "1M", "3M", "YTD"].map((tf) => (
          <TouchableOpacity 
            key={tf} 
            onPress={() => setTimeframe(tf)}
            style={[styles.tfPill, timeframe === tf ? styles.tfActive : styles.tfIdle]}
          >
            <Text style={[styles.tfText, timeframe === tf ? { color: '#fff' } : { color: ForgeTheme.colors.t3 }]}>{tf}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Weight Chart */}
      <View style={styles.weightChartWrap}>
        <View style={styles.card}>
          <View style={{ flexDirection: 'row', alignItems: 'baseline', marginBottom: 4 }}>
            <Text style={styles.weightBig}>{currentWeight}</Text>
            <Text style={{ fontSize: 13, color: ForgeTheme.colors.t2, marginLeft: 4 }}>lbs</Text>
            <View style={styles.weightDeltaBadge}>
              <Text style={{ fontSize: 11, fontWeight: '600', color: ForgeTheme.colors.green }}>↓ {Math.abs(weightDiff)} lbs</Text>
            </View>
          </View>
          <Text style={{ fontSize: 11, color: ForgeTheme.colors.t3, marginBottom: 12 }}>vs. last week</Text>
          
          <View style={{ marginLeft: -20 }}>
            <LineChart
              data={lineData}
              areaChart
              hideDataPoints
              color={ForgeTheme.colors.forge}
              thickness={2}
              startFillColor={ForgeTheme.colors.forge}
              endFillColor={ForgeTheme.colors.forge}
              startOpacity={0.2}
              endOpacity={0}
              xAxisColor={ForgeTheme.colors.b1}
              yAxisColor="transparent"
              yAxisTextStyle={{ color: ForgeTheme.colors.t3, fontSize: 10, fontWeight: '500' }}
              xAxisLabelTextStyle={{ color: ForgeTheme.colors.t3, fontSize: 10, fontWeight: '500' }}
              hideRules
              yAxisOffset={180}
              stepValue={5}
              maxValue={200}
              noOfSections={4}
              height={140}
            />
          </View>
        </View>
      </View>

      {/* Transformation */}
      <View style={styles.px}>
        <Text style={styles.sectionLabel}>Transformation</Text>
        <View style={styles.transformGrid}>
          <View style={styles.transformPhoto}>
            <Image source={{ uri: firstPhoto.url }} style={[StyleSheet.absoluteFill, { opacity: 0.8 }]} />
            <View style={styles.transformPhotoLabelBg}>
              <Text style={styles.transformPhotoLabelText}>BEFORE</Text>
            </View>
          </View>
          <View style={styles.transformPhoto}>
            <Image source={{ uri: lastPhoto.url }} style={StyleSheet.absoluteFill} />
            <View style={styles.transformPhotoLabelBg}>
              <Text style={styles.transformPhotoLabelText}>CURRENT</Text>
            </View>
          </View>
        </View>
        
        <TouchableOpacity style={styles.takePhotoBtn} onPress={takePhoto} disabled={isUploading}>
          <Camera size={16} color={ForgeTheme.colors.forge} />
          <Text style={styles.takePhotoBtnText}>{isUploading ? 'SAVING...' : 'Take Progress Photo'}</Text>
        </TouchableOpacity>
      </View>

      {/* Body Measurements */}
      <View style={styles.px}>
        <Text style={styles.sectionLabel}>Body Measurements</Text>
        <View style={styles.measurementsGrid}>
          {(() => {
            const latest = user?.measurements?.length ? user.measurements[user.measurements.length - 1] : { chest: 41.5, waist: 33.0, arms: 15.2, legs: 24.8 };
            return (
              <>
                <View style={styles.measCard}>
                  <Text style={styles.measLabel}>Chest</Text>
                  <Text style={styles.measVal}>{latest.chest}</Text>
                  <Text style={styles.measUnit}>inches</Text>
                  <TouchableOpacity style={styles.updateBtn} onPress={() => router.push('/measurements')}>
                    <Text style={styles.updateBtnText}>Update</Text>
                  </TouchableOpacity>
                </View>
                <View style={styles.measCard}>
                  <Text style={styles.measLabel}>Waist</Text>
                  <Text style={styles.measVal}>{latest.waist}</Text>
                  <Text style={styles.measUnit}>inches</Text>
                  <TouchableOpacity style={styles.updateBtn} onPress={() => router.push('/measurements')}>
                    <Text style={styles.updateBtnText}>Update</Text>
                  </TouchableOpacity>
                </View>
                <View style={styles.measCard}>
                  <Text style={styles.measLabel}>Arms</Text>
                  <Text style={styles.measVal}>{latest.arms}</Text>
                  <Text style={styles.measUnit}>inches</Text>
                  <TouchableOpacity style={styles.updateBtn} onPress={() => router.push('/measurements')}>
                    <Text style={styles.updateBtnText}>Update</Text>
                  </TouchableOpacity>
                </View>
                <View style={styles.measCard}>
                  <Text style={styles.measLabel}>Legs</Text>
                  <Text style={styles.measVal}>{latest.legs}</Text>
                  <Text style={styles.measUnit}>inches</Text>
                  <TouchableOpacity style={styles.updateBtn} onPress={() => router.push('/measurements')}>
                    <Text style={styles.updateBtnText}>Update</Text>
                  </TouchableOpacity>
                </View>
              </>
            );
          })()}
        </View>
      </View>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: ForgeTheme.colors.bg0 },
  scrollContent: { paddingBottom: 100 },
  px: { paddingHorizontal: 20, marginBottom: 24 },
  
  header: { paddingHorizontal: 20, paddingTop: 60, paddingBottom: 4 },
  title: { fontSize: 20, fontWeight: '700', color: ForgeTheme.colors.t1 },
  
  timeframePills: { flexDirection: 'row', gap: 6, paddingHorizontal: 20, paddingVertical: 12 },
  tfPill: { paddingHorizontal: 12, paddingVertical: 5, borderRadius: 100 },
  tfActive: { backgroundColor: ForgeTheme.colors.forge },
  tfIdle: { backgroundColor: ForgeTheme.colors.bg2 },
  tfText: { fontSize: 11, fontWeight: '600' },

  weightChartWrap: { marginHorizontal: 20, marginBottom: 24 },
  card: { backgroundColor: ForgeTheme.colors.bg1, borderRadius: 16, borderWidth: 0.5, borderColor: ForgeTheme.colors.b1, padding: 16 },
  weightBig: { fontSize: 24, fontWeight: '700', color: ForgeTheme.colors.t1 },
  weightDeltaBadge: { backgroundColor: 'rgba(52,199,89,0.12)', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 100, marginLeft: 8 },

  sectionLabel: { fontSize: 11, fontWeight: '500', color: ForgeTheme.colors.t3, letterSpacing: 1, textTransform: 'uppercase', marginBottom: 8 },
  
  transformGrid: { flexDirection: 'row', gap: 8 },
  transformPhoto: { flex: 1, aspectRatio: 0.75, backgroundColor: ForgeTheme.colors.bg2, borderRadius: 12, borderWidth: 0.5, borderColor: ForgeTheme.colors.b1, position: 'relative', overflow: 'hidden' },
  transformPhotoLabelBg: { position: 'absolute', bottom: 0, left: 0, right: 0, paddingVertical: 8, backgroundColor: 'rgba(10,10,11,0.8)' },
  transformPhotoLabelText: { fontSize: 10, fontWeight: '600', letterSpacing: 1, textTransform: 'uppercase', color: ForgeTheme.colors.t2, textAlign: 'center' },
  
  takePhotoBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, width: '100%', marginTop: 10, paddingVertical: 11, borderRadius: 12, backgroundColor: 'rgba(255,92,46,0.1)', borderWidth: 0.5, borderColor: 'rgba(255,92,46,0.3)' },
  takePhotoBtnText: { color: ForgeTheme.colors.forge, fontSize: 13, fontWeight: '600' },

  measurementsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  measCard: { width: '48%', backgroundColor: ForgeTheme.colors.bg1, borderRadius: 14, borderWidth: 0.5, borderColor: ForgeTheme.colors.b1, padding: 14 },
  measLabel: { fontSize: 10, color: ForgeTheme.colors.t3, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 4 },
  measVal: { fontSize: 20, fontWeight: '700', color: ForgeTheme.colors.t1 },
  measUnit: { fontSize: 11, color: ForgeTheme.colors.t2, marginTop: 1 },
  updateBtn: { alignSelf: 'flex-start', marginTop: 8, backgroundColor: 'rgba(255,92,46,0.1)', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6 },
  updateBtnText: { color: ForgeTheme.colors.forge, fontSize: 10, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.5 }
});
