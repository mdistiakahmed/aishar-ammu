import type { SessionUser } from "@/lib/user";
import type { WeightLog } from "@/lib/weights";

export const TOKEN_KEY = "ammu_token";

export type MeResponse = {
  user: SessionUser;
  logs: WeightLog[];
};

export type ApiResult<T> =
  | { ok: true; data: T }
  | { ok: false; error: string; status: number };

export function getToken() {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string) {
  window.localStorage.setItem(TOKEN_KEY, token);
}

export function clearToken() {
  window.localStorage.removeItem(TOKEN_KEY);
}

export async function api<T>(path: string, init: RequestInit = {}): Promise<ApiResult<T>> {
  const headers = new Headers(init.headers);
  const token = getToken();
  if (token) headers.set("Authorization", `Bearer ${token}`);
  if (init.body && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  const response = await fetch(path, { ...init, headers });
  if (response.status === 204) {
    return { ok: true, data: undefined as T };
  }

  const payload = (await response.json().catch(() => ({}))) as { error?: string } & T;
  if (!response.ok) {
    return { ok: false, error: payload.error || "db", status: response.status };
  }
  return { ok: true, data: payload };
}
