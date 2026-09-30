import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { FetusMark } from "@/app/pregnancy-weeks/_lib/illustrations";
import { weekSpanLabel } from "@/app/pregnancy-weeks/_lib/format";
import {
  allRangeParams,
  getRange,
  TONE_CLASS,
} from "@/app/pregnancy-weeks/_lib/ranges";
import { getWeekGuide } from "@/app/pregnancy-weeks/_lib/weeks";
import { CareNote, WeekChoiceCard, WeeksBreadcrumb } from "@/app/pregnancy-weeks/_lib/ui";

export const dynamicParams = false;

export function generateStaticParams() {
  return allRangeParams();
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ range: string }>;
}): Promise<Metadata> {
  const { range: slug } = await params;
  const found = getRange(slug);
  if (!found) return { title: "সপ্তাহ অনুযায়ী গর্ভাবস্থা" };
  return {
    title: weekSpanLabel(found.range.from, found.range.to),
    description: found.range.summary,
  };
}

export default async function PregnancyRangePage({
  params,
}: {
  params: Promise<{ range: string }>;
}) {
  const { range: slug } = await params;
  const found = getRange(slug);
  if (!found) notFound();

  const { range, trimester } = found;
  const tone = TONE_CLASS[trimester.tone];
  const weeks = Array.from({ length: range.to - range.from + 1 }, (_, index) => {
    const week = range.from + index;
    const guide = getWeekGuide(week);
    return {
      week,
      preview: guide?.yourBaby[0] ?? range.summary,
    };
  });

  return (
    <article className="space-y-4">
      <WeeksBreadcrumb
        items={[
          { href: "/", label: "হোম" },
          { href: "/pregnancy-weeks", label: "সপ্তাহ অনুযায়ী গর্ভাবস্থা" },
          { label: weekSpanLabel(range.from, range.to) },
        ]}
      />

      <header className={`rounded-[1.75rem] p-5 sm:p-7 ${tone.panel}`}>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <span
            className={`inline-flex h-16 w-16 shrink-0 items-center justify-center rounded-full ${tone.icon}`}
          >
            <FetusMark stage={range.stage} className="h-14 w-14" />
          </span>
          <div>
            <p className={`font-bn text-sm font-semibold ${tone.muted}`}>{trimester.title}</p>
            <h1 className={`font-bn! mt-1 text-3xl font-bold tracking-tight sm:text-4xl ${tone.title}`}>
              {weekSpanLabel(range.from, range.to)}
            </h1>
            <p className="font-bn mt-2 max-w-2xl text-sm leading-7 text-rose-950/75">
              {range.summary} নিচের চারটি সপ্তাহ আলাদা করে খুলুন।
            </p>
          </div>
        </div>
      </header>

      <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {weeks.map((item, index) => (
          <li key={item.week}>
            <WeekChoiceCard
              week={item.week}
              stage={range.stage + (index > 1 ? 1 : 0)}
              preview={item.preview}
              href={`/pregnancy-weeks/${range.slug}/${item.week}`}
              tone={trimester.tone}
            />
          </li>
        ))}
      </ul>

      <CareNote />
    </article>
  );
}
