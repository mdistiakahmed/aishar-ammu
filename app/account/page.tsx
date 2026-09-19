"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/auth/AuthProvider";
import { ProfileBasicsForm } from "@/components/profile/ProfileBasicsForm";
import { ProfileStatus } from "@/components/profile/ProfileStatus";
import { api } from "@/lib/api-client";
import { utcToday } from "@/lib/pregnancy";
import { weightOnDate, type WeightLog } from "@/lib/weights";

export default function AccountPage() {
  const { user, logs, refresh, logout } = useAuth();
  const router = useRouter();
  const [status, setStatus] = useState<{ saved?: string; error?: string }>({});

  useEffect(() => {
    if (!user) router.replace("/login");
  }, [router, user]);

  if (!user) return null;

  async function upsertLog(formData: FormData) {
    setStatus({});
    const result = await api<{ logs: WeightLog[] }>("/api/weights", {
      method: "PUT",
      body: JSON.stringify({
        loggedOn: formData.get("loggedOn"),
        weightKg: formData.get("weightKg"),
      }),
    });
    if (!result.ok) {
      if (result.status === 401) {
        await logout();
        return;
      }
      setStatus({ error: result.error });
      return;
    }
    await refresh();
    setStatus({ saved: "1" });
  }

  async function deleteLog(formData: FormData) {
    setStatus({});
    const loggedOn = String(formData.get("loggedOn") ?? "");
    const result = await api<{ logs: WeightLog[] }>(
      `/api/weights?loggedOn=${encodeURIComponent(loggedOn)}`,
      { method: "DELETE" },
    );
    if (!result.ok) {
      if (result.status === 401) {
        await logout();
        return;
      }
      setStatus({ error: result.error });
      return;
    }
    await refresh();
    setStatus({ saved: "1" });
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <section className="rounded-[2rem] border border-rose-100 bg-white p-6 shadow-sm sm:p-8">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-rose-700">Signed in</p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-rose-950">Your profile</h1>
        <div className="mt-5 flex items-center gap-3">
          {user.picture ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={user.picture}
              alt=""
              className="h-12 w-12 rounded-full border border-rose-100 object-cover"
              referrerPolicy="no-referrer"
            />
          ) : null}
          <div className="min-w-0">
            <p className="truncate font-semibold text-rose-950">{user.preferredName || user.name}</p>
            <p className="truncate text-sm text-rose-800/80">{user.email}</p>
          </div>
        </div>
      </section>

      <section className="rounded-[2rem] border border-rose-100 bg-white p-6 shadow-sm sm:p-8">
        <h2 className="text-xl font-semibold text-rose-950">Care details</h2>
        <p className="mt-2 text-sm leading-6 text-rose-900/75">
          Weight must be between 30 kg and 180 kg. This is a personal record, not medical advice.
        </p>
        <div className="mt-6">
          <ProfileBasicsForm
            user={user}
            idPrefix="account"
            weightTodayKg={weightOnDate(logs, utcToday())}
          />
        </div>
      </section>

      <section className="rounded-[2rem] border border-rose-100 bg-white p-6 shadow-sm sm:p-8">
        <h2 className="text-xl font-semibold text-rose-950">Weight history</h2>
        <p className="mt-2 text-sm leading-6 text-rose-900/75">
          Add or change past days. Dates should fall between your start date and today.
        </p>
        <div className="mt-5">
          <ProfileStatus saved={status.saved} error={status.error} />
        </div>

        <form action={upsertLog} className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-[1fr_8rem_auto]">
          <label className="block">
            <span className="text-sm font-semibold text-rose-950">Date</span>
            <input
              name="loggedOn"
              type="date"
              required
              className="mt-2 h-12 w-full rounded-2xl border border-rose-200 bg-petal px-4 text-sm text-rose-950 outline-none focus:border-rose-400"
            />
          </label>
          <label className="block">
            <span className="text-sm font-semibold text-rose-950">Weight (kg)</span>
            <input
              name="weightKg"
              type="number"
              inputMode="decimal"
              min={30}
              max={180}
              step={0.1}
              required
              className="mt-2 h-12 w-full rounded-2xl border border-rose-200 bg-petal px-4 text-sm text-rose-950 outline-none focus:border-rose-400"
            />
          </label>
          <button
            type="submit"
            className="inline-flex h-12 items-center justify-center self-end rounded-full bg-sage px-5 text-sm font-semibold text-white hover:bg-sage-dark"
          >
            Add or update
          </button>
        </form>

        {logs.length === 0 ? (
          <p className="mt-5 text-sm leading-6 text-rose-900/70">No weight days saved yet.</p>
        ) : (
          <ul className="mt-6 space-y-3">
            {logs.map((log) => (
              <li
                key={log.loggedOn}
                className="flex flex-col gap-3 rounded-2xl border border-rose-100 bg-petal p-3 sm:flex-row sm:items-end"
              >
                <form action={upsertLog} className="grid flex-1 grid-cols-1 gap-3 sm:grid-cols-2">
                  <input type="hidden" name="loggedOn" value={log.loggedOn} />
                  <label className="block">
                    <span className="text-sm font-semibold text-rose-950">Date</span>
                    <input
                      type="date"
                      value={log.loggedOn}
                      readOnly
                      className="mt-2 h-12 w-full rounded-2xl border border-rose-200 bg-white px-4 text-sm text-rose-950"
                    />
                  </label>
                  <label className="block">
                    <span className="text-sm font-semibold text-rose-950">Weight (kg)</span>
                    <input
                      name="weightKg"
                      type="number"
                      inputMode="decimal"
                      min={30}
                      max={180}
                      step={0.1}
                      defaultValue={log.weightKg}
                      className="mt-2 h-12 w-full rounded-2xl border border-rose-200 bg-white px-4 text-sm text-rose-950 outline-none focus:border-rose-400"
                    />
                  </label>
                  <button
                    type="submit"
                    className="inline-flex h-12 items-center justify-center rounded-full border border-rose-200 bg-white text-sm font-semibold text-rose-800 hover:bg-rose-50 sm:col-span-2"
                  >
                    Save day
                  </button>
                </form>
                <form action={deleteLog}>
                  <input type="hidden" name="loggedOn" value={log.loggedOn} />
                  <button
                    type="submit"
                    className="inline-flex h-12 w-full items-center justify-center rounded-full px-4 text-sm font-semibold text-rose-800 hover:bg-rose-100 sm:w-auto"
                  >
                    Delete
                  </button>
                </form>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
