const STOPWORDS = new Set(['the','a','an','and','or','of','for','to','in','on','at','with','by']);

function kebab(input: string): string {
  return (input || '')
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .trim()
    .replace(/\s+/g, '-');
}

export function buildTags(title: string, equipment: string[], types: string[]): string[] {
  const tags = new Set<string>();
  for (const t of types) if (t) tags.add(kebab(t));
  for (const e of equipment) if (e) tags.add(kebab(e));
  const words = (title || '')
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter(w => w && !STOPWORDS.has(w) && !/^[0-9]+$/.test(w));
  for (const w of words.slice(0, 3)) tags.add(kebab(w));
  return Array.from(tags);
}


