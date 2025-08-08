// utils/types.ts
export type WorkoutStep = {
  type: 'exercise' | 'rest' | 'time';
  raw: string;
  exercise?: string;
  sets?: number;
  reps?: number[];
  duration?: string; // for time or rest, e.g., "1 min", "30 sec"
};