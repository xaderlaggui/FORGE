import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, TouchableOpacity, ScrollView } from 'react-native';
import { collection, getDocs } from 'firebase/firestore';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'expo-router';
import { db } from '../../services/firebase';
import type { Exercise } from '../../types';

export default function WorkoutScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'planner' | 'library'>('planner');
  const [activeDay, setActiveDay] = useState(3);
  
  const days = [
    { label: "M", date: 12 },
    { label: "T", date: 13 },
    { label: "W", date: 14 },
    { label: "T", date: 15 },
    { label: "F", date: 16 },
    { label: "S", date: 17 },
    { label: "S", date: 18 },
  ];

  const { data: exercises, isLoading } = useQuery({
    queryKey: ['exercises'],
    queryFn: async () => {
      const snap = await getDocs(collection(db, 'exercises'));
      return snap.docs.map(doc => doc.data() as Exercise);
    }
  });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>WORKOUT <Text style={{ color: '#D2FF00' }}>PLAN</Text></Text>
        
        {/* Custom Segmented Control */}
        <View style={styles.tabContainer}>
          <TouchableOpacity 
            style={[styles.tab, activeTab === 'planner' && styles.activeTab]}
            onPress={() => setActiveTab('planner')}
          >
            <Text style={[styles.tabText, activeTab === 'planner' && styles.activeTabText]}>PLANNER</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.tab, activeTab === 'library' && styles.activeTab]}
            onPress={() => setActiveTab('library')}
          >
            <Text style={[styles.tabText, activeTab === 'library' && styles.activeTabText]}>LIBRARY</Text>
          </TouchableOpacity>
        </View>
      </View>

      {activeTab === 'library' ? (
        // --- EXERCISE LIBRARY VIEW ---
        isLoading ? (
          <ActivityIndicator size="large" color="#D2FF00" style={{ marginTop: 40 }} />
        ) : (
          <FlatList
            data={exercises}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.list}
            renderItem={({ item }) => (
              <View style={styles.card}>
                <Text style={styles.cardTitle}>{item.name}</Text>
                <Text style={styles.cardSub}>{item.muscleGroups.join(', ')} • {item.equipment}</Text>
              </View>
            )}
            ListEmptyComponent={
              <Text style={styles.emptyText}>No exercises found. Go to Settings and click Seed!</Text>
            }
          />
        )
      ) : (
        // --- WORKOUT PLANNER VIEW ---
        <ScrollView contentContainerStyle={styles.plannerContainer}>
          <View style={styles.weekRow}>
            {days.map((day, idx) => {
              const isActive = idx === activeDay;
              return (
                <TouchableOpacity 
                  key={idx} 
                  onPress={() => setActiveDay(idx)}
                  style={[styles.dayCircle, isActive && styles.activeDayCircle]}
                >
                  <Text style={[styles.dayText, isActive && styles.activeDayText]}>{day.label}</Text>
                  <Text style={[styles.dateText, isActive && styles.activeDateText]}>{day.date}</Text>
                </TouchableOpacity>
              )
            })}
          </View>

          <View style={styles.todayCard}>
            <Text style={styles.todayTitle}>TODAY'S ROUTINE</Text>
            <Text style={styles.todaySub}>UPPER BODY POWER</Text>
            
            <TouchableOpacity style={styles.startButton} onPress={() => router.push('/activeWorkout')}>
              <Text style={styles.startText}>▶ START WORKOUT</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0C0C0E' },
  header: { padding: 24, paddingTop: 48, backgroundColor: '#0C0C0E' },
  title: { fontSize: 24, fontWeight: '900', color: '#FFF', marginBottom: 24, letterSpacing: 1 },
  
  tabContainer: { flexDirection: 'row', backgroundColor: '#16161A', borderRadius: 12, padding: 4, borderWidth: 1, borderColor: '#242429' },
  tab: { flex: 1, paddingVertical: 10, alignItems: 'center', borderRadius: 8 },
  activeTab: { backgroundColor: '#D2FF00', shadowColor: '#D2FF00', shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.4, shadowRadius: 10, elevation: 5 },
  tabText: { fontWeight: '800', color: '#8A8A93', fontSize: 12, letterSpacing: 1 },
  activeTabText: { color: '#000' },

  list: { padding: 24 },
  card: { backgroundColor: '#16161A', padding: 20, borderRadius: 16, marginBottom: 12, borderWidth: 1, borderColor: '#242429' },
  cardTitle: { fontSize: 16, fontWeight: '800', color: '#FFF', letterSpacing: 0.5 },
  cardSub: { fontSize: 12, color: '#8A8A93', marginTop: 6, textTransform: 'uppercase', fontWeight: '700', letterSpacing: 1 },
  emptyText: { textAlign: 'center', marginTop: 40, color: '#8A8A93', fontWeight: '600' },

  plannerContainer: { padding: 24 },
  weekRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 40 },
  dayCircle: { width: 44, height: 56, borderRadius: 22, backgroundColor: '#16161A', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#242429' },
  activeDayCircle: { backgroundColor: '#D2FF00', borderColor: '#D2FF00', shadowColor: '#D2FF00', shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.4, shadowRadius: 12, elevation: 6 },
  dayText: { fontSize: 10, fontWeight: '800', color: '#8A8A93', marginBottom: 4 },
  activeDayText: { color: '#000' },
  dateText: { fontSize: 16, fontWeight: '900', color: '#FFF' },
  activeDateText: { color: '#000' },

  todayCard: { backgroundColor: '#16161A', padding: 24, borderRadius: 20, borderWidth: 1, borderColor: '#242429' },
  todayTitle: { fontSize: 12, color: '#8A8A93', marginBottom: 6, fontWeight: '800', letterSpacing: 1 },
  todaySub: { fontSize: 22, fontWeight: '900', color: '#FFF', marginBottom: 32, letterSpacing: -0.5 },
  startButton: { backgroundColor: '#D2FF00', padding: 16, borderRadius: 12, alignItems: 'center', shadowColor: '#D2FF00', shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.4, shadowRadius: 12, elevation: 6 },
  startText: { color: '#000', fontWeight: '900', fontSize: 14, letterSpacing: 1 },
});
