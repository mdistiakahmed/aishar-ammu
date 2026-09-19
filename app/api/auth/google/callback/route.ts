import { NextRequest, NextResponse } from "next/server";
import {
  OAUTH_STATE_COOKIE,
  getGoogleCredentials,
  issueLoginCode,
  issueSession,
} from "@/lib/auth";
import { upsertGoogleUser } from "@/lib/db";

export async function GET(request: NextRequest) {
  const loginUrl = new URL("/login", request.url);
  const oauthError = request.nextUrl.searchParams.get("error");
  if (oauthError === "access_denied") {
    loginUrl.searchParams.set("error", "denied");
    return clearState(NextResponse.redirect(loginUrl), request);
  }
  if (oauthError) {
    loginUrl.searchParams.set("error", "oauth");
    return clearState(NextResponse.redirect(loginUrl), request);
  }

  const code = request.nextUrl.searchParams.get("code");
  const state = request.nextUrl.searchParams.get("state");
  const expectedState = request.cookies.get(OAUTH_STATE_COOKIE)?.value;
  const { clientId, clientSecret } = getGoogleCredentials();

  if (!code || !state || !expectedState || state !== expectedState) {
    loginUrl.searchParams.set("error", "state");
    return clearState(NextResponse.redirect(loginUrl), request);
  }

  if (!clientId || !clientSecret) {
    loginUrl.searchParams.set("error", "config");
    return clearState(NextResponse.redirect(loginUrl), request);
  }

  const origin = (process.env.AUTH_URL?.trim() || request.nextUrl.origin).replace(/\/$/, "");
  const redirectUri = `${origin}/api/auth/google/callback`;

  try {
    const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri,
        grant_type: "authorization_code",
      }),
    });

    if (!tokenResponse.ok) {
      loginUrl.searchParams.set("error", "oauth");
      return clearState(NextResponse.redirect(loginUrl), request);
    }

    const tokens = (await tokenResponse.json()) as { access_token?: string };
    if (!tokens.access_token) {
      loginUrl.searchParams.set("error", "oauth");
      return clearState(NextResponse.redirect(loginUrl), request);
    }

    const profileResponse = await fetch("https://www.googleapis.com/oauth2/v2/userinfo", {
      headers: { Authorization: `Bearer ${tokens.access_token}` },
    });

    if (!profileResponse.ok) {
      loginUrl.searchParams.set("error", "oauth");
      return clearState(NextResponse.redirect(loginUrl), request);
    }

    const profile = (await profileResponse.json()) as {
      email?: string;
      verified_email?: boolean;
      name?: string;
      picture?: string;
    };

    if (!profile.email || profile.verified_email === false) {
      loginUrl.searchParams.set("error", "oauth");
      return clearState(NextResponse.redirect(loginUrl), request);
    }

    try {
      const user = await upsertGoogleUser({
        email: profile.email,
        name: profile.name || profile.email,
        picture: profile.picture || "",
      });
      const token = await issueSession(user.id);
      const loginCode = await issueLoginCode(token);
      const callbackUrl = new URL("/auth/callback", request.url);
      callbackUrl.searchParams.set("code", loginCode);
      return clearState(NextResponse.redirect(callbackUrl), request);
    } catch {
      loginUrl.searchParams.set("error", "db");
      return clearState(NextResponse.redirect(loginUrl), request);
    }
  } catch {
    loginUrl.searchParams.set("error", "oauth");
    return clearState(NextResponse.redirect(loginUrl), request);
  }
}

function clearState(response: NextResponse, request: NextRequest) {
  response.cookies.set(OAUTH_STATE_COOKIE, "", {
    path: "/",
    maxAge: 0,
    secure: request.nextUrl.protocol === "https:",
  });
  return response;
}
