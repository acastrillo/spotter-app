// utils/types.ts
export type WorkoutStep = {
  type: 'exercise' | 'rest' | 'time';
  raw: string;
  exercise?: string;
  sets?: number;
  reps?: number[];
  duration?: string;  // time for work or rest
  weight?: string;    // e.g., '225 lb', '16 kg'
  distance?: string;  // e.g., '1000 m', '1 mi'
};

export type Workout = {
  id: string;
  title: string;
  sourceUrl?: string;
  createdAt: number;
  steps: WorkoutStep[];
};