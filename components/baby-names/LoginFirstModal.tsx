"use client";

import Link from "next/link";
import { useEffect, useId } from "react";

export function LoginFirstModal({ onClose }: { onClose: () => void }) {
  const titleId = useId();

  useEffect(() => {
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, []);

  return (
    <div className="fixed inset-0 z-60 flex items-end justify-center bg-ink/40 p-4 sm:items-center">
      <button type="button" className="absolute inset-0" aria-label="Close" onClick={onClose} />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="relative z-10 w-full max-w-md rounded-4xl border border-mist bg-white p-6 shadow-xl"
      >
        <h2 id={titleId} className="text-xl font-semibold text-ink">
          Login first
        </h2>
        <p className="mt-2 text-sm leading-6 text-dusk">
          Sign in to save names to your favourites. You can keep browsing without an account.
        </p>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <Link
            href="/login"
            className="inline-flex h-12 flex-1 items-center justify-center rounded-full bg-sage text-sm font-semibold text-white hover:bg-sage-dark"
          >
            Go to login
          </Link>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-12 flex-1 items-center justify-center rounded-full border border-mist bg-white text-sm font-semibold text-sage-dark hover:bg-petal"
          >
            Not now
          </button>
        </div>
      </div>
    </div>
  );
}
