import { parseOptionalDate } from "@/lib/dates";

const STORAGE_PREFIX = "aishar-next-doctor-visit:";

export type NextDoctorVisit = {
  date: string;
  time: string;
  doctorName: string;
};

export function nextDoctorVisitKey(userId: string) {
  return `${STORAGE_PREFIX}${userId}`;
}

export function readNextDoctorVisit(userId: string): NextDoctorVisit | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(nextDoctorVisitKey(userId));
    if (!raw) return null;
    return parseVisit(JSON.parse(raw));
  } catch {
    return null;
  }
}

export function writeNextDoctorVisit(userId: string, visit: NextDoctorVisit) {
  window.localStorage.setItem(nextDoctorVisitKey(userId), JSON.stringify(visit));
}

export function parseVisitTime(value: string) {
  const raw = value.trim();
  if (!raw) return "";
  if (!/^([01]\d|2[0-3]):[0-5]\d$/.test(raw)) return null;
  return raw;
}

function parseVisit(value: unknown): NextDoctorVisit | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  const record = value as Record<string, unknown>;
  const date = parseOptionalDate(record.date);
  if (!date) return null;
  const time = parseVisitTime(String(record.time ?? ""));
  const doctorName = String(record.doctorName ?? "").trim().slice(0, 80);
  return { date, time: time ?? "", doctorName };
}
