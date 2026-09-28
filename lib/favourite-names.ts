import { isListedBabyNameId } from "@/lib/baby-names";

const STORAGE_PREFIX = "aishar-favourite-names:";

export function favouriteNamesKey(userId: string) {
  return `${STORAGE_PREFIX}${userId}`;
}

export function readFavouriteNameIds(userId: string) {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(favouriteNamesKey(userId));
    if (!raw) return [];
    return parseNameIds(JSON.parse(raw));
  } catch {
    return [];
  }
}

export function toggleFavouriteNameId(userId: string, nameId: string) {
  if (!isListedBabyNameId(nameId)) return readFavouriteNameIds(userId);
  const current = readFavouriteNameIds(userId);
  const next = current.includes(nameId)
    ? current.filter((id) => id !== nameId)
    : [...current, nameId];
  return writeFavouriteNameIds(userId, next);
}

function writeFavouriteNameIds(userId: string, nameIds: string[]) {
  const unique = [...new Set(nameIds.filter((id) => isListedBabyNameId(id)))].sort((a, b) =>
    a.localeCompare(b),
  );
  window.localStorage.setItem(favouriteNamesKey(userId), JSON.stringify(unique));
  return unique;
}

function parseNameIds(value: unknown) {
  if (!Array.isArray(value)) return [];
  return value.filter((id): id is string => typeof id === "string" && isListedBabyNameId(id));
}
