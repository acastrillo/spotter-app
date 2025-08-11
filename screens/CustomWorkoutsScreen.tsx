import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function CustomWorkoutsScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Custom Workouts</Text>
      <Text style={styles.sub}>Premium gated area (placeholder).</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 20, fontWeight: '700' },
  sub: { marginTop: 8, color: '#6B7280' },
});


