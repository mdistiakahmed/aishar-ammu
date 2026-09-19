import { NextRequest } from "next/server";
import { requireBearer } from "@/lib/auth";
import { corsOptions, jsonError, jsonOk, readJson } from "@/lib/http";
import { loadMe, parseProfilePayload, saveParsedProfile } from "@/lib/profile";

export function OPTIONS() {
  return corsOptions();
}

export async function GET(request: NextRequest) {
  const auth = await requireBearer(request);
  if (!auth) return jsonError("unauthorized", 401);
  try {
    return jsonOk(await loadMe(auth.user.id));
  } catch {
    return jsonError("db", 500);
  }
}

export async function PATCH(request: NextRequest) {
  const auth = await requireBearer(request);
  if (!auth) return jsonError("unauthorized", 401);

  const parsed = parseProfilePayload(await readJson(request));
  if (!parsed.ok) {
    return jsonError(parsed.error, 400);
  }

  try {
    return jsonOk(await saveParsedProfile(auth.user, parsed));
  } catch {
    return jsonError("db", 500);
  }
}
