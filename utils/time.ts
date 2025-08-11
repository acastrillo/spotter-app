import { WorkoutStep } from './types';

export const ESTIMATE_DEFAULTS = {
  repTempoSec: 2,
  perMoveTransitionSec: 5,
  perRoundTransitionSec: 15,
  pace: {
    row_500m_sec: 120,
    run_1mi_sec: 540,
    run_400m_sec: 120,
    bike_1km_sec: 120,
  },
};

export function parseDurationToSec(s: string): number {
  const m = (s || '').toLowerCase().trim().match(/(\d+(?:\.\d+)?)\s*(sec|second|seconds|min|minute|minutes)/);
  if (!m) return 0;
  const v = parseFloat(m[1]);
  const unit = m[2];
  if (unit.startsWith('sec')) return Math.round(v);
  return Math.round(v * 60);
}

function estimateDistanceSec(distance?: string, hint?: string, defaults = ESTIMATE_DEFAULTS): number {
  if (!distance) return 0;
  const m = distance.match(/(\d+(?:\.\d+)?)\s*(m|km|mi)/i);
  if (!m) return 0;
  const value = parseFloat(m[1]);
  const unit = m[2].toLowerCase();
  const hay = (hint || '').toLowerCase();
  if (unit === 'm') {
    if (value === 500 && /row|erg/.test(hay)) return defaults.pace.row_500m_sec;
    if (value === 400 && /run|treadmill/.test(hay)) return defaults.pace.run_400m_sec;
    // fallback: scale by 500m pace for row or 400m run
    if (/row|erg/.test(hay)) return (value / 500) * defaults.pace.row_500m_sec;
    if (/run|treadmill/.test(hay)) return (value / 400) * defaults.pace.run_400m_sec;
  }
  if (unit === 'mi') {
    if (/run|treadmill/.test(hay)) return value * defaults.pace.run_1mi_sec;
  }
  if (unit === 'km') {
    if (/bike/.test(hay)) return value * defaults.pace.bike_1km_sec;
  }
  return 0;
}

export function estimateStepTimeSec(step: WorkoutStep, defaults = ESTIMATE_DEFAULTS): number {
  let total = 0;
  if (step.duration) total += parseDurationToSec(step.duration);
  if (!total && step.distance) total += estimateDistanceSec(step.distance, step.raw + ' ' + (step.exercise || ''), defaults);
  if (!total && step.reps && step.reps.length) {
    const repsSum = step.reps.reduce((a, b) => a + (Number.isFinite(b as any) ? (b as number) : 0), 0);
    const sets = step.sets && step.sets > 0 ? step.sets : 1;
    total += repsSum * defaults.repTempoSec * sets;
  }
  if (step.timesThrough && step.timesThrough > 1) total *= step.timesThrough;
  // Add simple transition per move
  total += defaults.perMoveTransitionSec;
  return Math.round(total);
}

export function estimateTotalTimeSec(steps: WorkoutStep[], defaults = ESTIMATE_DEFAULTS): number {
  let total = 0;
  for (const s of steps) {
    total += estimateStepTimeSec(s, defaults);
  }
  return Math.max(0, Math.round(total));
}


