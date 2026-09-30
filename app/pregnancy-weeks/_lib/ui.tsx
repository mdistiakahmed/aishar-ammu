import Link from "next/link";
import { FetusMark } from "@/app/pregnancy-weeks/_lib/illustrations";
import { weekSpanLabel } from "@/app/pregnancy-weeks/_lib/format";
import {
  TONE_CLASS,
  type GuideTone,
  type WeekRange,
} from "@/app/pregnancy-weeks/_lib/ranges";

export function WeeksBreadcrumb({
  items,
}: {
  items: { href?: string; label: string }[];
}) {
  return (
    <nav aria-label="ব্রেডক্রাম্ব" className="font-bn text-sm text-rose-900/55">
      <ol className="flex flex-wrap items-center gap-x-1.5 gap-y-1">
        {items.map((item, index) => (
          <li key={`${item.label}-${index}`} className="flex items-center gap-1.5">
            {index > 0 ? (
              <span aria-hidden="true" className="text-rose-300">
                ›
              </span>
            ) : null}
            {item.href ? (
              <Link href={item.href} className="min-h-11 inline-flex items-center hover:text-rose-800">
                {item.label}
              </Link>
            ) : (
              <span className="font-semibold text-rose-950">{item.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

function Chevron() {
  return (
    <svg viewBox="0 0 20 20" className="h-4 w-4 shrink-0" aria-hidden="true" fill="none">
      <path
        d="M7.5 4.5 13 10l-5.5 5.5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function RangeCard({ range, tone }: { range: WeekRange; tone: GuideTone }) {
  const toneClass = TONE_CLASS[tone];
  return (
    <Link
      href={`/pregnancy-weeks/${range.slug}`}
      className="flex h-full min-h-11 flex-col rounded-2xl bg-white p-4 shadow-[0_10px_28px_-20px_rgba(90,30,50,0.55)] ring-1 ring-black/5 transition hover:-translate-y-0.5 hover:shadow-md"
    >
      <FetusMark stage={range.stage} className="h-16 w-16" />
      <span className={`mt-3 flex items-center justify-between gap-2 font-bn text-sm font-bold ${toneClass.title}`}>
        {weekSpanLabel(range.from, range.to)}
        <Chevron />
      </span>
      <span className="font-bn mt-1.5 line-clamp-3 text-[13px] leading-5 text-rose-950/70">
        {range.summary}
      </span>
    </Link>
  );
}

export function WeekChoiceCard({
  week,
  stage,
  preview,
  href,
  tone,
}: {
  week: number;
  stage: number;
  preview: string;
  href: string;
  tone: GuideTone;
}) {
  const toneClass = TONE_CLASS[tone];
  return (
    <Link
      href={href}
      className="flex h-full min-h-11 flex-col rounded-[1.35rem] bg-white p-5 shadow-[0_10px_28px_-20px_rgba(90,30,50,0.55)] ring-1 ring-black/5 transition hover:-translate-y-0.5 hover:shadow-md"
    >
      <FetusMark stage={stage} className="h-20 w-20" />
      <span className={`mt-4 flex items-center justify-between gap-2 font-bn text-lg font-bold ${toneClass.title}`}>
        {weekSpanLabel(week)}
        <Chevron />
      </span>
      <span className="font-bn mt-2 line-clamp-3 text-sm leading-6 text-rose-950/70">{preview}</span>
    </Link>
  );
}

export function CareNote() {
  return (
    <aside className="rounded-[1.35rem] border border-sky-100 bg-[#f4f8fc] p-4 sm:p-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex gap-3">
          <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-sky-500 shadow-sm">
            <LightbulbIcon />
          </span>
          <div>
            <p className="font-bn text-sm font-bold text-sky-950">মনে রাখবেন</p>
            <p className="font-bn mt-1 text-sm leading-6 text-sky-950/75">
              প্রতিটি গর্ভাবস্থা আলাদা। এই পাঠ সাধারণ জানাশোনার জন্য। এটি রোগনির্ণয় বা চিকিৎসার
              সিদ্ধান্ত নয়। নিজের অবস্থা নিয়ে চিকিৎসক বা মিডওয়াইফের সঙ্গে কথা বলুন।
            </p>
          </div>
        </div>
        <p className="font-bn flex items-center gap-2 text-sm font-semibold text-rose-700 sm:max-w-[11rem] sm:text-right">
          <span aria-hidden="true" className="text-lg text-rose-400">
            ♥
          </span>
          <span>
            আপনি একা নন
            <span className="mt-0.5 block font-medium text-rose-800/80">আমরা আছি আপনার পাশে</span>
          </span>
        </p>
      </div>
    </aside>
  );
}

function LightbulbIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden="true">
      <path
        d="M9 18h6M10 21h4"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
      <path
        d="M12 3a6.5 6.5 0 0 0-3.2 12.1c.4.3.7.8.7 1.3V17h5v-.6c0-.5.3-1 .7-1.3A6.5 6.5 0 0 0 12 3Z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function GuideList({ title, lines }: { title: string; lines: string[] }) {
  return (
    <section className="rounded-[1.35rem] border border-rose-100 bg-white p-5 shadow-sm sm:p-6">
      <h2 className="font-bn! text-lg font-semibold text-rose-950">{title}</h2>
      <ul className="font-bn mt-3 space-y-2.5 text-sm leading-7 text-rose-950/80">
        {lines.map((line) => (
          <li key={line} className="flex gap-2.5">
            <span aria-hidden="true" className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-rose-300" />
            <span>{line}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
