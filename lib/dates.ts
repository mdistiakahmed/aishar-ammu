const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

export function parseOptionalDate(value: unknown) {
  const raw = String(value ?? "").trim();
  if (!raw) return null;
  if (!DATE_PATTERN.test(raw)) return null;

  const [year, month, day] = raw.split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));
  if (
    date.getUTCFullYear() !== year ||
    date.getUTCMonth() !== month - 1 ||
    date.getUTCDate() !== day
  ) {
    return null;
  }

  return raw;
}

export function formatCareDate(value: string | null) {
  if (!value) return "Not saved yet";
  const [year, month, day] = value.split("-").map(Number);
  return new Intl.DateTimeFormat("en", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(Date.UTC(year, month - 1, day)));
}
