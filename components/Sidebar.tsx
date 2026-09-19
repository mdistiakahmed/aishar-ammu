"use client";

import Link from "next/link";
import { useEffect } from "react";
import { BookIcon, CloseIcon, HomeIcon, SparkleIcon } from "@/components/icons";
import { ProfileBasicsForm } from "@/components/profile/ProfileBasicsForm";
import type { SessionUser } from "@/lib/user";
import { brand, brandBn } from "@/lib/constants";

const navItems = [
  { href: "/", label: "Home", icon: HomeIcon },
  { href: "/baby-names", label: "Baby names", icon: SparkleIcon },
  { href: "/duas", label: "Islamic duas", icon: BookIcon },
];

export function Sidebar({
  user,
  open,
  onClose,
  weightTodayKg = null,
}: {
  user: SessionUser | null;
  open: boolean;
  onClose: () => void;
  weightTodayKg?: number | null;
}) {
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      {open ? (
        <button
          type="button"
          className="fixed inset-0 z-40 bg-rose-950/35 lg:hidden"
          aria-label="Close menu"
          onClick={onClose}
        />
      ) : null}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-[min(20rem,88vw)] flex-col border-r border-rose-100 bg-white shadow-xl transition-transform duration-200 lg:top-[4.25rem] lg:z-30 lg:h-[calc(100vh-4.25rem)] lg:w-72 lg:translate-x-0 lg:shadow-none ${
          open ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="flex items-center justify-between border-b border-rose-100 px-4 py-4 lg:hidden">
          <p className="min-w-0 truncate font-[family-name:var(--font-hind)] font-semibold text-rose-950">
            {brand} · {brandBn}
          </p>
          <button
            type="button"
            className="inline-flex h-11 w-11 items-center justify-center rounded-2xl text-rose-800"
            onClick={onClose}
            aria-label="Close menu"
          >
            <CloseIcon className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 space-y-4 overflow-y-auto px-3 py-4">
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onClose}
                  className="flex min-h-12 items-center gap-3 rounded-2xl px-3 text-sm font-medium text-rose-950 hover:bg-rose-50"
                >
                  <Icon className="h-5 w-5 text-rose-700" />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {user ? (
            <section className="space-y-3 rounded-2xl border border-rose-100 bg-petal p-3">
              <h2 className="text-sm font-semibold text-rose-950">Your details</h2>
              <ProfileBasicsForm
                user={user}
                idPrefix="sidebar"
                compact
                weightTodayKg={weightTodayKg}
              />
              <Link
                href="/account"
                onClick={onClose}
                className="block text-center text-sm font-semibold text-rose-800 underline-offset-2 hover:underline"
              >
                Edit weight history
              </Link>
            </section>
          ) : null}
        </div>
      </aside>
    </>
  );
}
