"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { api, clearToken, getToken, setToken, type MeResponse } from "@/lib/api-client";
import type { SessionUser } from "@/lib/user";
import type { WeightLog } from "@/lib/weights";

type AuthContextValue = {
  ready: boolean;
  user: SessionUser | null;
  logs: WeightLog[];
  refresh: () => Promise<void>;
  applyToken: (token: string) => Promise<boolean>;
  setMe: (data: MeResponse) => void;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);
  const [user, setUser] = useState<SessionUser | null>(null);
  const [logs, setLogs] = useState<WeightLog[]>([]);

  const setMe = useCallback((data: MeResponse) => {
    setUser(data.user);
    setLogs(data.logs);
  }, []);

  const refresh = useCallback(async () => {
    const token = getToken();
    if (!token) {
      setUser(null);
      setLogs([]);
      return;
    }

    const result = await api<MeResponse>("/api/me");
    if (!result.ok) {
      clearToken();
      setUser(null);
      setLogs([]);
      return;
    }
    setMe(result.data);
  }, [setMe]);

  useEffect(() => {
    refresh().finally(() => setReady(true));
  }, [refresh]);

  const applyToken = useCallback(
    async (token: string) => {
      setToken(token);
      const result = await api<MeResponse>("/api/me");
      if (!result.ok) {
        clearToken();
        setUser(null);
        setLogs([]);
        return false;
      }
      setMe(result.data);
      return true;
    },
    [setMe],
  );

  const logout = useCallback(async () => {
    await api("/api/auth/logout", { method: "POST" });
    clearToken();
    setUser(null);
    setLogs([]);
  }, []);

  const value = useMemo(
    () => ({ ready, user, logs, refresh, applyToken, setMe, logout }),
    [ready, user, logs, refresh, applyToken, setMe, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const value = useContext(AuthContext);
  if (!value) {
    throw new Error("useAuth must be used inside AuthProvider");
  }
  return value;
}
