"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuth } from "@/components/auth/AuthProvider";
import { api } from "@/lib/api-client";

export default function AuthCallbackPage() {
  const router = useRouter();
  const { applyToken } = useAuth();

  useEffect(() => {
    const code = new URLSearchParams(window.location.search).get("code")?.trim();
    if (!code) {
      router.replace("/login?error=oauth");
      return;
    }

    let cancelled = false;
    (async () => {
      const result = await api<{ token: string }>("/api/auth/token", {
        method: "POST",
        body: JSON.stringify({ code }),
      });
      if (cancelled) return;
      if (!result.ok) {
        router.replace("/login?error=oauth");
        return;
      }
      const ok = await applyToken(result.data.token);
      if (!ok) {
        router.replace("/login?error=oauth");
        return;
      }
      router.replace("/");
    })().catch(() => {
      if (!cancelled) router.replace("/login?error=oauth");
    });

    return () => {
      cancelled = true;
    };
  }, [applyToken, router]);

  return (
    <div className="flex min-h-[calc(100vh-10rem)] items-center justify-center text-sm text-rose-800">
      Finishing sign-in…
    </div>
  );
}
