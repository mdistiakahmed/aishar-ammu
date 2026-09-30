import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { FetusMark } from "@/app/pregnancy-weeks/_lib/illustrations";
import { toBnDigits, weekSpanLabel } from "@/app/pregnancy-weeks/_lib/format";
import {
  allWeekParams,
  getRange,
  rangeForWeek,
  TONE_CLASS,
  weekHref,
} from "@/app/pregnancy-weeks/_lib/ranges";
import { getWeekGuide } from "@/app/pregnancy-weeks/_lib/weeks";
import { CareNote, GuideList, WeeksBreadcrumb } from "@/app/pregnancy-weeks/_lib/ui";

export const dynamicParams = false;

export function generateStaticParams() {
  return allWeekParams();
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ range: string; week: string }>;
}): Promise<Metadata> {
  const { week } = await params;
  const weekNumber = Number(week);
  const guide = getWeekGuide(weekNumber);
  if (!guide) return { title: "সপ্তাহ অনুযায়ী গর্ভাবস্থা" };
  return {
    title: weekSpanLabel(guide.week),
    description: guide.yourBaby[0],
  };
}

export default async function PregnancyWeekPage({
  params,
}: {
  params: Promise<{ range: string; week: string }>;
}) {
  const { range: slug, week } = await params;
  const found = getRange(slug);
  const weekNumber = Number(week);
  const guide = getWeekGuide(weekNumber);
  if (
    !found ||
    !guide ||
    !Number.isInteger(weekNumber) ||
    weekNumber < found.range.from ||
    weekNumber > found.range.to
  ) {
    notFound();
  }

  const { range, trimester } = found;
  const tone = TONE_CLASS[trimester.tone];
  const previous = rangeForWeek(weekNumber - 1);
  const next = rangeForWeek(weekNumber + 1);
  const siblings = Array.from({ length: range.to - range.from + 1 }, (_, index) => range.from + index);

  return (
    <article className="space-y-4">
      <WeeksBreadcrumb
        items={[
          { href: "/", label: "হোম" },
          { href: "/pregnancy-weeks", label: "সপ্তাহ অনুযায়ী গর্ভাবস্থা" },
          { href: `/pregnancy-weeks/${range.slug}`, label: weekSpanLabel(range.from, range.to) },
          { label: weekSpanLabel(guide.week) },
        ]}
      />

      <header className={`rounded-[1.75rem] p-5 sm:p-7 ${tone.panel}`}>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <FetusMark stage={range.stage} className="h-24 w-24 shrink-0" />
          <div>
            <p className={`font-bn text-sm font-semibold ${tone.muted}`}>
              {trimester.title} · {weekSpanLabel(range.from, range.to)}
            </p>
            <h1 className={`font-bn! mt-1 text-3xl font-bold tracking-tight sm:text-4xl ${tone.title}`}>
              {weekSpanLabel(guide.week)}
            </h1>
            <p className="font-bn mt-2 max-w-2xl text-sm leading-7 text-rose-950/75">{range.summary}</p>
          </div>
        </div>
      </header>

      <nav aria-label="এই দলের সপ্তাহ" className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        {siblings.map((sibling) => {
          const current = sibling === guide.week;
          return (
            <Link
              key={sibling}
              href={`/pregnancy-weeks/${range.slug}/${sibling}`}
              aria-current={current ? "page" : undefined}
              className={`font-bn inline-flex min-h-11 items-center justify-center rounded-2xl px-3 text-sm font-semibold ${
                current
                  ? `${tone.panel} ${tone.title} ring-1 ring-black/5`
                  : "bg-white text-rose-950 ring-1 ring-rose-100 hover:bg-rose-50"
              }`}
            >
              {weekSpanLabel(sibling)}
            </Link>
          );
        })}
      </nav>

      <GuideList title="শিশুর দিক" lines={guide.yourBaby} />
      <GuideList title="মায়ের শরীর" lines={guide.yourBody} />
      <GuideList title="এই সপ্তাহে যা মনে রাখতে পারেন" lines={guide.suggestionsThisWeek} />

      <nav aria-label="আগের ও পরের সপ্তাহ" className="grid gap-3 sm:grid-cols-2">
        {previous ? (
          <Link
            href={weekHref(weekNumber - 1)}
            className="font-bn inline-flex min-h-11 items-center rounded-2xl border border-rose-100 bg-white px-4 text-sm font-semibold text-rose-900 hover:bg-rose-50"
          >
            ← আগেরটি · সপ্তাহ {toBnDigits(weekNumber - 1)}
          </Link>
        ) : (
          <span className="hidden sm:block" />
        )}
        {next ? (
          <Link
            href={weekHref(weekNumber + 1)}
            className="font-bn inline-flex min-h-11 items-center justify-end rounded-2xl border border-rose-100 bg-white px-4 text-sm font-semibold text-rose-900 hover:bg-rose-50"
          >
            সপ্তাহ {toBnDigits(weekNumber + 1)} · পরেরটি →
          </Link>
        ) : null}
      </nav>

      <CareNote />
    </article>
  );
}
