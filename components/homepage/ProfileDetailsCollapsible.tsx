"use client";

import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import Link from "next/link";
import { useAuth } from "@/components/auth/AuthProvider";
import { ProfileStatus } from "@/components/profile/ProfileStatus";
import { saveLocalProfile } from "@/lib/care-details";
import { readSavedDeliveryDate } from "@/lib/delivery-date";
import type { BabyGender, SessionUser } from "@/lib/user";

const DETAIL_TOTAL = 3;

const fieldId = {
  name: "home-details-preferred-name",
  start: "home-details-pregnancy-start",
  gender: "home-details-baby-gender",
} as const;

export function ProfileDetailsCollapsible({ user }: { user: SessionUser }) {
  const { logs, setMe } = useAuth();
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

  const [savedStart, setSavedStart] = useState<string | null>();
  const added = addedCount(user, Boolean(savedStart));
  const name = user.preferredName || user.name;

  useEffect(() => {
    setSavedStart(readSavedDeliveryDate()?.start ?? null);
  }, []);

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
        root.querySelectorAll<HTMLElement>(
          "button, input, select, textarea, a[href]",
        ),
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
    else if (sheet)
      dialogRef.current?.querySelector<HTMLElement>("button")?.focus();

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

  function onSubmit(formData: FormData) {
    setPending(true);
    setSaved(undefined);
    setError(undefined);
    try {
      const result = saveLocalProfile(user, logs, {
        preferredName: formData.get("preferredName"),
        pregnancyStartDate: formData.get("pregnancyStartDate"),
        dueDate: user.dueDate ?? "",
        nextDoctorVisitDate: user.nextDoctorVisitDate ?? "",
        weightAtStartKg: user.weightAtStartKg ?? "",
        babyGender: formData.get("babyGender"),
      });
      if (!result.ok) {
        setError(result.error);
        return;
      }
      setMe(result);
      setSaved("1");
      setEditing(false);
      editButtonRef.current?.focus();
    } catch {
      setError("db");
    } finally {
      setPending(false);
    }
  }

  const backgroundHidden = editing && sheet;

  return (
    <section
      className={`rounded-[1.75rem] border border-[#d5ebe8] bg-white shadow-sm ${
        open ? "p-4 sm:p-5" : "px-3 py-2 sm:px-4 sm:py-2"
      }`}
    >
      <div
        inert={backgroundHidden ? true : undefined}
        className="flex items-center justify-between gap-3"
      >
        <button
          type="button"
          aria-expanded={open}
          aria-controls={panelId}
          onClick={togglePanel}
          className="flex min-w-0 flex-1 items-center gap-2.5 text-left"
        >
          {user.picture ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={user.picture}
              alt=""
              referrerPolicy="no-referrer"
              className="h-8 w-8 shrink-0 rounded-full object-cover"
            />
          ) : (
            <IconBubble className="h-8 w-8">
              <PersonIcon className="h-4 w-4" />
            </IconBubble>
          )}
          <span className="min-w-0 flex-1">
            <span className="block text-sm font-semibold leading-tight text-ink">
              Your details
            </span>
            <span className="mt-0.5 block text-xs text-[#5f7c82]">
              সঠিক পরামর্শ পেতে আপনার তথ্যগুলো আপডেট রাখুন
            </span>
            {open ? (
              <span
                className="mt-2 block h-1.5 overflow-hidden rounded-full bg-[#d7eeed] lg:hidden"
                role="progressbar"
                aria-valuenow={added}
                aria-valuemin={0}
                aria-valuemax={DETAIL_TOTAL}
                aria-label={`${added} of ${DETAIL_TOTAL} details added`}
              >
                <span
                  className="block h-full rounded-full bg-lagoon transition-[width] duration-300"
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
            className="inline-flex h-9 shrink-0 items-center gap-1.5 rounded-full bg-[#e7f6f5] px-3 text-sm font-semibold text-sage hover:bg-[#d7eeed]"
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
          className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#e7f6f5] text-sage hover:bg-[#d7eeed]"
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

            {!editing ? (
              <div className="mt-4 flex flex-col gap-2.5">
                <DetailTile
                  label="Preferred name"
                  value={name.trim() ? name : "Not set"}
                  empty={!name.trim()}
                  icon={<PersonIcon className="h-5 w-5" />}
                  affordance="pencil"
                  onEdit={() => openEditor(fieldId.name)}
                />
                <div className="flex min-h-16 w-full items-center gap-3 rounded-2xl border border-[#d5ebe8] bg-white px-3 py-3 text-left shadow-sm">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#e7f6f5] text-[#5f7c82]">
                    <CalendarIcon className="h-5 w-5" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-xs font-medium text-[#5f7c82]">
                      Pregnancy start
                    </span>
                    <span
                      className={`mt-0.5 block text-sm font-semibold break-words ${
                        savedStart ? "text-ink" : "font-medium text-[#8aada8]"
                      }`}
                    >
                      {savedStart
                        ? shortDate(savedStart)
                        : savedStart === null
                          ? "Not started"
                          : "\u00a0"}
                    </span>
                  </span>
                  {savedStart !== undefined ? (
                    <PregnancyStartLink hasValue={Boolean(savedStart)} />
                  ) : null}
                </div>
                <DetailTile
                  label="Baby gender"
                  value={genderText(user.babyGender)}
                  empty={!user.babyGender}
                  icon={<BabyIcon className="h-5 w-5" />}
                  affordance="chevron"
                  onEdit={() => openEditor(fieldId.gender)}
                />
              </div>
            ) : null}
          </div>

          {editing ? (
            <button
              type="button"
              className="fixed inset-0 z-60 bg-ink/40 lg:hidden"
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
              className="fixed inset-x-0 bottom-0 z-70 max-h-[min(88svh,44rem)] overflow-y-auto rounded-t-[1.75rem] border border-[#d5ebe8] bg-white px-4 pb-[max(1.25rem,env(safe-area-inset-bottom))] pt-3 shadow-2xl lg:static lg:z-auto lg:mt-4 lg:max-h-none lg:overflow-visible lg:rounded-none lg:border-0 lg:bg-transparent lg:p-0 lg:shadow-none"
            >
              <h2 id={titleId} className="sr-only">
                Edit your details
              </h2>
              <div className="mx-auto mb-3 h-1.5 w-12 rounded-full bg-[#c5e4e2] lg:hidden" />
              <div className="mb-4 flex items-center justify-between gap-3 lg:hidden">
                <p className="text-lg font-semibold text-ink">
                  Edit your details
                </p>
                <button
                  type="button"
                  onClick={closeEditor}
                  aria-label="Close"
                  className="inline-flex h-11 w-11 items-center justify-center rounded-full text-[#5f7c82] hover:bg-[#e7f6f5]"
                >
                  <CloseIcon className="h-5 w-5" />
                </button>
              </div>

              <div className="flex flex-col gap-2.5">
                {error ? <ProfileStatus error={error} /> : null}
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
                <div className="flex flex-col gap-2.5 rounded-2xl border border-[#d5ebe8] bg-white px-3 py-3 shadow-sm sm:flex-row sm:items-center">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#e7f6f5] text-[#5f7c82]">
                    <CalendarIcon className="h-5 w-5" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <label
                      htmlFor={fieldId.start}
                      className="block text-xs font-medium text-[#5f7c82]"
                    >
                      Pregnancy start
                    </label>
                    <input
                      id={fieldId.start}
                      type="date"
                      readOnly
                      tabIndex={-1}
                      value={savedStart ?? ""}
                      aria-readonly="true"
                      className={`${controlClass} pointer-events-none`}
                    />
                  </span>
                  {savedStart !== undefined ? (
                    <PregnancyStartLink hasValue={Boolean(savedStart)} />
                  ) : null}
                </div>
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
                <div className="mt-1 flex flex-col gap-1 lg:flex-row-reverse lg:items-center lg:justify-end lg:gap-3">
                  <button
                    type="submit"
                    disabled={pending}
                    className="inline-flex h-12 w-full items-center justify-center rounded-full bg-lagoon text-sm font-semibold text-white shadow-sm hover:bg-sage-dark disabled:opacity-70 lg:w-44"
                  >
                    {pending ? "Saving…" : "Save"}
                  </button>
                  <button
                    type="button"
                    onClick={closeEditor}
                    className="inline-flex h-11 w-full items-center justify-center text-sm font-semibold text-[#5f7c82] hover:text-sage lg:w-auto lg:px-4"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </form>
          ) : null}
        </div>
      ) : null}
    </section>
  );
}

const controlClass =
  "mt-1 block h-9 w-full min-w-0 bg-transparent text-base font-semibold text-ink outline-none lg:text-sm";

function DetailTile({
  label,
  value,
  empty,
  icon,
  affordance = "none",
  onEdit,
  badge,
  className = "",
  bubbleClassName = "bg-[#e7f6f5]",
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
      className={`flex h-full min-h-16 w-full items-center gap-3 rounded-2xl border border-[#d5ebe8] bg-white px-3 py-3 text-left shadow-sm transition hover:border-[#b7d9d6] ${className}`}
    >
      <span
        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-[#5f7c82] ${bubbleClassName}`}
      >
        {icon}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-xs font-medium text-[#5f7c82]">
          {label}
        </span>
        <span className="mt-0.5 flex flex-wrap items-center gap-1.5">
          <span
            className={`min-w-0 text-sm font-semibold break-words ${empty ? "font-medium text-[#8aada8]" : "text-ink"}`}
          >
            {value}
          </span>
          {badge ? (
            <span className="rounded-full bg-white px-2 py-0.5 text-[11px] font-semibold text-sage">
              {badge}
            </span>
          ) : null}
        </span>
      </span>
      {affordance === "none" ? null : (
        <span className="shrink-0 text-[#8aada8]" aria-hidden="true">
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
      className="flex items-center gap-3 rounded-2xl border border-[#d5ebe8] bg-white px-3 py-3 shadow-sm"
    >
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#e7f6f5] text-[#5f7c82]">
        {icon}
      </span>
      <span className="min-w-0 flex-1">
        <span className="flex flex-wrap items-center gap-1.5 text-xs font-medium text-[#5f7c82]">
          {label}
          {badge ? (
            <span className="rounded-full bg-[#e7f6f5] px-2 py-0.5 text-[11px] font-semibold text-sage">
              {badge}
            </span>
          ) : null}
        </span>
        {children}
      </span>
      <span
        className="pointer-events-none shrink-0 text-[#8aada8]"
        aria-hidden="true"
      >
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

function IconBubble({
  children,
  className = "h-11 w-11",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <span
      className={`flex shrink-0 items-center justify-center rounded-full bg-[#e7f6f5] text-[#5f7c82] ${className}`}
    >
      {children}
    </span>
  );
}

function addedCount(user: SessionUser, hasPregnancyStart: boolean) {
  return [
    Boolean((user.preferredName || user.name).trim()),
    hasPregnancyStart,
    Boolean(user.babyGender),
  ].filter(Boolean).length;
}

const pregnancyStartButtonClass =
  "inline-flex h-11 shrink-0 items-center gap-1.5 rounded-full bg-peach px-4 text-sm font-semibold text-[#4a3428] shadow-sm transition hover:bg-[#e9a67a]";

function PregnancyStartLink({ hasValue }: { hasValue: boolean }) {
  return (
    <Link href="/delivery-date-calculator" className={pregnancyStartButtonClass}>
      {hasValue ? "Update" : "Add"}
      <span aria-hidden="true">→</span>
    </Link>
  );
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

function PersonIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
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
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <rect
        x="4"
        y="5.5"
        width="16"
        height="14.5"
        rx="2.2"
        stroke="currentColor"
        strokeWidth="1.7"
      />
      <path
        d="M8 4v3.2M16 4v3.2M4 10.2h16"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
    </svg>
  );
}

function BabyIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
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

function PencilIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M4.5 19.5h3.6L18.8 8.8a1.8 1.8 0 0 0 0-2.5l-1.1-1.1a1.8 1.8 0 0 0-2.5 0L4.5 15.9v3.6Z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
      <path
        d="M13.2 6.8l3.5 3.5"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
    </svg>
  );
}

function ChevronIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
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
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M7 7l10 10M17 7 7 17"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}
