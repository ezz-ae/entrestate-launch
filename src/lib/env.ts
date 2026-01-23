// lib/env.ts
export function env(name: string, fallback?: string) {
  const v = process.env[name];
  if (v && v.trim() !== "") return v.trim();
  if (fallback !== undefined) return fallback;
  // don't throw in dev; warn and return empty string
  if (process.env.NODE_ENV !== "production") {
    console.warn(`[env] Missing ${name} (dev mode)`);
    return "";
  }
  throw new Error(`Missing required env var: ${name}`);
}

const warnedBools = new Set<string>();

export function envBool(name: string, defaultValue: boolean) {
  const raw = process.env[name];
  if (!raw || raw.trim() === '') {
    if (process.env.NODE_ENV !== 'production' && !warnedBools.has(name)) {
      warnedBools.add(name);
      console.warn(`[env] ${name} is not set; defaulting to ${String(defaultValue)}.`);
    }
    return defaultValue;
  }
  const normalized = raw.trim().toLowerCase();
  if (normalized === 'true') return true;
  if (normalized === 'false') return false;
  return defaultValue;
}
