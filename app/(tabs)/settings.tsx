import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { signOut } from 'firebase/auth';
import { auth } from '../../services/firebase';
import { seedExercises } from '../../utils/seedData';

export default function SettingsScreen() {
  const [seeding, setSeeding] = useState(false);

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error(error);
    }
  };

  const handleSeed = async () => {
    try {
      setSeeding(true);
      const count = await seedExercises();
      Alert.alert('Success', `Seeded ${count} exercises to Firestore!`);
    } catch (error: any) {
      Alert.alert('Error', error.message);
    } finally {
      setSeeding(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Settings</Text>
      <Text style={styles.subtitle}>Profile, wearables, notifications.</Text>
      
      {__DEV__ && (
        <TouchableOpacity style={styles.seedButton} onPress={handleSeed} disabled={seeding}>
          {seeding ? <ActivityIndicator color="#fff" /> : <Text style={styles.seedText}>🌱 Seed Exercises (Dev Only)</Text>}
        </TouchableOpacity>
      )}

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>Log Out</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#fff' },
  title: { fontSize: 24, fontWeight: 'bold', color: '#1A1A1A' },
  subtitle: { fontSize: 14, color: '#666', marginTop: 8, marginBottom: 32 },
  seedButton: { backgroundColor: '#4CAF50', padding: 12, borderRadius: 8, marginBottom: 16 },
  seedText: { color: '#fff', fontWeight: 'bold' },
  logoutButton: { backgroundColor: '#FF4444', padding: 12, borderRadius: 8 },
  logoutText: { color: '#fff', fontWeight: 'bold' }
});
