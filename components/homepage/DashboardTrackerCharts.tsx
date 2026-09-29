"use client";

import Link from "next/link";
import { useSyncExternalStore } from "react";
import { LuArrowRight, LuBaby, LuScale } from "react-icons/lu";
import { useAuth } from "@/components/auth/AuthProvider";
import { MotherWeightProgressChart } from "@/components/charts/MotherWeightProgressChart";
import {
  MovementSetsChart,
  buildMovementChartRows,
  movementChartMax,
} from "@/components/charts/MovementSetsChart";
import {
  BABY_MOVEMENT_STORAGE_KEY,
  localDateKey,
  readMovementLog,
  type MovementLog,
} from "@/lib/baby-movements";
import {
  chartWeekTicks,
  chartWeightTicks,
  getMotherWeightSnapshot,
  getMotherWeightsServerSnapshot,
  motherWeightChart,
  subscribeMotherWeights,
} from "@/lib/mother-weights";

const emptyMovement: MovementLog = {};
const movementServerSnapshot = { log: emptyMovement, today: "" };
let movementRaw = "";
let movementToday = "";
let movementSnapshot = movementServerSnapshot;

function subscribeMovementPreview(onStoreChange: () => void) {
  const onStorage = (event: StorageEvent) => {
    if (event.key !== null && event.key !== BABY_MOVEMENT_STORAGE_KEY) return;
    onStoreChange();
  };
  window.addEventListener("storage", onStorage);
  return () => window.removeEventListener("storage", onStorage);
}

function getMovementPreviewSnapshot() {
  const raw = window.localStorage.getItem(BABY_MOVEMENT_STORAGE_KEY) ?? "";
  const today = localDateKey();
  if (raw === movementRaw && today === movementToday) return movementSnapshot;
  movementRaw = raw;
  movementToday = today;
  movementSnapshot = { log: readMovementLog(), today };
  return movementSnapshot;
}

function getMovementPreviewServerSnapshot() {
  return movementServerSnapshot;
}

export function DashboardTrackerCharts() {
  const { user } = useAuth();
  const signedIn = Boolean(user);
  const movement = useSyncExternalStore(
    subscribeMovementPreview,
    getMovementPreviewSnapshot,
    getMovementPreviewServerSnapshot,
  );
  const weights = useSyncExternalStore(
    subscribeMotherWeights,
    getMotherWeightSnapshot,
    getMotherWeightsServerSnapshot,
  );
  const movementRows = buildMovementChartRows(signedIn ? movement.log : {}, movement.today).map(
    (row) => (signedIn ? row : { ...row, count: null }),
  );
  const weightRows = motherWeightChart(signedIn ? weights : {}).map((row) =>
    signedIn ? row : { ...row, actual: null },
  );
  const weightXTicks = chartWeekTicks(weightRows[0].week, weightRows[weightRows.length - 1].week);
  const weightYTicks = chartWeightTicks(weightRows);

  return (
    <div className="mt-10! space-y-5 sm:mt-14!">
      <section className="rounded-[2rem] border border-rose-100 bg-white p-6 shadow-sm sm:p-8">
        <div>
          <h2 className="text-xl font-semibold text-rose-950">Daily sets</h2>
          <p className="mt-2 text-sm leading-6 text-rose-900/75">
            Each bar is one day of counted movement sets. The red line marks 10 sets as a general guide.
          </p>
        </div>
        <MovementSetsChart rows={movementRows} chartMax={movementChartMax(movementRows)} />
        <div className="mt-6 border-t border-rose-100 pt-6">
          <h3 className="font-bn! text-xl font-semibold leading-snug text-rose-950">
            গর্ভের শিশুর নড়াচড়া কীভাবে গুনবেন
          </h3>
          <p className="font-bn! mt-3 text-sm leading-7 text-rose-900/80">
            গর্ভাবস্থার শেষ দিকে শিশুর লাথি, গড়াগড়ি ও হালকা নড়াচড়া খেয়াল রাখা অনেক মায়ের
            দৈনন্দিন অভ্যাস। এই চার্টে প্রতিটি বার একটি দিনের নড়াচড়ার সেট দেখায়। কাছাকাছি
            সময়ে পরপর হওয়া লাথি বা নড়াকে একটি সেট ধরা হয়, প্রতিটি আলাদা নড়াচড়া নয়।
          </p>
          <p className="font-bn! mt-3 text-sm leading-7 text-rose-900/80">
            লাল রেখাটি শুধু সাধারণ ধারণার জন্য ১০টি সেটের একটি নির্দেশক। এটি কোনো চিকিৎসা
            পরীক্ষা নয় এবং ডাক্তার বা মিডওয়াইফের পরামর্শের বিকল্প নয়। নিজের হিসাব রাখতে
            নড়াচড়া ট্র্যাকার খুলুন।
          </p>
          <TrackerButton
            href="/baby-movement"
            icon={LuBaby}
            title="নড়াচড়া ট্র্যাকার খুলুন"
            subtitle="প্রতিদিনের সেট গুনে রাখুন"
            className="bg-gradient-to-r from-rose-800 to-rose-500 shadow-[0_18px_40px_-22px_rgba(159,18,57,0.9)]"
          />
        </div>
      </section>

      <section className="rounded-3xl border border-neutral-200 bg-white p-5 shadow-sm sm:p-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h2 className="!font-sans text-lg font-semibold tracking-tight text-neutral-950">
              Weight progress
            </h2>
            <p className="mt-1 text-sm text-neutral-500">Expected range vs your recorded weight</p>
          </div>
          <div className="flex flex-wrap items-center gap-4 text-sm text-neutral-500">
            <span className="inline-flex items-center gap-2">
              <span className="inline-block w-7 border-t-2 border-dashed border-neutral-400" />
              Expected
            </span>
            <span className="inline-flex items-center gap-2">
              <span className="inline-block h-0.5 w-7 rounded-full bg-[#22c55e]" />
              Actual
            </span>
          </div>
        </div>
        <MotherWeightProgressChart rows={weightRows} xTicks={weightXTicks} yTicks={weightYTicks} />
        <div className="mt-6 border-t border-neutral-200 pt-6">
          <h3 className="font-bn! text-xl font-semibold leading-snug text-neutral-950">
            গর্ভাবস্থায় মায়ের ওজন কীভাবে দেখবেন
          </h3>
          <p className="font-bn! mt-3 text-sm leading-7 text-neutral-700">
            গর্ভাবস্থায় মায়ের ওজন ধীরে ধীরে বদলাতে পারে। শিশুর বৃদ্ধি, প্লাসেন্টা,
            অ্যামনিওটিক তরল এবং শরীরে বাড়তি রক্ত ও তরলের কারণে কিছুটা ওজন বৃদ্ধি সাধারণ।
            এই চার্টে ড্যাশ রেখাটি প্রথম সপ্তাহের ওজন থেকে একটি শিক্ষামূলক বাড়তি ওজনের
            ধারা দেখায়। সবুজ রেখায় আপনার লেখা সাপ্তাহিক ওজন পাশাপাশি দেখা যায়।
          </p>
          <p className="font-bn! mt-3 text-sm leading-7 text-neutral-700">
            সবার ওজন একই হারে বাড়ে না। গর্ভাবস্থার আগের ওজন, উচ্চতা ও অন্যান্য বিষয়
            এই ধারাকে বদলে দিতে পারে। প্রত্যাশিত রেখা কোনো লক্ষ্য নয় এবং চিকিৎসকের
            পরামর্শের বিকল্প নয়। সপ্তাহে সপ্তাহে ওজন লিখতে ওজন ট্র্যাকার খুলুন।
          </p>
          <TrackerButton
            href="/mother-weight"
            icon={LuScale}
            title="ওজন ট্র্যাকার খুলুন"
            subtitle="সপ্তাহের ওজন লিখে রাখুন"
            className="bg-gradient-to-r from-emerald-800 to-emerald-500 shadow-[0_18px_40px_-22px_rgba(6,78,59,0.9)]"
          />
        </div>
      </section>
    </div>
  );
}

function TrackerButton({
  href,
  icon: Icon,
  title,
  subtitle,
  className,
}: {
  href: string;
  icon: typeof LuBaby;
  title: string;
  subtitle: string;
  className: string;
}) {
  return (
    <Link
      href={href}
      className={`mt-6 flex min-h-24 items-center gap-4 rounded-3xl px-5 py-4 text-white ${className}`}
    >
      <span className="inline-flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-white/20">
        <Icon className="h-9 w-9" aria-hidden="true" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="font-bn! block text-lg font-semibold leading-snug">{title}</span>
        <span className="font-bn! mt-1 block text-sm text-white/85">{subtitle}</span>
      </span>
      <LuArrowRight className="h-7 w-7 shrink-0" aria-hidden="true" />
    </Link>
  );
}
