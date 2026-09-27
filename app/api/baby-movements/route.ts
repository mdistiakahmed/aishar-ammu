import { NextRequest } from "next/server";
import { requireBearer } from "@/lib/auth";
import { parseMovementLogPayload } from "@/lib/baby-movements";
import { findBabyMovementCounts, saveBabyMovementCounts } from "@/lib/db";
import { corsOptions, jsonError, jsonOk, readJson } from "@/lib/http";

export function OPTIONS() {
  return corsOptions();
}

export async function GET(request: NextRequest) {
  const auth = await requireBearer(request);
  if (!auth) return jsonError("unauthorized", 401);
  try {
    const counts = await findBabyMovementCounts(auth.user.id);
    return jsonOk({ counts });
  } catch {
    return jsonError("db", 500);
  }
}

export async function PUT(request: NextRequest) {
  const auth = await requireBearer(request);
  if (!auth) return jsonError("unauthorized", 401);

  const body = await readJson(request);
  const counts = parseMovementLogPayload(body?.counts);
  if (!counts) return jsonError("counts", 400);

  try {
    await saveBabyMovementCounts(auth.user.id, counts);
    return jsonOk({ counts });
  } catch {
    return jsonError("db", 500);
  }
}
