import { NextRequest } from "next/server";
import { exchangeLoginCode } from "@/lib/auth";
import { corsOptions, jsonError, jsonOk, readJson } from "@/lib/http";

export function OPTIONS() {
  return corsOptions();
}

export async function POST(request: NextRequest) {
  const body = await readJson(request);
  const code = typeof body?.code === "string" ? body.code.trim() : "";
  if (!code) return jsonError("oauth", 400);

  try {
    const session = await exchangeLoginCode(code);
    if (!session) return jsonError("unauthorized", 401);
    return jsonOk(session);
  } catch {
    return jsonError("db", 500);
  }
}
