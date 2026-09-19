import type { Metadata } from "next";
import { FavouriteNameList } from "@/components/baby-names/FavouriteNameList";
import { BABY_NAMES } from "@/lib/baby-names";

export const metadata: Metadata = {
  title: "Baby names",
  description: "A short list of baby names to browse. Educational only.",
};

export default function BabyNamesPage() {
  return (
    <article className="mx-auto max-w-2xl">
      <header className="rounded-[2rem] border border-rose-100 bg-white p-6 shadow-sm sm:p-8">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-rose-700">Names</p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-rose-950">Baby names</h1>
        <p className="mt-3 text-sm leading-6 text-rose-900/75">
          Browse a small sample list. Meanings here are general notes for reading, not a guarantee about a
          child. Anyone can read this page. Saving a shortlist needs a signed-in account.
        </p>
      </header>

      <FavouriteNameList names={BABY_NAMES} />
    </article>
  );
}
