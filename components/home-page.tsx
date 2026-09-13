"use client";

import Link from "next/link";
import { useLanguage } from "@/components/language-provider";
import { BellIcon, CalendarIcon, ScaleIcon } from "@/components/icons";

const monthAccents = [
  "from-rose-100 to-orange-50",
  "from-orange-100 to-amber-50",
  "from-amber-100 to-yellow-50",
  "from-lime-100 to-emerald-50",
  "from-emerald-100 to-teal-50",
  "from-teal-100 to-sky-50",
  "from-sky-100 to-indigo-50",
  "from-violet-100 to-fuchsia-50",
  "from-fuchsia-100 to-rose-50",
  "from-rose-200 to-orange-100",
];

const toolIcons = {
  "due-date": CalendarIcon,
  "doctor-visit": BellIcon,
  "expected-weight": ScaleIcon,
};

export function HomePage() {
  const { t } = useLanguage();

  return (
    <div id="home" className="space-y-12 sm:space-y-16">
      <section className="overflow-hidden rounded-[2rem] border border-rose-100 bg-[linear-gradient(135deg,#fff7f4_0%,#fde8ef_48%,#fff1e0_100%)] px-5 py-8 sm:px-10 sm:py-12">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-rose-700">
          {t.heroEyebrow}
        </p>
        <h1 className="mt-3 max-w-2xl text-3xl font-semibold leading-tight text-rose-950 sm:text-5xl">
          {t.heroTitle}
        </h1>
        <p className="mt-4 max-w-2xl text-base leading-7 text-rose-900/80 sm:text-lg">
          {t.heroBody}
        </p>
        <div className="mt-7 flex flex-col gap-3 sm:flex-row">
          <Link
            href="#monthly-care"
            className="inline-flex min-h-12 items-center justify-center rounded-full bg-rose-700 px-5 text-sm font-semibold text-white shadow-sm hover:bg-rose-800"
          >
            {t.heroCtaMonths}
          </Link>
          <Link
            href="#care-tools"
            className="inline-flex min-h-12 items-center justify-center rounded-full border border-rose-200 bg-white/80 px-5 text-sm font-semibold text-rose-900 hover:bg-white"
          >
            {t.heroCtaTools}
          </Link>
        </div>
      </section>

      <section id="care-tools" className="scroll-mt-24 space-y-5">
        <div>
          <h2 className="text-2xl font-semibold text-rose-950 sm:text-3xl">{t.toolsTitle}</h2>
          <p className="mt-2 max-w-2xl text-rose-900/75">{t.toolsSubtitle}</p>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {t.tools.map((tool) => {
            const Icon = toolIcons[tool.id];
            return (
              <article
                key={tool.id}
                id={`tool-${tool.id}`}
                className="scroll-mt-24 flex flex-col rounded-3xl border border-rose-100 bg-white p-5 shadow-sm"
              >
                <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-50 text-rose-700">
                  <Icon className="h-6 w-6" />
                </span>
                <h3 className="mt-4 text-lg font-semibold text-rose-950">{tool.title}</h3>
                <p className="mt-2 flex-1 text-sm leading-6 text-rose-900/75">{tool.description}</p>
                <Link
                  href={tool.href}
                  className="mt-5 inline-flex min-h-11 items-center justify-center rounded-full bg-sage px-4 text-sm font-semibold text-white hover:bg-sage-dark"
                >
                  {t.openTool}
                </Link>
              </article>
            );
          })}
        </div>
      </section>

      <section id="monthly-care" className="scroll-mt-24 space-y-5">
        <div>
          <h2 className="text-2xl font-semibold text-rose-950 sm:text-3xl">{t.monthsTitle}</h2>
          <p className="mt-2 max-w-2xl text-rose-900/75">{t.monthsSubtitle}</p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {t.months.map((month, index) => (
            <article
              key={month.id}
              id={`month-${month.id}`}
              className={`scroll-mt-24 rounded-3xl border border-white/70 bg-linear-to-br ${monthAccents[index]} p-5 shadow-sm`}
            >
              <div className="flex items-center justify-between gap-3">
                <h3 className="text-xl font-semibold text-rose-950">{month.title}</h3>
                <span className="rounded-full bg-white/80 px-3 py-1 text-xs font-semibold text-rose-800">
                  {String(month.id).padStart(2, "0")}
                </span>
              </div>
              <div className="mt-4 space-y-3">
                <p className="text-sm leading-6 text-rose-950/85">
                  <span className="font-semibold">{t.motherLabel}: </span>
                  {month.mother}
                </p>
                <p className="text-sm leading-6 text-rose-950/85">
                  <span className="font-semibold">{t.babyLabel}: </span>
                  {month.baby}
                </p>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
