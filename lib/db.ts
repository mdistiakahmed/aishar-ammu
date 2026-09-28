import { env } from "cloudflare:workers";
import type { UserRecord } from "@/lib/user";

export type { UserRecord };

type UserRow = {
  id: string;
  email: string;
  name: string;
  picture: string;
};

const USER_COLUMNS = `id, email, name, picture`;

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
      `INSERT INTO users (id, email, name, picture, created_at, updated_at)
       VALUES (?, ?, ?, ?, datetime('now'), datetime('now'))
       ON CONFLICT(email) DO UPDATE SET
         name = excluded.name,
         picture = excluded.picture,
         updated_at = datetime('now')
       RETURNING ${USER_COLUMNS}`,
    )
    .bind(crypto.randomUUID(), input.email, input.name, input.picture)
    .first<UserRow>();

  if (!row) {
    throw new Error("Could not save the signed-in user");
  }

  return toUser(row);
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

function toUser(row: UserRow): UserRecord {
  return {
    id: row.id,
    email: row.email,
    name: row.name,
    preferredName: row.name,
    picture: row.picture || "",
    pregnancyStartDate: null,
    nextDoctorVisitDate: null,
    dueDate: null,
    weightAtStartKg: null,
    babyGender: null,
  };
}
