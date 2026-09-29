"use client";

import Link from "next/link";
import { useEffect, useId, useRef, useState, useSyncExternalStore } from "react";
import { LuInfo } from "react-icons/lu";
import { useAuth } from "@/components/auth/AuthProvider";
import { MotherWeightProgressChart } from "@/components/charts/MotherWeightProgressChart";
import {
  MAX_PREGNANCY_WEEK,
  MAX_WEIGHT_KG,
  MIN_PREGNANCY_WEEK,
  MIN_WEIGHT_KG,
  DEFAULT_WEEK_1_WEIGHT_KG,
  chartWeekTicks,
  chartWeightTicks,
  getMotherWeightSnapshot,
  getMotherWeightsServerSnapshot,
  motherWeightChart,
  motherWeightSummary,
  parseMotherWeightKg,
  subscribeMotherWeights,
  weightForWeek,
  withWeekWeight,
  writeMotherWeights,
} from "@/lib/mother-weights";

export function MotherWeightTracker() {
  const { user, ready } = useAuth();
  const signedIn = Boolean(user);
  const log = useSyncExternalStore(
    subscribeMotherWeights,
    getMotherWeightSnapshot,
    getMotherWeightsServerSnapshot,
  );
  const [pickedWeek, setPickedWeek] = useState<number | null>(null);
  const [draft, setDraft] = useState<{ week: number; value: string } | null>(
    null,
  );
  const [formError, setFormError] = useState<string>();
  const [storageError, setStorageError] = useState<string>();
  const [loginOpen, setLoginOpen] = useState(false);
  const scrollerRef = useRef<HTMLDivElement>(null);

  const visibleLog = signedIn ? log : {};
  const summary = motherWeightSummary(visibleLog);
  const selectedWeek = pickedWeek ?? (signedIn ? summary.lastWeek : 1);
  const storedWeight = signedIn ? weightForWeek(log, selectedWeek) : null;
  const weightValue =
    draft?.week === selectedWeek
      ? draft.value
      : storedWeight === null
        ? ""
        : String(storedWeight);
  const chartRows = motherWeightChart(visibleLog).map((row) =>
    signedIn ? row : { ...row, actual: null },
  );
  const xTicks = chartWeekTicks(
    chartRows[0].week,
    chartRows[chartRows.length - 1].week,
  );
  const yTicks = chartWeightTicks(chartRows);
  const weeks = Array.from(
    { length: MAX_PREGNANCY_WEEK - MIN_PREGNANCY_WEEK + 1 },
    (_, index) => MIN_PREGNANCY_WEEK + index,
  );

  useEffect(() => {
    const scroller = scrollerRef.current;
    const chip = scroller?.querySelector<HTMLElement>(
      `[data-week="${selectedWeek}"]`,
    );
    if (!scroller || !chip) return;
    const left =
      chip.offsetLeft - scroller.clientWidth / 2 + chip.clientWidth / 2;
    scroller.scrollTo({ left: Math.max(0, left) });
  }, [selectedWeek]);

  function saveWeight() {
    if (!ready) return;
    if (!user) {
      setLoginOpen(true);
      return;
    }
    const weightKg = parseMotherWeightKg(weightValue);
    if (weightKg === null) {
      setFormError(
        `Enter a weight from ${MIN_WEIGHT_KG} kg to ${MAX_WEIGHT_KG} kg.`,
      );
      return;
    }
    const next = withWeekWeight(log, selectedWeek, weightKg);
    const withStart = Object.prototype.hasOwnProperty.call(next, "1")
      ? next
      : withWeekWeight(next, 1, DEFAULT_WEEK_1_WEIGHT_KG);
    try {
      writeMotherWeights(withStart);
      setDraft(null);
      setFormError(undefined);
      setStorageError(undefined);
    } catch {
      setStorageError(
        "This browser could not save the weight. The number on screen may be lost if you leave.",
      );
    }
  }

  return (
    <div className="space-y-5">
      <section className="rounded-3xl border border-neutral-200 bg-white p-5 shadow-sm sm:p-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h1 className="!font-sans text-lg font-semibold tracking-tight text-neutral-950">
              Weight progress
            </h1>
            <p className="mt-1 text-sm text-neutral-500">
              Expected range vs your recorded weight
            </p>
          </div>
          <div className="flex items-center gap-4 text-sm text-neutral-500">
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

        <MotherWeightProgressChart rows={chartRows} xTicks={xTicks} yTicks={yTicks} />

        <dl className="mt-4 grid grid-cols-2 gap-3 lg:grid-cols-4">
          <Stat
            label="Current"
            value={signedIn ? `${summary.currentKg.toFixed(1)} kg` : "—"}
          />
          <Stat
            label="Starting"
            value={signedIn ? `${summary.startingKg.toFixed(1)} kg` : "—"}
          />
          <Stat
            label="Gain so far"
            value={signedIn ? formatGain(summary.gainKg) : "—"}
          />
          <Stat
            label="Last update"
            value={signedIn ? `Week ${summary.lastWeek}` : "—"}
          />
        </dl>
      </section>

      <section className="rounded-3xl border border-neutral-200 bg-white p-5 shadow-sm sm:p-6">
        <h2 className="!font-sans text-lg font-semibold tracking-tight text-neutral-950">
          Add your weight
        </h2>
        <p className="mt-1 text-sm text-neutral-500">
          Record one measurement for each week.
        </p>

        <div
          ref={scrollerRef}
          className="mt-5 flex gap-2 overflow-x-auto pb-1"
          role="group"
          aria-label="Pregnancy week"
        >
          {weeks.map((week) => {
            const selected = week === selectedWeek;
            return (
              <button
                key={week}
                type="button"
                data-week={week}
                aria-pressed={selected}
                className={`inline-flex h-12 min-w-14 shrink-0 items-center justify-center rounded-xl border px-3 text-base font-medium ${
                  selected
                    ? "border-blue-500 bg-blue-50 text-neutral-950"
                    : "border-neutral-200 bg-white text-neutral-800"
                }`}
                onClick={() => {
                  setPickedWeek(week);
                  setDraft(null);
                  setFormError(undefined);
                }}
              >
                {week}
              </button>
            );
          })}
        </div>

        <label
          className="mt-5 block text-sm font-semibold text-neutral-950"
          htmlFor="mother-weight-kg"
        >
          Weight (kg)
        </label>
        <div className="mt-2 flex flex-col gap-3 sm:flex-row sm:items-center">
          <input
            id="mother-weight-kg"
            type="number"
            inputMode="decimal"
            min={MIN_WEIGHT_KG}
            max={MAX_WEIGHT_KG}
            step={0.1}
            value={weightValue}
            onChange={(event) => {
              setDraft({ week: selectedWeek, value: event.target.value });
              setFormError(undefined);
            }}
            className="h-12 min-w-0 flex-1 rounded-xl border border-neutral-200 bg-white px-4 text-base text-neutral-950 outline-none focus:border-blue-500"
          />
          <button
            type="button"
            className="inline-flex h-12 shrink-0 cursor-pointer items-center justify-center rounded-xl bg-blue-600 px-5 text-sm font-semibold text-white hover:bg-blue-700"
            onClick={saveWeight}
          >
            Save weight
          </button>
        </div>
        <p className="mt-3 text-sm text-neutral-500">
          {!signedIn
            ? "Sign in to save a weight for this week."
            : storedWeight === null
              ? `No weight stored for week ${selectedWeek} yet.`
              : `Your weight is stored for week ${selectedWeek}.`}
        </p>
        {formError ? (
          <p className="mt-2 text-sm text-rose-800">{formError}</p>
        ) : null}
        {storageError ? (
          <p className="mt-2 text-sm text-rose-800">{storageError}</p>
        ) : null}
      </section>

      <p className="flex items-start gap-2 px-1 text-sm leading-6 text-neutral-500">
        <LuInfo className="mt-1 h-4 w-4 shrink-0" aria-hidden="true" />
        <span>
          The expected line is a guide, not a target. Healthy weight gain varies
          from person to person and depends on your pre-pregnancy weight and
          other factors.
        </span>
      </p>
      {loginOpen ? <LoginFirstModal onClose={() => setLoginOpen(false)} /> : null}
    </div>
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
        <h2 id={titleId} className="!font-sans text-xl font-semibold text-rose-950">
          Login first
        </h2>
        <p className="mt-2 text-sm leading-6 text-rose-900/75">
          Sign in to save your weight. The expected guide stays available
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

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-[#f6f7f9] px-4 py-3">
      <dt className="text-sm text-neutral-500">{label}</dt>
      <dd className="mt-1 text-xl font-semibold tracking-tight text-neutral-950 sm:text-2xl">
        {value}
      </dd>
    </div>
  );
}

function formatGain(gainKg: number) {
  const sign = gainKg > 0 ? "+" : "";
  return `${sign}${gainKg.toFixed(1)} kg`;
}
