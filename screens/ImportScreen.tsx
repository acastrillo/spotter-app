// screens/ImportScreen.tsx

import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ScrollView } from 'react-native';

const ImportScreen = () => {
  const [url, setUrl] = useState('');
  const [caption, setCaption] = useState('');
  const [parsedWorkout, setParsedWorkout] = useState<string[]>([]);

  const handleParse = () => {
    // Temporary stub parsing (we'll improve in Step 2)
    const lines = caption.split('\n').filter(line => line.trim().length > 0);
    setParsedWorkout(lines);
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

      {parsedWorkout.length > 0 && (
        <View style={styles.result}>
          <Text style={styles.label}>Parsed Workout:</Text>
          {parsedWorkout.map((line, idx) => (
            <Text key={idx}>• {line}</Text>
          ))}
        </View>
      )}
    </ScrollView>
  );
};

export default ImportScreen;

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  label: {
    marginTop: 15,
    fontWeight: 'bold',
    fontSize: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    padding: 10,
    marginTop: 5,
  },
  multiline: {
    height: 120,
    textAlignVertical: 'top',
  },
  result: {
    marginTop: 20,
  },
});
