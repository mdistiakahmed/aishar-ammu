import { parseOptionalDate } from "@/lib/dates";
import {
  getPregnancyMilestone,
  type PregnancyMilestone,
} from "@/lib/pregnancy-milestones";

const MS_PER_DAY = 86_400_000;
const PREGNANCY_DAYS = 280;
const FULL_TERM_WEEKS = 40;

export function utcToday(): string {
  const now = new Date();
  return toIsoDate(now.getUTCFullYear(), now.getUTCMonth() + 1, now.getUTCDate());
}

export function parseIsoDate(value: string): Date | null {
  const iso = parseOptionalDate(value);
  if (!iso) return null;
  const [year, month, day] = iso.split("-").map(Number);
  return new Date(Date.UTC(year, month - 1, day));
}

export function addUtcDays(iso: string, days: number): string {
  const date = parseIsoDate(iso);
  if (!date) return iso;
  date.setUTCDate(date.getUTCDate() + days);
  return toIsoDate(date.getUTCFullYear(), date.getUTCMonth() + 1, date.getUTCDate());
}

export function daysBetween(from: string, to: string): number {
  const start = parseIsoDate(from);
  const end = parseIsoDate(to);
  if (!start || !end) return 0;
  return Math.round((end.getTime() - start.getTime()) / MS_PER_DAY);
}

export function resolvePregnancyStart(saved: string | null) {
  if (saved && parseIsoDate(saved)) {
    return { start: saved, usingTodayFallback: false };
  }
  return { start: utcToday(), usingTodayFallback: true };
}

export function resolveDueDate(saved: string | null, start: string) {
  if (saved && parseIsoDate(saved)) {
    return { due: saved, estimated: false };
  }
  return { due: addUtcDays(start, PREGNANCY_DAYS), estimated: true };
}

export function gestationalAge(start: string, today = utcToday()) {
  const totalDays = Math.max(0, daysBetween(start, today));
  return {
    totalDays,
    week: Math.floor(totalDays / 7),
    day: totalDays % 7,
  };
}

export function trimester(week: number): 1 | 2 | 3 {
  if (week <= 13) return 1;
  if (week <= 27) return 2;
  return 3;
}

export function pregnancyProgress(week: number) {
  return Math.min(1, Math.max(0, week / FULL_TERM_WEEKS));
}

export type PregnancySnapshot = {
  start: string;
  usingTodayFallback: boolean;
  due: string;
  dueEstimated: boolean;
  week: number;
  day: number;
  trimester: 1 | 2 | 3;
  daysUntilDue: number;
  daysUntilVisit: number | null;
  visitPassed: boolean;
  progress: number;
  milestone: PregnancyMilestone;
};

export function buildPregnancySnapshot(input: {
  pregnancyStartDate: string | null;
  dueDate: string | null;
  nextDoctorVisitDate: string | null;
}): PregnancySnapshot {
  const today = utcToday();
  const { start, usingTodayFallback } = resolvePregnancyStart(input.pregnancyStartDate);
  const { due, estimated } = resolveDueDate(input.dueDate, start);
  const { week, day } = gestationalAge(start, today);
  const daysUntilDue = daysBetween(today, due);
  const visit = input.nextDoctorVisitDate && parseIsoDate(input.nextDoctorVisitDate)
    ? input.nextDoctorVisitDate
    : null;
  const daysUntilVisit = visit ? daysBetween(today, visit) : null;

  return {
    start,
    usingTodayFallback,
    due,
    dueEstimated: estimated,
    week,
    day,
    trimester: trimester(week),
    daysUntilDue,
    daysUntilVisit,
    visitPassed: daysUntilVisit !== null && daysUntilVisit < 0,
    progress: pregnancyProgress(week),
    milestone: getPregnancyMilestone(week),
  };
}

function toIsoDate(year: number, month: number, day: number) {
  return `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}
