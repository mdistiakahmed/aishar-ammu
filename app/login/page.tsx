"use client";

import { Suspense, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/components/auth/AuthProvider";
import { GoogleIcon, LogoMark } from "@/components/icons";
import { brand, brandBn, tagline } from "@/lib/constants";

const loginErrors: Record<string, string> = {
  config: "Gmail sign-in is not configured yet. Add Google OAuth credentials to the environment.",
  denied: "Google sign-in was cancelled. You can try again when you are ready.",
  state: "That sign-in attempt expired. Please try again.",
  oauth: "We could not complete Gmail sign-in. Please try again.",
  db: "You signed in, but we could not save your account. Please try again.",
};

export default function LoginPage() {
  return (
    <Suspense>
      <LoginView />
    </Suspense>
  );
}

function LoginView() {
  const { user } = useAuth();
  const router = useRouter();
  const params = useSearchParams();
  const error = params.get("error");
  const errorMessage = error ? loginErrors[error] || loginErrors.oauth : null;

  useEffect(() => {
    if (user) router.replace("/");
  }, [router, user]);

  if (user) return null;

  return (
    <div className="flex min-h-[calc(100vh-10rem)] items-center justify-center py-6">
      <div className="w-full max-w-md overflow-hidden rounded-[2rem] border border-rose-100 bg-white shadow-[0_20px_50px_-28px_rgba(127,29,29,0.28)]">
        <div className="bg-[linear-gradient(135deg,#fff7f4_0%,#fde8ef_52%,#fff1e0_100%)] px-6 py-8 text-center sm:px-10">
          <LogoMark className="mx-auto h-14 w-14" />
          <p className="mt-4 font-[family-name:var(--font-hind)] text-lg font-semibold text-rose-950">
            {brand} · {brandBn}
          </p>
          <p className="mt-1 text-sm text-rose-800/80">{tagline}</p>
        </div>

        <div className="px-6 py-8 sm:px-10">
          <h1 className="text-2xl font-semibold tracking-tight text-rose-950">Welcome back</h1>
          <p className="mt-2 text-sm leading-6 text-rose-900/75">
            Continue with your Gmail account to keep your care tools in one place.
          </p>

          {errorMessage ? (
            <p
              role="alert"
              className="mt-5 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm leading-6 text-rose-900"
            >
              {errorMessage}
            </p>
          ) : null}

          <a
            href="/api/auth/google"
            className="mt-7 inline-flex h-12 w-full items-center justify-center gap-2.5 rounded-full border border-rose-200 bg-white text-sm font-semibold text-rose-950 shadow-sm transition hover:bg-rose-50"
          >
            <GoogleIcon className="h-5 w-5" />
            Continue with Gmail
          </a>

          <p className="mt-6 text-center text-xs leading-5 text-rose-900/55">
            By continuing, you agree to our care guidance being educational only
            and not a substitute for medical advice.
          </p>
        </div>
      </div>
    </div>
  );
}
