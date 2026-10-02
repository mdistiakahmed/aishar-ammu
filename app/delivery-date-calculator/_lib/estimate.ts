import { addUtcDays, daysBetween, parseIsoDate, trimester, utcToday } from "@/lib/pregnancy";

const NAEGELE_DAYS = 280;
const DEFAULT_CYCLE = 28;

export type DueDateEstimate = {
  due: string;
  start: string;
  signedAgeDays: number;
  week: number;
  day: number;
  daysUntilDue: number;
  trimester: 1 | 2 | 3 | null;
};

function fromStart(start: string, due: string, today: string): DueDateEstimate | null {
  if (!parseIsoDate(start) || !parseIsoDate(due)) return null;
  const signedAgeDays = daysBetween(start, today);
  const week = signedAgeDays > 0 ? Math.floor(signedAgeDays / 7) : 0;
  const day = signedAgeDays > 0 ? signedAgeDays % 7 : 0;
  return {
    due,
    start,
    signedAgeDays,
    week,
    day,
    daysUntilDue: daysBetween(today, due),
    trimester: signedAgeDays >= 0 ? trimester(week) : null,
  };
}

/** Usual Naegele estimate: last period + 280 days, shifted when the cycle is not 28 days. */
export function estimateFromLastPeriod(lmp: string, cycleLength: number, today = utcToday()) {
  if (!parseIsoDate(lmp)) return null;
  const cycle = Math.min(35, Math.max(21, Math.round(cycleLength)));
  const due = addUtcDays(lmp, NAEGELE_DAYS + (cycle - DEFAULT_CYCLE));
  return fromStart(lmp, due, today);
}

/** Back-count a reported scan age, then use the same 280-day span. */
export function estimateFromScan(
  scanDate: string,
  weeks: number,
  days: number,
  today = utcToday(),
) {
  if (!parseIsoDate(scanDate)) return null;
  const ageDays = Math.round(weeks) * 7 + Math.round(days);
  if (ageDays < 0 || ageDays > 42 * 7) return null;
  const start = addUtcDays(scanDate, -ageDays);
  return fromStart(start, addUtcDays(start, NAEGELE_DAYS), today);
}

/** A doctor-given due date replaces the estimate and recounts the 280-day span from that date. */
export function estimateFromDoctorDue(due: string, today = utcToday()) {
  if (!parseIsoDate(due)) return null;
  return fromStart(addUtcDays(due, -NAEGELE_DAYS), due, today);
}
