import { env } from "cloudflare:workers";
import type { BabyGender, UserRecord } from "@/lib/user";
import type { WeightLog } from "@/lib/weights";

export type { UserRecord };

type UserRow = {
  id: string;
  email: string;
  name: string;
  preferred_name: string | null;
  picture: string;
  pregnancy_start_date: string | null;
  next_doctor_visit_date: string | null;
  due_date: string | null;
  weight_at_start_kg: number | null;
  baby_gender: string | null;
};

type WeightRow = {
  logged_on: string;
  weight_kg: number;
};

const USER_COLUMNS = `id, email, name, preferred_name, picture, pregnancy_start_date, next_doctor_visit_date, due_date, weight_at_start_kg, baby_gender`;

function getDb() {
  const db = env.DB;
  if (!db) {
    throw new Error("Cloudflare D1 binding DB is missing");
  }
  return db;
}

export async function findUserById(id: string) {
  const row = await getDb()
    .prepare(`SELECT ${USER_COLUMNS} FROM users WHERE id = ?`)
    .bind(id)
    .first<UserRow>();
  return row ? toUser(row) : null;
}

export async function upsertGoogleUser(input: {
  email: string;
  name: string;
  picture: string;
}) {
  const row = await getDb()
    .prepare(
      `INSERT INTO users (id, email, name, preferred_name, picture, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, datetime('now'), datetime('now'))
       ON CONFLICT(email) DO UPDATE SET
         name = excluded.name,
         picture = excluded.picture,
         updated_at = datetime('now')
       RETURNING ${USER_COLUMNS}`,
    )
    .bind(crypto.randomUUID(), input.email, input.name, input.name, input.picture)
    .first<UserRow>();

  if (!row) {
    throw new Error("Could not save the signed-in user");
  }

  return toUser(row);
}

export async function updateUserProfile(
  userId: string,
  profile: {
    preferredName: string;
    pregnancyStartDate: string | null;
    nextDoctorVisitDate: string | null;
    dueDate: string | null;
    weightAtStartKg: number | null;
    babyGender: BabyGender | null;
  },
) {
  await getDb()
    .prepare(
      `UPDATE users
       SET preferred_name = ?,
           pregnancy_start_date = ?,
           next_doctor_visit_date = ?,
           due_date = ?,
           weight_at_start_kg = ?,
           baby_gender = ?,
           updated_at = datetime('now')
       WHERE id = ?`,
    )
    .bind(
      profile.preferredName,
      profile.pregnancyStartDate,
      profile.nextDoctorVisitDate,
      profile.dueDate,
      profile.weightAtStartKg,
      profile.babyGender,
      userId,
    )
    .run();
}

export async function listMotherWeightLogs(userId: string): Promise<WeightLog[]> {
  const result = await getDb()
    .prepare(
      `SELECT logged_on, weight_kg
       FROM mother_weight_logs
       WHERE user_id = ?
       ORDER BY logged_on ASC`,
    )
    .bind(userId)
    .all<WeightRow>();

  return (result.results ?? []).map((row) => ({
    loggedOn: row.logged_on,
    weightKg: row.weight_kg,
  }));
}

export async function upsertMotherWeightLog(userId: string, loggedOn: string, weightKg: number) {
  await getDb()
    .prepare(
      `INSERT INTO mother_weight_logs (user_id, logged_on, weight_kg)
       VALUES (?, ?, ?)
       ON CONFLICT(user_id, logged_on) DO UPDATE SET weight_kg = excluded.weight_kg`,
    )
    .bind(userId, loggedOn, weightKg)
    .run();
}

export async function deleteMotherWeightLog(userId: string, loggedOn: string) {
  await getDb()
    .prepare(`DELETE FROM mother_weight_logs WHERE user_id = ? AND logged_on = ?`)
    .bind(userId, loggedOn)
    .run();
}

type SessionRow = {
  id: string;
  user_id: string;
  expires_at: string;
};

type LoginCodeRow = {
  code: string;
  session_id: string;
  expires_at: string;
};

export async function createSession(userId: string, ttlSeconds: number) {
  const id = crypto.randomUUID();
  const expiresAt = new Date(Date.now() + ttlSeconds * 1000).toISOString();
  await getDb()
    .prepare(`INSERT INTO sessions (id, user_id, expires_at) VALUES (?, ?, ?)`)
    .bind(id, userId, expiresAt)
    .run();
  return id;
}

export async function findValidSession(id: string) {
  const row = await getDb()
    .prepare(`SELECT id, user_id, expires_at FROM sessions WHERE id = ?`)
    .bind(id)
    .first<SessionRow>();
  if (!row) return null;
  if (Date.parse(row.expires_at) <= Date.now()) {
    await deleteSession(id);
    return null;
  }
  return row;
}

export async function deleteSession(id: string) {
  await getDb().prepare(`DELETE FROM sessions WHERE id = ?`).bind(id).run();
}

export async function createLoginCode(sessionId: string, ttlSeconds: number) {
  const code = crypto.randomUUID();
  const expiresAt = new Date(Date.now() + ttlSeconds * 1000).toISOString();
  await getDb()
    .prepare(`INSERT INTO login_codes (code, session_id, expires_at) VALUES (?, ?, ?)`)
    .bind(code, sessionId, expiresAt)
    .run();
  return code;
}

export async function consumeLoginCode(code: string) {
  const row = await getDb()
    .prepare(`SELECT code, session_id, expires_at FROM login_codes WHERE code = ?`)
    .bind(code)
    .first<LoginCodeRow>();
  if (!row) return null;
  await getDb().prepare(`DELETE FROM login_codes WHERE code = ?`).bind(code).run();
  if (Date.parse(row.expires_at) <= Date.now()) return null;
  return row.session_id;
}

export async function listFavouriteBabyNameIds(userId: string) {
  const result = await getDb()
    .prepare(`SELECT name_id FROM favourite_baby_names WHERE user_id = ? ORDER BY name_id COLLATE NOCASE`)
    .bind(userId)
    .all<{ name_id: string }>();
  return (result.results ?? []).map((row) => row.name_id);
}

export async function addFavouriteBabyName(userId: string, nameId: string) {
  await getDb()
    .prepare(
      `INSERT INTO favourite_baby_names (user_id, name_id)
       VALUES (?, ?)
       ON CONFLICT(user_id, name_id) DO NOTHING`,
    )
    .bind(userId, nameId)
    .run();
}

export async function deleteFavouriteBabyName(userId: string, nameId: string) {
  await getDb()
    .prepare(`DELETE FROM favourite_baby_names WHERE user_id = ? AND name_id = ?`)
    .bind(userId, nameId)
    .run();
}

function toUser(row: UserRow): UserRecord {
  return {
    id: row.id,
    email: row.email,
    name: row.name,
    preferredName: row.preferred_name || row.name,
    picture: row.picture || "",
    pregnancyStartDate: row.pregnancy_start_date,
    nextDoctorVisitDate: row.next_doctor_visit_date,
    dueDate: row.due_date,
    weightAtStartKg: toKg(row.weight_at_start_kg),
    babyGender: toBabyGender(row.baby_gender),
  };
}

function toBabyGender(value: string | null): BabyGender | null {
  if (value === "girl" || value === "boy" || value === "unknown") return value;
  return null;
}

function toKg(value: number | null) {
  if (value === null || value === undefined || !Number.isFinite(Number(value))) return null;
  return Math.round(Number(value) * 10) / 10;
}
