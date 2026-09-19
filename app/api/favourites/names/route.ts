import { NextRequest } from "next/server";
import { requireBearer } from "@/lib/auth";
import { isListedBabyNameId } from "@/lib/baby-names";
import { addFavouriteBabyName, deleteFavouriteBabyName, listFavouriteBabyNameIds } from "@/lib/db";
import { corsOptions, jsonError, jsonOk, readJson } from "@/lib/http";

export function OPTIONS() {
  return corsOptions();
}

export async function GET(request: NextRequest) {
  const auth = await requireBearer(request);
  if (!auth) return jsonError("unauthorized", 401);
  try {
    const nameIds = await listFavouriteBabyNameIds(auth.user.id);
    return jsonOk({ nameIds });
  } catch {
    return jsonError("db", 500);
  }
}

export async function POST(request: NextRequest) {
  const auth = await requireBearer(request);
  if (!auth) return jsonError("unauthorized", 401);

  const body = await readJson(request);
  const nameId = typeof body?.nameId === "string" ? body.nameId.trim() : "";
  if (!nameId || !isListedBabyNameId(nameId)) return jsonError("nameId", 400);

  try {
    await addFavouriteBabyName(auth.user.id, nameId);
    const nameIds = await listFavouriteBabyNameIds(auth.user.id);
    return jsonOk({ nameIds });
  } catch {
    return jsonError("db", 500);
  }
}

export async function DELETE(request: NextRequest) {
  const auth = await requireBearer(request);
  if (!auth) return jsonError("unauthorized", 401);

  const nameId = request.nextUrl.searchParams.get("nameId")?.trim() ?? "";
  if (!nameId) return jsonError("nameId", 400);

  try {
    await deleteFavouriteBabyName(auth.user.id, nameId);
    const nameIds = await listFavouriteBabyNameIds(auth.user.id);
    return jsonOk({ nameIds });
  } catch {
    return jsonError("db", 500);
  }
}
