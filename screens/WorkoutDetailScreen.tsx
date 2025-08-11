import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function WorkoutDetailScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Workout Detail</Text>
      <Text style={styles.sub}>Details, tags and actions will go here.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 20, fontWeight: '700' },
  sub: { marginTop: 8, color: '#6B7280' },
});


