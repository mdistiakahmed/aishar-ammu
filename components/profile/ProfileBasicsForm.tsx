"use client";

import { useState } from "react";
import { useAuth } from "@/components/auth/AuthProvider";
import { ProfileStatus } from "@/components/profile/ProfileStatus";
import { api, type MeResponse } from "@/lib/api-client";
import type { SessionUser } from "@/lib/user";
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
    <form action={onSubmit} className={compact ? "space-y-3" : "space-y-5"}>
      <ProfileStatus saved={saved} error={error} />
      <TextField
        id={`${idPrefix}-preferred-name`}
        name="preferredName"
        label="Preferred name"
        defaultValue={user.preferredName || user.name}
        required
      />
      <DateField
        id={`${idPrefix}-pregnancy-start`}
        name="pregnancyStartDate"
        label="Pregnancy start"
        defaultValue={user.pregnancyStartDate}
        required
      />
      <DateField
        id={`${idPrefix}-due-date`}
        name="dueDate"
        label="Due date"
        defaultValue={user.dueDate}
        required
      />
      <DateField
        id={`${idPrefix}-doctor-visit`}
        name="nextDoctorVisitDate"
        label="Next doctor visit"
        defaultValue={user.nextDoctorVisitDate}
      />
      <WeightField
        id={`${idPrefix}-weight-start`}
        name="weightAtStartKg"
        label="Weight at start (kg)"
        defaultValue={user.weightAtStartKg}
        required
      />
      <WeightField
        id={`${idPrefix}-weight-today`}
        name="weightTodayKg"
        label="Weight as of today (kg)"
        defaultValue={weightTodayKg}
      />
      <button
        type="submit"
        disabled={pending}
        className="inline-flex h-12 w-full items-center justify-center rounded-full bg-rose-700 text-sm font-semibold text-white shadow-sm hover:bg-rose-800 disabled:opacity-70"
      >
        {pending ? "Saving…" : "Save profile"}
      </button>
    </form>
  );
}

function TextField({
  id,
  name,
  label,
  defaultValue,
  required = false,
}: {
  id: string;
  name: string;
  label: string;
  defaultValue: string;
  required?: boolean;
}) {
  return (
    <label htmlFor={id} className="block">
      <span className="text-sm font-semibold text-rose-950">{label}</span>
      <input
        id={id}
        name={name}
        type="text"
        maxLength={40}
        defaultValue={defaultValue}
        required={required}
        className="mt-2 h-12 w-full rounded-2xl border border-rose-200 bg-petal px-4 text-sm text-rose-950 outline-none focus:border-rose-400"
      />
    </label>
  );
}

function DateField({
  id,
  name,
  label,
  defaultValue,
  required = false,
}: {
  id: string;
  name: string;
  label: string;
  defaultValue: string | null;
  required?: boolean;
}) {
  return (
    <label htmlFor={id} className="block">
      <span className="text-sm font-semibold text-rose-950">{label}</span>
      <input
        id={id}
        name={name}
        type="date"
        defaultValue={defaultValue ?? ""}
        required={required}
        className="mt-2 h-12 w-full rounded-2xl border border-rose-200 bg-petal px-4 text-sm text-rose-950 outline-none focus:border-rose-400"
      />
    </label>
  );
}

function WeightField({
  id,
  name,
  label,
  defaultValue,
  required = false,
}: {
  id: string;
  name: string;
  label: string;
  defaultValue: number | null;
  required?: boolean;
}) {
  return (
    <label htmlFor={id} className="block">
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
        required={required}
        className="mt-2 h-12 w-full rounded-2xl border border-rose-200 bg-petal px-4 text-sm text-rose-950 outline-none focus:border-rose-400"
      />
    </label>
  );
}
