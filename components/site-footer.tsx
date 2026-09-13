import Link from "next/link";
import { LogoMark } from "@/components/icons";
import { brand, nav, tagline } from "@/lib/copy";

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-rose-100 bg-white">
      <div className="mx-auto grid max-w-5xl gap-8 px-4 py-10 sm:px-6 md:grid-cols-3">
        <div>
          <Link href="#home" className="inline-flex items-center gap-2.5">
            <LogoMark className="h-10 w-10 shrink-0" />
            <span>
              <span className="block text-sm font-semibold text-rose-950">{brand}</span>
              <span className="block text-xs text-rose-800/75">{tagline}</span>
            </span>
          </Link>
          <p className="mt-4 text-sm leading-6 text-rose-900/70">
            Care guidance for everyday wellbeing. Always follow your doctor’s advice for
            medical decisions.
          </p>
        </div>

        <div>
          <h2 className="text-sm font-semibold text-rose-950">Explore</h2>
          <ul className="mt-3 space-y-2 text-sm">
            <li>
              <Link href="#home" className="text-rose-900/80 hover:text-rose-800">
                {nav.home}
              </Link>
            </li>
            <li>
              <Link href="#monthly-care" className="text-rose-900/80 hover:text-rose-800">
                {nav.months}
              </Link>
            </li>
            <li>
              <Link href="#care-tools" className="text-rose-900/80 hover:text-rose-800">
                {nav.tools}
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h2 className="text-sm font-semibold text-rose-950">Tools</h2>
          <ul className="mt-3 space-y-2 text-sm">
            <li>
              <Link href="#tool-due-date" className="text-rose-900/80 hover:text-rose-800">
                {nav.dueDate}
              </Link>
            </li>
            <li>
              <Link href="#tool-doctor-visit" className="text-rose-900/80 hover:text-rose-800">
                {nav.doctorVisit}
              </Link>
            </li>
            <li>
              <Link href="#tool-expected-weight" className="text-rose-900/80 hover:text-rose-800">
                {nav.expectedWeight}
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-rose-100">
        <div className="mx-auto flex max-w-5xl flex-col gap-3 px-4 py-4 text-xs text-rose-900/65 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <p>
            © {year} {brand}. All rights reserved.
          </p>
          <div className="flex gap-4">
            <Link href="#home" className="hover:text-rose-800">
              Privacy
            </Link>
            <Link href="#home" className="hover:text-rose-800">
              Contact
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
