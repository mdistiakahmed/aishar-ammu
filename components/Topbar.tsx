"use client";

import Link from "next/link";
import { LogoMark, MenuIcon } from "@/components/icons";
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
    <header className="sticky top-0 z-40 border-b border-rose-100/80 bg-petal/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center gap-3 px-4 sm:h-[4.25rem] sm:px-6">
        <button
          type="button"
          className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-rose-200 bg-white text-rose-800 shadow-sm lg:hidden"
          onClick={onOpenMenu}
          aria-label="Open menu"
        >
          <MenuIcon className="h-5 w-5" />
        </button>

        <Link href="/" className="flex min-w-0 flex-1 items-center gap-2.5 sm:gap-3">
          <LogoMark className="h-10 w-10 shrink-0" />
          <span className="min-w-0">
            <span className="block truncate font-[family-name:var(--font-hind)] text-[15px] font-semibold tracking-tight text-rose-950 sm:text-lg">
              {brand} · {brandBn}
            </span>
            <span className="hidden truncate font-[family-name:var(--font-hind)] text-xs text-rose-800/80 sm:block">
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
                className="h-9 w-9 rounded-full border border-rose-100 object-cover"
                referrerPolicy="no-referrer"
              />
            ) : null}
            <Link
              href="/account"
              className="hidden max-w-36 truncate text-sm font-medium text-rose-950 hover:text-rose-800 sm:inline"
            >
              {user.preferredName || user.name}
            </Link>
            <button
              type="button"
              onClick={onLogout}
              className="inline-flex h-11 items-center justify-center rounded-full border border-rose-200 bg-white px-4 text-sm font-semibold text-rose-800 shadow-sm hover:bg-rose-50"
            >
              Log out
            </button>
          </div>
        ) : (
          <Link
            href="/login"
            className="inline-flex h-11 shrink-0 items-center justify-center rounded-full bg-rose-700 px-4 text-sm font-semibold text-white shadow-sm hover:bg-rose-800 sm:px-5"
          >
            Login
          </Link>
        )}
      </div>
    </header>
  );
}
