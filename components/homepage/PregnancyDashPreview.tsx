"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { NextDoctorVisitCard } from "@/components/homepage/NextDoctorVisitCard";
import { GuestDashCard } from "@/components/homepage/guest/GuestDashCard";
import {
  CrescentIcon,
  FlameIcon,
} from "@/components/homepage/guest/GuestDashIcons";
import babyWeekSize from "@/lib/baby-week-size.json";
import pregnancyWeekByWeek from "@/lib/pregnancy-week-by-week.json";
import {
  addUtcDays,
  buildPregnancySnapshot,
  trimester,
  utcToday,
} from "@/lib/pregnancy";

/** Signed-out preview until a saved pregnancy start date is available. */
const GUEST_WEEK = 29;
const GUEST_DAY = 2;

/** Week-by-week writing covers pregnancy weeks 1 through 40. */
const CONTENT_MIN_WEEK = 1;
const CONTENT_MAX_WEEK = 40;

function stepContentWeek(week: number, direction: -1 | 1) {
  if (direction < 0) {
    if (week > CONTENT_MAX_WEEK) return CONTENT_MAX_WEEK;
    return Math.max(CONTENT_MIN_WEEK, week - 1);
  }
  if (week < CONTENT_MIN_WEEK) return CONTENT_MIN_WEEK;
  return Math.min(CONTENT_MAX_WEEK, week + 1);
}

const TRIMESTER_LABEL: Record<1 | 2 | 3, string> = {
  1: "প্রথম ত্রৈমাসিক",
  2: "দ্বিতীয় ত্রৈমাসিক",
  3: "তৃতীয় ত্রৈমাসিক",
};

function guideForWeek(week: number) {
  const contentWeek = Math.min(
    CONTENT_MAX_WEEK,
    Math.max(CONTENT_MIN_WEEK, week),
  );
  return (
    pregnancyWeekByWeek.data.find((entry) => entry.week === contentWeek) ??
    pregnancyWeekByWeek.data[0]
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
  const day = new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
  }).format(visit);
  return `${day}, 10:30 AM`;
}

function ChevronIcon({
  direction,
  className,
}: {
  direction: "left" | "right";
  className?: string;
}) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d={
          direction === "left"
            ? "M14.5 6.5 9 12l5.5 5.5"
            : "M9.5 6.5 15 12l-5.5 5.5"
        }
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function CurrentWeekIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="7.25" stroke="currentColor" strokeWidth="2" />
      <circle cx="12" cy="12" r="2.25" fill="currentColor" />
    </svg>
  );
}

export function PregnancyDashPreview({
  fillViewport = false,
  pregnancyStartDate,
  preferredName,
}: {
  /** Guest landing locks to the viewport; logged-in pages size to content. */
  fillViewport?: boolean;
  /** Saved start date. Omit for the signed-out preview (29 weeks, 2 days). */
  pregnancyStartDate?: string | null;
  /** Name shown after the time-of-day greeting. Omit for the signed-out preview. */
  preferredName?: string | null;
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

  const [viewedWeek, setViewedWeek] = useState(snapshot.week);

  useEffect(() => {
    setViewedWeek(snapshot.week);
  }, [snapshot.week]);

  const isCurrentWeek = viewedWeek === snapshot.week;
  const otherWeekNote = isCurrentWeek
    ? null
    : viewedWeek < snapshot.week
      ? "আপনি আগের সপ্তাহের নির্দেশনা দেখছেন। চলতি সপ্তাহ দেখতে ‘চলতি সপ্তাহ’ চাপুন।"
      : "আপনি সামনের সপ্তাহের নির্দেশনা দেখছেন। চলতি সপ্তাহ দেখতে ‘চলতি সপ্তাহ’ চাপুন।";
  const todayCardHeight = isCurrentWeek
    ? "h-52 lg:h-64"
    : "min-h-52 lg:min-h-64";

  const viewedTrimester = trimester(viewedWeek);
  const weekGuide = guideForWeek(viewedWeek);
  const babySize = sizeForWeek(viewedWeek);
  const viewedWeekLabel = toBnDigits(viewedWeek);
  const weightLabel = formatWeightBn(babySize.weightGrams);
  const ageLabel = `${toBnDigits(viewedWeek)} সপ্তাহ ${toBnDigits(snapshot.day)} দিন`;
  const visitWhen = previewVisitLabel(now);

  const shellClass = fillViewport
    ? "font-bn -my-1 mx-auto flex w-full max-w-6xl flex-col gap-1.5 sm:my-0 sm:gap-3 lg:gap-6"
    : "font-bn mx-auto flex w-full max-w-6xl flex-col gap-1.5 sm:gap-3 lg:gap-6";

  return (
    <div className={shellClass}>
      <header className="shrink-0 px-0.5">
        <h1 className="font-bn text-lg font-semibold leading-tight tracking-tight text-ink sm:text-xl lg:text-2xl">
          <span>
            {timeOfDayGreeting(now)}
            {preferredName?.trim() ? `, ${preferredName.trim()}` : ""}
          </span>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/logo.png"
            alt=""
            className="ml-1.5 inline h-5 w-5 rounded-full object-cover align-[-0.15em] sm:h-6 sm:w-6 lg:h-7 lg:w-7"
          />
        </h1>
        <p className="mt-0.5 text-[0.65rem] text-[#5f7c82] sm:text-xs lg:mt-1 lg:text-sm">
          {formatDisplayDate(now)}
        </p>
      </header>

      <div className="flex flex-wrap items-center justify-end gap-1 sm:gap-1.5">
        <p className="mr-0.5 text-[0.625rem] font-semibold text-ink sm:text-sm">
          সপ্তাহ {viewedWeekLabel}
        </p>
        <button
          type="button"
          className="inline-flex h-6 items-center gap-0.5 rounded-full border border-[#c5ddd9] bg-white px-1.5 text-[0.625rem] font-semibold leading-none text-ink disabled:opacity-40 sm:h-8 sm:gap-1 sm:px-2.5 sm:text-xs"
          disabled={viewedWeek <= CONTENT_MIN_WEEK}
          onClick={() => setViewedWeek((week) => stepContentWeek(week, -1))}
        >
          <ChevronIcon direction="left" className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
          আগের সপ্তাহ
        </button>
        <button
          type="button"
          className={`inline-flex h-6 items-center gap-0.5 rounded-full px-1.5 text-[0.625rem] font-semibold leading-none sm:h-8 sm:gap-1 sm:px-2.5 sm:text-xs ${
            isCurrentWeek
              ? "bg-dusk text-white"
              : "border border-[#c5ddd9] bg-white text-ink"
          }`}
          aria-pressed={isCurrentWeek}
          onClick={() => setViewedWeek(snapshot.week)}
        >
          <CurrentWeekIcon className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
          চলতি সপ্তাহ
        </button>
        <button
          type="button"
          className="inline-flex h-6 items-center gap-0.5 rounded-full bg-peach px-1.5 text-[0.625rem] font-semibold leading-none text-[#3f2a22] disabled:opacity-40 sm:h-8 sm:gap-1 sm:px-2.5 sm:text-xs"
          disabled={viewedWeek >= CONTENT_MAX_WEEK}
          onClick={() => setViewedWeek((week) => stepContentWeek(week, 1))}
        >
          পরের সপ্তাহ
          <ChevronIcon
            direction="right"
            className="h-3 w-3 sm:h-3.5 sm:w-3.5"
          />
        </button>
      </div>

      <div className="grid grid-cols-[1.2fr_1fr_1fr] items-start gap-1.5 sm:gap-2.5 lg:grid-cols-[1.25fr_1fr_1fr] lg:gap-4 xl:gap-5">
        <GuestDashCard
          title="আজকের বাবুর বয়স"
          headerClassName="bg-dusk"
          className={`col-start-1 row-start-1 self-start ${todayCardHeight}`}
          bodyClassName="relative min-h-0 flex-1 items-center justify-center gap-1 text-center lg:px-5"
        >
          <div className="w-full">
            <p className="text-base font-semibold leading-tight text-ink sm:text-xl lg:text-3xl">
              {ageLabel}
            </p>
            <p className="mt-1 text-[0.6rem] text-[#5f7c82] sm:text-[0.7rem] lg:text-sm">
              {TRIMESTER_LABEL[viewedTrimester]}
            </p>
            {otherWeekNote ? (
              <p className="mt-1.5 text-[0.55rem] leading-snug text-[#8a5a42] sm:text-[0.65rem] lg:text-xs">
                {otherWeekNote}
              </p>
            ) : null}
          </div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/baby.png"
            alt=""
            className="pointer-events-none absolute bottom-1 right-1 h-16 w-14 object-contain sm:h-20 sm:w-16 lg:bottom-2 lg:right-2 lg:h-24 lg:w-20"
          />
        </GuestDashCard>

        <GuestDashCard
          title={
            isCurrentWeek
              ? "এই সপ্তাহের বাবুর বিকাশ"
              : `সপ্তাহ ${viewedWeekLabel}-এর বাবুর বিকাশ`
          }
          headerClassName="bg-dusk"
          className="row-start-2 min-h-52 max-lg:col-span-3 self-start lg:col-start-1 lg:row-start-2 lg:min-h-72"
          bodyClassName="gap-3 lg:px-5 lg:py-4"
        >
          <div
            className="flex items-end justify-center gap-1 sm:gap-3"
            aria-hidden="true"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/baby-fingers.png"
              alt=""
              className="h-16 w-14 object-contain sm:h-20 sm:w-16 lg:h-24 lg:w-20"
            />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/baby.png"
              alt=""
              className="h-20 w-16 object-contain sm:h-24 sm:w-20 lg:h-28 lg:w-24"
            />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/baby-toe.png"
              alt=""
              className="h-16 w-14 object-contain sm:h-20 sm:w-16 lg:h-24 lg:w-20"
            />
          </div>

          <ul className="w-full space-y-1 px-0.5 text-left text-md leading-snug text-[#3e4a46] lg:leading-6">
            {weekGuide.yourBaby.map((line, index) => (
              <li
                key={`${weekGuide.week}-baby-${index}`}
                className="flex gap-1.5"
              >
                <span className="shrink-0" aria-hidden="true">
                  •
                </span>
                <span>{line}</span>
              </li>
            ))}
          </ul>
        </GuestDashCard>

        <GuestDashCard
          title={
            isCurrentWeek
              ? "এই সপ্তাহের বাবুর সাইজ"
              : `সপ্তাহ ${viewedWeekLabel}-এর বাবুর সাইজ`
          }
          headerClassName="bg-mint"
          titleClassName="text-[#1e3a38]"
          className="col-start-2 row-start-1 h-52 self-start lg:h-64"
          bodyClassName="min-h-0 flex-1 items-center justify-center gap-1 text-center lg:gap-2"
        >
          <div className="flex h-16 w-16 shrink-0 items-center justify-center sm:h-20 sm:w-20 lg:h-24 lg:w-24">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={`/baby-size/${babySize.image}`}
              alt={babySize.fruit}
              className="h-full w-full object-contain"
            />
          </div>
          <p className="text-[0.58rem] font-medium leading-snug text-[#3e4a46] sm:text-[0.7rem] lg:text-sm">
            বাবুর আকার{" "}
            <span className="font-bold text-ink">{babySize.fruit}</span> এর সমান
          </p>
          <p className="inline-flex items-center justify-center gap-1.5 text-[0.58rem] font-medium leading-snug text-[#3e4a46] sm:text-[0.7rem] lg:text-sm">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/weight-machine.png"
              alt=""
              className="h-7 w-7 shrink-0 object-contain sm:h-8 sm:w-8 lg:h-9 lg:w-9"
            />
            <span>
              বাবুর ওজন{" "}
              <span className="font-bold text-ink">{weightLabel}</span>
            </span>
          </p>
        </GuestDashCard>

        <NextDoctorVisitCard
          previewWhen={visitWhen}
          note={otherWeekNote}
          className="col-start-3 row-start-1 self-start min-h-52 lg:min-h-64"
        />

        <div className="contents lg:col-span-2 lg:col-start-2 lg:row-start-2 lg:flex lg:flex-col lg:gap-4 lg:self-stretch xl:gap-5">
          <GuestDashCard
            title="মায়ের শারীরিক/ মানসিক পরিবর্তন"
            headerClassName="bg-peach"
            titleClassName="text-[#4a3428]"
            icon={
              <FlameIcon className="h-3.5 w-3.5 text-[#4a3428] lg:h-4 lg:w-4" />
            }
            className="row-start-3 min-h-40 max-lg:col-span-3 lg:h-auto lg:min-h-44 lg:flex-none"
            bodyClassName="shrink-0 justify-start pb-3 lg:pb-4"
          >
            <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center">
              <div className="flex min-w-0 flex-1 flex-col">
                <ol className="space-y-1 text-md leading-snug text-[#4a3428] lg:space-y-1.5 lg:leading-6">
                  {weekGuide.yourBody.map((line, index) => (
                    <li
                      key={`${weekGuide.week}-body-${index}`}
                      className="flex gap-1.5"
                    >
                      <span className="font-semibold tabular-nums">
                        {toBnDigits(index + 1)}.
                      </span>
                      <span>{line}</span>
                    </li>
                  ))}
                </ol>
                <Link
                  href="#"
                  onClick={(event) => event.preventDefault()}
                  className="mt-3 inline-flex h-11 items-center gap-1.5 self-end rounded-full bg-peach px-4 text-sm font-semibold text-[#4a3428] shadow-sm transition hover:bg-[#e9a67a]"
                >
                  Details
                  <span aria-hidden="true">→</span>
                </Link>
              </div>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/baby-with-mother.png"
                alt="A mother resting beside her baby"
                className="h-28 w-full shrink-0 rounded-2xl object-cover sm:h-32 sm:w-40 lg:h-36 lg:w-44"
              />
            </div>
          </GuestDashCard>

          <GuestDashCard
            title="সাজেশনস"
            headerClassName="bg-mint"
            titleClassName="text-[#1e3a38]"
            className="row-start-4 min-h-40 max-lg:col-span-3 lg:min-h-44 lg:flex-1"
            bodyClassName="flex-1 justify-center"
          >
            <ol className="space-y-1 text-md leading-snug text-ink lg:space-y-1.5 lg:leading-6">
              {weekGuide.suggestionsThisWeek.map((line, index) => (
                <li
                  key={`${weekGuide.week}-suggestion-${index}`}
                  className="flex gap-1.5"
                >
                  <span className="font-semibold tabular-nums">
                    {toBnDigits(index + 1)}.
                  </span>
                  <span>{line}</span>
                </li>
              ))}
            </ol>
          </GuestDashCard>

          <GuestDashCard
            title="আজকের দোয়া"
            headerClassName="bg-mist"
            titleClassName="text-[#1e3a38]"
            icon={
              <CrescentIcon className="h-3.5 w-3.5 text-[#1e3a38] lg:h-4 lg:w-4" />
            }
            className="row-start-5 min-h-40 max-lg:col-span-3 lg:min-h-44 lg:flex-1"
            bodyClassName="flex-1 justify-center gap-1 lg:gap-2"
          >
            <p className="text-md leading-snug text-ink lg:leading-6">
              {PREVIEW_DUA.text}
            </p>
            <p className="text-xs text-[#5f7c82]">— {PREVIEW_DUA.source}</p>
            <Link
              href="/duas"
              className="mt-auto text-xs font-semibold text-sage underline-offset-2 hover:underline"
            >
              আরও দোয়া
            </Link>
          </GuestDashCard>
        </div>
      </div>
    </div>
  );
}
