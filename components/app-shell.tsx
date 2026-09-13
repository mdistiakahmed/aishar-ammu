"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useLanguage } from "@/components/language-provider";
import { LanguageToggle } from "@/components/language-toggle";
import { SiteFooter } from "@/components/site-footer";
import {
  BellIcon,
  CalendarIcon,
  CloseIcon,
  HomeIcon,
  LogoMark,
  MenuIcon,
  MonthsIcon,
  ScaleIcon,
} from "@/components/icons";

const navItems = [
  { href: "#home", key: "home" as const, icon: HomeIcon },
  { href: "#monthly-care", key: "months" as const, icon: MonthsIcon },
  { href: "#care-tools", key: "tools" as const, icon: CalendarIcon },
  { href: "#tool-due-date", key: "dueDate" as const, icon: CalendarIcon },
  { href: "#tool-doctor-visit", key: "doctorVisit" as const, icon: BellIcon },
  { href: "#tool-expected-weight", key: "expectedWeight" as const, icon: ScaleIcon },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const { t } = useLanguage();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <div className="min-h-full bg-petal text-ink">
      <header className="sticky top-0 z-40 border-b border-rose-100/80 bg-petal/90 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-6xl items-center gap-3 px-4 sm:h-[4.25rem] sm:px-6">
          <button
            type="button"
            className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-rose-200 bg-white text-rose-800 shadow-sm lg:hidden"
            onClick={() => setOpen(true)}
            aria-label={t.menu}
          >
            <MenuIcon className="h-5 w-5" />
          </button>

          <Link href="#home" className="flex min-w-0 flex-1 items-center gap-2.5 sm:gap-3">
            <LogoMark className="h-10 w-10 shrink-0" />
            <span className="min-w-0">
              <span className="block truncate text-[15px] font-semibold tracking-tight text-rose-950 sm:text-lg">
                {t.brand} · {t.brandBn}
              </span>
              <span className="hidden truncate text-xs text-rose-800/80 sm:block">
                {t.tagline}
              </span>
            </span>
          </Link>

          <LanguageToggle />
        </div>
      </header>

      {open ? (
        <button
          type="button"
          className="fixed inset-0 z-40 bg-rose-950/35 lg:hidden"
          aria-label={t.closeMenu}
          onClick={() => setOpen(false)}
        />
      ) : null}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-[min(20rem,88vw)] flex-col border-r border-rose-100 bg-white shadow-xl transition-transform duration-200 lg:top-[4.25rem] lg:z-30 lg:h-[calc(100vh-4.25rem)] lg:w-72 lg:translate-x-0 lg:shadow-none ${
          open ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="flex items-center justify-between border-b border-rose-100 px-4 py-4 lg:hidden">
          <p className="font-semibold text-rose-950">{t.brandBn}</p>
          <button
            type="button"
            className="inline-flex h-11 w-11 items-center justify-center rounded-2xl text-rose-800"
            onClick={() => setOpen(false)}
            aria-label={t.closeMenu}
          >
            <CloseIcon className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.key}
                href={item.href}
                onClick={() => setOpen(false)}
                className="flex min-h-12 items-center gap-3 rounded-2xl px-3 text-sm font-medium text-rose-950 hover:bg-rose-50"
              >
                <Icon className="h-5 w-5 text-rose-700" />
                {t.nav[item.key]}
              </Link>
            );
          })}
        </nav>
      </aside>

      <div className="flex min-h-[calc(100vh-4.25rem)] flex-col lg:pl-72">
        <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-6 sm:px-6 sm:py-8">
          {children}
        </main>
        <SiteFooter />
      </div>
    </div>
  );
}
