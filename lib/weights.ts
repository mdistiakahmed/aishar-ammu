export const MIN_WEIGHT_KG = 30;
export const MAX_WEIGHT_KG = 180;
export const WEIGHT_COOKIE_CAP = 80;

export type WeightLog = {
  loggedOn: string;
  weightKg: number;
};

export type CompactWeightLog = {
  d: string;
  w: number;
};

export function parsePreferredName(value: unknown, fallback: string) {
  const raw = String(value ?? "").trim().replace(/\s+/g, " ");
  if (!raw) return fallback.trim() || fallback;
  if (raw.length > 40) return null;
  return raw;
}

export function parseOptionalWeightKg(value: unknown) {
  const raw = String(value ?? "").trim();
  if (!raw) return null;
  if (!/^\d{1,3}(\.\d)?$/.test(raw)) return null;
  const kg = Number(raw);
  if (!Number.isFinite(kg)) return null;
  if (kg < MIN_WEIGHT_KG || kg > MAX_WEIGHT_KG) return null;
  return Math.round(kg * 10) / 10;
}

export function compactWeightLogs(logs: WeightLog[]): CompactWeightLog[] {
  const sorted = [...logs].sort((a, b) => a.loggedOn.localeCompare(b.loggedOn));
  const kept = sorted.slice(-WEIGHT_COOKIE_CAP);
  return kept.map((row) => ({ d: row.loggedOn, w: row.weightKg }));
}

export function expandWeightLogs(rows: CompactWeightLog[] | null): WeightLog[] | null {
  if (!Array.isArray(rows)) return null;
  const logs: WeightLog[] = [];
  for (const row of rows) {
    if (!row || typeof row.d !== "string" || typeof row.w !== "number") continue;
    if (row.w < MIN_WEIGHT_KG || row.w > MAX_WEIGHT_KG) continue;
    logs.push({ loggedOn: row.d, weightKg: row.w });
  }
  return logs;
}

export function weightOnDate(logs: WeightLog[], loggedOn: string) {
  return logs.find((log) => log.loggedOn === loggedOn)?.weightKg ?? null;
}

export function formatWeightInput(value: number | null) {
  if (value === null || !Number.isFinite(value)) return "";
  return String(value);
}
