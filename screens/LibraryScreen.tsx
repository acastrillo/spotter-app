import React from 'react';
import { View, Text, FlatList, StyleSheet, Pressable, Alert } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { getAllWorkouts, deleteWorkout, SavedWorkout } from '../storage/workouts';

export default function LibraryScreen() {
  const [items, setItems] = React.useState<SavedWorkout[]>([]);

  const load = React.useCallback(async () => {
    const data = await getAllWorkouts();
    setItems(data);
  }, []);

  useFocusEffect(React.useCallback(() => { load(); }, [load]));

  const onDelete = (id: string) => {
    Alert.alert('Delete workout?', 'This cannot be undone.', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: async () => { await deleteWorkout(id); load(); } }
    ]);
  };

  return (
    <View style={styles.container}>
      {items.length === 0 ? (
        <Text>No saved workouts yet.</Text>
      ) : (
        <FlatList
          data={items}
          keyExtractor={(w) => w.id}
          renderItem={({ item }) => (
            <Pressable style={styles.card} onLongPress={() => onDelete(item.id)}>
              <Text style={styles.title}>{item.title}</Text>
              {item.sourceUrl ? <Text style={styles.meta} numberOfLines={1}>{item.sourceUrl}</Text> : null}
              <Text style={styles.meta}>
                {new Date(item.createdAt).toLocaleString()} • {item.steps.length} steps
              </Text>
            </Pressable>
          )}
          ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  card: { borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 12, padding: 14, backgroundColor: 'white', shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 6, shadowOffset: { width: 0, height: 2 }, elevation: 1 },
  title: { fontSize: 16, fontWeight: '700' },
  meta: { color: '#6B7280', marginTop: 4 },
});
