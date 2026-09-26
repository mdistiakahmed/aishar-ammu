"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { PausingGif } from "@/components/homepage/PausingGif";
import { GuestDashCard } from "@/components/homepage/guest/GuestDashCard";
import {
  CrescentIcon,
  PencilIcon,
  StethoscopeIcon,
} from "@/components/homepage/guest/GuestDashIcons";
import babyWeekSize from "@/lib/baby-week-size.json";
import thirdTrimesterBn from "@/lib/third-trimester-bn.json";
import { addUtcDays, buildPregnancySnapshot, utcToday } from "@/lib/pregnancy";

/** Signed-out preview until a saved pregnancy start date is available. */
const GUEST_WEEK = 29;
const GUEST_DAY = 2;

const TRIMESTER_LABEL: Record<1 | 2 | 3, string> = {
  1: "প্রথম ত্রৈমাসিক",
  2: "দ্বিতীয় ত্রৈমাসিক",
  3: "তৃতীয় ত্রৈমাসিক",
};

function guideForWeek(week: number) {
  const contentWeek = Math.min(40, Math.max(28, week));
  return (
    thirdTrimesterBn.data.find((entry) => entry.week === contentWeek) ??
    thirdTrimesterBn.data[0]
  );
}

function sizeForWeek(week: number) {
  const contentWeek = Math.min(40, Math.max(4, week));
  return (
    babyWeekSize.data.find((entry) => entry.week === contentWeek) ??
    babyWeekSize.data[0]
  );
}

const PREVIEW_DUA = {
  text: "হে আমার পালনকর্তা, তোমার কাছ থেকে আমাকে উত্তম সন্তান দান কর। নিশ্চয়ই তুমি প্রার্থনা শ্রবণকারী।",
  source: "সূরা আলে ইমরান: ৩৮",
};

const BN_DIGITS = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"];

function toBnDigits(value: string | number) {
  return String(value).replace(
    /\d/g,
    (digit) => BN_DIGITS[Number(digit)] ?? digit,
  );
}

function formatDisplayDate(date: Date) {
  return toBnDigits(
    new Intl.DateTimeFormat("bn-BD", {
      month: "long",
      day: "numeric",
      year: "numeric",
    }).format(date),
  );
}

function timeOfDayGreeting(date: Date) {
  const hour = date.getHours();
  if (hour < 12) return "সুপ্রভাত";
  if (hour < 17) return "শুভ অপরাহ্ন";
  return "শুভ সন্ধ্যা";
}

function trimesterProgress(week: number, day: number, trimester: 1 | 2 | 3) {
  const totalDays = Math.max(0, week) * 7 + Math.max(0, day);
  if (trimester === 1) return Math.min(1, totalDays / (14 * 7));
  if (trimester === 2)
    return Math.min(1, Math.max(0, totalDays - 14 * 7) / (14 * 7));
  return Math.min(1, Math.max(0, totalDays - 28 * 7) / (12 * 7 + 6));
}

function formatWeightBn(weightGrams: number) {
  if (weightGrams < 1000) return `${toBnDigits(weightGrams)} গ্রাম`;
  const kg = weightGrams / 1000;
  const hundredths = Math.round(kg * 100);
  const label = hundredths % 10 === 0 ? kg.toFixed(1) : kg.toFixed(2);
  return `${toBnDigits(label)} কেজি`;
}

/** Sample visit a few days ahead so the preview card feels current. */
function previewVisitLabel(from: Date) {
  const visit = new Date(from);
  visit.setDate(visit.getDate() + 6);
  const day = toBnDigits(
    new Intl.DateTimeFormat("bn-BD", { month: "short", day: "numeric" }).format(
      visit,
    ),
  );
  return `${day}, সকাল ১০:০০`;
}

export function PregnancyDashPreview({
  fillViewport = false,
  pregnancyStartDate,
}: {
  /** Guest landing locks to the viewport; logged-in pages size to content. */
  fillViewport?: boolean;
  /** Saved start date. Omit for the signed-out preview (29 weeks, 2 days). */
  pregnancyStartDate?: string | null;
}) {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    setNow(new Date());
  }, []);

  const snapshot = useMemo(() => {
    const start =
      pregnancyStartDate === undefined
        ? addUtcDays(utcToday(), -(GUEST_WEEK * 7 + GUEST_DAY))
        : pregnancyStartDate;
    return buildPregnancySnapshot({
      pregnancyStartDate: start,
      dueDate: null,
      nextDoctorVisitDate: null,
    });
  }, [pregnancyStartDate]);

  const weekGuide = guideForWeek(snapshot.week);
  const babySize = sizeForWeek(snapshot.week);
  const weightLabel = formatWeightBn(babySize.weightGrams);
  const progress = trimesterProgress(
    snapshot.week,
    snapshot.day,
    snapshot.trimester,
  );
  const ageLabel = `${toBnDigits(snapshot.week)} সপ্তাহ ${toBnDigits(snapshot.day)} দিন`;
  const visitWhen = previewVisitLabel(now);

  const shellClass = fillViewport
    ? "font-bn -my-1 mx-auto flex h-[calc(100svh-7.25rem)] w-full max-w-6xl flex-col gap-1.5 overflow-hidden sm:my-0 sm:h-[calc(100svh-7.75rem)] sm:gap-3 lg:h-auto lg:min-h-[min(720px,calc(100svh-8rem))] lg:gap-6 lg:overflow-visible"
    : "font-bn mx-auto flex w-full max-w-6xl flex-col gap-1.5 sm:gap-3 lg:min-h-[min(720px,calc(100svh-8rem))] lg:gap-6";

  return (
    <div className={shellClass}>
      <header className="shrink-0 px-0.5">
        <h1 className="font-bn text-xl font-semibold leading-tight tracking-tight text-[#3f4634] sm:text-2xl lg:text-4xl">
          <span>{timeOfDayGreeting(now)}, প্রিয় আম্মু </span>
          <span className="inline-block text-rose-300" aria-hidden="true">
            <svg
              className="inline h-4 w-4 align-[-0.1em] lg:h-6 lg:w-6"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M12 19.4s-6.6-4.1-8.4-8A4.4 4.4 0 0 1 12 7.6a4.4 4.4 0 0 1 8.4 3.8c-1.8 3.9-8.4 8-8.4 8Z" />
            </svg>
          </span>
        </h1>
        <p className="mt-0.5 text-[0.7rem] text-[#6b735f] sm:text-sm lg:mt-1.5 lg:text-base">
          {formatDisplayDate(now)}
        </p>
      </header>

      <div
        className={`grid grid-cols-[1.2fr_1fr_1fr] grid-rows-3 gap-1.5 sm:gap-2.5 lg:grid-cols-[1.25fr_1fr_1fr] lg:gap-4 xl:gap-5 ${
          fillViewport
            ? "min-h-0 flex-1"
            : "min-h-[28rem] sm:min-h-[32rem] lg:min-h-0 lg:flex-1"
        }`}
      >
        <GuestDashCard
          title="আজকের বাবুর বয়স"
          headerClassName="bg-[#d4846a]"
          className="row-span-3"
          bodyClassName="items-center justify-between gap-1 text-center sm:gap-2 lg:gap-3 lg:px-5 lg:py-5"
        >
          <div className="w-full shrink-0">
            <p className="text-[0.95rem] font-semibold leading-tight text-[#3f4634] sm:text-xl lg:text-3xl xl:text-4xl">
              {ageLabel}
            </p>
            <div
              className="mx-auto mt-1.5 h-1.5 w-full max-w-40 overflow-hidden rounded-full bg-[#e8efe4] sm:mt-2 lg:mt-4 lg:h-2.5 lg:max-w-xs"
              role="progressbar"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={Math.round(progress * 100)}
              aria-label={`${TRIMESTER_LABEL[snapshot.trimester]} অগ্রগতি`}
            >
              <div
                className="h-full rounded-full bg-[#769471] transition-[width] duration-500 ease-out"
                style={{
                  width: `${Math.max(10, Math.round(progress * 100))}%`,
                }}
              />
            </div>
            <p className="mt-1 text-[0.6rem] text-[#6b735f] sm:text-[0.7rem] lg:mt-2 lg:text-sm">
              {TRIMESTER_LABEL[snapshot.trimester]}
            </p>
          </div>

          <div className="flex shrink-0 items-center justify-center py-0.5">
            <div className="flex h-36 w-36 items-center justify-center overflow-hidden rounded-full bg-[#fff6f1] shadow-inner ring-4 ring-white sm:h-36 sm:w-36 lg:h-56 lg:w-56 lg:ring-[6px]">
              <PausingGif
                src="/girl-gif-5.gif"
                className="h-full w-full object-cover"
              />
            </div>
          </div>

          <ul className="min-h-0 w-full flex-1 space-y-0.5 overflow-y-auto px-0.5 text-left text-[0.55rem] leading-snug text-[#5c6554] sm:text-[0.7rem] lg:space-y-1 lg:text-sm lg:leading-6">
            {weekGuide.yourBaby.map((line, index) => (
              <li key={`${weekGuide.week}-baby-${index}`} className="flex gap-1.5">
                <span className="shrink-0" aria-hidden="true">
                  •
                </span>
                <span>{line}</span>
              </li>
            ))}
          </ul>
        </GuestDashCard>

        <GuestDashCard
          title="আজকের বাবুর সাইজ"
          headerClassName="bg-[#8c84b0]"
          className="col-start-2 row-start-1"
          bodyClassName="items-center justify-center gap-1 text-center lg:gap-2"
        >
          <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#f4f0fa] sm:h-14 sm:w-14 lg:h-20 lg:w-20">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={`/baby-size/${babySize.image}`}
              alt={babySize.fruit}
              className="h-full w-full object-contain"
            />
          </div>
          <p className="text-[0.58rem] font-medium leading-snug text-[#5c6554] sm:text-[0.7rem] lg:text-sm">
            বাবুর আকার <span className="font-bold text-[#3f4634]">{babySize.fruit}</span> এর সমান
          </p>
          <p className="text-[0.58rem] font-medium leading-snug text-[#5c6554] sm:text-[0.7rem] lg:text-sm">
            বাবুর ওজন <span className="font-bold text-[#3f4634]">{weightLabel}</span>
          </p>
        </GuestDashCard>

        <GuestDashCard
          title="পরবর্তী ডাক্তার দেখা"
          headerClassName="bg-[#d5d0de]"
          titleClassName="text-[#4a4458]"
          icon={
            <StethoscopeIcon className="h-3.5 w-3.5 text-[#4a4458] lg:h-4 lg:w-4" />
          }
          className="col-start-3 row-start-1"
          bodyClassName="justify-center gap-0.5 lg:gap-1"
        >
          <p className="text-[0.58rem] leading-snug text-[#4a4458] sm:text-[0.7rem] lg:text-sm">
            <span className="font-semibold">সাক্ষাৎ:</span> {visitWhen}
          </p>
          <p className="text-[0.58rem] leading-snug text-[#6b6680] sm:text-[0.7rem] lg:text-sm">
            ডা. আয়শা খান
          </p>
        </GuestDashCard>

        <GuestDashCard
          title="আজকের নোট"
          headerClassName="bg-[#e8dcc8]"
          titleClassName="text-[#5c5346]"
          icon={
            <PencilIcon className="h-3.5 w-3.5 text-[#5c5346] lg:h-4 lg:w-4" />
          }
          className="col-span-2 col-start-2 row-start-2"
          bodyClassName="justify-center"
        >
          <ol className="min-h-0 flex-1 space-y-0.5 overflow-y-auto text-[0.58rem] leading-snug text-[#5c5346] sm:text-[0.7rem] lg:space-y-1.5 lg:text-sm lg:leading-6">
            {weekGuide.yourBody.map((line, index) => (
              <li key={`${weekGuide.week}-body-${index}`} className="flex gap-1.5">
                <span className="font-semibold tabular-nums">
                  {toBnDigits(index + 1)}.
                </span>
                <span>{line}</span>
              </li>
            ))}
          </ol>
        </GuestDashCard>

        <GuestDashCard
          title="ইসলামি দোয়া"
          headerClassName="bg-[#ddd6cb]"
          titleClassName="text-[#5c5346]"
          icon={
            <CrescentIcon className="h-3.5 w-3.5 text-[#5c5346] lg:h-4 lg:w-4" />
          }
          className="col-span-2 col-start-2 row-start-3"
          bodyClassName="justify-center gap-1 lg:gap-2"
        >
          <p className="text-[0.58rem] leading-snug text-[#4a4458] sm:text-[0.7rem] lg:text-sm lg:leading-6">
            {PREVIEW_DUA.text}
          </p>
          <p className="text-[0.5rem] text-[#8a8498] sm:text-[0.6rem] lg:text-xs">
            — {PREVIEW_DUA.source}
          </p>
          <Link
            href="/duas"
            className="mt-auto text-[0.55rem] font-semibold text-sage underline-offset-2 hover:underline lg:text-xs"
          >
            আরও দোয়া
          </Link>
        </GuestDashCard>
      </div>
    </div>
  );
}
