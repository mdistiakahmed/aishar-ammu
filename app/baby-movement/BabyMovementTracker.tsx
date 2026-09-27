"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { LuMinus, LuPlus } from "react-icons/lu";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useAuth } from "@/components/auth/AuthProvider";
import { api } from "@/lib/api-client";
import {
  chartColors,
  tooltipStyle,
} from "@/components/homepage/dashboard/chartTheme";
import { formatCareDate } from "@/lib/dates";
import {
  BABY_MOVEMENT_STORAGE_KEY,
  earlierMovementDays,
  localDateKey,
  MAX_MOVEMENT_SETS,
  MOVEMENT_REFERENCE_COUNT,
  movementChartDays,
  movementCount,
  parseMovementCount,
  parsePastMovementDate,
  readMovementLog,
  stepMovementCount,
  withMovementCount,
  withoutMovementDate,
  writeMovementLog,
  type MovementDay,
  type MovementLog,
} from "@/lib/baby-movements";

export function BabyMovementTracker() {
  const { user, ready: authReady } = useAuth();
  const [log, setLog] = useState<MovementLog>({});
  const [today, setToday] = useState("");
  const [ready, setReady] = useState(false);
  const [pastDate, setPastDate] = useState("");
  const [pastCount, setPastCount] = useState("");
  const [formError, setFormError] = useState<string>();
  const [savedMessage, setSavedMessage] = useState<string>();
  const [storageError, setStorageError] = useState<string>();
  const [rememberMessage, setRememberMessage] = useState<string>();
  const [rememberError, setRememberError] = useState<string>();
  const [reloadMessage, setReloadMessage] = useState<string>();
  const [reloadError, setReloadError] = useState<string>();
  const [syncing, setSyncing] = useState<"remember" | "reload" | null>(null);

  useEffect(() => {
    setToday(localDateKey());
    setLog(readMovementLog());
    setReady(true);

    function refreshFromStorage() {
      setToday(localDateKey());
      setLog(readMovementLog());
    }

    function onStorage(event: StorageEvent) {
      if (event.key !== BABY_MOVEMENT_STORAGE_KEY) return;
      refreshFromStorage();
    }

    window.addEventListener("storage", onStorage);
    window.addEventListener("focus", refreshFromStorage);
    document.addEventListener("visibilitychange", refreshFromStorage);
    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener("focus", refreshFromStorage);
      document.removeEventListener("visibilitychange", refreshFromStorage);
    };
  }, []);

  function commit(next: MovementLog) {
    setLog(next);
    try {
      writeMovementLog(next);
      setStorageError(undefined);
    } catch {
      setStorageError(
        "This browser could not save the log. The count on screen may be lost if you leave.",
      );
    }
  }

  function stepToday(delta: 1 | -1) {
    const currentToday = localDateKey();
    setToday(currentToday);
    setSavedMessage(undefined);
    commit(stepMovementCount(log, currentToday, delta));
  }

  function onAddPastDay() {
    const currentToday = localDateKey();
    setToday(currentToday);
    const date = parsePastMovementDate(pastDate, currentToday);
    if (!date) {
      setSavedMessage(undefined);
      setFormError("Choose a day before today.");
      return;
    }
    const count = parseMovementCount(pastCount);
    if (count === null) {
      setSavedMessage(undefined);
      setFormError(`Enter a whole number from 0 to ${MAX_MOVEMENT_SETS}.`);
      return;
    }

    if (Object.prototype.hasOwnProperty.call(log, date)) {
      setSavedMessage(undefined);
      setFormError("This date is already saved. Update it in the table.");
      return;
    }

    commit(withMovementCount(log, date, count));
    setFormError(undefined);
    setSavedMessage(
      `Saved ${count} ${count === 1 ? "set" : "sets"} for ${formatCareDate(date)}.`,
    );
    setPastDate("");
    setPastCount("");
  }

  function updatePastDay(date: string, count: number) {
    commit(withMovementCount(log, date, count));
  }

  function deletePastDay(date: string) {
    commit(withoutMovementDate(log, date));
    setSavedMessage(undefined);
  }

  async function remember() {
    setSyncing("remember");
    setRememberMessage(undefined);
    setRememberError(undefined);
    const result = await api<{ counts: MovementLog }>("/api/baby-movements", {
      method: "PUT",
      body: JSON.stringify({ counts: log }),
    });
    setSyncing(null);
    if (!result.ok) {
      setRememberError(syncErrorMessage(result.error));
      return;
    }
    setRememberMessage("Saved on your account.");
  }

  async function reloadFromAccount() {
    setSyncing("reload");
    setReloadMessage(undefined);
    setReloadError(undefined);
    const result = await api<{ counts: MovementLog | null }>(
      "/api/baby-movements",
    );
    setSyncing(null);
    if (!result.ok) {
      setReloadError(syncErrorMessage(result.error));
      return;
    }
    if (!result.data.counts) {
      setReloadMessage("Nothing saved on your account yet.");
      return;
    }
    commit(result.data.counts);
    setReloadMessage("Loaded the saved log into this browser.");
  }

  const todayCount = today ? movementCount(log, today) : 0;
  const earlierDays = today ? earlierMovementDays(log, today) : [];
  const chartRows = today
    ? movementChartDays(log, today).map((day) => ({
        ...day,
        label: shortDayLabel(day.date),
      }))
    : [];
  const chartMax = Math.max(
    MOVEMENT_REFERENCE_COUNT,
    ...chartRows.map((row) => row.count),
  );
  const yesterday = today ? shiftDate(today, -1) : "";
  const newDate = today ? parsePastMovementDate(pastDate, today) : null;
  const dateTaken = Boolean(
    newDate && Object.prototype.hasOwnProperty.call(log, newDate),
  );
  const canAddDay = Boolean(
    newDate && parseMovementCount(pastCount) !== null && !dateTaken,
  );

  return (
    <div className="space-y-4">
      <section className="px-2 py-2">
        <h1 className="text-center text-sm font-semibold uppercase tracking-[0.18em] text-rose-700">
          Today
        </h1>
        <p className="mt-1 text-center text-sm text-rose-900/70">
          {today ? formatCareDate(today) : "Today"}
        </p>
        <p
          className="mt-6 text-center font-sans text-8xl font-semibold tabular-nums tracking-tight text-rose-950"
          aria-live="polite"
        >
          {ready ? todayCount : "–"}
        </p>
        <p className="mt-1 text-center text-sm text-rose-900/70">
          {todayCount === 1 ? "set" : "sets"}
        </p>

        <div className="mt-10 flex justify-center">
          <button
            type="button"
            className={`${circleButton} h-64 w-64`}
            onClick={() => stepToday(1)}
            disabled={!ready || todayCount >= MAX_MOVEMENT_SETS}
            aria-label="Add one set"
          >
            <LuPlus
              className="h-[45%] w-[45%]"
              strokeWidth={2.5}
              aria-hidden="true"
            />
          </button>
        </div>

        <div className="mt-8">
          <button
            type="button"
            className={`${circleButton} h-14 w-14`}
            onClick={() => stepToday(-1)}
            disabled={!ready || todayCount === 0}
            aria-label="Remove one set"
          >
            <LuMinus className="h-6 w-6" strokeWidth={2.5} aria-hidden="true" />
          </button>
        </div>
        {storageError ? (
          <p className="mt-4 text-sm text-rose-800">{storageError}</p>
        ) : null}
      </section>

      <section className="rounded-[2rem] border border-rose-100 bg-white p-6 shadow-sm sm:p-8">
        <h2 className="text-xl font-semibold text-rose-950">Daily sets</h2>
        <p className="mt-2 text-sm leading-6 text-rose-900/75">
          প্রতিটি বার একটি দিনের নড়াচড়ার সংখ্যা দেখায়। লাল রেখাটি শুধু সাধারণ
          ধারণার জন্য ১০টি নড়াচড়ার একটি নির্দেশক হিসেবে দেওয়া হয়েছে।
        </p>
        <div className="mt-4 h-56 w-full min-w-0">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartRows}
              margin={{ top: 16, right: 8, left: 0, bottom: 0 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#fecdd3"
                vertical={false}
              />
              <XAxis
                dataKey="label"
                tick={{ fontSize: 10, fill: chartColors.ink }}
                interval="preserveStartEnd"
              />
              <YAxis
                domain={[0, chartMax]}
                allowDecimals={false}
                tick={{ fontSize: 10, fill: chartColors.ink }}
                width={28}
              />
              <Tooltip
                contentStyle={tooltipStyle}
                formatter={(value) => [`${value} sets`, "Sets"]}
                labelFormatter={(_, payload) => {
                  const date = payload?.[0]?.payload?.date;
                  return typeof date === "string" ? formatCareDate(date) : "";
                }}
              />
              <ReferenceLine
                y={MOVEMENT_REFERENCE_COUNT}
                stroke="#dc2626"
                strokeWidth={2}
                ifOverflow="extendDomain"
                label={{
                  value: "Minimum",
                  fill: "#dc2626",
                  fontSize: 11,
                  position: "insideTopRight",
                }}
              />
              <Bar
                dataKey="count"
                name="Sets"
                fill={chartColors.sage}
                radius={[6, 6, 0, 0]}
                maxBarSize={36}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
        {authReady && user ? (
          <div className="mt-6">
            <p className="text-sm leading-6 text-rose-800">
              আজকের তথ্য এখনও সংরক্ষণ না করে থাকলে, আগে সেটি সংরক্ষণ করুন।
            </p>
            <button
              type="button"
              className="mt-3 inline-flex h-12 cursor-pointer items-center justify-center rounded-full border border-rose-200 px-5 text-sm font-semibold text-rose-900 disabled:cursor-default disabled:opacity-40"
              onClick={() => void reloadFromAccount()}
              disabled={!ready || syncing !== null}
            >
              {syncing === "reload" ? "Loading…" : "Reload data"}
            </button>
            {reloadError ? (
              <p className="mt-3 text-sm text-rose-800">{reloadError}</p>
            ) : null}
            {reloadMessage ? (
              <p className="mt-3 text-sm text-sage-dark">{reloadMessage}</p>
            ) : null}
          </div>
        ) : null}
      </section>

      <section className="rounded-[2rem] border border-rose-100 bg-white p-6 shadow-sm sm:p-8">
        <h2 className="text-xl font-semibold text-rose-950">Saved days</h2>
        <p className="mt-2 text-sm leading-6 text-rose-900/75">
          The newest date is at the top. Use the empty row to add a day.
        </p>
        <div className="mt-6 overflow-x-auto">
          <table className="w-full min-w-[28rem] border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-rose-100 text-rose-800">
                <th className="py-3 pr-3 font-semibold">Date</th>
                <th className="py-3 pr-3 font-semibold">Sets</th>
                <th className="py-3 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {earlierDays.map((day) => (
                <MovementDayRow
                  key={day.date}
                  day={day}
                  onUpdate={updatePastDay}
                  onDelete={deletePastDay}
                />
              ))}
              <tr className="border-b border-rose-50">
                <td className="py-3 pr-3">
                  <input
                    id="past-movement-date"
                    type="date"
                    aria-label="New date"
                    value={pastDate}
                    max={yesterday}
                    onChange={(event) => {
                      setPastDate(event.target.value);
                      setFormError(undefined);
                    }}
                    className="box-border h-11 w-full min-w-0 rounded-2xl border border-rose-200 bg-petal px-3 text-sm text-rose-950 outline-none focus:border-rose-400"
                  />
                </td>
                <td className="py-3 pr-3">
                  <input
                    id="past-movement-count"
                    type="number"
                    aria-label="Sets for the new date"
                    inputMode="numeric"
                    min={0}
                    max={MAX_MOVEMENT_SETS}
                    step={1}
                    value={pastCount}
                    onChange={(event) => setPastCount(event.target.value)}
                    className="box-border h-11 w-24 rounded-2xl border border-rose-200 bg-petal px-3 text-sm text-rose-950 outline-none focus:border-rose-400"
                  />
                </td>
                <td className="py-3">
                  <button
                    type="button"
                    className="inline-flex h-11 cursor-pointer items-center justify-center rounded-full bg-rose-800 px-4 text-sm font-semibold text-white disabled:cursor-default disabled:opacity-40"
                    disabled={!canAddDay}
                    onClick={onAddPastDay}
                  >
                    Save
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        {dateTaken ? (
          <p className="mt-3 text-sm text-rose-800">
            This date is already saved. Update it in the table.
          </p>
        ) : null}
        {formError ? (
          <p className="mt-3 text-sm text-rose-800">{formError}</p>
        ) : null}
        {savedMessage && !dateTaken ? (
          <p className="mt-3 text-sm text-sage-dark">{savedMessage}</p>
        ) : null}
        {authReady && user ? (
          <div className="mt-6">
            <p className="text-sm leading-6 text-rose-800">
              Double check the current values. Remember replaces the log saved
              on your account.
            </p>
            <button
              type="button"
              className="mt-3 inline-flex h-12 cursor-pointer items-center justify-center rounded-full bg-sage px-5 text-sm font-semibold text-white hover:bg-sage-dark disabled:cursor-default disabled:opacity-40"
              onClick={() => void remember()}
              disabled={!ready || syncing !== null}
            >
              {syncing === "remember" ? "Saving…" : "Remember"}
            </button>
            {rememberError ? (
              <p className="mt-3 text-sm text-rose-800">{rememberError}</p>
            ) : null}
            {rememberMessage ? (
              <p className="mt-3 text-sm text-sage-dark">{rememberMessage}</p>
            ) : null}
          </div>
        ) : null}
        {authReady && !user ? (
          <p className="mt-6 text-sm leading-6 text-rose-900/75">
            <Link
              href="/login"
              className="font-semibold text-rose-800 underline-offset-2 hover:underline"
            >
              Sign in
            </Link>{" "}
            to remember this log on your account.
          </p>
        ) : null}
      </section>

      <section className="rounded-[2rem] border border-rose-100 bg-white p-6 shadow-sm sm:p-8">
        <h2 className="text-xl font-semibold text-rose-950">
          প্রতিটি নড়াচড়া নয়, একটি করে সেট গণনা করুন
        </h2>
        <p className="mt-3 text-sm leading-6 text-rose-900/75">
          প্রতিদিন শিশুর নড়াচড়ার সেট গুনে রাখুন। আজকের জন্য + বোতামে ট্যাপ করলে
          ১টি সেট যোগ হবে।
        </p>
        <ol className="mt-4 list-decimal space-y-2 pl-5 text-sm leading-6 text-rose-900/80">
          <li>
            কিছুক্ষণ আরাম করে বসুন বা শুয়ে থাকুন এবং শিশুর নড়াচড়ার দিকে মনোযোগ
            দিন।
          </li>
          <li>
            একটি সেট বলতে কাছাকাছি সময়ে পরপর হওয়া এমন কিছু নড়াচড়াকে বোঝায়,
            যেগুলো একই ধারার বলে মনে হয়। যেমন—পরপর কয়েকবার লাথি, শরীর মোড়ানো বা
            হালকা নড়াচড়া। মাঝখানে খুব অল্প বা কোনো বিরতি না থাকলে এগুলোকে একটি
            সেট হিসেবেই ধরুন।
          </li>
          <li>
            নড়াচড়ার সেই ধারা থেমে শান্ত হওয়া পর্যন্ত অপেক্ষা করুন। এরপর + বোতামে
            একবার ট্যাপ করে ১টি সেট যোগ করুন।
          </li>
          <li>
            কিছুক্ষণ স্পষ্ট বিরতির পর আবার নতুন করে নড়াচড়া শুরু হলে সেটিকে নতুন
            একটি সেট হিসেবে গণনা করুন এবং আবার + বোতামে ট্যাপ করুন।
          </li>
          <li>
            ভুল করে অতিরিক্ত একটি সেট যোগ করলে শুধু − বোতাম ব্যবহার করে তা কমিয়ে
            দিন।.
          </li>
        </ol>
        <p className="mt-4 text-sm leading-6 text-rose-900/75">
          মনে রাখবেন: এটি আপনার ব্যক্তিগতভাবে শিশুর নড়াচড়ার হিসাব রাখার একটি সহজ
          উপায়। এটি কোনো চিকিৎসা পরীক্ষা নয় এবং আপনার ডাক্তার বা মিডওয়াইফের
          পরামর্শের বিকল্প নয়।
        </p>
      </section>
    </div>
  );
}

function MovementDayRow({
  day,
  onUpdate,
  onDelete,
}: {
  day: MovementDay;
  onUpdate: (date: string, count: number) => void;
  onDelete: (date: string) => void;
}) {
  const [count, setCount] = useState(String(day.count));

  useEffect(() => {
    setCount(String(day.count));
  }, [day.date, day.count]);

  const parsed = parseMovementCount(count);
  const canUpdate = parsed !== null && parsed !== day.count;

  return (
    <tr className="border-b border-rose-50">
      <th scope="row" className="py-3 pr-3 text-left font-medium text-rose-950">
        {formatCareDate(day.date)}
      </th>
      <td className="py-3 pr-3">
        <input
          id={`movement-count-${day.date}`}
          type="number"
          aria-label={`Sets for ${formatCareDate(day.date)}`}
          inputMode="numeric"
          min={0}
          max={MAX_MOVEMENT_SETS}
          step={1}
          value={count}
          onChange={(event) => setCount(event.target.value)}
          className="box-border h-11 w-24 rounded-2xl border border-rose-200 bg-petal px-3 text-sm text-rose-950 outline-none focus:border-rose-400"
        />
      </td>
      <td className="py-3">
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            className="inline-flex h-11 items-center justify-center rounded-full bg-sage px-4 text-sm font-semibold text-white hover:bg-sage-dark disabled:cursor-default disabled:opacity-40"
            disabled={!canUpdate}
            onClick={() => {
              if (parsed === null) return;
              onUpdate(day.date, parsed);
            }}
          >
            Update
          </button>
          <button
            type="button"
            className="inline-flex h-11 cursor-pointer items-center justify-center rounded-full border border-rose-200 px-4 text-sm font-semibold text-rose-800"
            onClick={() => onDelete(day.date)}
          >
            Delete
          </button>
        </div>
      </td>
    </tr>
  );
}

function syncErrorMessage(error: string) {
  if (error === "unauthorized") return "Sign in again to use the saved log.";
  if (error === "counts") return "This log could not be saved.";
  return "The saved log could not be reached.";
}

const circleButton =
  "inline-flex cursor-pointer items-center justify-center rounded-full border-2 border-[#0b3220] bg-transparent text-[#06fd91] transition-[background-color,border-color] duration-500 ease-out active:border-[#06fd91] active:bg-[rgba(6,253,145,0.1)] active:duration-0 disabled:cursor-default disabled:opacity-40";

function shortDayLabel(dateKey: string) {
  const [year, month, day] = dateKey.split("-").map(Number);
  return new Intl.DateTimeFormat("en", {
    day: "numeric",
    month: "short",
    timeZone: "UTC",
  }).format(new Date(Date.UTC(year, month - 1, day)));
}

function shiftDate(dateKey: string, days: number) {
  const [year, month, day] = dateKey.split("-").map(Number);
  const date = new Date(year, month - 1, day);
  date.setDate(date.getDate() + days);
  return localDateKey(date);
}
