"use client";

import { useState, type FormEvent } from "react";
import {
  estimateFromLastPeriod,
  estimateFromScan,
  estimateFromTransfer,
  type DueDateEstimate,
} from "@/app/pregnancy-due-date/_lib/estimate";
import { formatBnDate, formatBnWeekday, formatWeekAndDay, toBnDigits } from "@/app/pregnancy-due-date/_lib/format";

type Mode = "lmp" | "scan" | "ivf";

const TRIMESTER_NAME = {
  1: "প্রথম ত্রৈমাসিক",
  2: "দ্বিতীয় ত্রৈমাসিক",
  3: "তৃতীয় ত্রৈমাসিক",
} as const;

const fieldClass =
  "font-bn h-12 w-full rounded-xl border border-rose-100 bg-[#fff8f8] px-3 text-sm text-rose-950 outline-none focus:border-rose-300 focus:ring-2 focus:ring-rose-100";

export function DueDateCalculator() {
  const [mode, setMode] = useState<Mode>("lmp");
  const [lmp, setLmp] = useState("");
  const [cycle, setCycle] = useState(28);
  const [scanDate, setScanDate] = useState("");
  const [scanWeeks, setScanWeeks] = useState(8);
  const [scanDays, setScanDays] = useState(0);
  const [transfer, setTransfer] = useState("");
  const [embryoDay, setEmbryoDay] = useState<3 | 5>(5);
  const [result, setResult] = useState<DueDateEstimate | null>(null);
  const [error, setError] = useState("");

  function chooseMode(next: Mode) {
    setMode(next);
    setResult(null);
    setError("");
  }

  function onSubmit(event: FormEvent) {
    event.preventDefault();
    const estimate =
      mode === "lmp"
        ? estimateFromLastPeriod(lmp, cycle)
        : mode === "scan"
          ? estimateFromScan(scanDate, scanWeeks, scanDays)
          : estimateFromTransfer(transfer, embryoDay);

    if (!estimate) {
      setResult(null);
      setError("তারিখটি ঠিকমতো দিন, তারপর হিসাব করুন।");
      return;
    }
    setError("");
    setResult(estimate);
  }

  return (
    <div className="space-y-4">
      <div className="grid gap-4 lg:grid-cols-2">
        <form
          id="due-date-form"
          onSubmit={onSubmit}
          className="rounded-[1.5rem] border border-rose-100 bg-white p-5 shadow-sm sm:p-6"
        >
          <h2 className="font-bn! flex items-center gap-2 text-lg font-bold text-rose-950">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-rose-50 text-rose-700">
              <CalendarIcon />
            </span>
            তারিখ দিন
          </h2>

          {mode === "ivf" ? (
            <p className="font-bn mt-4 text-sm leading-6 text-rose-950/75">
              ভ্রূণ স্থানান্তরের তারিখ থেকে একটি সাধারণ হিসাব। ক্লিনিকের তারিখ থাকলে সেটিই আগে মানবেন।
            </p>
          ) : (
            <>
              <p className="font-bn mt-4 text-sm font-semibold text-rose-950">আপনার কী জানা আছে?</p>
              <div className="mt-2 space-y-2">
                <Radio
                  name="method"
                  checked={mode === "lmp"}
                  onChange={() => chooseMode("lmp")}
                  label="শেষ মাসিকের প্রথম দিন"
                />
                <Radio
                  name="method"
                  checked={mode === "scan"}
                  onChange={() => chooseMode("scan")}
                  label="আল্ট্রাসাউন্ডের তারিখ"
                />
              </div>
            </>
          )}

          {mode === "lmp" ? (
            <div className="mt-5 space-y-4">
              <label className="block">
                <span className="font-bn text-sm font-semibold text-rose-950">শেষ মাসিকের প্রথম দিন</span>
                <input
                  type="date"
                  required
                  value={lmp}
                  onChange={(event) => setLmp(event.target.value)}
                  className={`mt-2 ${fieldClass}`}
                />
              </label>
              <label className="block">
                <span className="font-bn text-sm font-semibold text-rose-950">
                  আপনার সাধারণ মাসিক চক্র কত দিনের? (ঐচ্ছিক)
                </span>
                <select
                  value={cycle}
                  onChange={(event) => setCycle(Number(event.target.value))}
                  className={`mt-2 ${fieldClass}`}
                >
                  {Array.from({ length: 15 }, (_, index) => 21 + index).map((days) => (
                    <option key={days} value={days}>
                      {toBnDigits(days)} দিন
                    </option>
                  ))}
                </select>
                <span className="font-bn mt-2 flex items-start gap-1.5 text-xs leading-5 text-rose-900/60">
                  <span aria-hidden="true">ⓘ</span>
                  সাধারণত ২১–৩৫ দিনের মধ্যে হয়।
                </span>
              </label>
            </div>
          ) : null}

          {mode === "scan" ? (
            <div className="mt-5 space-y-4">
              <label className="block">
                <span className="font-bn text-sm font-semibold text-rose-950">আল্ট্রাসাউন্ডের তারিখ</span>
                <input
                  type="date"
                  required
                  value={scanDate}
                  onChange={(event) => setScanDate(event.target.value)}
                  className={`mt-2 ${fieldClass}`}
                />
              </label>
              <fieldset>
                <legend className="font-bn text-sm font-semibold text-rose-950">
                  সেই দিন রিপোর্টে কত সপ্তাহ লেখা ছিল?
                </legend>
                <div className="mt-2 grid grid-cols-2 gap-3">
                  <label className="block">
                    <span className="font-bn text-xs text-rose-900/60">সপ্তাহ</span>
                    <select
                      value={scanWeeks}
                      onChange={(event) => setScanWeeks(Number(event.target.value))}
                      className={`mt-1 ${fieldClass}`}
                    >
                      {Array.from({ length: 43 }, (_, week) => (
                        <option key={week} value={week}>
                          {toBnDigits(week)}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label className="block">
                    <span className="font-bn text-xs text-rose-900/60">দিন</span>
                    <select
                      value={scanDays}
                      onChange={(event) => setScanDays(Number(event.target.value))}
                      className={`mt-1 ${fieldClass}`}
                    >
                      {Array.from({ length: 7 }, (_, day) => (
                        <option key={day} value={day}>
                          {toBnDigits(day)}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>
              </fieldset>
            </div>
          ) : null}

          {mode === "ivf" ? (
            <div className="mt-5 space-y-4">
              <label className="block">
                <span className="font-bn text-sm font-semibold text-rose-950">ভ্রূণ স্থানান্তরের তারিখ</span>
                <input
                  type="date"
                  required
                  value={transfer}
                  onChange={(event) => setTransfer(event.target.value)}
                  className={`mt-2 ${fieldClass}`}
                />
              </label>
              <fieldset>
                <legend className="font-bn text-sm font-semibold text-rose-950">ভ্রূণ কত দিনের ছিল?</legend>
                <div className="mt-2 space-y-2">
                  <Radio
                    name="embryo"
                    checked={embryoDay === 5}
                    onChange={() => setEmbryoDay(5)}
                    label="৫ দিন (ব্লাস্টোসিস্ট)"
                  />
                  <Radio
                    name="embryo"
                    checked={embryoDay === 3}
                    onChange={() => setEmbryoDay(3)}
                    label="৩ দিন"
                  />
                </div>
              </fieldset>
              <button
                type="button"
                onClick={() => chooseMode("lmp")}
                className="font-bn text-sm font-semibold text-rose-700 underline-offset-2 hover:underline"
              >
                শেষ মাসিকের তারিখ দিয়ে ফিরে যান
              </button>
            </div>
          ) : null}

          {error ? (
            <p className="font-bn mt-3 text-sm text-rose-700" role="alert">
              {error}
            </p>
          ) : null}

          <button
            type="submit"
            className="font-bn mt-5 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#c2255c] px-4 text-sm font-bold text-white hover:bg-[#a61d4e]"
          >
            <CalendarIcon />
            হিসাব করুন
          </button>
        </form>

        <ResultCard estimate={result} />
      </div>

      <aside className="flex flex-col gap-3 rounded-[1.35rem] border border-violet-100 bg-[#f7f4fc] px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
        <div className="flex gap-3">
          <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-violet-600">
            <SparkIcon />
          </span>
          <div>
            <p className="font-bn text-sm font-bold text-violet-950">IVF-এর মাধ্যমে গর্ভধারণ করেছেন?</p>
            <p className="font-bn mt-0.5 text-sm leading-6 text-violet-950/70">
              স্থানান্তরের তারিখ দিয়ে হিসাব একটু আলাদা হয়।
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => {
            chooseMode("ivf");
            document.getElementById("due-date-form")?.scrollIntoView({ behavior: "smooth", block: "start" });
          }}
          className="font-bn inline-flex min-h-11 items-center justify-center rounded-xl bg-white px-4 text-sm font-semibold text-violet-800 ring-1 ring-violet-100 hover:bg-violet-50"
        >
          IVF দিয়ে হিসাব করুন →
        </button>
      </aside>
    </div>
  );
}

function ResultCard({ estimate }: { estimate: DueDateEstimate | null }) {
  if (!estimate) {
    return (
      <section className="flex min-h-64 flex-col justify-center rounded-[1.5rem] border border-emerald-100 bg-[#f4faf6] p-5 sm:p-6">
        <h2 className="font-bn! text-base font-bold text-emerald-900">আপনার সম্ভাব্য প্রসবের তারিখ</h2>
        <p className="font-bn mt-3 text-sm leading-7 text-emerald-950/70">
          বাঁ দিকে তারিখ দিয়ে হিসাব করুন। সম্ভাব্য তারিখ, সপ্তাহ এবং ত্রৈমাসিক এখানে দেখা যাবে। এটি
          একটি আনুমানিক পাঠ, চিকিৎসকের তারিখের বদলি নয়।
        </p>
      </section>
    );
  }

  const started = estimate.signedAgeDays >= 0;
  const passed = estimate.daysUntilDue < 0;
  const remainingDays = Math.max(0, estimate.daysUntilDue);
  const remainingWeeks = Math.floor(remainingDays / 7);
  const remainingExtra = remainingDays % 7;
  const progress = started ? Math.min(1, Math.max(0, estimate.signedAgeDays / 280)) : 0;
  const trimesterNow = estimate.trimester;

  return (
    <section
      className="rounded-[1.5rem] border border-emerald-100 bg-[#f4faf6] p-5 sm:p-6"
      aria-live="polite"
    >
      <h2 className="font-bn! flex items-center gap-2 text-base font-bold text-emerald-900">
        <span aria-hidden="true">🍃</span>
        আপনার সম্ভাব্য প্রসবের তারিখ
      </h2>
      <p className="font-bn! mt-3 text-3xl font-bold tracking-tight text-[#1d7a45] sm:text-4xl">
        {formatBnDate(estimate.due)}
      </p>
      <p className="font-bn mt-1 text-sm text-emerald-900/70">{formatBnWeekday(estimate.due)}</p>
      <p className="font-bn mt-3 text-sm font-semibold text-emerald-950">
        {started
          ? `আপনার গর্ভাবস্থার প্রায় ${formatWeekAndDay(estimate.week, estimate.day)}`
          : "এই শুরুর তারিখ এখনও আসেনি"}
      </p>

      <dl className="mt-5 space-y-3 border-t border-emerald-100 pt-4">
        <Stat
          label="গর্ভাবস্থার সপ্তাহ + দিন"
          value={started ? formatWeekAndDay(estimate.week, estimate.day) : "এখনও শুরু হয়নি"}
        />
        <Stat
          label="সন্তান প্রসবের বাকি"
          value={passed ? "সম্ভাব্য তারিখ পার হয়ে গেছে" : formatWeekAndDay(remainingWeeks, remainingExtra)}
        />
        <Stat
          label="বর্তমান ত্রৈমাসিক"
          value={trimesterNow ? TRIMESTER_NAME[trimesterNow] : "এখনও শুরু হয়নি"}
        />
      </dl>

      <div className="mt-5">
        <p className="font-bn text-sm font-semibold text-emerald-950">ত্রৈমাসিকের অগ্রগতি</p>
        <div className="relative mt-3 h-2 rounded-full bg-[#e5f0e8]">
          <div
            className="absolute inset-y-0 left-0 rounded-full bg-[#3d9a68]"
            style={{ width: `${progress * 100}%` }}
          />
          <span
            className="absolute top-1/2 h-3.5 w-3.5 -translate-y-1/2 rounded-full border-2 border-white bg-[#e24b78] shadow"
            style={{ left: `calc(${progress * 100}% - 7px)` }}
          />
        </div>
        <ol className="mt-3 grid grid-cols-3 gap-2 text-center">
          {([1, 2, 3] as const).map((item) => (
            <li key={item} className="font-bn text-[11px] leading-4 text-emerald-950/70 sm:text-xs">
              <span className={trimesterNow === item ? "font-bold text-[#c2255c]" : ""}>
                {item === 1 ? "১ম" : item === 2 ? "২য়" : "৩য়"} ত্রৈমাসিক
              </span>
              <span className="mt-0.5 block">
                {trimesterStatus(trimesterNow, item, passed)}
              </span>
            </li>
          ))}
        </ol>
      </div>

      <p className="font-bn mt-4 flex gap-2 rounded-xl bg-white/80 px-3 py-3 text-xs leading-5 text-emerald-950/75">
        <span aria-hidden="true">ⓘ</span>
        <span>
          এটি একটি আনুমানিক তারিখ। আল্ট্রাসাউন্ডে তারিখ একটু আলাদা হতে পারে। নিজের সিদ্ধান্তের জন্য
          চিকিৎসক বা মিডওয়াইফের কথাই আগে মানবেন।
        </span>
      </p>
    </section>
  );
}

function trimesterStatus(current: 1 | 2 | 3 | null, item: 1 | 2 | 3, passed: boolean) {
  if (!current) return "(বাকি)";
  if (passed || item < current) return "(সম্পন্ন)";
  if (item === current) return "(চলমান)";
  return "(বাকি)";
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-3">
      <dt className="font-bn text-sm text-emerald-950/75">{label}</dt>
      <dd className="font-bn text-right text-sm font-semibold text-emerald-950">{value}</dd>
    </div>
  );
}

function Radio({
  name,
  checked,
  onChange,
  label,
}: {
  name: string;
  checked: boolean;
  onChange: () => void;
  label: string;
}) {
  return (
    <label className="font-bn flex min-h-11 cursor-pointer items-center gap-2.5 text-sm text-rose-950">
      <input
        type="radio"
        name={name}
        checked={checked}
        onChange={onChange}
        className="h-4 w-4 accent-[#c2255c]"
      />
      {label}
    </label>
  );
}

function CalendarIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" aria-hidden="true">
      <rect x="3.5" y="5" width="17" height="15" rx="2" stroke="currentColor" strokeWidth="1.7" />
      <path d="M8 3.5v3M16 3.5v3M3.5 10h17" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  );
}

function SparkIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden="true">
      <path
        d="M12 3.5 13.4 9 19 10.2 13.4 11.5 12 17l-1.4-5.5L5 10.2 10.6 9 12 3.5Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    </svg>
  );
}
