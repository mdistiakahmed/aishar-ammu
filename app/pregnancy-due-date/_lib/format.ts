const BN_DIGITS = "০১২৩৪৫৬৭৮৯";
const MONTHS = [
  "জানুয়ারি",
  "ফেব্রুয়ারি",
  "মার্চ",
  "এপ্রিল",
  "মে",
  "জুন",
  "জুলাই",
  "আগস্ট",
  "সেপ্টেম্বর",
  "অক্টোবর",
  "নভেম্বর",
  "ডিসেম্বর",
];
const WEEKDAYS = ["রবিবার", "সোমবার", "মঙ্গলবার", "বুধবার", "বৃহস্পতিবার", "শুক্রবার", "শনিবার"];

export function toBnDigits(value: number | string) {
  return String(value).replace(/\d/g, (digit) => BN_DIGITS[Number(digit)] ?? digit);
}

export function formatBnDate(iso: string) {
  const [year, month, day] = iso.split("-").map(Number);
  const monthName = MONTHS[month - 1] ?? "";
  return `${toBnDigits(day)} ${monthName} ${toBnDigits(year)}`;
}

export function formatBnWeekday(iso: string) {
  const [year, month, day] = iso.split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));
  return WEEKDAYS[date.getUTCDay()] ?? "";
}

export function formatWeekAndDay(weeks: number, days: number) {
  return `${toBnDigits(weeks)} সপ্তাহ ${toBnDigits(days)} দিন`;
}
