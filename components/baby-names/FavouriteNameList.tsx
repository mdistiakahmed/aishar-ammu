"use client";

import Link from "next/link";
import { useEffect, useId, useState } from "react";
import { useAuth } from "@/components/auth/AuthProvider";
import { api } from "@/lib/api-client";
import type { BabyName } from "@/lib/baby-names";

export function FavouriteNameList({ names }: { names: BabyName[] }) {
  const { user, ready } = useAuth();
  const [saved, setSaved] = useState<string[]>([]);
  const [loginOpen, setLoginOpen] = useState(false);
  const [pendingNameId, setPendingNameId] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      setSaved([]);
      return;
    }

    let cancelled = false;
    api<{ nameIds: string[] }>("/api/favourites/names").then((result) => {
      if (cancelled || !result.ok) return;
      setSaved(result.data.nameIds);
    });
    return () => {
      cancelled = true;
    };
  }, [user]);

  async function onToggle(nameId: string) {
    if (!ready) return;
    if (!user) {
      setLoginOpen(true);
      return;
    }

    setPendingNameId(nameId);
    const isSaved = saved.includes(nameId);
    const result = isSaved
      ? await api<{ nameIds: string[] }>(`/api/favourites/names?nameId=${encodeURIComponent(nameId)}`, {
          method: "DELETE",
        })
      : await api<{ nameIds: string[] }>("/api/favourites/names", {
          method: "POST",
          body: JSON.stringify({ nameId }),
        });
    setPendingNameId(null);
    if (result.ok) setSaved(result.data.nameIds);
  }

  return (
    <>
      <ul className="mt-6 space-y-3">
        {names.map((item) => {
          const isSaved = saved.includes(item.id);
          const busy = pendingNameId === item.id;
          return (
            <li
              key={item.id}
              className="flex flex-col gap-3 rounded-2xl border border-rose-100 bg-white p-4 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="min-w-0">
                <p className="font-semibold text-rose-950">{item.name}</p>
                <p className="mt-1 text-sm leading-6 text-rose-900/75">{item.meaning}</p>
              </div>
              <button
                type="button"
                disabled={busy || !ready}
                onClick={() => void onToggle(item.id)}
                className="inline-flex h-12 w-full shrink-0 items-center justify-center rounded-full border border-rose-200 bg-petal px-4 text-sm font-semibold text-rose-800 hover:bg-rose-50 disabled:opacity-70 sm:w-auto"
              >
                {busy
                  ? isSaved
                    ? "Removing…"
                    : "Saving…"
                  : isSaved
                    ? "Remove from shortlist"
                    : "Add to shortlist"}
              </button>
            </li>
          );
        })}
      </ul>
      {loginOpen ? <LoginFirstModal onClose={() => setLoginOpen(false)} /> : null}
    </>
  );
}

function LoginFirstModal({ onClose }: { onClose: () => void }) {
  const titleId = useId();

  useEffect(() => {
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, []);

  return (
    <div className="fixed inset-0 z-[60] flex items-end justify-center bg-rose-950/40 p-4 sm:items-center">
      <button type="button" className="absolute inset-0" aria-label="Close" onClick={onClose} />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="relative z-10 w-full max-w-md rounded-[2rem] border border-rose-100 bg-white p-6 shadow-xl"
      >
        <h2 id={titleId} className="text-xl font-semibold text-rose-950">
          Login first
        </h2>
        <p className="mt-2 text-sm leading-6 text-rose-900/75">
          Sign in to save names to your shortlist. The list of names stays available without an account.
        </p>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <Link
            href="/login"
            className="inline-flex h-12 flex-1 items-center justify-center rounded-full bg-rose-700 text-sm font-semibold text-white hover:bg-rose-800"
          >
            Go to login
          </Link>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-12 flex-1 items-center justify-center rounded-full border border-rose-200 bg-white text-sm font-semibold text-rose-800 hover:bg-rose-50"
          >
            Not now
          </button>
        </div>
      </div>
    </div>
  );
}
