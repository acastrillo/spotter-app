// utils/parser.ts
import { WorkoutStep } from './types';

export function parseWorkoutCaption(caption: string): WorkoutStep[] {
  const lines = caption.split('\n').map(l => l.trim()).filter(Boolean);
  const steps: WorkoutStep[] = [];

  for (const line of lines) {
    const lower = line.toLowerCase();

    // REST
    if (lower.includes('rest')) {
      const m = line.match(/rest\s*(\d+\s*(sec|second|seconds|min|minute|minutes))/i);
      steps.push({ type: 'rest', raw: line, duration: m?.[1] });
      continue;
    }

    // TIME-BASED first token like "30 sec something" or "1 min jump rope"
    const timeFront = line.match(/^(\d+\s*(sec|second|seconds|min|minute|minutes))\s+(.+)$/i);
    if (timeFront) {
      steps.push({
        type: 'time',
        raw: line,
        duration: timeFront[1],
        exercise: timeFront[3],
      });
      continue;
    }

    // TIME-BASED at end like "Plank 30 sec"
    const timeEnd = line.match(/^(.+?)\s+(\d+\s*(sec|second|seconds|min|minute|minutes))$/i);
    if (timeEnd) {
      steps.push({
        type: 'time',
        raw: line,
        exercise: timeEnd[1],
        duration: timeEnd[2],
      });
      continue;
    }

    // EXERCISE with sets + reps list: "Name  4  12, 10, 8, 6"
    const ex = line.match(/^(.*?)(\d+)\s+([\d,\s]+)$/);
    if (ex) {
      const [, name, setsStr, repsStr] = ex;
      const sets = parseInt(setsStr.trim(), 10);
      const reps = repsStr.split(',').map(x => parseInt(x.trim(), 10)).filter(n => !Number.isNaN(n));
      steps.push({ type: 'exercise', raw: line, exercise: name.trim(), sets, reps });
      continue;
    }

    // Fallback
    steps.push({ type: 'exercise', raw: line, exercise: line });
  }

  return steps;
}
