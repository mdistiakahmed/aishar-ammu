import type { Metadata } from "next";
import Link from "next/link";
import { HomeAuthUpgrade } from "@/components/homepage/HomeAuthUpgrade";
import { HomePageForGuest } from "@/components/homepage/HomePageForGuest";
import { brand, tagline } from "@/lib/constants";

export const metadata: Metadata = {
  title: brand,
  description: `${tagline}. Educational care reading for pregnancy, mother, and baby. Not medical advice.`,
};

export default function Home() {
  return (
    <div id="home" className="space-y-12 sm:space-y-16">
      <HomeAuthUpgrade>
        <HomePageForGuest />
      </HomeAuthUpgrade>

      <section className="rounded-[2rem] border border-rose-100 bg-petal p-6 sm:p-8">
        <h2 className="text-2xl font-semibold text-rose-950">Read without signing in</h2>
        <p className="mt-2 text-sm leading-6 text-rose-900/75">
          These pages are open to everyone. A shortlist and your care dashboard need a signed-in account.
        </p>
        <ul className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
          <li>
            <Link
              href="/baby-names"
              className="block rounded-2xl border border-rose-100 bg-white p-4 text-sm font-semibold text-rose-950 hover:bg-rose-50"
            >
              Baby names
              <span className="mt-1 block font-normal leading-6 text-rose-900/75">
                Browse a sample list. Save a shortlist after you sign in.
              </span>
            </Link>
          </li>
          <li>
            <Link
              href="/duas"
              className="block rounded-2xl border border-rose-100 bg-white p-4 text-sm font-semibold text-rose-950 hover:bg-rose-50"
            >
              Islamic duas
              <span className="mt-1 block font-normal leading-6 text-rose-900/75">
                Short prayers in English for quiet reading.
              </span>
            </Link>
          </li>
        </ul>
      </section>
    </div>
  );
}
