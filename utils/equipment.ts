export const BASE_EQUIPMENT = [
  'barbell',
  'dumbbell',
  'kettlebell',
  'medicine ball',
  'sandbag',
  'rower',
  'bike',
  'assault bike',
  'treadmill',
  'ski erg',
  'box',
  'bands',
  'bodyweight',
  'rope',
  'sled',
];

/** Lowercase, trim, simple plural singularization, and alias mapping */
export function normalizeEquip(term: string): string {
  let t = (term || '').toLowerCase().trim();
  const aliases: Record<string, string> = {
    kb: 'kettlebell',
    kbs: 'kettlebell',
    db: 'dumbbell',
    dbs: 'dumbbell',
    erg: 'rower',
    skierg: 'ski erg',
    'ski-erg': 'ski erg',
    'assault-bike': 'assault bike',
    'airbike': 'assault bike',
    'air bike': 'assault bike',
    mb: 'medicine ball',
    band: 'bands',
  };
  if (aliases[t]) return aliases[t];
  // simple plural handling
  if (t.endsWith('s') && !t.endsWith('ss')) {
    const singular = t.slice(0, -1);
    // keep known plurals like 'bands' as-is
    if (!['bands'].includes(t)) t = singular;
  }
  return t;
}

function levenshteinDistance(a: string, b: string): number {
  const dp: number[][] = Array.from({ length: a.length + 1 }, () => new Array(b.length + 1).fill(0));
  for (let i = 0; i <= a.length; i++) dp[i][0] = i;
  for (let j = 0; j <= b.length; j++) dp[0][j] = j;
  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      dp[i][j] = Math.min(dp[i - 1][j] + 1, dp[i][j - 1] + 1, dp[i - 1][j - 1] + cost);
    }
  }
  return dp[a.length][b.length];
}

export function detectEquipment(text: string, userList: string[] = []): string[] {
  const hay = (text || '').toLowerCase();
  const dict = Array.from(new Set([...BASE_EQUIPMENT, ...userList.map(normalizeEquip)]));
  const found = new Set<string>();

  for (const item of dict) {
    const norm = normalizeEquip(item);
    if (!norm) continue;
    // whole-word check
    const wordRe = new RegExp(`(^|[^a-z])${norm.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&')}(?=[^a-z]|$)`, 'i');
    if (wordRe.test(hay)) {
      found.add(norm);
      continue;
    }
    // near match (distance <= 1)
    const tokens = hay.split(/[^a-z]+/i).filter(Boolean);
    for (const tok of tokens) {
      if (levenshteinDistance(tok, norm) <= 1) {
        found.add(norm);
        break;
      }
    }
  }
  return Array.from(found);
}


