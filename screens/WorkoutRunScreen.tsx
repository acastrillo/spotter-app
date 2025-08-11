import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function WorkoutRunScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Run Workout</Text>
      <Text style={styles.sub}>Timers and controls will go here.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 20, fontWeight: '700' },
  sub: { marginTop: 8, color: '#6B7280' },
});


