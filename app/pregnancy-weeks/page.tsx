import type { Metadata } from "next";
import { weekSpanLabel } from "@/app/pregnancy-weeks/_lib/format";
import { ExpectingIllustration, FetusMark } from "@/app/pregnancy-weeks/_lib/illustrations";
import { TONE_CLASS, TRIMESTERS } from "@/app/pregnancy-weeks/_lib/ranges";
import { CareNote, RangeCard, WeeksBreadcrumb } from "@/app/pregnancy-weeks/_lib/ui";

export const metadata: Metadata = {
  title: "সপ্তাহ অনুযায়ী গর্ভাবস্থা",
  description:
    "গর্ভাবস্থার ১ম থেকে ৪০তম সপ্তাহ পর্যন্ত শিশুর বৃদ্ধি ও মায়ের শরীরের পরিবর্তন। সাধারণ পাঠ, চিকিৎসকের পরামর্শের বিকল্প নয়।",
};

export default function PregnancyWeeksPage() {
  return (
    <article className="space-y-4">
      <WeeksBreadcrumb
        items={[{ href: "/", label: "হোম" }, { label: "সপ্তাহ অনুযায়ী গর্ভাবস্থা" }]}
      />

      <header className="overflow-hidden rounded-[1.75rem] border border-rose-100 bg-[#fff6f8] px-5 py-6 shadow-sm sm:px-8 sm:py-7">
        <div className="grid items-center gap-2 sm:grid-cols-[minmax(0,1fr)_15rem] sm:gap-6">
          <div>
            <h1 className="font-bn! text-[1.65rem] font-bold leading-tight tracking-tight text-[#7a2340] sm:text-4xl">
              গর্ভাবস্থা: সপ্তাহ অনুযায়ী
            </h1>
            <p className="font-bn mt-3 max-w-xl text-sm leading-7 text-rose-950/75 sm:text-[15px]">
              গর্ভাবস্থার ১ম থেকে ৪০তম সপ্তাহ পর্যন্ত শিশুর বৃদ্ধি, মায়ের শরীরের পরিবর্তন এবং প্রতিটি
              সপ্তাহে কী কী জানা ও করার আছে তা সহজভাবে জানুন।
            </p>
          </div>
          <ExpectingIllustration className="mx-auto h-40 w-full max-w-64 sm:h-48 sm:max-w-none" />
        </div>
      </header>

      {TRIMESTERS.map((trimester) => {
        const tone = TONE_CLASS[trimester.tone];
        return (
          <section key={trimester.id} className={`rounded-[1.75rem] p-4 sm:p-5 ${tone.panel}`}>
            <div className="grid gap-4 xl:grid-cols-[13.5rem_minmax(0,1fr)] xl:items-stretch">
              <div className="flex gap-3 xl:block">
                <span
                  className={`inline-flex h-14 w-14 shrink-0 items-center justify-center rounded-full ${tone.icon}`}
                >
                  <FetusMark stage={trimester.ranges[0]?.stage ?? 0} className="h-12 w-12" />
                </span>
                <div>
                  <h2 className={`font-bn! text-lg font-bold sm:text-xl ${tone.title}`}>
                    {trimester.title}
                  </h2>
                  <p className={`font-bn mt-0.5 text-sm font-semibold ${tone.muted}`}>
                    {weekSpanLabel(trimester.from, trimester.to)}
                  </p>
                  <p className="font-bn mt-2 text-[13px] leading-6 text-rose-950/75 xl:mt-3">
                    {trimester.summary}
                  </p>
                </div>
              </div>

              <ul
                className={`grid grid-cols-1 gap-3 sm:grid-cols-2 ${
                  trimester.ranges.length > 3 ? "xl:grid-cols-4" : "xl:grid-cols-3"
                }`}
              >
                {trimester.ranges.map((range) => (
                  <li key={range.slug} className="min-w-0">
                    <RangeCard range={range} tone={trimester.tone} />
                  </li>
                ))}
              </ul>
            </div>
          </section>
        );
      })}

      <CareNote />
    </article>
  );
}
