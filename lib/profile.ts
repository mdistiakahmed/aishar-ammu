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
import { parseOptionalWeightKg, parsePreferredName } from "@/lib/weights";

export type ProfileError = "name" | "dates" | "weight";

export type ParsedProfile =
  | { ok: false; error: ProfileError }
  | {
      ok: true;
      profile: {
        preferredName: string;
        pregnancyStartDate: string;
        nextDoctorVisitDate: string | null;
        dueDate: string;
        weightAtStartKg: number;
      };
      weightTodayKg: number | null;
    };

export function parseProfilePayload(body: Record<string, unknown> | null): ParsedProfile {
  if (!body) return { ok: false, error: "name" };

  const preferredName = parsePreferredName(body.preferredName, "");
  const pregnancyStartDate = parseOptionalDate(body.pregnancyStartDate);
  const dueDate = parseOptionalDate(body.dueDate);
  const nextDoctorVisitDate = parseOptionalDate(body.nextDoctorVisitDate);
  const weightAtStartKg = parseOptionalWeightKg(body.weightAtStartKg);
  const todayRaw = body.weightTodayKg;
  const todayFilled = todayRaw !== undefined && todayRaw !== null && String(todayRaw).trim() !== "";
  const weightTodayKg = todayFilled ? parseOptionalWeightKg(todayRaw) : null;

  if (!preferredName) return { ok: false, error: "name" };
  if (!pregnancyStartDate || !dueDate || pregnancyStartDate > dueDate) {
    return { ok: false, error: "dates" };
  }
  if (weightAtStartKg === null) return { ok: false, error: "weight" };
  if (todayFilled && weightTodayKg === null) return { ok: false, error: "weight" };

  return {
    ok: true,
    profile: {
      preferredName,
      pregnancyStartDate,
      nextDoctorVisitDate,
      dueDate,
      weightAtStartKg,
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
  await upsertMotherWeightLog(
    user.id,
    parsed.profile.pregnancyStartDate,
    parsed.profile.weightAtStartKg,
  );
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
