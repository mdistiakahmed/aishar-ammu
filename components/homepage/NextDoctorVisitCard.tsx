"use client";

import { useEffect, useId, useState } from "react";
import { useAuth } from "@/components/auth/AuthProvider";
import { GuestDashCard } from "@/components/homepage/guest/GuestDashCard";
import { PencilIcon, StethoscopeIcon } from "@/components/homepage/guest/GuestDashIcons";
import { saveNextDoctorVisitDate } from "@/lib/care-details";
import { parseOptionalDate } from "@/lib/dates";
import {
  nextDoctorVisitKey,
  parseVisitTime,
  readNextDoctorVisit,
  writeNextDoctorVisit,
  type NextDoctorVisit,
} from "@/lib/next-doctor-visit";

export function NextDoctorVisitCard({
  previewWhen,
  note,
  className,
}: {
  previewWhen: string;
  note?: string | null;
  className?: string;
}) {
  const { user, logs, setMe } = useAuth();
  const titleId = useId();
  const [visit, setVisit] = useState<NextDoctorVisit | null>(null);
  const [todayKey, setTodayKey] = useState("");
  const [editing, setEditing] = useState(false);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [doctorName, setDoctorName] = useState("");
  const [error, setError] = useState<string>();

  useEffect(() => {
    function refreshToday() {
      setTodayKey(localDateKey(new Date()));
    }
    refreshToday();
    window.addEventListener("focus", refreshToday);
    return () => window.removeEventListener("focus", refreshToday);
  }, []);

  useEffect(() => {
    if (!user) {
      setVisit(null);
      return;
    }
    const signedIn = user;

    function refresh() {
      setVisit(readNextDoctorVisit(signedIn.id));
    }

    refresh();

    function onStorage(event: StorageEvent) {
      if (event.key !== nextDoctorVisitKey(signedIn.id)) return;
      refresh();
    }

    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, [user]);

  function openEditor() {
    setDate(visit?.date ?? "");
    setTime(visit?.time ?? "");
    setDoctorName(visit?.doctorName ?? "");
    setError(undefined);
    setEditing(true);
  }

  function save() {
    if (!user) return;
    const savedDate = parseOptionalDate(date);
    if (!savedDate) {
      setError("Choose a date.");
      return;
    }
    const savedTime = parseVisitTime(time);
    if (savedTime === null) {
      setError("Enter a time, or leave it blank.");
      return;
    }
    const savedName = doctorName.trim().slice(0, 80);
    const next: NextDoctorVisit = {
      date: savedDate,
      time: savedTime,
      doctorName: savedName,
    };
    try {
      writeNextDoctorVisit(user.id, next);
      setMe(saveNextDoctorVisitDate(user, logs, savedDate));
      setVisit(next);
      setEditing(false);
      setError(undefined);
    } catch {
      setError("This browser could not save the visit.");
    }
  }

  const when = user
    ? visit
      ? formatVisitWhen(visit)
      : "Not saved yet"
    : previewWhen;
  const doctor = user ? visit?.doctorName || "Doctor not set" : "Supatra Suricya";
  const reminder = user ? visitReminder(visit, todayKey) : null;

  return (
    <>
      <GuestDashCard
        title="পরবর্তী ডাক্তার দেখা"
        headerClassName="bg-[#d5d0de]"
        titleClassName="text-[#4a4458]"
        icon={
          <StethoscopeIcon className="h-3.5 w-3.5 text-[#4a4458] lg:h-4 lg:w-4" />
        }
        headerAction={
          user ? (
            <button
              type="button"
              onClick={openEditor}
              aria-label="Edit"
              className="inline-flex h-7 w-7 items-center justify-center rounded-full text-[#c2255c] hover:bg-black/5"
            >
              <PencilIcon className="h-3.5 w-3.5" />
            </button>
          ) : null
        }
        className={className}
        bodyClassName="min-h-0 flex-1 justify-center gap-0.5 lg:gap-1"
      >
        <p className="text-[0.65rem] leading-snug text-[#4a4458] lg:text-xs">
          <span className="font-semibold">সাক্ষাৎ:</span> {when}
        </p>
        <p className="text-[0.65rem] leading-snug text-[#6b6680] lg:text-xs">{doctor}</p>
        {reminder ? (
          <p className="mt-1 text-[0.65rem] font-semibold leading-snug text-[#4a4458] lg:text-xs">
            {reminder}
          </p>
        ) : null}
        {note ? (
          <p className="mt-1 text-[0.55rem] leading-snug text-[#8a4b32] sm:text-[0.65rem] lg:text-xs">
            {note}
          </p>
        ) : null}
      </GuestDashCard>

      {editing && user ? (
        <div className="fixed inset-0 z-[70] flex items-end justify-center bg-rose-950/40 p-4 sm:items-center">
          <button
            type="button"
            className="absolute inset-0"
            aria-label="Close"
            onClick={() => setEditing(false)}
          />
          <form
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            className="relative z-10 w-full max-w-md rounded-[2rem] border border-rose-100 bg-white p-6 shadow-xl"
            onSubmit={(event) => {
              event.preventDefault();
              save();
            }}
          >
            <h2 id={titleId} className="text-xl font-semibold text-rose-950">
              Next doctor visit
            </h2>
            <div className="mt-5 flex flex-col gap-4">
              <label className="block min-w-0" htmlFor="next-visit-date">
                <span className="text-sm font-semibold text-rose-800">
                  Date
                </span>
                <input
                  id="next-visit-date"
                  type="date"
                  required
                  value={date}
                  onChange={(event) => setDate(event.target.value)}
                  className={fieldClass}
                />
              </label>
              <label className="block min-w-0" htmlFor="next-visit-time">
                <span className="text-sm font-semibold text-rose-800">
                  Time
                </span>
                <input
                  id="next-visit-time"
                  type="time"
                  value={time}
                  onChange={(event) => setTime(event.target.value)}
                  className={fieldClass}
                />
              </label>
              <label className="block min-w-0" htmlFor="next-visit-doctor">
                <span className="text-sm font-semibold text-rose-800">
                  Doctor name
                </span>
                <input
                  id="next-visit-doctor"
                  type="text"
                  maxLength={80}
                  value={doctorName}
                  onChange={(event) => setDoctorName(event.target.value)}
                  className={fieldClass}
                />
              </label>
              {error ? <p className="text-sm text-rose-800">{error}</p> : null}
              <button
                type="submit"
                className="inline-flex h-12 w-full items-center justify-center rounded-full bg-rose-800 text-sm font-semibold text-white"
              >
                Save
              </button>
            </div>
          </form>
        </div>
      ) : null}
    </>
  );
}

const fieldClass =
  "mt-1 block h-12 w-full min-w-0 max-w-full rounded-2xl border border-rose-200 bg-petal px-3 text-base text-rose-950 outline-none focus:border-rose-400";

function visitReminder(visit: NextDoctorVisit | null, todayKey: string) {
  if (!visit) return "add next doctor visit";
  if (!todayKey) return null;
  const days = calendarDaysBetween(todayKey, visit.date);
  if (days > 1) return `${days} days remaining`;
  if (days === 1) return "1 day remaining";
  if (days === 0) return "Today";
  return "add next doctor visit";
}

function calendarDaysBetween(fromKey: string, toKey: string) {
  const from = localMidnight(fromKey);
  const to = localMidnight(toKey);
  return Math.round((to.getTime() - from.getTime()) / 86_400_000);
}

function localMidnight(dateKey: string) {
  const [year, month, day] = dateKey.split("-").map(Number);
  return new Date(year, month - 1, day);
}

function localDateKey(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function formatVisitWhen(visit: NextDoctorVisit) {
  const [year, month, day] = visit.date.split("-").map(Number);
  const label = new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  }).format(new Date(Date.UTC(year, month - 1, day)));
  if (!visit.time) return label;
  return `${label}, ${formatTimeAmPm(visit.time)}`;
}

function formatTimeAmPm(time: string) {
  const [hourText, minute] = time.split(":");
  const hour = Number(hourText);
  const period = hour >= 12 ? "PM" : "AM";
  const hour12 = hour % 12 || 12;
  return `${hour12}:${minute} ${period}`;
}
