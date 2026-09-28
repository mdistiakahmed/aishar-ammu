import { parseOptionalDate } from "@/lib/dates";

export const BABY_MOVEMENT_STORAGE_KEY = "aishar-baby-movements";
export const MAX_MOVEMENT_SETS = 200;
export const MOVEMENT_REFERENCE_COUNT = 10;

export type MovementLog = Record<string, number>;

export type MovementDay = {
  date: string;
  count: number;
};

export function localDateKey(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function readMovementLog(): MovementLog {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(BABY_MOVEMENT_STORAGE_KEY);
    if (!raw) return {};
    return parseMovementLog(JSON.parse(raw));
  } catch {
    return {};
  }
}

export function writeMovementLog(log: MovementLog) {
  const sorted: MovementLog = {};
  for (const date of Object.keys(log).sort((a, b) => b.localeCompare(a))) {
    sorted[date] = log[date];
  }
  window.localStorage.setItem(BABY_MOVEMENT_STORAGE_KEY, JSON.stringify(sorted));
}

export function movementCount(log: MovementLog, date: string) {
  return log[date] ?? 0;
}

export function withMovementCount(log: MovementLog, date: string, count: number): MovementLog {
  return { ...log, [date]: count };
}

export function withoutMovementDate(log: MovementLog, date: string): MovementLog {
  const next = { ...log };
  delete next[date];
  return next;
}

export function stepMovementCount(log: MovementLog, date: string, delta: 1 | -1): MovementLog {
  const next = Math.min(MAX_MOVEMENT_SETS, Math.max(0, movementCount(log, date) + delta));
  return withMovementCount(log, date, next);
}

export function movementChartDays(log: MovementLog, today: string): MovementDay[] {
  const dates = new Set(Object.keys(log));
  if (today) dates.add(today);
  return [...dates].sort().map((date) => ({ date, count: movementCount(log, date) }));
}

export function earlierMovementDays(log: MovementLog, today: string): MovementDay[] {
  return Object.entries(log)
    .filter(([date]) => date < today)
    .map(([date, count]) => ({ date, count }))
    .sort((a, b) => b.date.localeCompare(a.date));
}

export function parseMovementCount(value: unknown) {
  const raw = String(value ?? "").trim();
  if (!/^\d{1,3}$/.test(raw)) return null;
  const count = Number(raw);
  if (!Number.isInteger(count) || count > MAX_MOVEMENT_SETS) return null;
  return count;
}

export function parsePastMovementDate(value: unknown, today: string) {
  const date = parseOptionalDate(value);
  if (!date || date >= today) return null;
  return date;
}

function parseMovementLog(value: unknown): MovementLog {
  if (!value || typeof value !== "object" || Array.isArray(value)) return {};
  const log: MovementLog = {};
  for (const [date, count] of Object.entries(value)) {
    if (!parseOptionalDate(date)) continue;
    if (typeof count !== "number" || !Number.isInteger(count)) continue;
    if (count < 0 || count > MAX_MOVEMENT_SETS) continue;
    log[date] = count;
  }
  return log;
}
