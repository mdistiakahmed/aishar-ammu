import pregnancyWeekByWeek from "@/lib/pregnancy-week-by-week.json";

export type PregnancyWeekGuide = {
  week: number;
  yourBaby: string[];
  yourBody: string[];
  suggestionsThisWeek: string[];
};

const weeks = pregnancyWeekByWeek.data as PregnancyWeekGuide[];

export function getWeekGuide(week: number) {
  return weeks.find((entry) => entry.week === week) ?? null;
}
