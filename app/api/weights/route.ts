import { NextRequest } from "next/server";
import { requireBearer } from "@/lib/auth";
import { parseOptionalDate } from "@/lib/dates";
import { corsOptions, jsonError, jsonOk, readJson } from "@/lib/http";
import { loadMe, parseWeightLogPayload, removeWeightLog, saveWeightLog } from "@/lib/profile";

export function OPTIONS() {
  return corsOptions();
}

export async function GET(request: NextRequest) {
  const auth = await requireBearer(request);
  if (!auth) return jsonError("unauthorized", 401);
  try {
    const { logs } = await loadMe(auth.user.id);
    return jsonOk({ logs });
  } catch {
    return jsonError("db", 500);
  }
}

export async function PUT(request: NextRequest) {
  const auth = await requireBearer(request);
  if (!auth) return jsonError("unauthorized", 401);

  const parsed = parseWeightLogPayload(await readJson(request), auth.user);
  if (!parsed.ok) return jsonError(parsed.error, 400);

  try {
    const { logs } = await saveWeightLog(auth.user, parsed.loggedOn, parsed.weightKg);
    return jsonOk({ logs });
  } catch {
    return jsonError("db", 500);
  }
}

export async function DELETE(request: NextRequest) {
  const auth = await requireBearer(request);
  if (!auth) return jsonError("unauthorized", 401);

  const loggedOn = parseOptionalDate(request.nextUrl.searchParams.get("loggedOn"));
  if (!loggedOn) return jsonError("dates", 400);

  try {
    const { logs } = await removeWeightLog(auth.user, loggedOn);
    return jsonOk({ logs });
  } catch {
    return jsonError("db", 500);
  }
}
