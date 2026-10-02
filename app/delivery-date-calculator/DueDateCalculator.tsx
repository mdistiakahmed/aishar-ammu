"use client";

import Link from "next/link";
import { useEffect, useId, useState, type FormEvent } from "react";
import { useAuth } from "@/components/auth/AuthProvider";
import {
  readSavedDeliveryDate,
  writeSavedDeliveryDate,
} from "@/lib/delivery-date";
import {
  estimateFromDoctorDue,
  estimateFromLastPeriod,
  estimateFromScan,
  type DueDateEstimate,
} from "@/app/delivery-date-calculator/_lib/estimate";
import {
  formatBnDate,
  formatBnWeekday,
  formatWeekAndDay,
  toBnDigits,
} from "@/app/delivery-date-calculator/_lib/format";

type Mode = "lmp" | "scan" | "doctor";

const TRIMESTER_NAME = {
  1: "1st Trimester",
  2: "2nd Trimester",
  3: "3rd Trimester",
} as const;

const fieldClass =
  "font-bn h-12 w-full rounded-xl border border-rose-100 bg-[#fff8f8] px-3 text-sm text-rose-950 outline-none focus:border-rose-300 focus:ring-2 focus:ring-rose-100";

const resultCardClass =
  "rounded-[1.5rem] border border-emerald-100 bg-cover bg-center p-5 sm:p-6";

const resultCardStyle = {
  backgroundImage: "url('/blur-mother-child.PNG')",
};

export function DueDateCalculator() {
  const [mode, setMode] = useState<Mode>("lmp");
  const [lmp, setLmp] = useState("");
  const [scanDate, setScanDate] = useState("");
  const [scanWeeks, setScanWeeks] = useState(8);
  const [scanDays, setScanDays] = useState(0);
  const [doctorDue, setDoctorDue] = useState("");
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
        ? estimateFromLastPeriod(lmp, 28)
        : mode === "scan"
          ? estimateFromScan(scanDate, scanWeeks, scanDays)
          : estimateFromDoctorDue(doctorDue);

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

          <p className="font-bn mt-4 text-sm font-semibold text-rose-950">
            আপনার কী জানা আছে?
          </p>
          <div className="mt-2 space-y-2">
            <Radio
              name="method"
              checked={mode === "lmp"}
              onChange={() => chooseMode("lmp")}
              label="শেষ period এর প্রথম দিন"
            />
            <Radio
              name="method"
              checked={mode === "scan"}
              onChange={() => chooseMode("scan")}
              label="আল্ট্রাসাউন্ডের তারিখ"
            />
            <Radio
              name="method"
              checked={mode === "doctor"}
              onChange={() => chooseMode("doctor")}
              label="ডাক্তারের দেওয়া Delivery Date"
            />
          </div>

          {mode === "lmp" ? (
            <div className="mt-5 space-y-4">
              <label className="block">
                <span className="font-bn text-sm font-semibold text-rose-950">
                  শেষ মাসিকের প্রথম দিন
                </span>
                <input
                  type="date"
                  required
                  value={lmp}
                  onChange={(event) => setLmp(event.target.value)}
                  className={`mt-2 ${fieldClass}`}
                />
              </label>
              <p className="font-bn flex items-start gap-1.5 text-sm leading-6 text-rose-900/70">
                <span aria-hidden="true">ⓘ</span>
                <span>
                  শেষ period এর প্রথম দিন মানে সেই দিন, যেদিন আপনার শেষ period
                  এর রক্তপাত শুরু হয়েছিল। Period শেষ হওয়ার দিন নয়। এই হিসাবে
                  সেই দিন থেকে ২৮০ দিন (৪০ সপ্তাহ) যোগ করে একটি সম্ভাব্য তারিখ
                  দেখানো হয়। এটি চিকিৎসকের তারিখের বিকল্প নয়।
                </span>
              </p>
            </div>
          ) : null}

          {mode === "scan" ? (
            <div className="mt-5 space-y-4">
              <label className="block">
                <span className="font-bn text-sm font-semibold text-rose-950">
                  আল্ট্রাসাউন্ডের তারিখ
                </span>
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
                    <span className="font-bn text-xs text-rose-900/60">
                      সপ্তাহ
                    </span>
                    <select
                      value={scanWeeks}
                      onChange={(event) =>
                        setScanWeeks(Number(event.target.value))
                      }
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
                    <span className="font-bn text-xs text-rose-900/60">
                      দিন
                    </span>
                    <select
                      value={scanDays}
                      onChange={(event) =>
                        setScanDays(Number(event.target.value))
                      }
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

          {mode === "doctor" ? (
            <div className="mt-5">
              <label className="block">
                <span className="font-bn text-sm font-semibold text-rose-950">
                  ডাক্তারের দেওয়া Delivery Date
                </span>
                <input
                  type="date"
                  required
                  value={doctorDue}
                  onChange={(event) => setDoctorDue(event.target.value)}
                  className={`mt-2 ${fieldClass}`}
                />
              </label>
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

        <ResultCard
          estimate={result}
          source={mode === "doctor" ? "doctor" : "calculated"}
        />
      </div>
    </div>
  );
}

function ResultCard({
  estimate,
  source,
}: {
  estimate: DueDateEstimate | null;
  source: "calculated" | "doctor";
}) {
  const { user, ready } = useAuth();
  const [savedDue, setSavedDue] = useState(
    () => readSavedDeliveryDate()?.due ?? "",
  );
  const [saveError, setSaveError] = useState("");
  const [loginOpen, setLoginOpen] = useState(false);

  function saveDeliveryDate() {
    if (!estimate || !ready) return;
    if (!user) {
      setLoginOpen(true);
      return;
    }
    try {
      writeSavedDeliveryDate({
        due: estimate.due,
        start: estimate.start,
        source,
      });
      setSavedDue(estimate.due);
      setSaveError("");
    } catch {
      setSaveError("This browser could not save the date.");
    }
  }

  if (!estimate) {
    return (
      <section
        className={`flex min-h-64 flex-col justify-center ${resultCardClass}`}
        style={resultCardStyle}
      >
        <h2 className="font-bn! text-base font-bold text-emerald-900">
          আপনার সম্ভাব্য Delivery Date
        </h2>
        <p className="font-bn mt-3 text-sm leading-7 text-emerald-950/70">
          বা দিকে তারিখ দিয়ে হিসাব করুন। সম্ভাব্য তারিখ, সপ্তাহ এবং ত্রৈমাসিক
          এখানে দেখা যাবে। এটি একটি আনুমানিক পাঠ, চিকিৎসকের তারিখের বদলি নয়।
        </p>
      </section>
    );
  }

  const started = estimate.signedAgeDays >= 0;
  const passed = estimate.daysUntilDue < 0;
  const remainingDays = Math.max(0, estimate.daysUntilDue);
  const remainingWeeks = Math.floor(remainingDays / 7);
  const remainingExtra = remainingDays % 7;
  const progress = started
    ? Math.min(1, Math.max(0, estimate.signedAgeDays / 280))
    : 0;
  const trimesterNow = estimate.trimester;

  const alreadySaved = Boolean(user) && savedDue === estimate.due;

  return (
    <>
      <section
        className={resultCardClass}
        style={resultCardStyle}
        aria-live="polite"
      >
        <div className="flex items-start justify-between gap-3">
          <h2 className="font-bn! flex min-w-0 items-center gap-2 text-base font-bold text-emerald-900">
            <span aria-hidden="true">🍃</span>
            আপনার সম্ভাব্য Delivery Date
          </h2>
          <button
            type="button"
            onClick={saveDeliveryDate}
            disabled={alreadySaved}
            className={`inline-flex h-11 shrink-0 cursor-pointer items-center justify-center rounded-full px-4 text-sm font-bold text-white disabled:cursor-pointer ${
              alreadySaved
                ? "bg-[#8fbfa4]"
                : "save-attention bg-[#1d7a45] hover:bg-[#17663a]"
            }`}
          >
            {alreadySaved ? "Saved" : "Save"}
          </button>
        </div>
        {saveError ? (
          <p className="mt-2 text-right text-sm text-rose-700" role="alert">
            {saveError}
          </p>
        ) : null}
        <p className="font-bn! mt-3 text-3xl font-bold tracking-tight text-[#1d7a45] sm:text-4xl">
          {formatBnDate(estimate.due)}
        </p>
        <p className="font-bn mt-1 text-sm text-emerald-900/70">
          {formatBnWeekday(estimate.due)}
        </p>
        <p className="font-bn mt-3 text-sm font-semibold text-emerald-950">
          {started
            ? `আপনার গর্ভাবস্থার প্রায় ${formatWeekAndDay(estimate.week, estimate.day)}`
            : "এই শুরুর তারিখ এখনও আসেনি"}
        </p>

        <dl className="mt-5 space-y-3 border-t border-emerald-100 pt-4">
          <Stat
            label="গর্ভাবস্থার সপ্তাহ + দিন"
            value={
              started
                ? formatWeekAndDay(estimate.week, estimate.day)
                : "এখনও শুরু হয়নি"
            }
          />
          <Stat
            label="সন্তান প্রসবের বাকি"
            value={
              passed
                ? "সম্ভাব্য তারিখ পার হয়ে গেছে"
                : formatWeekAndDay(remainingWeeks, remainingExtra)
            }
          />
          <Stat
            label="বর্তমান ত্রৈমাসিক"
            value={
              trimesterNow ? TRIMESTER_NAME[trimesterNow] : "এখনও শুরু হয়নি"
            }
          />
        </dl>

        <div className="mt-5">
          <p className="font-bn text-sm font-semibold text-emerald-950">
            ত্রৈমাসিকের অগ্রগতি
          </p>
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
              <li
                key={item}
                className="font-bn text-[11px] leading-4 text-emerald-950/70 sm:text-xs"
              >
                <span
                  className={
                    trimesterNow === item ? "font-bold text-[#c2255c]" : ""
                  }
                >
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
            এটি একটি আনুমানিক তারিখ। আল্ট্রাসাউন্ডে তারিখ একটু আলাদা হতে পারে।
            নিজের সিদ্ধান্তের জন্য চিকিৎসক বা মিডওয়াইফের কথাই আগে মানবেন।
          </span>
        </p>
      </section>
      {loginOpen ? (
        <LoginFirstModal onClose={() => setLoginOpen(false)} />
      ) : null}
    </>
  );
}

function LoginFirstModal({ onClose }: { onClose: () => void }) {
  const titleId = useId();

  useEffect(() => {
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, []);

  return (
    <div className="fixed inset-0 z-[60] flex items-end justify-center bg-rose-950/40 p-4 sm:items-center">
      <button
        type="button"
        className="absolute inset-0"
        aria-label="Close"
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="relative z-10 w-full max-w-md rounded-[2rem] border border-rose-100 bg-white p-6 shadow-xl"
      >
        <h2 id={titleId} className="text-xl font-semibold text-rose-950">
          Login first
        </h2>
        <p className="mt-2 text-sm leading-6 text-rose-900/75">
          Sign in to save this delivery date. You can still calculate a date
          without an account.
        </p>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <Link
            href="/login"
            className="inline-flex h-12 flex-1 items-center justify-center rounded-full bg-rose-700 text-sm font-semibold text-white hover:bg-rose-800"
          >
            Go to login
          </Link>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-12 flex-1 items-center justify-center rounded-full border border-rose-200 bg-white text-sm font-semibold text-rose-800 hover:bg-rose-50"
          >
            Not now
          </button>
        </div>
      </div>
    </div>
  );
}

function trimesterStatus(
  current: 1 | 2 | 3 | null,
  item: 1 | 2 | 3,
  passed: boolean,
) {
  if (!current) return "(বাকি)";
  if (passed || item < current) return "(সম্পন্ন)";
  if (item === current) return "(চলমান)";
  return "(বাকি)";
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-3">
      <dt className="font-bn text-sm text-emerald-950/75">{label}</dt>
      <dd className="font-bn text-right text-sm font-semibold text-emerald-950">
        {value}
      </dd>
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
      <rect
        x="3.5"
        y="5"
        width="17"
        height="15"
        rx="2"
        stroke="currentColor"
        strokeWidth="1.7"
      />
      <path
        d="M8 3.5v3M16 3.5v3M3.5 10h17"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
    </svg>
  );
}
