// storage/workouts.ts
import AsyncStorage from '@react-native-async-storage/async-storage';
import { WorkoutStep } from '../utils/types';

const KEY = 'SPOTTER_WORKOUTS_V1';

export type SavedWorkout = {
  id: string;
  title: string;
  url?: string;
  caption?: string;
  steps: WorkoutStep[];
  createdAt: string; // ISO
};

const uid = () => Math.random().toString(36).slice(2) + Date.now().toString(36);

export async function getAllWorkouts(): Promise<SavedWorkout[]> {
  const raw = await AsyncStorage.getItem(KEY);
  return raw ? JSON.parse(raw) : [];
}

export async function saveWorkout(partial: Omit<SavedWorkout,'id'|'createdAt'>) {
  const list = await getAllWorkouts();
  const item: SavedWorkout = { ...partial, id: uid(), createdAt: new Date().toISOString() };
  await AsyncStorage.setItem(KEY, JSON.stringify([item, ...list]));
  return item;
}

export async function deleteWorkout(id: string) {
  const list = await getAllWorkouts();
  const next = list.filter(w => w.id !== id);
  await AsyncStorage.setItem(KEY, JSON.stringify(next));
}

export async function clearAll() {
  await AsyncStorage.setItem(KEY, JSON.stringify([]));
}
