import { expectedMaternalGainKg } from "@/lib/mother-gain";
import { MAX_WEIGHT_KG, MIN_WEIGHT_KG, parseOptionalWeightKg } from "@/lib/weights";

export const MOTHER_WEIGHT_STORAGE_KEY = "aishar-mother-weights";
export const DEFAULT_WEEK_1_WEIGHT_KG = 50;
export const MIN_PREGNANCY_WEEK = 1;
export const MAX_PREGNANCY_WEEK = 42;

export type MotherWeightLog = Record<string, number>;

export type MotherWeightPoint = {
  week: number;
  expected: number;
  actual: number | null;
};

const EMPTY_LOG: MotherWeightLog = {};
const listeners = new Set<() => void>();
let snapshotRaw = "";
let snapshotLog: MotherWeightLog = EMPTY_LOG;

export function readMotherWeights(): MotherWeightLog {
  if (typeof window === "undefined") return EMPTY_LOG;
  return getMotherWeightSnapshot();
}

export function subscribeMotherWeights(onStoreChange: () => void) {
  listeners.add(onStoreChange);
  const onStorage = (event: StorageEvent) => {
    if (event.key !== null && event.key !== MOTHER_WEIGHT_STORAGE_KEY) return;
    onStoreChange();
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(onStoreChange);
    window.removeEventListener("storage", onStorage);
  };
}

export function getMotherWeightSnapshot(): MotherWeightLog {
  const raw = window.localStorage.getItem(MOTHER_WEIGHT_STORAGE_KEY) ?? "";
  if (raw === snapshotRaw) return snapshotLog;
  snapshotRaw = raw;
  snapshotLog = parseStoredMotherWeights(raw);
  return snapshotLog;
}

export function getMotherWeightsServerSnapshot(): MotherWeightLog {
  return EMPTY_LOG;
}

export function writeMotherWeights(log: MotherWeightLog) {
  const sorted: MotherWeightLog = {};
  for (const week of Object.keys(log).sort((a, b) => Number(a) - Number(b))) {
    sorted[week] = log[week];
  }
  window.localStorage.setItem(MOTHER_WEIGHT_STORAGE_KEY, JSON.stringify(sorted));
  for (const listener of listeners) listener();
}

export function referenceWeightKg(log: MotherWeightLog) {
  return log["1"] ?? DEFAULT_WEEK_1_WEIGHT_KG;
}

export function withWeekWeight(log: MotherWeightLog, week: number, weightKg: number): MotherWeightLog {
  return { ...log, [String(week)]: weightKg };
}

export function withoutWeekWeight(log: MotherWeightLog, week: number): MotherWeightLog {
  const next = { ...log };
  delete next[String(week)];
  return next;
}

export function expectedWeightKg(referenceKg: number, week: number) {
  const day = Math.max(0, (week - 1) * 7);
  return Math.round((referenceKg + expectedMaternalGainKg(day)) * 10) / 10;
}

export function weightForWeek(log: MotherWeightLog, week: number) {
  const stored = log[String(week)];
  if (typeof stored === "number") return stored;
  if (week === 1) return referenceWeightKg(log);
  return null;
}

export function motherWeightSummary(log: MotherWeightLog) {
  const startingKg = referenceWeightKg(log);
  const recorded = savedWeeks(log).sort((a, b) => a.week - b.week);
  const latest = recorded[recorded.length - 1];
  return {
    startingKg,
    currentKg: latest.weightKg,
    gainKg: Math.round((latest.weightKg - startingKg) * 10) / 10,
    lastWeek: latest.week,
  };
}

export function motherWeightChart(log: MotherWeightLog): MotherWeightPoint[] {
  const reference = referenceWeightKg(log);
  const recorded = savedWeeks(log).map((row) => row.week);
  const start = Math.min(...recorded);
  const last = Math.max(...recorded);
  const end = Math.min(MAX_PREGNANCY_WEEK, Math.max(last + 10, start + 19));
  const points: MotherWeightPoint[] = [];
  for (let week = start; week <= end; week += 1) {
    points.push({
      week,
      expected: expectedWeightKg(reference, week),
      actual: weightForWeek(log, week),
    });
  }
  return points;
}

export function chartWeekTicks(start: number, end: number) {
  const ticks: number[] = [];
  for (let week = Math.ceil(start / 4) * 4; week <= end; week += 4) ticks.push(week);
  if (ticks.length === 0 || ticks[0] - start >= 2) ticks.unshift(start);
  const lastTick = ticks[ticks.length - 1];
  if (lastTick !== end && end - lastTick >= 2) ticks.push(end);
  return ticks;
}

export function chartWeightTicks(points: MotherWeightPoint[]) {
  const values = points.flatMap((point) =>
    point.actual === null ? [point.expected] : [point.expected, point.actual],
  );
  const low = Math.floor((Math.min(...values) - 2) / 5) * 5;
  const high = Math.ceil((Math.max(...values) + 2) / 5) * 5;
  const ticks: number[] = [];
  for (let value = low; value <= high; value += 5) ticks.push(value);
  return ticks;
}

export function savedWeeks(log: MotherWeightLog) {
  const later = Object.entries(log)
    .map(([week, weightKg]) => ({ week: Number(week), weightKg }))
    .filter((row) => Number.isInteger(row.week) && row.week !== 1)
    .sort((a, b) => b.week - a.week);
  return [{ week: 1, weightKg: referenceWeightKg(log) }, ...later];
}

export function parseWeightWeek(value: unknown) {
  const raw = String(value ?? "").trim();
  if (!/^\d{1,2}$/.test(raw)) return null;
  const week = Number(raw);
  if (week < MIN_PREGNANCY_WEEK || week > MAX_PREGNANCY_WEEK) return null;
  return week;
}

export function parseMotherWeightKg(value: unknown) {
  return parseOptionalWeightKg(value);
}

export { MAX_WEIGHT_KG, MIN_WEIGHT_KG };

function parseStoredMotherWeights(raw: string): MotherWeightLog {
  if (!raw) return EMPTY_LOG;
  try {
    const parsed = parseMotherWeights(JSON.parse(raw));
    return Object.keys(parsed).length ? parsed : EMPTY_LOG;
  } catch {
    return EMPTY_LOG;
  }
}

function parseMotherWeights(value: unknown): MotherWeightLog {
  if (!value || typeof value !== "object" || Array.isArray(value)) return {};
  const log: MotherWeightLog = {};
  for (const [week, weight] of Object.entries(value)) {
    const parsedWeek = parseWeightWeek(week);
    if (parsedWeek === null) continue;
    if (typeof weight !== "number" || !Number.isFinite(weight)) continue;
    if (weight < MIN_WEIGHT_KG || weight > MAX_WEIGHT_KG) continue;
    log[String(parsedWeek)] = Math.round(weight * 10) / 10;
  }
  return log;
}
