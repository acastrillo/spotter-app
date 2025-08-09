// utils/parser.ts
import { WorkoutStep } from './types';

const TIME_UNITS = '(sec|second|seconds|min|minute|minutes)';
const DIST_UNITS = '(m|meter|meters|km|k|mi|mile|miles)';
const WEIGHT_UNITS = '(lb|lbs|kg|kgs)';

function normalizeWhitespace(input: string): string {
  return input.replace(/[\t\u00A0]+/g, ' ').replace(/\s{2,}/g, ' ').trim();
}

function extractWeightsFromLine(line: string): { cleaned: string; weight?: string } {
  const re = new RegExp(`(?:@\\s*)?(\\d+(?:\\.\\d+)?)\\s*${WEIGHT_UNITS}`, 'ig');
  const matches = Array.from(line.matchAll(re));
  if (matches.length === 0) {
    // Strip trailing parenthetical notes for cleanliness
    const cleanedNoNote = normalizeWhitespace(line.replace(/\s*\([^)]*\)\s*$/, ''));
    return { cleaned: cleanedNoNote };
  }

  const tokens = matches.map(m => {
    const qty = m[1];
    const unit = (m[2] || '').toLowerCase().replace('kgs', 'kg').replace('lbs', 'lb');
    return `${qty} ${unit}`;
  });

  // Remove all matched weight tokens from the string (reverse to keep indices valid)
  let cleaned = line;
  for (const m of matches.slice().reverse()) {
    const idx = m.index ?? 0;
    cleaned = cleaned.slice(0, idx) + cleaned.slice(idx + m[0].length);
  }

  // Remove parentheses that now contain only whitespace or weight conversions
  cleaned = cleaned
    .replace(/\(\s*\)/g, '')
    .replace(new RegExp(`\\((?:\\s*\\d+(?:\\.\\d+)?\\s*${WEIGHT_UNITS}[\\s/,-]*)+\\)`, 'ig'), '')
    .replace(/[,:;\-\s]+$/g, '')
    .trim();
  cleaned = normalizeWhitespace(cleaned);

  const weight = tokens.filter((t, i, a) => a.indexOf(t) === i).join(' / ');
  return { cleaned, weight: weight || undefined };
}

export function parseWorkoutCaption(caption: string): WorkoutStep[] {
  const lines = caption
    .split(/\r?\n/)
    .map(l => normalizeWhitespace(l))
    .filter(l => l.length > 0);

  const steps: WorkoutStep[] = [];

  for (const originalLine of lines) {
    let line = originalLine;
    const lower = line.toLowerCase();

    // Extract one or multiple weight tokens
    const { cleaned, weight } = extractWeightsFromLine(line);
    line = cleaned;

    // REST with duration, e.g., "Rest 1 min"
    const restMatch = line.match(new RegExp(`^rest\\s*(\\d+\\s*${TIME_UNITS})`, 'i'));
    if (restMatch) {
      steps.push({ type: 'rest', raw: originalLine, duration: restMatch[1].replace(/\s+/, ' '), weight });
      continue;
    }

    // TIME first: "30 sec plank" or "1 min jump rope"
    const timeFront = line.match(new RegExp(`^(\\d+(?:\\.\\d+)?)\\s*${TIME_UNITS}\\s+(.+)$`, 'i'));
    if (timeFront) {
      const duration = `${timeFront[1]} ${timeFront[2]}`.replace('seconds', 'sec').replace('second', 'sec').replace('minutes', 'min').replace('minute', 'min');
      steps.push({ type: 'time', raw: originalLine, duration, exercise: timeFront[3], weight });
      continue;
    }

    // TIME last: "Plank 30 sec"
    const timeEnd = line.match(new RegExp(`^(.+?)\\s+(\\d+(?:\\.\\d+)?)\\s*${TIME_UNITS}$`, 'i'));
    if (timeEnd) {
      const duration = `${timeEnd[2]} ${timeEnd[3]}`.replace('seconds', 'sec').replace('second', 'sec').replace('minutes', 'min').replace('minute', 'min');
      steps.push({ type: 'time', raw: originalLine, exercise: timeEnd[1], duration, weight });
      continue;
    }

    // DISTANCE first: "1000m ski", "1 mi run"
    const distFirst = line.match(new RegExp(`^(\\d+(?:\\.\\d+)?)\\s*${DIST_UNITS}\\b\\s*(.*)$`, 'i'));
    if (distFirst) {
      const unit = distFirst[2].toLowerCase().replace('meter', 'm').replace('meters', 'm').replace('mile', 'mi').replace('miles', 'mi');
      const distance = `${distFirst[1]} ${unit === 'k' ? 'km' : unit}`;
      const exercise = distFirst[3] ? distFirst[3].trim() : undefined;
      steps.push({ type: 'exercise', raw: originalLine, exercise, distance, weight });
      continue;
    }

    // EXERCISE with sets + reps list: "Incline DB Press 4 12, 10, 8, 6"
    const sr = line.match(/^(.*?)(\d+)\s+([\d,\s]+)$/);
    if (sr) {
      const [, name, setsStr, repsStr] = sr;
      const sets = parseInt(setsStr.trim(), 10);
      const reps = repsStr
        .split(',')
        .map(x => parseInt(x.trim(), 10))
        .filter(n => !Number.isNaN(n));
      steps.push({ type: 'exercise', raw: originalLine, exercise: normalizeWhitespace(name), sets, reps, weight });
      continue;
    }

    // Fallback info row: keep as exercise with raw as label
    steps.push({ type: 'exercise', raw: originalLine, exercise: normalizeWhitespace(line), weight });
  }

  return steps;
}
