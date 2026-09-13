"use client";

import Link from "next/link";
import { useLanguage } from "@/components/language-provider";
import { LogoMark } from "@/components/icons";

export function SiteFooter() {
  const { t } = useLanguage();
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-rose-100 bg-white">
      <div className="mx-auto grid max-w-5xl gap-8 px-4 py-10 sm:px-6 md:grid-cols-3">
        <div>
          <Link href="#home" className="inline-flex items-center gap-2.5">
            <LogoMark className="h-10 w-10 shrink-0" />
            <span>
              <span className="block text-sm font-semibold text-rose-950">
                {t.brand} · {t.brandBn}
              </span>
              <span className="block text-xs text-rose-800/75">{t.tagline}</span>
            </span>
          </Link>
          <p className="mt-4 text-sm leading-6 text-rose-900/70">{t.footerNote}</p>
        </div>

        <div>
          <h2 className="text-sm font-semibold text-rose-950">{t.footerExplore}</h2>
          <ul className="mt-3 space-y-2 text-sm">
            <li>
              <Link href="#home" className="text-rose-900/80 hover:text-rose-800">
                {t.nav.home}
              </Link>
            </li>
            <li>
              <Link href="#monthly-care" className="text-rose-900/80 hover:text-rose-800">
                {t.nav.months}
              </Link>
            </li>
            <li>
              <Link href="#care-tools" className="text-rose-900/80 hover:text-rose-800">
                {t.nav.tools}
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h2 className="text-sm font-semibold text-rose-950">{t.footerTools}</h2>
          <ul className="mt-3 space-y-2 text-sm">
            <li>
              <Link href="#tool-due-date" className="text-rose-900/80 hover:text-rose-800">
                {t.nav.dueDate}
              </Link>
            </li>
            <li>
              <Link href="#tool-doctor-visit" className="text-rose-900/80 hover:text-rose-800">
                {t.nav.doctorVisit}
              </Link>
            </li>
            <li>
              <Link href="#tool-expected-weight" className="text-rose-900/80 hover:text-rose-800">
                {t.nav.expectedWeight}
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-rose-100">
        <div className="mx-auto flex max-w-5xl flex-col gap-3 px-4 py-4 text-xs text-rose-900/65 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <p>
            © {year} {t.brandBn}. {t.footerRights}
          </p>
          <div className="flex gap-4">
            <Link href="#home" className="hover:text-rose-800">
              {t.footerPrivacy}
            </Link>
            <Link href="#home" className="hover:text-rose-800">
              {t.footerContact}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
