// screens/ImportScreen.tsx
import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView, Alert, Linking, Pressable } from 'react-native';
import ParsedTable from '../components/ParsedTable';
import { parseWorkoutCaption } from '../utils/parser';
import { WorkoutStep } from '../utils/types';
import { saveWorkout } from '../storage/workouts';

export default function ImportScreen() {
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const [caption, setCaption] = useState('');
  const [parsedWorkout, setParsedWorkout] = useState<WorkoutStep[]>([]);

  const handleParse = () => {
    const result = parseWorkoutCaption(caption);
    setParsedWorkout(result);
  };

  const handleSave = async () => {
    if (parsedWorkout.length === 0) {
      Alert.alert('Nothing to save', 'Parse a workout first.');
      return;
    }
    const derivedTitle = title.trim() ||
      (parsedWorkout.find(s => s.type === 'exercise' && s.exercise)?.exercise ?? 'Workout');
    await saveWorkout({
      title: derivedTitle,
      sourceUrl: url.trim() || undefined,
      steps: parsedWorkout,
    });
    Alert.alert('Saved!', 'Your workout was saved to the Library.');
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.legendRow}>
        <View style={[styles.legendChip, { backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#E5E7EB' }]}>
          <Text>💪 Exercise</Text>
        </View>
        <View style={[styles.legendChip, { backgroundColor: '#D6F5E3' }]}>
          <Text>🧘 Rest</Text>
        </View>
        <View style={[styles.legendChip, { backgroundColor: '#FFF9C4' }]}>
          <Text>⏱ Time</Text>
        </View>
      </View>
      <Text style={styles.label}>Title</Text>
      <TextInput
        style={styles.input}
        placeholder="Optional title"
        value={title}
        onChangeText={setTitle}
      />

      <Text style={styles.label}>Source URL</Text>
      <TextInput
        style={styles.input}
        placeholder="Paste the source URL"
        value={url}
        onChangeText={setUrl}
        autoCapitalize="none"
      />

      <Text style={styles.label}>Workout Caption</Text>
      <TextInput
        style={[styles.input, styles.multiline]}
        placeholder="Paste the caption text"
        value={caption}
        onChangeText={setCaption}
        multiline
        numberOfLines={6}
      />

      <View style={styles.buttonRow}>
        <Pressable style={[styles.button, styles.primary]} onPress={handleParse}>
          <Text style={styles.buttonText}>Parse Workout</Text>
        </Pressable>
        <Pressable style={[styles.button, styles.secondary]} onPress={handleSave}>
          <Text style={styles.buttonText}>Save Workout</Text>
        </Pressable>
      </View>

      {url ? (
        <Pressable style={styles.sourcePill} onPress={() => Linking.openURL(url)}>
          <Text style={styles.sourceText}>Source: {url}</Text>
        </Pressable>
      ) : null}

      {parsedWorkout.length > 0 && (
        <View style={styles.result}>
          <Text style={styles.label}>Parsed Workout:</Text>
          <ParsedTable steps={parsedWorkout} />
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, maxWidth: 960, alignSelf: 'center', width: '100%' },
  label: { marginTop: 15, fontWeight: 'bold', fontSize: 16 },
  input: {
    borderWidth: 1, borderColor: '#ccc', borderRadius: 6, padding: 10, marginTop: 5,
  },
  multiline: { height: 120, textAlignVertical: 'top' },
  result: { marginTop: 20 },
  legendRow: { flexDirection: 'row', gap: 8, marginBottom: 10 },
  legendChip: { paddingHorizontal: 10, paddingVertical: 6, borderRadius: 999 },
  buttonRow: { flexDirection: 'row', gap: 10, marginTop: 12 },
  button: { paddingVertical: 12, paddingHorizontal: 16, borderRadius: 8, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 4, shadowOffset: { width: 0, height: 2 }, elevation: 1 },
  primary: { backgroundColor: '#2563EB' },
  secondary: { backgroundColor: '#059669' },
  buttonText: { color: 'white', fontWeight: '700' },
  sourcePill: {
    alignSelf: 'flex-start',
    marginTop: 10,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: '#F3F4F6',
  },
  sourceText: { color: '#2563EB', fontWeight: '600' },
});
