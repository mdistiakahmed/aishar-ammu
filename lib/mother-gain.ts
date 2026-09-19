import { daysBetween } from "@/lib/pregnancy";
import type { WeightLog } from "@/lib/weights";

export type GainPoint = {
  day: number;
  expected: number;
  actual: number | null;
  projected: number | null;
};

export function expectedMaternalGainKg(day: number) {
  const week = Math.max(0, day) / 7;
  if (week <= 13) return Math.round(((1.5 * week) / 13) * 10) / 10;
  return Math.round((1.5 + (week - 13) * 0.4) * 10) / 10;
}

export function buildMotherGainSeries(input: {
  startDate: string;
  startWeightKg: number | null;
  logs: WeightLog[];
  today: string;
}) {
  const startWeight = input.startWeightKg;
  const todayDay = Math.max(0, daysBetween(input.startDate, input.today));
  const points: GainPoint[] = [];

  if (startWeight === null) {
    for (let day = 0; day <= todayDay; day += 1) {
      points.push({ day, expected: expectedMaternalGainKg(day), actual: null, projected: null });
    }
    return points;
  }

  const logged = [...input.logs]
    .map((log) => ({
      day: Math.max(0, daysBetween(input.startDate, log.loggedOn)),
      gain: Math.round((log.weightKg - startWeight) * 10) / 10,
    }))
    .sort((a, b) => a.day - b.day);

  const lastLogDay = logged.length ? logged[logged.length - 1].day : 0;
  const endDay = Math.max(todayDay, lastLogDay);

  for (let day = 0; day <= endDay; day += 1) {
    const expected = expectedMaternalGainKg(day);
    const actual = day <= lastLogDay && logged.length ? interpolateGain(logged, day) : null;
    const projected =
      logged.length && day > lastLogDay && day <= todayDay
        ? projectGain(logged, day)
        : null;
    points.push({ day, expected, actual, projected });
  }

  return points;
}

function interpolateGain(logged: { day: number; gain: number }[], day: number) {
  if (day <= logged[0].day) return logged[0].gain;
  const last = logged[logged.length - 1];
  if (day >= last.day) return last.gain;

  let prev = logged[0];
  for (const next of logged) {
    if (next.day === day) return next.gain;
    if (next.day > day) {
      const span = next.day - prev.day;
      if (span <= 0) return next.gain;
      return Math.round((prev.gain + ((day - prev.day) / span) * (next.gain - prev.gain)) * 10) / 10;
    }
    prev = next;
  }
  return last.gain;
}

function projectGain(logged: { day: number; gain: number }[], day: number) {
  const last = logged[logged.length - 1];
  if (logged.length < 2) return last.gain;
  const prev = logged[logged.length - 2];
  const span = last.day - prev.day;
  const slope = span > 0 ? (last.gain - prev.gain) / span : 0;
  return Math.round((last.gain + slope * (day - last.day)) * 10) / 10;
}
