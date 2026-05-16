import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { LineChart } from 'react-native-gifted-charts';
import { useAuthStore } from '../../stores/authStore';

export default function ProgressScreen() {
  const { user } = useAuthStore();
  const [timeframe, setTimeframe] = useState('1M');

  // Dummy data mapped for react-native-gifted-charts LineChart
  const lineData = [
    { value: 195, label: 'May 1' },
    { value: 193, label: 'May 8' },
    { value: 190, label: 'May 15' },
    { value: 188, label: 'May 22' },
    { value: 185, label: 'May 29' },
  ];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>YOUR <Text style={{ color: '#D2FF00' }}>PROGRESS</Text></Text>
        <Text style={styles.subtitle}>Consistency compounds.</Text>
      </View>

      {/* Analytics Chart */}
      <View style={styles.chartSection}>
        <View style={styles.chartHeaderRow}>
          <Text style={styles.sectionTitle}>WEIGHT TREND</Text>
          
          <View style={styles.timeframeToggle}>
            {["7D", "1M", "3M", "YTD"].map((tf) => (
              <TouchableOpacity 
                key={tf} 
                onPress={() => setTimeframe(tf)}
                style={[styles.tfBtn, timeframe === tf && styles.tfBtnActive]}
              >
                <Text style={[styles.tfText, timeframe === tf && styles.tfTextActive]}>{tf}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.chartCard}>
          <View style={styles.weightHeader}>
            <Text style={styles.currentWeight}>185<Text style={styles.weightUnit}>lbs</Text></Text>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>-10 lbs</Text>
            </View>
          </View>
          
          <View style={{ marginTop: 20, marginLeft: -20 }}>
            <LineChart
              data={lineData}
              areaChart
              hideDataPoints
              color="#D2FF00"
              thickness={3}
              startFillColor="#D2FF00"
              endFillColor="#D2FF00"
              startOpacity={0.3}
              endOpacity={0}
              xAxisColor="transparent"
              yAxisColor="transparent"
              yAxisTextStyle={{ color: '#8A8A93', fontSize: 10, fontWeight: '600' }}
              xAxisLabelTextStyle={{ color: '#8A8A93', fontSize: 10, fontWeight: '600' }}
              hideRules
              yAxisOffset={180}
              stepValue={5}
              maxValue={200}
              noOfSections={4}
              height={180}
            />
          </View>
        </View>
      </View>

      {/* Photo Grid */}
      <View style={styles.photoSection}>
        <Text style={styles.sectionTitle}>TRANSFORMATION</Text>
        
        <View style={styles.photoGrid}>
          {/* Before Photo */}
          <View style={styles.photoWrapper}>
            <Image 
              source={{ uri: 'https://images.unsplash.com/photo-1507398941214-572c25f4b1dc?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' }} 
              style={[styles.photo, { opacity: 0.7 }]} 
            />
            <View style={styles.photoOverlay}>
              <View style={styles.badgeBefore}>
                <Text style={styles.badgeBeforeText}>BEFORE</Text>
              </View>
              <Text style={styles.photoDate}>Jan 1, 2026</Text>
            </View>
          </View>
          
          {/* Current Photo */}
          <View style={[styles.photoWrapper, styles.photoCurrentWrapper]}>
            <Image 
              source={{ uri: 'https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' }} 
              style={styles.photo} 
            />
            <View style={styles.photoOverlay}>
              <View style={styles.badgeCurrent}>
                <Text style={styles.badgeCurrentText}>CURRENT</Text>
              </View>
              <Text style={styles.photoDate}>May 16, 2026</Text>
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0C0C0E' },
  scrollContent: { padding: 24, paddingTop: 48, paddingBottom: 100 },
  
  header: { marginBottom: 32 },
  title: { fontSize: 24, fontWeight: '900', color: '#FFF', marginBottom: 8, letterSpacing: 1 },
  subtitle: { fontSize: 14, color: '#8A8A93' },
  
  chartSection: { marginBottom: 40 },
  chartHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  sectionTitle: { fontSize: 12, fontWeight: '800', color: '#8A8A93', letterSpacing: 1 },
  
  timeframeToggle: { flexDirection: 'row', backgroundColor: '#16161A', borderRadius: 20, borderWidth: 1, borderColor: '#242429', padding: 4 },
  tfBtn: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 16 },
  tfBtnActive: { backgroundColor: '#242429' },
  tfText: { fontSize: 10, fontWeight: '800', color: '#8A8A93' },
  tfTextActive: { color: '#FFF' },

  chartCard: { backgroundColor: '#16161A', borderRadius: 16, padding: 20, borderWidth: 1, borderColor: '#242429' },
  weightHeader: { flexDirection: 'row', alignItems: 'center' },
  currentWeight: { fontSize: 32, fontWeight: '900', color: '#FFF', letterSpacing: -1 },
  weightUnit: { fontSize: 14, color: '#8A8A93', marginLeft: 4 },
  badge: { backgroundColor: 'rgba(210,255,0,0.1)', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6, marginLeft: 12 },
  badgeText: { color: '#D2FF00', fontSize: 10, fontWeight: '800' },

  photoSection: {},
  photoGrid: { flexDirection: 'row', gap: 16, marginTop: 16 },
  photoWrapper: { flex: 1, aspectRatio: 0.75, borderRadius: 16, overflow: 'hidden', borderWidth: 1, borderColor: '#242429', position: 'relative' },
  photoCurrentWrapper: { borderColor: '#D2FF00', shadowColor: '#D2FF00', shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.2, shadowRadius: 15, elevation: 5 },
  photo: { width: '100%', height: '100%', resizeMode: 'cover' },
  
  photoOverlay: { position: 'absolute', bottom: 0, left: 0, right: 0, padding: 12, paddingTop: 40, backgroundColor: 'rgba(0,0,0,0.5)' },
  badgeBefore: { backgroundColor: 'rgba(0,0,0,0.7)', alignSelf: 'flex-start', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4, marginBottom: 4 },
  badgeBeforeText: { color: '#D2FF00', fontSize: 9, fontWeight: '900', letterSpacing: 1 },
  badgeCurrent: { backgroundColor: '#D2FF00', alignSelf: 'flex-start', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4, marginBottom: 4 },
  badgeCurrentText: { color: '#000', fontSize: 9, fontWeight: '900', letterSpacing: 1 },
  photoDate: { color: '#FFF', fontSize: 11, fontWeight: '800' }
});
