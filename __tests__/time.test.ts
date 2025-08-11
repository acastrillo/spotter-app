import { parseDurationToSec, estimateTotalTimeSec } from '../utils/time';
import { WorkoutStep } from '../utils/types';

test('parseDurationToSec', () => {
  expect(parseDurationToSec('30 sec')).toBe(30);
  expect(parseDurationToSec('1 min')).toBe(60);
  expect(parseDurationToSec('2 minutes')).toBe(120);
});

test('estimateTotalTimeSec basic', () => {
  const steps: WorkoutStep[] = [
    { type: 'time', raw: 'Plank 30 sec', duration: '30 sec', exercise: 'Plank' },
    { type: 'exercise', raw: 'Push-ups 3 10, 10, 10', exercise: 'Push-ups', sets: 3, reps: [10,10,10] },
  ];
  const total = estimateTotalTimeSec(steps);
  expect(total).toBeGreaterThan(0);
});


