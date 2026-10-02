const EN_MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

/** 4:00–11:59 সকাল, 12:00–3:59 দুপুর, 4:00–5:59 বিকাল, 6:00–3:59 রাত. */
export function dayPartForHour(hour: number) {
  if (hour >= 4 && hour <= 11) return "সকাল";
  if (hour >= 12 && hour <= 15) return "দুপুর";
  if (hour >= 16 && hour <= 17) return "বিকাল";
  return "রাত";
}

/** 4:00–11:59 Good Morning, 12:00–6:59 Good Afternoon, 7:00–3:59 Good Evening. */
export function greetingForHour(hour: number) {
  if (hour >= 4 && hour <= 11) return "Good Morning";
  if (hour >= 12 && hour <= 18) return "Good Afternoon";
  return "Good Evening";
}

function englishOrdinal(day: number) {
  const mod100 = day % 100;
  if (mod100 >= 11 && mod100 <= 13) return `${day}th`;
  switch (day % 10) {
    case 1:
      return `${day}st`;
    case 2:
      return `${day}nd`;
    case 3:
      return `${day}rd`;
    default:
      return `${day}th`;
  }
}

/** `9th October, 2026 at 10:30AM (সকাল)`. Omit the clock when `time` is blank. */
export function formatEnglishVisit(year: number, month: number, day: number, time: string) {
  const dateLabel = `${englishOrdinal(day)} ${EN_MONTHS[month - 1]}, ${year}`;
  if (!time) return dateLabel;
  const [hourText, minute] = time.split(":");
  const hour = Number(hourText);
  const hour12 = hour % 12 || 12;
  const period = hour >= 12 ? "PM" : "AM";
  return `${dateLabel} at ${hour12}:${minute}${period} (${dayPartForHour(hour)})`;
}
