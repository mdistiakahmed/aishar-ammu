import type { Metadata } from "next";
import { BabyNamesBrowser } from "@/components/baby-names/BabyNamesBrowser";
import {
  girlNameGroupsForLetter,
  parseGirlNameLetter,
  parseGirlNameToken,
} from "@/lib/girl-names";

export const metadata: Metadata = {
  title: "Baby names",
  description:
    "Browse girl names by letter and token. See full names, popularity, and save favourites when signed in.",
};

export default async function BabyNamesPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const query = await searchParams;
  const letter = parseGirlNameLetter(query.letter);
  const tokenParam = parseGirlNameToken(query.token);
  const groups = girlNameGroupsForLetter(letter);

  return (
    <article className="mx-auto max-w-4xl">
      <header className="rounded-4xl border border-mist bg-white p-6 shadow-sm sm:p-8">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-sage">Names</p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-ink">Baby names</h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-dusk">
          A soft directory of girl names from the collected list. Open a token to see every full name,
          sorted by popularity.
        </p>
      </header>

      <BabyNamesBrowser letter={letter} groups={groups} tokenParam={tokenParam} />
    </article>
  );
}
