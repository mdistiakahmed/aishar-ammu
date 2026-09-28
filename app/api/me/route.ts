import { NextRequest } from "next/server";
import { requireBearer } from "@/lib/auth";
import { corsOptions, jsonError, jsonOk } from "@/lib/http";
import { loadMe } from "@/lib/profile";

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
