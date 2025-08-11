// storage/workouts.ts
import AsyncStorage from '@react-native-async-storage/async-storage';
import { WorkoutStep, SavedWorkout, SessionLog, ParsedWorkoutMeta } from '../utils/types';
export type { SavedWorkout } from '../utils/types';

const KEY = 'SPOTTER_WORKOUTS_V2';

const uid = () => Math.random().toString(36).slice(2) + Date.now().toString(36);

export async function getAllWorkouts(): Promise<SavedWorkout[]> {
  const rawNew = await AsyncStorage.getItem(KEY);
  if (rawNew) {
    return JSON.parse(rawNew);
  }
  // Backward compatibility: try previous key if present
  const rawLegacy = await AsyncStorage.getItem('SPOTTER_WORKOUTS_V1');
  const legacyList: any[] = rawLegacy ? JSON.parse(rawLegacy) : [];
  const migrated: SavedWorkout[] = legacyList.map((it: any) => {
    const createdAtISO = typeof it.createdAt === 'number' ? new Date(it.createdAt).toISOString() : (it.createdAt || new Date().toISOString());
    const meta: ParsedWorkoutMeta = {
      detectedTitle: undefined,
      sourceUrl: it.sourceUrl || it.url,
      equipment: [],
      workoutTypes: [],
      tags: [],
      totalTimeEstimateSec: undefined,
    };
    return {
      id: it.id,
      title: it.title,
      url: it.url ?? it.sourceUrl,
      caption: it.caption,
      steps: (it.steps as WorkoutStep[]) || [],
      meta,
      createdAt: createdAtISO,
      scheduledFor: undefined,
      sessions: [],
    };
  });
  return migrated;
}

type LegacySave = { title: string; sourceUrl?: string; url?: string; caption?: string; steps: WorkoutStep[] };

export async function saveWorkout(partial: Omit<SavedWorkout,'id'|'createdAt'> | LegacySave) {
  const list = await getAllWorkouts();
  const nowISO = new Date().toISOString();
  let item: SavedWorkout;
  if ((partial as any).meta) {
    item = { ...(partial as any), id: uid(), createdAt: nowISO } as SavedWorkout;
  } else {
    const legacy = partial as LegacySave;
    const meta: ParsedWorkoutMeta = {
      detectedTitle: legacy.title,
      sourceUrl: legacy.sourceUrl || legacy.url,
      equipment: [],
      workoutTypes: [],
      tags: [],
      totalTimeEstimateSec: undefined,
    };
    item = {
      id: uid(),
      title: legacy.title,
      url: legacy.url || legacy.sourceUrl,
      caption: legacy.caption,
      steps: legacy.steps,
      meta,
      createdAt: nowISO,
    };
  }
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

export async function updateWorkout(id: string, update: Partial<SavedWorkout>) {
  const list = await getAllWorkouts();
  const idx = list.findIndex(w => w.id === id);
  if (idx === -1) return;
  const next = [...list];
  next[idx] = { ...next[idx], ...update } as SavedWorkout;
  await AsyncStorage.setItem(KEY, JSON.stringify(next));
}

export async function scheduleWorkout(id: string, dateISO: string) {
  await updateWorkout(id, { scheduledFor: dateISO });
}

export async function addSession(workoutId: string, session: SessionLog) {
  const list = await getAllWorkouts();
  const idx = list.findIndex(w => w.id === workoutId);
  if (idx === -1) return;
  const w = list[idx];
  const sessions = Array.isArray(w.sessions) ? w.sessions : [];
  const next = { ...w, sessions: [...sessions, session] } as SavedWorkout;
  const newList = [...list];
  newList[idx] = next;
  await AsyncStorage.setItem(KEY, JSON.stringify(newList));
}
