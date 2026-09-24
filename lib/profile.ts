import { parseOptionalDate } from "@/lib/dates";
import {
  deleteMotherWeightLog,
  findUserById,
  listMotherWeightLogs,
  updateUserProfile,
  upsertMotherWeightLog,
  type UserRecord,
} from "@/lib/db";
import { utcToday } from "@/lib/pregnancy";
import type { BabyGender } from "@/lib/user";
import { parseOptionalWeightKg, parsePreferredName } from "@/lib/weights";

export type ProfileError = "name" | "dates" | "weight" | "gender";

export type ParsedProfile =
  | { ok: false; error: ProfileError }
  | {
      ok: true;
      profile: {
        preferredName: string;
        pregnancyStartDate: string | null;
        nextDoctorVisitDate: string | null;
        dueDate: string | null;
        weightAtStartKg: number | null;
        babyGender: BabyGender | null;
      };
      weightTodayKg: number | null;
    };

function parseBabyGender(value: unknown): BabyGender | null | undefined {
  if (value === undefined || value === null) return null;
  const raw = String(value).trim().toLowerCase();
  if (raw === "") return null;
  if (raw === "girl" || raw === "boy" || raw === "unknown") return raw;
  return undefined;
}

function parseDateOrEmpty(value: unknown): { ok: true; value: string | null } | { ok: false } {
  const raw = String(value ?? "").trim();
  if (!raw) return { ok: true, value: null };
  const parsed = parseOptionalDate(raw);
  if (!parsed) return { ok: false };
  return { ok: true, value: parsed };
}

export function parseProfilePayload(
  body: Record<string, unknown> | null,
  existing: UserRecord,
): ParsedProfile {
  if (!body) return { ok: false, error: "name" };

  const nameRaw = String(body.preferredName ?? "").trim();
  let preferredName = existing.preferredName || existing.name;
  if (nameRaw) {
    const parsedName = parsePreferredName(body.preferredName, "");
    if (!parsedName) return { ok: false, error: "name" };
    preferredName = parsedName;
  }

  const pregnancyStart = parseDateOrEmpty(body.pregnancyStartDate);
  if (!pregnancyStart.ok) return { ok: false, error: "dates" };
  const due = parseDateOrEmpty(body.dueDate);
  if (!due.ok) return { ok: false, error: "dates" };
  const nextVisit = parseDateOrEmpty(body.nextDoctorVisitDate);
  if (!nextVisit.ok) return { ok: false, error: "dates" };

  const pregnancyStartDate = pregnancyStart.value ?? existing.pregnancyStartDate;
  const dueDate = due.value ?? existing.dueDate;
  // Empty next-visit field clears it; a filled value updates it.
  const nextDoctorVisitDate = nextVisit.value;

  const startWeightRaw = String(body.weightAtStartKg ?? "").trim();
  let weightAtStartKg = existing.weightAtStartKg;
  if (startWeightRaw) {
    const parsedWeight = parseOptionalWeightKg(body.weightAtStartKg);
    if (parsedWeight === null) return { ok: false, error: "weight" };
    weightAtStartKg = parsedWeight;
  }

  const babyGenderParsed = parseBabyGender(body.babyGender);
  if (babyGenderParsed === undefined) return { ok: false, error: "gender" };
  // Empty gender clears it.
  const babyGender = babyGenderParsed;

  if (pregnancyStartDate && dueDate && pregnancyStartDate > dueDate) {
    return { ok: false, error: "dates" };
  }

  const todayRaw = body.weightTodayKg;
  const todayFilled = todayRaw !== undefined && todayRaw !== null && String(todayRaw).trim() !== "";
  const weightTodayKg = todayFilled ? parseOptionalWeightKg(todayRaw) : null;
  if (todayFilled && weightTodayKg === null) return { ok: false, error: "weight" };

  return {
    ok: true,
    profile: {
      preferredName,
      pregnancyStartDate,
      nextDoctorVisitDate,
      dueDate,
      weightAtStartKg,
      babyGender,
    },
    weightTodayKg,
  };
}

export function parseWeightLogPayload(
  body: Record<string, unknown> | null,
  user: UserRecord,
): { ok: false; error: ProfileError } | { ok: true; loggedOn: string; weightKg: number } {
  if (!body) return { ok: false, error: "dates" };
  const loggedOn = parseOptionalDate(body.loggedOn);
  const weightKg = parseOptionalWeightKg(body.weightKg);
  const today = utcToday();

  if (!loggedOn || loggedOn > today) return { ok: false, error: "dates" };
  if (user.pregnancyStartDate && loggedOn < user.pregnancyStartDate) {
    return { ok: false, error: "dates" };
  }
  if (weightKg === null) return { ok: false, error: "weight" };

  return { ok: true, loggedOn, weightKg };
}

export async function saveParsedProfile(
  user: UserRecord,
  parsed: Extract<ParsedProfile, { ok: true }>,
) {
  await updateUserProfile(user.id, parsed.profile);
  if (parsed.profile.pregnancyStartDate && parsed.profile.weightAtStartKg !== null) {
    await upsertMotherWeightLog(
      user.id,
      parsed.profile.pregnancyStartDate,
      parsed.profile.weightAtStartKg,
    );
  }
  if (parsed.weightTodayKg !== null) {
    await upsertMotherWeightLog(user.id, utcToday(), parsed.weightTodayKg);
  }
  return loadMe(user.id);
}

export async function saveWeightLog(user: UserRecord, loggedOn: string, weightKg: number) {
  await upsertMotherWeightLog(user.id, loggedOn, weightKg);
  if (user.pregnancyStartDate && loggedOn === user.pregnancyStartDate) {
    await updateUserProfile(user.id, {
      preferredName: user.preferredName,
      pregnancyStartDate: user.pregnancyStartDate,
      nextDoctorVisitDate: user.nextDoctorVisitDate,
      dueDate: user.dueDate,
      weightAtStartKg: weightKg,
      babyGender: user.babyGender,
    });
  }
  return loadMe(user.id);
}

export async function removeWeightLog(user: UserRecord, loggedOn: string) {
  await deleteMotherWeightLog(user.id, loggedOn);
  const logs = await listMotherWeightLogs(user.id);
  if (user.pregnancyStartDate && loggedOn === user.pregnancyStartDate) {
    const startLog = logs.find((log) => log.loggedOn === user.pregnancyStartDate);
    await updateUserProfile(user.id, {
      preferredName: user.preferredName,
      pregnancyStartDate: user.pregnancyStartDate,
      nextDoctorVisitDate: user.nextDoctorVisitDate,
      dueDate: user.dueDate,
      weightAtStartKg: startLog ? startLog.weightKg : user.weightAtStartKg,
      babyGender: user.babyGender,
    });
  }
  return loadMe(user.id);
}

export async function loadMe(userId: string) {
  const user = await findUserById(userId);
  if (!user) throw new Error("User missing after save");
  const logs = await listMotherWeightLogs(userId);
  return { user, logs };
}
