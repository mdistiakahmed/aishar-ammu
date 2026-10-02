"use client";

import Link from "next/link";
import { LuMenu } from "react-icons/lu";
import type { SessionUser } from "@/lib/user";
import { brand, brandBn, taglineBn } from "@/lib/constants";

export function Topbar({
  user,
  onOpenMenu,
  onLogout,
}: {
  user: SessionUser | null;
  onOpenMenu: () => void;
  onLogout: () => void;
}) {
  return (
    <header className="sticky top-0 z-40 border-b border-[#d5ebe8] bg-petal/90 backdrop-blur-md transition-[margin-left] duration-200 ease-out lg:static lg:ml-(--sidebar-offset)">
      <div className="mx-auto flex h-16 max-w-6xl items-center gap-3 px-4 sm:h-[4.25rem] sm:px-6 lg:max-w-none">
        <button
          type="button"
          className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-[#d5ebe8] bg-white text-ink shadow-sm lg:hidden"
          onClick={onOpenMenu}
          aria-label="Open menu"
        >
          <LuMenu className="h-5 w-5" aria-hidden="true" />
        </button>

        <Link href="/" className="flex min-w-0 flex-1 items-center gap-2.5 sm:gap-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/logo.png"
            alt=""
            className="h-10 w-10 shrink-0 rounded-full object-cover"
          />
          <span className="min-w-0">
            <span className="block truncate font-[family-name:var(--font-hind)] text-[15px] font-semibold tracking-tight text-ink sm:text-lg">
              {brand} · {brandBn}
            </span>
            <span className="hidden truncate font-[family-name:var(--font-hind)] text-xs text-[#5f7c82] sm:block">
              {taglineBn}
            </span>
          </span>
        </Link>

        {user ? (
          <div className="flex min-w-0 shrink-0 items-center gap-2">
            {user.picture ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={user.picture}
                alt=""
                className="h-9 w-9 rounded-full border border-[#d5ebe8] object-cover"
                referrerPolicy="no-referrer"
              />
            ) : null}
            <span className="hidden max-w-36 truncate text-sm font-medium text-ink sm:inline">
              {user.preferredName || user.name}
            </span>
            <button
              type="button"
              onClick={onLogout}
              className="inline-flex h-11 items-center justify-center rounded-full bg-peach px-4 text-sm font-semibold text-[#3f2a22] shadow-sm hover:bg-[#e9a67a]"
            >
              Log out
            </button>
          </div>
        ) : (
          <Link
            href="/login"
            className="inline-flex h-11 shrink-0 items-center justify-center rounded-full bg-lagoon px-4 text-sm font-semibold text-white shadow-sm hover:bg-sage-dark sm:px-5"
          >
            Login
          </Link>
        )}
      </div>
    </header>
  );
}
