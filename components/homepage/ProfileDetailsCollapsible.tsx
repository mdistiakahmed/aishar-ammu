"use client";

import { useId, useState } from "react";
import Link from "next/link";
import { ProfileBasicsForm } from "@/components/profile/ProfileBasicsForm";
import type { SessionUser } from "@/lib/user";

export function ProfileDetailsCollapsible({
  user,
  weightTodayKg = null,
}: {
  user: SessionUser;
  weightTodayKg?: number | null;
}) {
  const [open, setOpen] = useState(false);
  const panelId = useId();

  return (
    <section className="overflow-hidden rounded-[1.5rem] border border-rose-100 bg-white shadow-sm">
      <button
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((value) => !value)}
        className="flex min-h-12 w-full items-center justify-between gap-3 px-4 py-3 text-left sm:px-5"
      >
        <span>
          <span className="block text-sm font-semibold text-rose-950">Your details</span>
          <span className="mt-0.5 block text-xs text-rose-800/70">
            {open ? "Tap to hide profile fields" : "Tap to edit pregnancy and care details"}
          </span>
        </span>
        <span
          className={`inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-rose-50 text-rose-800 transition-transform duration-200 ${
            open ? "rotate-180" : ""
          }`}
          aria-hidden="true"
        >
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none">
            <path
              d="M6 9l6 6 6-6"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
      </button>

      {open ? (
        <div id={panelId} className="border-t border-rose-100 px-4 pb-4 pt-3 sm:px-5 sm:pb-5">
          <ProfileBasicsForm
            user={user}
            idPrefix="home-profile"
            weightTodayKg={weightTodayKg}
          />
          <Link
            href="/account"
            className="mt-3 block text-center text-sm font-semibold text-rose-800 underline-offset-2 hover:underline"
          >
            Edit weight history
          </Link>
        </div>
      ) : null}
    </section>
  );
}
