import { parseWorkoutCaption } from '../utils/parser';

describe('parseWorkoutCaption', () => {
  test('Incline Dumbbell Press with sets and reps', () => {
    const input = 'Incline Dumbbell Press 4 12, 10, 8, 6';
    const steps = parseWorkoutCaption(input);
    expect(steps).toHaveLength(1);
    expect(steps[0].type).toBe('exercise');
    expect(steps[0].exercise).toMatch(/Incline Dumbbell Press/i);
    expect(steps[0].sets).toBe(4);
    expect(steps[0].reps).toEqual([12, 10, 8, 6]);
  });

  test('distance step 1000m ski', () => {
    const input = '1000m ski';
    const [s] = parseWorkoutCaption(input);
    expect(s.distance).toBe('1000 m');
    expect(s.exercise).toMatch(/ski/i);
  });

  test('time-first 30 sec plank', () => {
    const input = '30 sec plank';
    const [s] = parseWorkoutCaption(input);
    expect(s.type).toBe('time');
    expect(s.duration).toBe('30 sec');
    expect(s.exercise).toMatch(/plank/i);
  });

  test('rest 1 min', () => {
    const input = 'Rest 1 min';
    const [s] = parseWorkoutCaption(input);
    expect(s.type).toBe('rest');
    expect(s.duration).toBe('1 min');
  });

  test('fallback free-form', () => {
    const input = 'Workout details: complete as many rounds as possible';
    const [s] = parseWorkoutCaption(input);
    expect(s.type).toBe('exercise');
    expect(s.exercise).toMatch(/Workout details/i);
  });

  test('multiple weights and parenthetical notes', () => {
    const input = `Sled Pull (weight to be added to sled)\nMens Pro 125kg (275lbs)\nWomen Pro, mixed doubles, men 75Kg (165lbs)\nWomen 50Kg (110lbs)`;
    const steps = parseWorkoutCaption(input);
    expect(steps.length).toBeGreaterThanOrEqual(4);
    expect(steps[0].exercise?.toLowerCase()).toContain('sled pull');
    expect(steps[0].weight).toBeUndefined();
    expect(steps[1].weight?.toLowerCase()).toContain('125 kg');
    // mixed line may contain one or more weights
    expect(steps[2].weight?.toLowerCase()).toContain('75 kg');
    expect(steps[3].weight?.toLowerCase()).toContain('50 kg');
  });
});


