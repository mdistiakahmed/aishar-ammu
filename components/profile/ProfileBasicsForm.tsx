"use client";

import { useState } from "react";
import { useAuth } from "@/components/auth/AuthProvider";
import { ProfileStatus } from "@/components/profile/ProfileStatus";
import { api, type MeResponse } from "@/lib/api-client";
import type { BabyGender, SessionUser } from "@/lib/user";
import { formatWeightInput } from "@/lib/weights";

export function ProfileBasicsForm({
  user,
  idPrefix,
  compact = false,
  weightTodayKg = null,
}: {
  user: SessionUser;
  idPrefix: string;
  compact?: boolean;
  weightTodayKg?: number | null;
}) {
  const { setMe, logout } = useAuth();
  const [saved, setSaved] = useState<string>();
  const [error, setError] = useState<string>();
  const [pending, setPending] = useState(false);

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
  }

  return (
    <form action={onSubmit} className={`min-w-0 ${compact ? "space-y-2.5" : "space-y-5"}`}>
      <ProfileStatus saved={saved} error={error} />
      <TextField
        id={`${idPrefix}-preferred-name`}
        name="preferredName"
        label="Preferred name"
        defaultValue={user.preferredName || user.name}
        compact={compact}
      />
      <DateField
        id={`${idPrefix}-pregnancy-start`}
        name="pregnancyStartDate"
        label="Pregnancy start"
        defaultValue={user.pregnancyStartDate}
        compact={compact}
      />
      <DateField
        id={`${idPrefix}-due-date`}
        name="dueDate"
        label="Due date"
        defaultValue={user.dueDate}
        compact={compact}
      />
      <DateField
        id={`${idPrefix}-doctor-visit`}
        name="nextDoctorVisitDate"
        label="Next doctor visit"
        defaultValue={user.nextDoctorVisitDate}
        compact={compact}
      />
      <GenderField
        id={`${idPrefix}-baby-gender`}
        name="babyGender"
        label="Baby gender"
        defaultValue={user.babyGender}
        compact={compact}
      />
      <WeightField
        id={`${idPrefix}-weight-start`}
        name="weightAtStartKg"
        label="Weight at start (kg)"
        defaultValue={user.weightAtStartKg}
        compact={compact}
      />
      <WeightField
        id={`${idPrefix}-weight-today`}
        name="weightTodayKg"
        label="Weight as of today (kg)"
        defaultValue={weightTodayKg}
        compact={compact}
      />
      <button
        type="submit"
        disabled={pending}
        className={`inline-flex w-full items-center justify-center rounded-full bg-rose-700 text-sm font-semibold text-white shadow-sm hover:bg-rose-800 disabled:opacity-70 ${
          compact ? "h-10" : "h-11 sm:h-12"
        }`}
      >
        {pending ? "Saving…" : "Save profile"}
      </button>
    </form>
  );
}

function fieldClass(compact: boolean) {
  return compact
    ? "mt-1.5 box-border h-10 w-full min-w-0 max-w-full rounded-xl border border-rose-200 bg-petal px-2.5 text-sm text-rose-950 outline-none focus:border-rose-400"
    : "mt-2 box-border h-11 w-full min-w-0 max-w-full rounded-2xl border border-rose-200 bg-petal px-3 text-sm text-rose-950 outline-none focus:border-rose-400 sm:h-12 sm:px-4";
}

function TextField({
  id,
  name,
  label,
  defaultValue,
  compact,
}: {
  id: string;
  name: string;
  label: string;
  defaultValue: string;
  compact: boolean;
}) {
  return (
    <label htmlFor={id} className="block min-w-0">
      <span className="text-sm font-semibold text-rose-950">{label}</span>
      <input
        id={id}
        name={name}
        type="text"
        maxLength={40}
        defaultValue={defaultValue}
        className={fieldClass(compact)}
      />
    </label>
  );
}

function DateField({
  id,
  name,
  label,
  defaultValue,
  compact,
}: {
  id: string;
  name: string;
  label: string;
  defaultValue: string | null;
  compact: boolean;
}) {
  return (
    <label htmlFor={id} className="block min-w-0">
      <span className="text-sm font-semibold text-rose-950">{label}</span>
      <input
        id={id}
        name={name}
        type="date"
        defaultValue={defaultValue ?? ""}
        className={`${fieldClass(compact)} appearance-none`}
      />
    </label>
  );
}

function GenderField({
  id,
  name,
  label,
  defaultValue,
  compact,
}: {
  id: string;
  name: string;
  label: string;
  defaultValue: BabyGender | null;
  compact: boolean;
}) {
  return (
    <label htmlFor={id} className="block min-w-0">
      <span className="text-sm font-semibold text-rose-950">{label}</span>
      <select
        id={id}
        name={name}
        defaultValue={defaultValue ?? ""}
        className={fieldClass(compact)}
      >
        <option value="">Not set</option>
        <option value="girl">Girl</option>
        <option value="boy">Boy</option>
        <option value="unknown">Not known yet</option>
      </select>
    </label>
  );
}

function WeightField({
  id,
  name,
  label,
  defaultValue,
  compact,
}: {
  id: string;
  name: string;
  label: string;
  defaultValue: number | null;
  compact: boolean;
}) {
  return (
    <label htmlFor={id} className="block min-w-0">
      <span className="text-sm font-semibold text-rose-950">{label}</span>
      <input
        id={id}
        name={name}
        type="number"
        inputMode="decimal"
        min={30}
        max={180}
        step={0.1}
        defaultValue={formatWeightInput(defaultValue)}
        className={fieldClass(compact)}
      />
    </label>
  );
}
