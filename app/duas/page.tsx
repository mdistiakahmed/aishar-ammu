import type { Metadata } from "next";
import { DUAS } from "@/lib/duas";

export const metadata: Metadata = {
  title: "Islamic duas",
  description: "Short Islamic prayers in English for everyday reading. Educational only.",
};

export default function DuasPage() {
  return (
    <article className="mx-auto max-w-2xl space-y-4">
      <header className="rounded-[2rem] border border-rose-100 bg-white p-6 shadow-sm sm:p-8">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-rose-700">Prayer</p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-rose-950">Islamic duas</h1>
        <p className="mt-3 text-sm leading-6 text-rose-900/75">
          These are short sample prayers in English for quiet reading. They are general spiritual wording,
          not medical advice, and they do not replace care from a qualified clinician.
        </p>
      </header>

      {DUAS.map((dua) => (
        <section
          key={dua.title}
          className="rounded-[2rem] border border-rose-100 bg-white p-6 shadow-sm sm:p-8"
        >
          <h2 className="text-xl font-semibold text-rose-950">{dua.title}</h2>
          <p className="mt-3 text-base leading-7 text-rose-950">{dua.text}</p>
          <p className="mt-3 text-sm leading-6 text-rose-900/75">{dua.note}</p>
        </section>
      ))}
    </article>
  );
}
