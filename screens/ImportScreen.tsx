// screens/ImportScreen.tsx
import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ScrollView, Alert } from 'react-native';
import WorkoutCard from '../components/WorkoutCard';
import { parseWorkoutCaption } from '../utils/parser';
import { WorkoutStep } from '../utils/types';
import { saveWorkout } from '../storage/workouts';

export default function ImportScreen() {
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
  const title =
    parsedWorkout.find(s => s.type === 'exercise' && s.exercise)?.exercise ||
    'Workout';
  await saveWorkout({
    title,
    url,
    caption,
    steps: parsedWorkout,
  });
  Alert.alert('Saved!', 'Your workout was saved to the Library.');
};

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.label}>Instagram Post URL</Text>
      <TextInput
        style={styles.input}
        placeholder="Paste the Instagram post URL"
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

      <Button title="Parse Workout" onPress={handleParse} />

      <View style={{ height: 10 }} />

      <Button title="Save Workout" onPress={handleSave} />

      {parsedWorkout.length > 0 && (
        <View style={styles.result}>
          <Text style={styles.label}>Parsed Workout:</Text>
          {parsedWorkout.map((step, idx) => (
            <WorkoutCard key={idx} step={step} />
          ))}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20 },
  label: { marginTop: 15, fontWeight: 'bold', fontSize: 16 },
  input: {
    borderWidth: 1, borderColor: '#ccc', borderRadius: 6, padding: 10, marginTop: 5,
  },
  multiline: { height: 120, textAlignVertical: 'top' },
  result: { marginTop: 20 },
});
