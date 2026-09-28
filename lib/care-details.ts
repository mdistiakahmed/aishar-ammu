import { utcToday } from "@/lib/pregnancy";
import { parseProfilePayload, parseWeightLogPayload, type ProfileError } from "@/lib/profile-parse";
import type { BabyGender, SessionUser } from "@/lib/user";
import { parseOptionalDate } from "@/lib/dates";
import { parseOptionalWeightKg, parsePreferredName, type WeightLog } from "@/lib/weights";

const STORAGE_PREFIX = "aishar-care-details:";

type StoredCareDetails = {
  preferredName: string;
  pregnancyStartDate: string | null;
  nextDoctorVisitDate: string | null;
  dueDate: string | null;
  weightAtStartKg: number | null;
  babyGender: BabyGender | null;
  logs: WeightLog[];
};

export function careDetailsKey(userId: string) {
  return `${STORAGE_PREFIX}${userId}`;
}

export function loadStoredCareDetails(user: SessionUser) {
  const stored = readCareDetails(user.id);
  if (!stored) return null;
  return applyStored(user, stored);
}

export function hydrateCareDetails(user: SessionUser, logs: WeightLog[]) {
  const stored = readCareDetails(user.id);
  if (!stored) {
    try {
      writeCareDetails(user.id, toStored(user, logs));
    } catch {
      return { user, logs };
    }
    return { user, logs };
  }
  return applyStored(user, stored);
}

export function saveLocalProfile(
  user: SessionUser,
  logs: WeightLog[],
  body: Record<string, unknown>,
): { ok: false; error: ProfileError } | { ok: true; user: SessionUser; logs: WeightLog[] } {
  const parsed = parseProfilePayload(body, user);
  if (!parsed.ok) return parsed;

  let nextLogs = logs;
  const nextUser: SessionUser = { ...user, ...parsed.profile };
  if (nextUser.pregnancyStartDate && nextUser.weightAtStartKg !== null) {
    nextLogs = upsertLog(nextLogs, nextUser.pregnancyStartDate, nextUser.weightAtStartKg);
  }
  if (parsed.weightTodayKg !== null) {
    nextLogs = upsertLog(nextLogs, utcToday(), parsed.weightTodayKg);
  }
  writeCareDetails(nextUser.id, toStored(nextUser, nextLogs));
  return { ok: true, user: nextUser, logs: nextLogs };
}

export function saveLocalWeightLog(
  user: SessionUser,
  logs: WeightLog[],
  body: Record<string, unknown>,
): { ok: false; error: ProfileError } | { ok: true; user: SessionUser; logs: WeightLog[] } {
  const parsed = parseWeightLogPayload(body, user);
  if (!parsed.ok) return parsed;

  const nextLogs = upsertLog(logs, parsed.loggedOn, parsed.weightKg);
  const nextUser =
    user.pregnancyStartDate && parsed.loggedOn === user.pregnancyStartDate
      ? { ...user, weightAtStartKg: parsed.weightKg }
      : user;
  writeCareDetails(nextUser.id, toStored(nextUser, nextLogs));
  return { ok: true, user: nextUser, logs: nextLogs };
}

export function removeLocalWeightLog(user: SessionUser, logs: WeightLog[], loggedOn: string) {
  const nextLogs = logs.filter((log) => log.loggedOn !== loggedOn);
  let nextUser = user;
  if (user.pregnancyStartDate && loggedOn === user.pregnancyStartDate) {
    const startLog = nextLogs.find((log) => log.loggedOn === user.pregnancyStartDate);
    nextUser = {
      ...user,
      weightAtStartKg: startLog ? startLog.weightKg : user.weightAtStartKg,
    };
  }
  writeCareDetails(nextUser.id, toStored(nextUser, nextLogs));
  return { user: nextUser, logs: nextLogs };
}

function applyStored(user: SessionUser, stored: StoredCareDetails) {
  return {
    user: {
      ...user,
      preferredName: stored.preferredName || user.name,
      pregnancyStartDate: stored.pregnancyStartDate,
      nextDoctorVisitDate: stored.nextDoctorVisitDate,
      dueDate: stored.dueDate,
      weightAtStartKg: stored.weightAtStartKg,
      babyGender: stored.babyGender,
    },
    logs: stored.logs,
  };
}

function readCareDetails(userId: string): StoredCareDetails | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(careDetailsKey(userId));
    if (!raw) return null;
    return parseStored(JSON.parse(raw));
  } catch {
    return null;
  }
}

function writeCareDetails(userId: string, details: StoredCareDetails) {
  window.localStorage.setItem(careDetailsKey(userId), JSON.stringify(details));
}

function toStored(user: SessionUser, logs: WeightLog[]): StoredCareDetails {
  return {
    preferredName: user.preferredName || user.name,
    pregnancyStartDate: user.pregnancyStartDate,
    nextDoctorVisitDate: user.nextDoctorVisitDate,
    dueDate: user.dueDate,
    weightAtStartKg: user.weightAtStartKg,
    babyGender: user.babyGender,
    logs: [...logs].sort((a, b) => a.loggedOn.localeCompare(b.loggedOn)),
  };
}

function upsertLog(logs: WeightLog[], loggedOn: string, weightKg: number) {
  return [...logs.filter((log) => log.loggedOn !== loggedOn), { loggedOn, weightKg }].sort((a, b) =>
    a.loggedOn.localeCompare(b.loggedOn),
  );
}

function parseStored(value: unknown): StoredCareDetails | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  const record = value as Record<string, unknown>;
  const preferredName = parsePreferredName(record.preferredName, "") ?? "";
  return {
    preferredName,
    pregnancyStartDate: optionalDate(record.pregnancyStartDate),
    nextDoctorVisitDate: optionalDate(record.nextDoctorVisitDate),
    dueDate: optionalDate(record.dueDate),
    weightAtStartKg: optionalWeight(record.weightAtStartKg),
    babyGender: optionalGender(record.babyGender),
    logs: parseLogs(record.logs),
  };
}

function optionalDate(value: unknown) {
  if (value === null || value === undefined || value === "") return null;
  return parseOptionalDate(value);
}

function optionalWeight(value: unknown) {
  if (value === null || value === undefined || value === "") return null;
  return parseOptionalWeightKg(value);
}

function optionalGender(value: unknown): BabyGender | null {
  if (value === "girl" || value === "boy" || value === "unknown") return value;
  return null;
}

function parseLogs(value: unknown): WeightLog[] {
  if (!Array.isArray(value)) return [];
  const logs: WeightLog[] = [];
  for (const row of value) {
    if (!row || typeof row !== "object") continue;
    const item = row as Record<string, unknown>;
    const loggedOn = parseOptionalDate(item.loggedOn);
    const weightKg = parseOptionalWeightKg(item.weightKg);
    if (!loggedOn || weightKg === null) continue;
    logs.push({ loggedOn, weightKg });
  }
  return logs.sort((a, b) => a.loggedOn.localeCompare(b.loggedOn));
}
