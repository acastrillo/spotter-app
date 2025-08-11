// utils/types.ts
export type WorkoutType =
  | 'emom' | 'amrap' | 'tabata' | 'metcon' | 'for time' | 'circuit' | 'ladder' | 'interval' | 'custom';

export type Equipment =
  | 'barbell' | 'dumbbell' | 'kettlebell' | 'medicine ball' | 'sandbag' | 'rower'
  | 'bike' | 'assault bike' | 'treadmill' | 'ski erg' | 'box' | 'bands' | 'bodyweight' | 'rope' | 'sled'
  | string; // user-extended at runtime

export type WorkoutStep = {
  type: 'exercise' | 'rest' | 'time';
  raw: string;
  exercise?: string;
  sets?: number;
  reps?: number[];            // allow ladders: e.g., [10,8,6]
  duration?: string;          // "30 sec" | "1 min"
  weight?: string;            // "24 kg" | "135 lb"
  distance?: string;          // "1000 m" | "1 mi"
  timesThrough?: number;      // e.g., 4 rounds
  workoutTypeHint?: WorkoutType;
};

export type ParsedWorkoutMeta = {
  detectedTitle?: string;
  sourceUrl?: string;
  equipment: Equipment[];
  workoutTypes: WorkoutType[];
  tags: string[];
  totalTimeEstimateSec?: number;
};

export type SessionLog = {
  sessionId: string;
  workoutId: string;
  startedAt: string;
  endedAt?: string;
  elapsedSec?: number;
  notes?: string;
  rpe?: number;               // 1–10 optional
};

export type SavedWorkout = {
  id: string;
  title: string;
  url?: string;
  caption?: string;
  steps: WorkoutStep[];
  meta: ParsedWorkoutMeta;
  createdAt: string;          // ISO
  scheduledFor?: string;      // YYYY-MM-DD
  sessions?: SessionLog[];    // history
};

// Back-compat type used earlier in the app. Keep exported for any legacy imports.
export type Workout = {
  id: string;
  title: string;
  sourceUrl?: string;
  createdAt: number;
  steps: WorkoutStep[];
};