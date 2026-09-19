import {
  consumeLoginCode,
  createLoginCode,
  createSession,
  deleteSession,
  findUserById,
  findValidSession,
} from "@/lib/db";

export type { SessionUser } from "@/lib/user";

export const OAUTH_STATE_COOKIE = "ammu_oauth_state";
export const SESSION_MAX_AGE = 60 * 60 * 24 * 30;
export const LOGIN_CODE_TTL = 60;

export async function issueSession(userId: string) {
  return createSession(userId, SESSION_MAX_AGE);
}

export async function issueLoginCode(sessionId: string) {
  return createLoginCode(sessionId, LOGIN_CODE_TTL);
}

export async function exchangeLoginCode(code: string) {
  const sessionId = await consumeLoginCode(code);
  if (!sessionId) return null;
  const session = await findValidSession(sessionId);
  if (!session) return null;
  const user = await findUserById(session.user_id);
  if (!user) return null;
  return { token: session.id, user };
}

export async function requireBearer(request: Request) {
  const header = request.headers.get("authorization") || "";
  const match = /^Bearer\s+(\S+)$/i.exec(header);
  if (!match) return null;
  const token = match[1];
  const session = await findValidSession(token);
  if (!session) return null;
  const user = await findUserById(session.user_id);
  if (!user) return null;
  return { user, token };
}

export async function revokeBearer(request: Request) {
  const auth = await requireBearer(request);
  if (!auth) return false;
  await deleteSession(auth.token);
  return true;
}

export function getGoogleCredentials() {
  return {
    clientId: process.env.GOOGLE_CLIENT_ID?.trim() || "",
    clientSecret: process.env.GOOGLE_CLIENT_SECRET?.trim() || "",
  };
}

export function getAllowedGoogleAudiences() {
  const extra = (process.env.GOOGLE_CLIENT_IDS || "")
    .split(",")
    .map((value) => value.trim())
    .filter(Boolean);
  const { clientId } = getGoogleCredentials();
  return [...new Set([clientId, ...extra].filter(Boolean))];
}

export function cookieOptions(maxAgeSeconds: number, secure: boolean) {
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    secure,
    path: "/",
    maxAge: maxAgeSeconds,
  };
}
