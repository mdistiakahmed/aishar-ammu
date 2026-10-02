"use client";

import { useEffect, useId, useState } from "react";
import { useAuth } from "@/components/auth/AuthProvider";
import { GuestDashCard } from "@/components/homepage/guest/GuestDashCard";
import { PencilIcon } from "@/components/homepage/guest/GuestDashIcons";
import { saveNextDoctorVisitDate } from "@/lib/care-details";
import { formatEnglishVisit } from "@/lib/day-part";
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
  const doctor = user
    ? visit?.doctorName || "Doctor not set"
    : "Supatra Suricya";
  const reminder = user ? visitReminder(visit, todayKey) : null;

  return (
    <>
      <GuestDashCard
        title="Next Doctor Visit"
        headerClassName="bg-mist"
        titleClassName="text-[#1e3a38]"
        headerAction={
          user ? (
            <button
              type="button"
              onClick={openEditor}
              aria-label="Edit"
              className="inline-flex h-7 w-7 items-center justify-center rounded-full text-[#3d7a76] hover:bg-black/5"
            >
              <PencilIcon className="h-3.5 w-3.5" />
            </button>
          ) : null
        }
        className={className}
        bodyClassName="min-h-0 flex-1"
      >
        <div className="flex min-h-0 flex-1 items-center gap-4 lg:gap-3">
          <div className="min-w-0 flex-1">
            <p className="flex items-start gap-1 text-sm leading-snug text-ink sm:text-base lg:text-xs">
              <span className="font-semibold">{when}</span>
            </p>
            <p className="mt-1 text-sm leading-snug text-[#3e4a46] sm:text-base lg:text-sm">
              {doctor}
            </p>
            {reminder ? (
              <p className="mt-1 text-sm font-semibold leading-snug text-[#3d7a76] sm:text-base lg:text-xs">
                {reminder}
              </p>
            ) : null}
            {note ? (
              <p className="mt-1 text-sm leading-snug text-[#8a5a42] lg:text-xs">
                {note}
              </p>
            ) : null}
          </div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/doctor.png"
            alt=""
            className="h-24 w-24 shrink-0 rounded-full object-cover object-top sm:h-28 sm:w-28 lg:h-24 lg:w-24"
          />
        </div>
      </GuestDashCard>

      {editing && user ? (
        <div className="fixed inset-0 z-[70] flex items-end justify-center bg-ink/40 p-4 sm:items-center">
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
            className="relative z-10 w-full max-w-md rounded-[2rem] border border-[#d5ebe8] bg-white p-6 shadow-xl"
            onSubmit={(event) => {
              event.preventDefault();
              save();
            }}
          >
            <h2 id={titleId} className="text-xl font-semibold text-ink">
              Next doctor visit
            </h2>
            <div className="mt-5 flex flex-col gap-4">
              <label className="block min-w-0" htmlFor="next-visit-date">
                <span className="text-sm font-semibold text-ink">Date</span>
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
                <span className="text-sm font-semibold text-ink">Time</span>
                <input
                  id="next-visit-time"
                  type="time"
                  value={time}
                  onChange={(event) => setTime(event.target.value)}
                  className={fieldClass}
                />
              </label>
              <label className="block min-w-0" htmlFor="next-visit-doctor">
                <span className="text-sm font-semibold text-ink">
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
              {error ? <p className="text-sm text-[#8a5a42]">{error}</p> : null}
              <button
                type="submit"
                className="inline-flex h-12 w-full items-center justify-center rounded-full bg-lagoon text-sm font-semibold text-white"
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

function PinIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M12 2.5a6.2 6.2 0 0 0-6.2 6.2c0 4.6 6.2 12.8 6.2 12.8s6.2-8.2 6.2-12.8A6.2 6.2 0 0 0 12 2.5Zm0 8.4a2.2 2.2 0 1 1 0-4.4 2.2 2.2 0 0 1 0 4.4Z" />
    </svg>
  );
}

const fieldClass =
  "mt-1 block h-12 w-full min-w-0 max-w-full rounded-2xl border border-[#d5ebe8] bg-petal px-3 text-base text-ink outline-none focus:border-lagoon";

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
  return formatEnglishVisit(year, month, day, visit.time);
}
