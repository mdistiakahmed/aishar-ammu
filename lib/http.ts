import { NextResponse } from "next/server";

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Authorization, Content-Type",
  "Access-Control-Allow-Methods": "GET, POST, PATCH, PUT, DELETE, OPTIONS",
};

export type ApiError = "unauthorized" | "name" | "dates" | "weight" | "db" | "oauth";

export function corsOptions() {
  return new NextResponse(null, { status: 204, headers: CORS_HEADERS });
}

export function jsonOk(body: unknown, status = 200) {
  return NextResponse.json(body, { status, headers: CORS_HEADERS });
}

export function jsonError(error: ApiError, status: number) {
  return NextResponse.json({ error }, { status, headers: CORS_HEADERS });
}

export function emptyOk(status = 204) {
  return new NextResponse(null, { status, headers: CORS_HEADERS });
}

export async function readJson(request: Request) {
  try {
    return (await request.json()) as Record<string, unknown>;
  } catch {
    return null;
  }
}
