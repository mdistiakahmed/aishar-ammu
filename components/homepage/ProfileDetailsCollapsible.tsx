"use client";

import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import Link from "next/link";
import { useAuth } from "@/components/auth/AuthProvider";
import { ProfileStatus } from "@/components/profile/ProfileStatus";
import { api, type MeResponse } from "@/lib/api-client";
import { gestationalAge, parseIsoDate } from "@/lib/pregnancy";
import type { BabyGender, SessionUser } from "@/lib/user";
import { formatWeightInput } from "@/lib/weights";

const DETAIL_TOTAL = 6;

const fieldId = {
  name: "home-details-preferred-name",
  start: "home-details-pregnancy-start",
  due: "home-details-due-date",
  visit: "home-details-next-visit",
  gender: "home-details-baby-gender",
  startWeight: "home-details-weight-start",
  todayWeight: "home-details-weight-today",
} as const;

export function ProfileDetailsCollapsible({
  user,
  weightTodayKg = null,
}: {
  user: SessionUser;
  weightTodayKg?: number | null;
}) {
  const { setMe, logout } = useAuth();
  const titleId = useId();
  const panelId = useId();
  const editButtonRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLFormElement>(null);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(false);
  const [session, setSession] = useState(0);
  const [focusField, setFocusField] = useState("");
  const [sheet, setSheet] = useState(false);
  const [pending, setPending] = useState(false);
  const [saved, setSaved] = useState<string>();
  const [error, setError] = useState<string>();

  const added = addedCount(user);
  const week = weekText(user.pregnancyStartDate);
  const name = user.preferredName || user.name;

  useEffect(() => {
    const media = window.matchMedia("(max-width: 1023px)");
    const sync = () => setSheet(media.matches);
    sync();
    media.addEventListener("change", sync);
    return () => media.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    if (!editing) return;
    const previousOverflow = document.body.style.overflow;
    if (sheet) document.body.style.overflow = "hidden";

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        setEditing(false);
        setError(undefined);
        editButtonRef.current?.focus();
        return;
      }
      if (event.key !== "Tab" || !sheet) return;
      const root = dialogRef.current;
      if (!root) return;
      const nodes = Array.from(
        root.querySelectorAll<HTMLElement>("button, input, select, textarea, a[href]"),
      ).filter((node) => !node.hasAttribute("disabled"));
      if (nodes.length === 0) return;
      const first = nodes[0];
      const last = nodes[nodes.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", onKeyDown);
    if (focusField) document.getElementById(focusField)?.focus();
    else if (sheet) dialogRef.current?.querySelector<HTMLElement>("button")?.focus();

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [editing, focusField, session, sheet]);

  function openEditor(field = "") {
    setSaved(undefined);
    setError(undefined);
    setFocusField(field);
    setSession((value) => value + 1);
    setEditing(true);
  }

  function closeEditor() {
    setEditing(false);
    setError(undefined);
    editButtonRef.current?.focus();
  }

  function togglePanel() {
    if (open) {
      setEditing(false);
      setError(undefined);
    }
    setOpen((value) => !value);
  }

  async function onSubmit(formData: FormData) {
    setPending(true);
    setSaved(undefined);
    setError(undefined);
    const result = await api<MeResponse>("/api/me", {
      method: "PATCH",
      body: JSON.stringify({
        preferredName: formData.get("preferredName"),
        pregnancyStartDate: formData.get("pregnancyStartDate"),
        dueDate: formData.get("dueDate"),
        nextDoctorVisitDate: formData.get("nextDoctorVisitDate"),
        weightAtStartKg: formData.get("weightAtStartKg"),
        weightTodayKg: formData.get("weightTodayKg"),
        babyGender: formData.get("babyGender"),
      }),
    });
    setPending(false);
    if (!result.ok) {
      if (result.status === 401) {
        await logout();
        return;
      }
      setError(result.error);
      return;
    }
    setMe(result.data);
    setSaved("1");
    setEditing(false);
    editButtonRef.current?.focus();
  }

  const backgroundHidden = editing && sheet;

  return (
    <section className="rounded-[1.75rem] border border-rose-100 bg-white p-4 shadow-sm sm:p-5">
      <div
        inert={backgroundHidden ? true : undefined}
        className="flex items-start justify-between gap-3"
      >
        <button
          type="button"
          aria-expanded={open}
          aria-controls={panelId}
          onClick={togglePanel}
          className="flex min-h-11 min-w-0 flex-1 items-start gap-3 text-left"
        >
          <IconBubble>
            <PersonIcon className="h-5 w-5" />
          </IconBubble>
          <span className="min-w-0 flex-1">
            <span className="block text-base font-semibold text-rose-950">Your details</span>
            <span className="mt-0.5 block text-xs text-rose-400 lg:hidden">
              {added} of {DETAIL_TOTAL} details added
            </span>
            <span className="mt-0.5 hidden text-xs text-rose-400 lg:block">
              Keep your information up to date
            </span>
            {open ? (
              <span
                className="mt-2 block h-1.5 overflow-hidden rounded-full bg-rose-100 lg:hidden"
                role="progressbar"
                aria-valuenow={added}
                aria-valuemin={0}
                aria-valuemax={DETAIL_TOTAL}
                aria-label={`${added} of ${DETAIL_TOTAL} details added`}
              >
                <span
                  className="block h-full rounded-full bg-rose-400 transition-[width] duration-300"
                  style={{ width: `${(added / DETAIL_TOTAL) * 100}%` }}
                />
              </span>
            ) : null}
          </span>
        </button>
        {open ? (
          <button
            ref={editButtonRef}
            type="button"
            aria-expanded={editing}
            onClick={() => (editing ? closeEditor() : openEditor())}
            className="inline-flex h-9 shrink-0 items-center gap-1.5 rounded-full bg-rose-50 px-3 text-sm font-semibold text-rose-500 hover:bg-rose-100"
          >
            <PencilIcon className="h-3.5 w-3.5" />
            Edit
          </button>
        ) : null}
        <button
          type="button"
          aria-expanded={open}
          aria-controls={panelId}
          aria-label={open ? "Hide your details" : "Show your details"}
          onClick={togglePanel}
          className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-rose-50 text-rose-500 hover:bg-rose-100"
        >
          <ChevronIcon
            className={`h-4 w-4 transition-transform ${open ? "-rotate-90" : "rotate-90"}`}
          />
        </button>
      </div>

      {open ? (
      <div id={panelId}>
      <div inert={backgroundHidden ? true : undefined}>

      {!editing && saved === "1" ? (
        <div className="mt-3">
          <ProfileStatus saved={saved} />
        </div>
      ) : null}

      <div className="mt-4 grid grid-cols-1 gap-2.5 lg:hidden">
        <DetailTile
          label="Pregnancy start"
          value={user.pregnancyStartDate ? shortDate(user.pregnancyStartDate) : "Not started"}
          empty={!user.pregnancyStartDate}
          icon={<CalendarIcon className="h-5 w-5" />}
          onEdit={() => openEditor(fieldId.start)}
        />
        <DetailTile
          label="Due date"
          value={user.dueDate ? shortDate(user.dueDate) : "Not set"}
          empty={!user.dueDate}
          badge={user.dueDate ? week : null}
          icon={<CalendarIcon className="h-5 w-5" />}
          onEdit={() => openEditor(fieldId.due)}
          className={user.dueDate ? "bg-rose-50" : ""}
          bubbleClassName={user.dueDate ? "bg-white" : "bg-rose-50"}
        />
        <DetailTile
          label="Next visit"
          value={user.nextDoctorVisitDate ? shortDate(user.nextDoctorVisitDate) : "Not set"}
          empty={!user.nextDoctorVisitDate}
          icon={<StethoscopeIcon className="h-5 w-5" />}
          affordance="chevron"
          onEdit={() => openEditor(fieldId.visit)}
        />
        <DetailTile
          label="Baby gender"
          value={genderText(user.babyGender)}
          empty={!user.babyGender}
          icon={<BabyIcon className="h-5 w-5" />}
          affordance="chevron"
          onEdit={() => openEditor(fieldId.gender)}
        />
        <DetailTile
          label="Weight at start"
          value={weightText(user.weightAtStartKg)}
          empty={user.weightAtStartKg === null}
          icon={<ScaleIcon className="h-5 w-5" />}
          affordance="chevron"
          onEdit={() => openEditor(fieldId.startWeight)}
        />
      </div>

      {!editing ? (
        <div className="mt-4 hidden grid-cols-2 gap-3 lg:grid">
          <DetailTile
            label="Preferred name"
            value={name.trim() ? name : "Not set"}
            empty={!name.trim()}
            icon={<PersonIcon className="h-5 w-5" />}
            affordance="pencil"
            onEdit={() => openEditor(fieldId.name)}
          />
          <DetailTile
            label="Pregnancy start"
            value={user.pregnancyStartDate ? slashDate(user.pregnancyStartDate) : "mm/dd/yyyy"}
            empty={!user.pregnancyStartDate}
            icon={<CalendarIcon className="h-5 w-5" />}
            affordance="pencil"
            onEdit={() => openEditor(fieldId.start)}
          />
          <DetailTile
            label="Due date"
            value={user.dueDate ? slashDate(user.dueDate) : "mm/dd/yyyy"}
            empty={!user.dueDate}
            icon={<CalendarIcon className="h-5 w-5" />}
            affordance="pencil"
            onEdit={() => openEditor(fieldId.due)}
          />
          <DetailTile
            label="Next doctor visit"
            value={user.nextDoctorVisitDate ? slashDate(user.nextDoctorVisitDate) : "mm/dd/yyyy"}
            empty={!user.nextDoctorVisitDate}
            icon={<CalendarIcon className="h-5 w-5" />}
            affordance="pencil"
            onEdit={() => openEditor(fieldId.visit)}
          />
          <DetailTile
            label="Baby gender"
            value={genderText(user.babyGender)}
            empty={!user.babyGender}
            icon={<BabyIcon className="h-5 w-5" />}
            affordance="chevron"
            onEdit={() => openEditor(fieldId.gender)}
          />
          <DetailTile
            label="Weight at start (kg)"
            value={weightText(user.weightAtStartKg)}
            empty={user.weightAtStartKg === null}
            icon={<ScaleIcon className="h-5 w-5" />}
            affordance="chevron"
            onEdit={() => openEditor(fieldId.startWeight)}
          />
        </div>
      ) : null}
      </div>

      {editing ? (
        <button
          type="button"
          className="fixed inset-0 z-60 bg-rose-950/40 lg:hidden"
          aria-label="Close editor"
          onClick={closeEditor}
        />
      ) : null}

      {editing ? (
        <form
          key={session}
          ref={dialogRef}
          action={onSubmit}
          role={sheet ? "dialog" : undefined}
          aria-modal={sheet ? true : undefined}
          aria-labelledby={titleId}
          className="fixed inset-x-0 bottom-0 z-70 max-h-[min(88svh,44rem)] overflow-y-auto rounded-t-[1.75rem] border border-rose-100 bg-white px-4 pb-[max(1.25rem,env(safe-area-inset-bottom))] pt-3 shadow-2xl lg:static lg:z-auto lg:mt-4 lg:max-h-none lg:overflow-visible lg:rounded-none lg:border-0 lg:bg-transparent lg:p-0 lg:shadow-none"
        >
          <h2 id={titleId} className="sr-only">
            Edit your details
          </h2>
          <div className="mx-auto mb-3 h-1.5 w-12 rounded-full bg-rose-200 lg:hidden" />
          <div className="mb-4 flex items-center justify-between gap-3 lg:hidden">
            <p className="text-lg font-semibold text-rose-950">Edit your details</p>
            <button
              type="button"
              onClick={closeEditor}
              aria-label="Close"
              className="inline-flex h-11 w-11 items-center justify-center rounded-full text-rose-400 hover:bg-rose-50"
            >
              <CloseIcon className="h-5 w-5" />
            </button>
          </div>

          <div className="grid gap-2.5 lg:grid-cols-2 lg:gap-3">
            {error ? (
              <div className="lg:col-span-2">
                <ProfileStatus error={error} />
              </div>
            ) : null}
            <div className="hidden lg:contents">
              <EditorField
                id={fieldId.name}
                label="Preferred name"
                icon={<PersonIcon className="h-5 w-5" />}
                affordance="pencil"
              >
                <input
                  id={fieldId.name}
                  name="preferredName"
                  type="text"
                  maxLength={40}
                  defaultValue={name}
                  autoComplete="name"
                  className={controlClass}
                />
              </EditorField>
            </div>
            <EditorField
              id={fieldId.start}
              label="Pregnancy start"
              icon={<CalendarIcon className="h-5 w-5" />}
              affordance="pencil"
            >
              <input
                id={fieldId.start}
                name="pregnancyStartDate"
                type="date"
                defaultValue={user.pregnancyStartDate ?? ""}
                className={controlClass}
              />
            </EditorField>
            <EditorField
              id={fieldId.due}
              label="Due date"
              badge={week}
              icon={<CalendarIcon className="h-5 w-5" />}
              affordance="pencil"
            >
              <input
                id={fieldId.due}
                name="dueDate"
                type="date"
                defaultValue={user.dueDate ?? ""}
                className={controlClass}
              />
            </EditorField>
            <EditorField
              id={fieldId.visit}
              label="Next doctor visit"
              icon={
                <>
                  <span className="lg:hidden">
                    <StethoscopeIcon className="h-5 w-5" />
                  </span>
                  <span className="hidden lg:block">
                    <CalendarIcon className="h-5 w-5" />
                  </span>
                </>
              }
              affordance="pencil"
            >
              <input
                id={fieldId.visit}
                name="nextDoctorVisitDate"
                type="date"
                defaultValue={user.nextDoctorVisitDate ?? ""}
                className={controlClass}
              />
            </EditorField>
            <EditorField
              id={fieldId.gender}
              label="Baby gender"
              icon={<BabyIcon className="h-5 w-5" />}
              affordance="chevron"
            >
              <select
                id={fieldId.gender}
                name="babyGender"
                defaultValue={user.babyGender ?? ""}
                className={`${controlClass} appearance-none`}
              >
                <option value="">Not set</option>
                <option value="girl">Girl</option>
                <option value="boy">Boy</option>
                <option value="unknown">Not known yet</option>
              </select>
            </EditorField>
            <EditorField
              id={fieldId.startWeight}
              label="Weight at start (kg)"
              icon={<ScaleIcon className="h-5 w-5" />}
              affordance="chevron"
            >
              <input
                id={fieldId.startWeight}
                name="weightAtStartKg"
                type="number"
                inputMode="decimal"
                min={30}
                max={180}
                step={0.1}
                defaultValue={formatWeightInput(user.weightAtStartKg)}
                className={numberClass}
              />
            </EditorField>
            <EditorField
              id={fieldId.todayWeight}
              label="Weight as of today (kg)"
              icon={<ScaleIcon className="h-5 w-5" />}
              affordance="chevron"
            >
              <input
                id={fieldId.todayWeight}
                name="weightTodayKg"
                type="number"
                inputMode="decimal"
                min={30}
                max={180}
                step={0.1}
                defaultValue={formatWeightInput(weightTodayKg)}
                className={numberClass}
              />
            </EditorField>
            <Link
              href="/account"
              className="block py-1 text-center text-sm font-semibold text-rose-600 underline-offset-2 hover:underline lg:col-span-2 lg:text-left"
            >
              Edit weight history
            </Link>
            <div className="mt-1 flex flex-col gap-1 lg:col-span-2 lg:flex-row-reverse lg:items-center lg:justify-end lg:gap-3">
              <button
                type="submit"
                disabled={pending}
                className="inline-flex h-12 w-full items-center justify-center rounded-full bg-rose-400 text-sm font-semibold text-white shadow-sm hover:bg-rose-500 disabled:opacity-70 lg:w-44"
              >
                {pending ? "Saving…" : "Save"}
              </button>
              <button
                type="button"
                onClick={closeEditor}
                className="inline-flex h-11 w-full items-center justify-center text-sm font-semibold text-rose-400 hover:text-rose-600 lg:w-auto lg:px-4"
              >
                Cancel
              </button>
            </div>
          </div>
        </form>
      ) : null}

      <div inert={backgroundHidden ? true : undefined}>
      <Link
        href="#pregnancy-journey"
        className="mt-4 flex items-center gap-3 rounded-2xl bg-rose-50 px-3.5 py-3.5 text-left transition hover:bg-rose-100/80"
      >
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white text-rose-400">
          <JourneyIcon className="h-6 w-6" />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block text-sm font-semibold text-rose-800">Your pregnancy journey</span>
          <span className="mt-0.5 block text-xs leading-5 text-rose-400">
            Track your progress, get helpful tips and care reminders.
          </span>
        </span>
        <ChevronIcon className="h-4 w-4 shrink-0 text-rose-300" />
      </Link>
      </div>
      </div>
      ) : null}
    </section>
  );
}

const controlClass =
  "mt-1 block h-9 w-full min-w-0 bg-transparent text-base font-semibold text-rose-800 outline-none lg:text-sm";

const numberClass = `${controlClass} [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none`;

function DetailTile({
  label,
  value,
  empty,
  icon,
  affordance = "none",
  onEdit,
  badge,
  className = "",
  bubbleClassName = "bg-rose-50",
}: {
  label: string;
  value: string;
  empty: boolean;
  icon: ReactNode;
  affordance?: "pencil" | "chevron" | "none";
  onEdit: () => void;
  badge?: string | null;
  className?: string;
  bubbleClassName?: string;
}) {
  return (
    <button
      type="button"
      onClick={onEdit}
      className={`flex h-full min-h-16 w-full items-center gap-3 rounded-2xl border border-rose-100 bg-white px-3 py-3 text-left shadow-sm transition hover:border-rose-200 ${className}`}
    >
      <span
        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-rose-400 ${bubbleClassName}`}
      >
        {icon}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-xs font-medium text-rose-400">{label}</span>
        <span className="mt-0.5 flex flex-wrap items-center gap-1.5">
          <span
            className={`min-w-0 text-sm font-semibold break-words ${empty ? "font-medium text-rose-300" : "text-rose-800"}`}
          >
            {value}
          </span>
          {badge ? (
            <span className="rounded-full bg-white px-2 py-0.5 text-[11px] font-semibold text-rose-600">
              {badge}
            </span>
          ) : null}
        </span>
      </span>
      {affordance === "none" ? null : (
        <span className="shrink-0 text-rose-300" aria-hidden="true">
          {affordance === "pencil" ? (
            <PencilIcon className="h-4 w-4" />
          ) : (
            <ChevronIcon className="h-4 w-4" />
          )}
        </span>
      )}
    </button>
  );
}

function EditorField({
  id,
  label,
  icon,
  badge,
  affordance,
  children,
}: {
  id: string;
  label: string;
  icon: ReactNode;
  badge?: string | null;
  affordance: "pencil" | "chevron";
  children: ReactNode;
}) {
  return (
    <label
      htmlFor={id}
      className="flex items-center gap-3 rounded-2xl border border-rose-100 bg-white px-3 py-3 shadow-sm"
    >
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-rose-50 text-rose-400">
        {icon}
      </span>
      <span className="min-w-0 flex-1">
        <span className="flex flex-wrap items-center gap-1.5 text-xs font-medium text-rose-400">
          {label}
          {badge ? (
            <span className="rounded-full bg-rose-50 px-2 py-0.5 text-[11px] font-semibold text-rose-600">
              {badge}
            </span>
          ) : null}
        </span>
        {children}
      </span>
      <span className="pointer-events-none shrink-0 text-rose-300" aria-hidden="true">
        <span className="lg:hidden">
          <ChevronIcon className="h-4 w-4" />
        </span>
        <span className="hidden lg:block">
          {affordance === "pencil" ? (
            <PencilIcon className="h-4 w-4" />
          ) : (
            <ChevronIcon className="h-4 w-4" />
          )}
        </span>
      </span>
    </label>
  );
}

function IconBubble({ children }: { children: ReactNode }) {
  return (
    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-rose-50 text-rose-400">
      {children}
    </span>
  );
}

function addedCount(user: SessionUser) {
  return [
    Boolean((user.preferredName || user.name).trim()),
    Boolean(user.pregnancyStartDate),
    Boolean(user.dueDate),
    Boolean(user.nextDoctorVisitDate),
    Boolean(user.babyGender),
    user.weightAtStartKg !== null,
  ].filter(Boolean).length;
}

function weekText(start: string | null) {
  if (!start || !parseIsoDate(start)) return null;
  return `Week ${gestationalAge(start).week}`;
}

function slashDate(iso: string) {
  const [year, month, day] = iso.split("-");
  if (!year || !month || !day) return iso;
  return `${month}/${day}/${year}`;
}

function shortDate(iso: string) {
  const [year, month, day] = iso.split("-").map(Number);
  if (!year || !month || !day) return iso;
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(Date.UTC(year, month - 1, day)));
}

function genderText(value: BabyGender | null) {
  if (value === "girl") return "Girl";
  if (value === "boy") return "Boy";
  if (value === "unknown") return "Not known yet";
  return "Not set";
}

function weightText(value: number | null) {
  return value === null ? "Not set" : String(value);
}

function PersonIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="8" r="3.1" stroke="currentColor" strokeWidth="1.7" />
      <path
        d="M6.2 19.2v-.8c0-2.6 2-4.2 5.8-4.2s5.8 1.6 5.8 4.2v.8"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
    </svg>
  );
}

function CalendarIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="4" y="5.5" width="16" height="14.5" rx="2.2" stroke="currentColor" strokeWidth="1.7" />
      <path
        d="M8 4v3.2M16 4v3.2M4 10.2h16"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
    </svg>
  );
}

function StethoscopeIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M7 4.5v6a3.5 3.5 0 0 0 7 0v-6"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
      <path d="M5.5 4.5h2.2M12.3 4.5H14.5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
      <path
        d="M14 10.2a4.2 4.2 0 0 0 8.2.2V8.5"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
      <circle cx="19.4" cy="7.2" r="1.5" stroke="currentColor" strokeWidth="1.7" />
    </svg>
  );
}

function BabyIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="8" r="2.6" stroke="currentColor" strokeWidth="1.7" />
      <path
        d="M8.2 19.2c.5-2.4 2-3.8 3.8-3.8s3.3 1.4 3.8 3.8"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
      <path
        d="M9.5 14.2c.8 1.3 1.6 1.8 2.5 1.8s1.7-.5 2.5-1.8"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
    </svg>
  );
}

function ScaleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="5" y="7.5" width="14" height="11" rx="2.4" stroke="currentColor" strokeWidth="1.7" />
      <circle cx="12" cy="13" r="2.1" stroke="currentColor" strokeWidth="1.7" />
      <path d="M9.2 7.5V6.6A2.8 2.8 0 0 1 12 3.8a2.8 2.8 0 0 1 2.8 2.8v.9" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  );
}

function JourneyIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="5.2" r="1.7" stroke="currentColor" strokeWidth="1.6" />
      <path
        d="M9.2 20.5v-2.8c0-1 .4-1.8 1.1-2.4-.8-1-1.2-2.2-.7-3.6.4-1.2 1.4-2 2.6-2.2 1.4-.2 2.6.5 3.1 1.8.4 1 .2 2-.4 2.8 1.2.7 2 2 2 3.5v2.9"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M10.2 14.6c1.2.7 2.4.8 3.6.2"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

function PencilIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M4.5 19.5h3.6L18.8 8.8a1.8 1.8 0 0 0 0-2.5l-1.1-1.1a1.8 1.8 0 0 0-2.5 0L4.5 15.9v3.6Z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
      <path d="M13.2 6.8l3.5 3.5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  );
}

function ChevronIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M9 6l6 6-6 6"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function CloseIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M7 7l10 10M17 7 7 17"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}
