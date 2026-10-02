import { parseOptionalDate } from "@/lib/dates";

const STORAGE_KEY = "aishar-delivery-date";

export type SavedDeliveryDate = {
  due: string;
  start: string;
  source: "calculated" | "doctor";
};

export function writeSavedDeliveryDate(value: SavedDeliveryDate) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(value));
}

export function readSavedDeliveryDate(): SavedDeliveryDate | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Record<string, unknown>;
    const due = parseOptionalDate(parsed.due);
    const start = parseOptionalDate(parsed.start);
    if (!due || !start) return null;
    return { due, start, source: parsed.source === "doctor" ? "doctor" : "calculated" };
  } catch {
    return null;
  }
}
