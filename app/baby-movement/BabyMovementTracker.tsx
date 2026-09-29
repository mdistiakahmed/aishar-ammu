"use client";

import { useEffect, useRef, useState } from "react";
import { LuMinus, LuPlus } from "react-icons/lu";
import {
  MovementSetsChart,
  buildMovementChartRows,
  movementChartMax,
} from "@/components/charts/MovementSetsChart";
import { formatCareDate } from "@/lib/dates";
import {
  BABY_MOVEMENT_STORAGE_KEY,
  earlierMovementDays,
  localDateKey,
  MAX_MOVEMENT_SETS,
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
  const [log, setLog] = useState<MovementLog>({});
  const [today, setToday] = useState("");
  const [ready, setReady] = useState(false);
  const [pastDate, setPastDate] = useState("");
  const [pastCount, setPastCount] = useState("");
  const [formError, setFormError] = useState<string>();
  const [savedMessage, setSavedMessage] = useState<string>();
  const [storageError, setStorageError] = useState<string>();
  const rowDrafts = useRef<Record<string, string>>({});

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
      return true;
    } catch {
      setStorageError(
        "This browser could not save the log. The count on screen may be lost if you leave.",
      );
      return false;
    }
  }

  function stepToday(delta: 1 | -1) {
    const currentToday = localDateKey();
    setToday(currentToday);
    setSavedMessage(undefined);
    commit(stepMovementCount(log, currentToday, delta));
  }

  function remember() {
    const currentToday = localDateKey();
    setToday(currentToday);
    let next: MovementLog = { ...log };

    for (const day of earlierMovementDays(log, currentToday)) {
      const count = parseMovementCount(
        rowDrafts.current[day.date] ?? String(day.count),
      );
      if (count === null) {
        setSavedMessage(undefined);
        setFormError(`Enter a whole number from 0 to ${MAX_MOVEMENT_SETS}.`);
        return;
      }
      next = withMovementCount(next, day.date, count);
    }

    const adding = pastDate.trim() !== "" || pastCount.trim() !== "";
    if (adding) {
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
        setFormError("This date is already saved. Update it in the list.");
        return;
      }
      next = withMovementCount(next, date, count);
    }

    if (!commit(next)) return;
    setFormError(undefined);
    if (adding) {
      setPastDate("");
      setPastCount("");
    }
    setSavedMessage("Saved successfully.");
  }

  function updatePastDay(date: string, count: number) {
    commit(withMovementCount(log, date, count));
  }

  function deletePastDay(date: string) {
    commit(withoutMovementDate(log, date));
    setSavedMessage(undefined);
  }

  const todayCount = today ? movementCount(log, today) : 0;
  const earlierDays = today ? earlierMovementDays(log, today) : [];
  const chartRows = buildMovementChartRows(log, today);
  const chartMax = movementChartMax(chartRows);
  const yesterday = today ? shiftDate(today, -1) : "";
  const newDate = today ? parsePastMovementDate(pastDate, today) : null;
  const dateTaken = Boolean(
    newDate && Object.prototype.hasOwnProperty.call(log, newDate),
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
        <MovementSetsChart rows={chartRows} chartMax={chartMax} />
      </section>

      <section className="rounded-[2rem] border border-rose-100 bg-white p-6 shadow-sm sm:p-8">
        <h2 className="text-xl font-semibold text-rose-950">Saved days</h2>
        <p className="mt-2 text-sm leading-6 text-rose-900/75">
          The newest date is at the top. Use the empty fields to add a day.
        </p>
        <ul className="mt-6 space-y-4">
          {earlierDays.map((day) => (
            <MovementDayRow
              key={day.date}
              day={day}
              drafts={rowDrafts}
              onUpdate={updatePastDay}
              onDelete={deletePastDay}
            />
          ))}
          <li className="space-y-3 rounded-3xl border border-rose-100 bg-petal/40 p-4">
            <label className="block min-w-0" htmlFor="past-movement-date">
              <span className="text-sm font-semibold text-rose-800">Date</span>
              <input
                id="past-movement-date"
                type="date"
                value={pastDate}
                max={yesterday}
                onChange={(event) => {
                  setPastDate(event.target.value);
                  setFormError(undefined);
                }}
                className={fieldClass}
              />
            </label>
            <label className="block min-w-0" htmlFor="past-movement-count">
              <span className="text-sm font-semibold text-rose-800">Sets</span>
              <input
                id="past-movement-count"
                type="number"
                inputMode="numeric"
                min={0}
                max={MAX_MOVEMENT_SETS}
                step={1}
                value={pastCount}
                onChange={(event) => setPastCount(event.target.value)}
                className={fieldClass}
              />
            </label>
          </li>
        </ul>
        {dateTaken ? (
          <p className="mt-3 text-sm text-rose-800">
            This date is already saved. Update it in the list.
          </p>
        ) : null}
        {formError ? (
          <p className="mt-3 text-sm text-rose-800">{formError}</p>
        ) : null}
        {savedMessage && !dateTaken ? (
          <p className="mt-3 text-sm text-sage-dark">{savedMessage}</p>
        ) : null}
        <div className="mt-6">
          <button
            type="button"
            className="mt-3 inline-flex h-12 w-full cursor-pointer items-center justify-center rounded-full bg-sage px-5 text-sm font-semibold text-white hover:bg-sage-dark disabled:cursor-default disabled:opacity-40 sm:w-auto"
            onClick={remember}
            disabled={!ready}
          >
            Remember
          </button>
        </div>
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
  drafts,
  onUpdate,
  onDelete,
}: {
  day: MovementDay;
  drafts: { current: Record<string, string> };
  onUpdate: (date: string, count: number) => void;
  onDelete: (date: string) => void;
}) {
  const [count, setCount] = useState(String(day.count));

  useEffect(() => {
    setCount(String(day.count));
    drafts.current[day.date] = String(day.count);
    return () => {
      delete drafts.current[day.date];
    };
  }, [day.date, day.count, drafts]);

  const parsed = parseMovementCount(count);
  const canUpdate = parsed !== null && parsed !== day.count;

  return (
    <li className="space-y-3 rounded-3xl border border-rose-100 p-4">
      <p className="text-base font-medium text-rose-950">{formatCareDate(day.date)}</p>
      <label className="block min-w-0" htmlFor={`movement-count-${day.date}`}>
        <span className="text-sm font-semibold text-rose-800">Sets</span>
        <input
          id={`movement-count-${day.date}`}
          type="number"
          inputMode="numeric"
          min={0}
          max={MAX_MOVEMENT_SETS}
          step={1}
          value={count}
          onChange={(event) => {
            setCount(event.target.value);
            drafts.current[day.date] = event.target.value;
          }}
          className={fieldClass}
        />
      </label>
      <div className="grid grid-cols-2 gap-2">
        <button
          type="button"
          className="inline-flex h-12 items-center justify-center rounded-full bg-sage px-4 text-sm font-semibold text-white hover:bg-sage-dark disabled:cursor-default disabled:opacity-40"
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
          className="inline-flex h-12 cursor-pointer items-center justify-center rounded-full border border-rose-200 px-4 text-sm font-semibold text-rose-800"
          onClick={() => onDelete(day.date)}
        >
          Delete
        </button>
      </div>
    </li>
  );
}

const fieldClass =
  "mt-1 block h-12 w-full min-w-0 max-w-full rounded-2xl border border-rose-200 bg-white px-3 text-base text-rose-950 outline-none focus:border-rose-400";

const circleButton =
  "inline-flex cursor-pointer items-center justify-center rounded-full border-2 border-[#0b3220] bg-transparent text-[#06fd91] transition-[background-color,border-color] duration-500 ease-out active:border-[#06fd91] active:bg-[rgba(6,253,145,0.1)] active:duration-0 disabled:cursor-default disabled:opacity-40";

function shiftDate(dateKey: string, days: number) {
  const [year, month, day] = dateKey.split("-").map(Number);
  const date = new Date(year, month - 1, day);
  date.setDate(date.getDate() + days);
  return localDateKey(date);
}
