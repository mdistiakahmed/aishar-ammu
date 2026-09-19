"use client";

import Link from "next/link";
import { useState } from "react";
import { PanelCard } from "@/components/homepage/dashboard/PanelCard";

type MockShortlistName = {
  favouriteNameId: string;
  en: string;
  ar: string;
  bn: string;
};

const MOCK_R2_SHORTLIST: MockShortlistName[] = [
  { favouriteNameId: "a.json:nm_aisha_01", en: "Aisha", ar: "عائشة", bn: "আয়শা" },
  { favouriteNameId: "m.json:nm_maryam_01", en: "Maryam", ar: "مريم", bn: "মারইয়াম" },
  { favouriteNameId: "n.json:nm_noor_01", en: "Noor", ar: "نور", bn: "নূর" },
];

function mockFetchShortlistFromR2() {
  return new Promise<MockShortlistName[]>((resolve) => {
    setTimeout(() => resolve(MOCK_R2_SHORTLIST), 450);
  });
}

export function BabyNamesPanel() {
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState<"idle" | "loading" | "ready">("idle");
  const [names, setNames] = useState<MockShortlistName[]>([]);

  async function toggle() {
    const next = !open;
    setOpen(next);
    if (!next || status !== "idle") return;
    setStatus("loading");
    const rows = await mockFetchShortlistFromR2();
    setNames(rows);
    setStatus("ready");
  }

  return (
    <PanelCard eyebrow="Shortlist" title="Baby names" wide>
      <p className="mt-1 text-sm leading-6 text-rose-900/75">
        Open the list to load names from storage. This is a personal shortlist, not medical advice.
      </p>

      <button
        type="button"
        aria-expanded={open}
        onClick={() => void toggle()}
        className="mt-4 inline-flex h-12 w-full items-center justify-between rounded-2xl border border-rose-200 bg-petal px-4 text-sm font-semibold text-rose-800 hover:bg-rose-50"
      >
        <span>{open ? "Hide shortlist" : "Show shortlist"}</span>
        <span aria-hidden="true">{open ? "−" : "+"}</span>
      </button>

      {open ? (
        <div className="mt-4">
          {status === "loading" ? (
            <p className="text-sm text-rose-900/70">Loading shortlist…</p>
          ) : names.length === 0 ? (
            <p className="text-sm leading-6 text-rose-900/70">
              No names in your shortlist yet.{" "}
              <Link href="/baby-names" className="font-semibold text-rose-800 underline-offset-2 hover:underline">
                Browse baby names
              </Link>
              .
            </p>
          ) : (
            <ul className="space-y-2">
              {names.map((item) => (
                <li
                  key={item.favouriteNameId}
                  className="rounded-2xl border border-rose-100 bg-petal px-4 py-3 text-sm text-rose-950"
                >
                  <p className="font-semibold">{item.en}</p>
                  <p className="mt-1 text-rose-900/75">
                    {item.ar} · {item.bn}
                  </p>
                </li>
              ))}
            </ul>
          )}
          <Link
            href="/baby-names"
            className="mt-4 inline-flex h-11 items-center text-sm font-semibold text-rose-800 underline-offset-2 hover:underline"
          >
            Browse more names
          </Link>
        </div>
      ) : null}
    </PanelCard>
  );
}
