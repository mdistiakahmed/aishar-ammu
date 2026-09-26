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
import { GuestProduceIllustration } from "@/components/homepage/guest/GuestIllustrations";
import { babySizeAge, getBabySizeWeek } from "@/lib/baby-size";
import { addUtcDays, buildPregnancySnapshot, utcToday } from "@/lib/pregnancy";

/** Sample week shown so the dashboard looks complete before real profile data is wired. */
const DEMO_WEEK = 7;
const DEMO_DAY = 3;

const TRIMESTER_LABEL: Record<1 | 2 | 3, string> = {
  1: "প্রথম ত্রৈমাসিক",
  2: "দ্বিতীয় ত্রৈমাসিক",
  3: "তৃতীয় ত্রৈমাসিক",
};

const SIZE_HIGHLIGHTS: Record<1 | 2 | 3, [string, string]> = {
  1: ["ক্ষুদ্র নড়াচড়া শুরু হচ্ছে", "প্রধান অঙ্গগুলো গঠিত হচ্ছে"],
  2: ["নড়াচড়া আরও বোঝা যেতে পারে", "শিশু সপ্তাহে সপ্তাহে বেড়ে উঠছে"],
  3: [
    "শিশু আপনার সাথে দেখা করতে প্রস্তুত হচ্ছে",
    "পূর্ণকাল পর্যন্ত বৃদ্ধি চলছে",
  ],
};

const TODAY_NOTES: Record<1 | 2 | 3, [string, string, string]> = {
  1: ["পর্যাপ্ত পানি খান", "একটু হাঁটুন", "সুযোগ পেলে বিশ্রাম নিন"],
  2: ["পর্যাপ্ত পানি খান", "ধীরে হাঁটুন", "শিশুর নড়াচড়া লক্ষ্য করুন"],
  3: ["পর্যাপ্ত পানি খান", "পা তুলে বিশ্রাম নিন", "শান্ত সন্ধ্যা কাটান"],
};

const PRODUCE_BN: Record<string, string> = {
  "poppy seed": "পপি বীজ",
  "sesame seed": "তিল",
  "apple seed": "আপেলের বীজ",
  lentil: "মসুর ডাল",
  blueberry: "ব্লুবেরি",
  raspberry: "রাস্পবেরি",
  grape: "আঙুর",
  strawberry: "স্ট্রবেরি",
  fig: "ডুমুর",
  lime: "লেবু",
  "pea pod": "মটরশুঁটি",
  lemon: "লেবু",
  apple: "আপেল",
  avocado: "অ্যাভোকাডো",
  pear: "নাশপাতি",
  "bell pepper": "ক্যাপসিকাম",
  mango: "আম",
  banana: "কলা",
  carrot: "গাজর",
  papaya: "পেঁপে",
  grapefruit: "বাতাবি লেবু",
  "ear of corn": "ভুট্টা",
  cauliflower: "ফুলকপি",
  "spring onions": "পেঁয়াজকলি",
  cabbage: "বাঁধাকপি",
  eggplant: "বেগুন",
  "butternut squash": "স্কোয়াশ",
  coconut: "নারকেল",
  pineapple: "আনারস",
  squash: "স্কোয়াশ",
  cantaloupe: "খরমুজ",
  "honeydew melon": "মধুমেলন",
  "romaine lettuce": "লেটুস",
  "Swiss chard": "পালং শাক",
  leek: "লীক",
  "mini watermelon": "ছোট তরমুজ",
  "small pumpkin": "ছোট কুমড়া",
};

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

function produceLabelBn(produceName: string) {
  return PRODUCE_BN[produceName] ?? produceName;
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

function formatLengthLabelBn(lengthCm: string) {
  const match = lengthCm.match(/([\d.]+)\s*cm/i);
  if (match) return `প্রায় ${toBnDigits(match[1])} সেমি`;
  if (/too early/i.test(lengthCm)) return "এখনো পরিমাপযোগ্য নয়";
  if (/under/i.test(lengthCm)) return "০.১ সেমির কম";
  return "আকার ভিন্ন হতে পারে";
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
}: {
  /** Guest landing locks to the viewport; logged-in pages size to content. */
  fillViewport?: boolean;
}) {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    setNow(new Date());
  }, []);

  const snapshot = useMemo(() => {
    const start = addUtcDays(utcToday(), -(DEMO_WEEK * 7 + DEMO_DAY));
    return buildPregnancySnapshot({
      pregnancyStartDate: start,
      dueDate: null,
      nextDoctorVisitDate: null,
    });
  }, []);

  const { week } = babySizeAge(snapshot.week, snapshot.day);
  const size = getBabySizeWeek(week);
  const produceLabel = produceLabelBn(size.produceName);
  const lengthLabel = formatLengthLabelBn(snapshot.milestone.lengthCm);
  const highlights = SIZE_HIGHLIGHTS[snapshot.trimester];
  const notes = TODAY_NOTES[snapshot.trimester];
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

          <p className="shrink-0 px-0.5 text-[0.55rem] leading-snug text-[#5c6554] sm:text-[0.7rem] lg:text-sm lg:leading-6">
            <span className="font-semibold">বিকাশ:</span> {highlights[0]},{" "}
            {highlights[1]}।
          </p>
        </GuestDashCard>

        <GuestDashCard
          title="আজকের বাবুর সাইজ"
          headerClassName="bg-[#8c84b0]"
          className="col-start-2 row-start-1"
          bodyClassName="items-center justify-center gap-1 text-center lg:gap-2"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#f4f0fa] sm:h-11 sm:w-11 lg:h-16 lg:w-16">
            <GuestProduceIllustration
              produceName={size.produceName}
              className="h-7 w-7 sm:h-9 sm:w-9 lg:h-14 lg:w-14"
            />
          </div>
          <p className="text-[0.58rem] font-medium leading-snug text-[#5c6554] sm:text-[0.7rem] lg:text-sm">
            {produceLabel}, {lengthLabel}।
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
          <ol className="space-y-0.5 text-[0.58rem] leading-snug text-[#5c5346] sm:text-[0.7rem] lg:space-y-1.5 lg:text-sm lg:leading-6">
            {notes.map((line, index) => (
              <li key={line} className="flex gap-1.5">
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
