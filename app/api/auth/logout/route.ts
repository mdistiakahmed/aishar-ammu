import { NextRequest } from "next/server";
import { revokeBearer } from "@/lib/auth";
import { corsOptions, emptyOk, jsonError } from "@/lib/http";

export function OPTIONS() {
  return corsOptions();
}

export async function POST(request: NextRequest) {
  const revoked = await revokeBearer(request);
  if (!revoked) return jsonError("unauthorized", 401);
  return emptyOk();
}
