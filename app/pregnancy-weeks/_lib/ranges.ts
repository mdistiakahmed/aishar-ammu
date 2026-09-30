export type GuideTone = "rose" | "sage" | "lilac";

export type WeekRange = {
  slug: string;
  from: number;
  to: number;
  summary: string;
  /** Illustration stage, early cell through late pregnancy. */
  stage: number;
};

export type TrimesterGuide = {
  id: 1 | 2 | 3;
  tone: GuideTone;
  title: string;
  from: number;
  to: number;
  summary: string;
  ranges: WeekRange[];
};

export const TRIMESTERS: TrimesterGuide[] = [
  {
    id: 1,
    tone: "rose",
    title: "প্রথম ত্রৈমাসিক",
    from: 1,
    to: 12,
    summary:
      "এই সময়ে শিশুর মূল অঙ্গ-প্রত্যঙ্গের গঠন শুরু হয় এবং গর্ভাবস্থার প্রথম পরিবর্তনগুলো আপনার শরীরে অনুভূত হতে পারে।",
    ranges: [
      {
        slug: "1-4",
        from: 1,
        to: 4,
        stage: 0,
        summary: "গর্ভধারণ, ভ্রূণের প্রাথমিক বিকাশ এবং মায়ের শরীরে পরিবর্তনের শুরু।",
      },
      {
        slug: "5-8",
        from: 5,
        to: 8,
        stage: 1,
        summary: "হৃৎস্পন্দন শুরু, অঙ্গ-প্রত্যঙ্গের গঠন এবং গর্ভাবস্থার লক্ষণগুলো বাড়তে থাকে।",
      },
      {
        slug: "9-12",
        from: 9,
        to: 12,
        stage: 2,
        summary: "শিশুর প্রধান অঙ্গগুলোর বিকাশ এবং মায়ের শরীরে আরও স্পষ্ট পরিবর্তন।",
      },
    ],
  },
  {
    id: 2,
    tone: "sage",
    title: "দ্বিতীয় ত্রৈমাসিক",
    from: 13,
    to: 28,
    summary:
      "শিশু দ্রুত বৃদ্ধি পায়। অনেক মা এই সময়টাকে শরীরে একটু বেশি শক্তি ও স্বস্তির দিন বলে মনে করেন। এটি গর্ভাবস্থার একটি গুরুত্বপূর্ণ পর্যায়।",
    ranges: [
      {
        slug: "13-16",
        from: 13,
        to: 16,
        stage: 3,
        summary: "শিশুর হাত-পা আরও স্পষ্ট হয় এবং শরীরের গঠন এগোতে থাকে।",
      },
      {
        slug: "17-20",
        from: 17,
        to: 20,
        stage: 4,
        summary: "শিশু নড়াচড়া শুরু করতে পারে এবং মায়ের পেটে ধীরে ধীরে পরিবর্তন দেখা যায়।",
      },
      {
        slug: "21-24",
        from: 21,
        to: 24,
        stage: 5,
        summary: "শিশুর ওজন বাড়ে, আর ঘুম ও শ্রবণের বিকাশ এগোতে থাকে।",
      },
      {
        slug: "25-28",
        from: 25,
        to: 28,
        stage: 6,
        summary: "মস্তিষ্কের বিকাশ দ্রুত হয় এবং মায়ের শরীরে চাপ বাড়তে পারে।",
      },
    ],
  },
  {
    id: 3,
    tone: "lilac",
    title: "তৃতীয় ত্রৈমাসিক",
    from: 29,
    to: 40,
    summary:
      "এই সময়ে শিশুর ওজন দ্রুত বাড়ে এবং জন্মের জন্য প্রস্তুতি এগোয়। মায়ের শরীরে কিছু অস্বস্তি বাড়তে পারে। অনেকের জন্য এটি এই সময়ের পরিচিত অভিজ্ঞতা।",
    ranges: [
      {
        slug: "29-32",
        from: 29,
        to: 32,
        stage: 7,
        summary: "শিশুর চোখের বিকাশ এগোয় এবং মায়ের শ্বাস নিতে কষ্ট বা অস্বস্তি হতে পারে।",
      },
      {
        slug: "33-36",
        from: 33,
        to: 36,
        stage: 8,
        summary: "শিশুর বৃদ্ধি দ্রুত হয় এবং জন্মের প্রস্তুতি এগোতে থাকে।",
      },
      {
        slug: "37-40",
        from: 37,
        to: 40,
        stage: 9,
        summary: "শিশু জন্মের জন্য প্রায় প্রস্তুত, এবং জন্মের সময় একেবারে কাছাকাছি।",
      },
    ],
  },
];

export const TONE_CLASS: Record<
  GuideTone,
  { panel: string; title: string; muted: string; icon: string }
> = {
  rose: {
    panel: "bg-[#fff1f4]",
    title: "text-[#9d3350]",
    muted: "text-[#a85a6d]",
    icon: "bg-[#f8d0da]",
  },
  sage: {
    panel: "bg-[#f3f8f4]",
    title: "text-[#2c6848]",
    muted: "text-[#4d7a62]",
    icon: "bg-[#d5eadc]",
  },
  lilac: {
    panel: "bg-[#f6f3fb]",
    title: "text-[#5c457f]",
    muted: "text-[#7a6796]",
    icon: "bg-[#e4d8f2]",
  },
};

export function getRange(slug: string) {
  for (const trimester of TRIMESTERS) {
    const range = trimester.ranges.find((item) => item.slug === slug);
    if (range) return { range, trimester };
  }
  return null;
}

export function rangeForWeek(week: number) {
  for (const trimester of TRIMESTERS) {
    const range = trimester.ranges.find((item) => week >= item.from && week <= item.to);
    if (range) return { range, trimester };
  }
  return null;
}

export function allRangeParams() {
  return TRIMESTERS.flatMap((trimester) =>
    trimester.ranges.map((range) => ({ range: range.slug })),
  );
}

export function allWeekParams() {
  return TRIMESTERS.flatMap((trimester) =>
    trimester.ranges.flatMap((range) =>
      Array.from({ length: range.to - range.from + 1 }, (_, index) => ({
        range: range.slug,
        week: String(range.from + index),
      })),
    ),
  );
}

export function weekHref(week: number) {
  const found = rangeForWeek(week);
  if (!found) return "/pregnancy-weeks";
  return `/pregnancy-weeks/${found.range.slug}/${week}`;
}
