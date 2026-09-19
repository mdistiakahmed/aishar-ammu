export type BabySizeWeek = {
  week: number;
  produceName: string;
  imageName: string;
};

export const BABY_SIZE_WEEKS: BabySizeWeek[] = [
  { week: 1, produceName: "poppy seed", imageName: "week-01-poppy-seed.png" },
  { week: 2, produceName: "poppy seed", imageName: "week-02-poppy-seed.png" },
  { week: 3, produceName: "sesame seed", imageName: "week-03-sesame-seed.png" },
  { week: 4, produceName: "sesame seed", imageName: "week-04-sesame-seed.png" },
  { week: 5, produceName: "apple seed", imageName: "week-05-apple-seed.png" },
  { week: 6, produceName: "lentil", imageName: "week-06-lentil.png" },
  { week: 7, produceName: "blueberry", imageName: "week-07-blueberry.png" },
  { week: 8, produceName: "raspberry", imageName: "week-08-raspberry.png" },
  { week: 9, produceName: "grape", imageName: "week-09-grape.png" },
  { week: 10, produceName: "strawberry", imageName: "week-10-strawberry.png" },
  { week: 11, produceName: "fig", imageName: "week-11-fig.png" },
  { week: 12, produceName: "lime", imageName: "week-12-lime.png" },
  { week: 13, produceName: "pea pod", imageName: "week-13-pea-pod.png" },
  { week: 14, produceName: "lemon", imageName: "week-14-lemon.png" },
  { week: 15, produceName: "apple", imageName: "week-15-apple.png" },
  { week: 16, produceName: "avocado", imageName: "week-16-avocado.png" },
  { week: 17, produceName: "pear", imageName: "week-17-pear.png" },
  { week: 18, produceName: "bell pepper", imageName: "week-18-bell-pepper.png" },
  { week: 19, produceName: "mango", imageName: "week-19-mango.png" },
  { week: 20, produceName: "banana", imageName: "week-20-banana.png" },
  { week: 21, produceName: "carrot", imageName: "week-21-carrot.png" },
  { week: 22, produceName: "papaya", imageName: "week-22-papaya.png" },
  { week: 23, produceName: "grapefruit", imageName: "week-23-grapefruit.png" },
  { week: 24, produceName: "ear of corn", imageName: "week-24-corn.png" },
  { week: 25, produceName: "cauliflower", imageName: "week-25-cauliflower.png" },
  { week: 26, produceName: "spring onions", imageName: "week-26-spring-onions.png" },
  { week: 27, produceName: "cabbage", imageName: "week-27-cabbage.png" },
  { week: 28, produceName: "eggplant", imageName: "week-28-eggplant.png" },
  { week: 29, produceName: "butternut squash", imageName: "week-29-butternut-squash.png" },
  { week: 30, produceName: "coconut", imageName: "week-30-coconut.png" },
  { week: 31, produceName: "pineapple", imageName: "week-31-pineapple.png" },
  { week: 32, produceName: "squash", imageName: "week-32-squash.png" },
  { week: 33, produceName: "pineapple", imageName: "week-33-pineapple.png" },
  { week: 34, produceName: "cantaloupe", imageName: "week-34-cantaloupe.png" },
  { week: 35, produceName: "honeydew melon", imageName: "week-35-honeydew-melon.png" },
  { week: 36, produceName: "romaine lettuce", imageName: "week-36-romaine-lettuce.png" },
  { week: 37, produceName: "Swiss chard", imageName: "week-37-swiss-chard.png" },
  { week: 38, produceName: "leek", imageName: "week-38-leek.png" },
  { week: 39, produceName: "mini watermelon", imageName: "week-39-mini-watermelon.png" },
  { week: 40, produceName: "small pumpkin", imageName: "week-40-small-pumpkin.png" },
];

export function getBabySizeWeek(week: number): BabySizeWeek {
  const clamped = Math.min(40, Math.max(1, week));
  return BABY_SIZE_WEEKS[clamped - 1] ?? BABY_SIZE_WEEKS[0];
}

export function babySizeAge(elapsedWeek: number, elapsedDay: number) {
  const totalDays = Math.max(0, elapsedWeek) * 7 + Math.max(0, elapsedDay) + 1;
  return {
    week: Math.floor(totalDays / 7),
    day: totalDays % 7,
  };
}

export function formatBabyAge(week: number, day: number) {
  const weeksLabel = week === 1 ? "1 week" : `${week} weeks`;
  const daysLabel = day === 1 ? "1 day" : `${day} days`;
  return `${weeksLabel} and ${daysLabel}`;
}

export function produceWithArticle(produceName: string) {
  const first = produceName.trim().charAt(0).toLowerCase();
  return /^[aeiou]/.test(first) ? `an ${produceName}` : `a ${produceName}`;
}

export function babySizeImageSrc(imageName: string) {
  return `/baby-size/${imageName}`;
}
