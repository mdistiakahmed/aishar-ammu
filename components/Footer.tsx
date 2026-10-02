import Link from "next/link";
import { LogoMark } from "@/components/icons";
import { brand, tagline } from "@/lib/constants";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-[#d5ebe8] bg-white">
      <div className="mx-auto grid max-w-5xl gap-8 px-4 py-10 sm:px-6 md:grid-cols-2">
        <div>
          <Link href="/" className="inline-flex items-center gap-2.5">
            <LogoMark className="h-10 w-10 shrink-0" />
            <span>
              <span className="block text-sm font-semibold text-ink">{brand}</span>
              <span className="block text-xs text-[#5f7c82]">{tagline}</span>
            </span>
          </Link>
          <p className="mt-4 text-sm leading-6 text-[#5f7c82]">
            Care guidance for everyday wellbeing. Always follow your doctor’s advice for
            medical decisions.
          </p>
        </div>

        <div>
          <h2 className="text-sm font-semibold text-ink">Explore</h2>
          <ul className="mt-3 space-y-2 text-sm">
            <li>
              <Link href="/" className="text-[#5f7c82] hover:text-ink">
                Home
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-[#d5ebe8]">
        <div className="mx-auto flex max-w-5xl flex-col gap-3 px-4 py-4 text-xs text-[#5f7c82] sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <p>
            © {year} {brand}. All rights reserved.
          </p>
          <div className="flex gap-4">
            <Link href="/" className="hover:text-ink">
              Privacy
            </Link>
            <Link href="/" className="hover:text-ink">
              Contact
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
