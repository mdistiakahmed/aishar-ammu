import { NextRequest, NextResponse } from "next/server";
import {
  OAUTH_STATE_COOKIE,
  cookieOptions,
  getAllowedGoogleAudiences,
  getGoogleCredentials,
  issueSession,
} from "@/lib/auth";
import { upsertGoogleUser } from "@/lib/db";
import { corsOptions, jsonError, jsonOk, readJson } from "@/lib/http";

export function OPTIONS() {
  return corsOptions();
}

export async function GET(request: NextRequest) {
  const { clientId } = getGoogleCredentials();
  if (!clientId) {
    return NextResponse.redirect(new URL("/login?error=config", request.url));
  }

  const origin = (process.env.AUTH_URL?.trim() || request.nextUrl.origin).replace(/\/$/, "");
  const secure = request.nextUrl.protocol === "https:";
  const state = crypto.randomUUID();
  const redirectUri = `${origin}/api/auth/google/callback`;
  const googleUrl = new URL("https://accounts.google.com/o/oauth2/v2/auth");
  googleUrl.searchParams.set("client_id", clientId);
  googleUrl.searchParams.set("redirect_uri", redirectUri);
  googleUrl.searchParams.set("response_type", "code");
  googleUrl.searchParams.set("scope", "openid email profile");
  googleUrl.searchParams.set("state", state);
  googleUrl.searchParams.set("prompt", "select_account");

  const response = NextResponse.redirect(googleUrl);
  response.cookies.set(OAUTH_STATE_COOKIE, state, cookieOptions(60 * 10, secure));
  return response;
}

export async function POST(request: NextRequest) {
  const body = await readJson(request);
  const idToken = typeof body?.idToken === "string" ? body.idToken.trim() : "";
  if (!idToken) return jsonError("oauth", 400);

  const profile = await verifyGoogleIdToken(idToken);
  if (!profile) return jsonError("oauth", 401);

  try {
    const user = await upsertGoogleUser(profile);
    const token = await issueSession(user.id);
    return jsonOk({ token, user });
  } catch {
    return jsonError("db", 500);
  }
}

async function verifyGoogleIdToken(idToken: string) {
  const response = await fetch(
    `https://oauth2.googleapis.com/tokeninfo?id_token=${encodeURIComponent(idToken)}`,
  );
  if (!response.ok) return null;

  const payload = (await response.json()) as {
    aud?: string;
    email?: string;
    email_verified?: boolean | string;
    name?: string;
    picture?: string;
  };

  const audiences = getAllowedGoogleAudiences();
  if (!payload.aud || !audiences.includes(payload.aud)) return null;
  if (payload.email_verified === false || payload.email_verified === "false") return null;
  if (!payload.email) return null;

  return {
    email: payload.email,
    name: payload.name || payload.email,
    picture: payload.picture || "",
  };
}
