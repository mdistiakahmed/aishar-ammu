import type { Metadata } from "next";
import pregnancyWeekByWeek from "@/lib/pregnancy-week-by-week.json";

export const metadata: Metadata = {
  title: "সপ্তাহ অনুযায়ী গর্ভাবস্থা",
  description:
    "গর্ভাবস্থার প্রতি সপ্তাহে শিশু, শরীর ও দৈনন্দিন যত্নের সাধারণ পাঠ। চিকিৎসকের পরামর্শের বিকল্প নয়।",
};

const weeks = pregnancyWeekByWeek.data;

export default function PregnancyWeeksPage() {
  return (
    <article className="mx-auto max-w-2xl space-y-4">
      <header className="rounded-[2rem] border border-rose-100 bg-white p-6 shadow-sm sm:p-8">
        <p className="font-bn text-sm font-semibold text-rose-700">গর্ভাবস্থা সম্পর্কে জানুন</p>
        <h1 className="font-bn! mt-3 text-3xl font-semibold tracking-tight text-rose-950">
          সপ্তাহ অনুযায়ী গর্ভাবস্থা
        </h1>
        <p className="font-bn! mt-3 text-sm leading-7 text-rose-900/75">
          প্রথম থেকে চল্লিশতম সপ্তাহ পর্যন্ত সাধারণ পাঠ। প্রতিটি শরীর একরকম নয়। কোনো লক্ষণ নিয়ে
          চিন্তা হলে আপনার চিকিৎসক বা মিডওয়াইফের সঙ্গে কথা বলুন।
        </p>
        <nav aria-label="সপ্তাহ বেছে নিন" className="mt-5 flex gap-2 overflow-x-auto pb-1">
          {weeks.map((week) => (
            <a
              key={week.week}
              href={`#week-${week.week}`}
              className="font-bn inline-flex h-11 min-w-11 shrink-0 items-center justify-center rounded-xl border border-rose-100 bg-rose-50 px-3 text-sm font-semibold text-rose-900"
            >
              {toBnDigits(week.week)}
            </a>
          ))}
        </nav>
      </header>

      {weeks.map((week) => (
        <section
          key={week.week}
          id={`week-${week.week}`}
          className="scroll-mt-24 rounded-[2rem] border border-rose-100 bg-white p-6 shadow-sm sm:p-8"
        >
          <h2 className="font-bn! text-2xl font-semibold text-rose-950">
            সপ্তাহ {toBnDigits(week.week)}
          </h2>
          <WeekBlock title="শিশুর দিক" lines={week.yourBaby} />
          <WeekBlock title="মায়ের শরীর" lines={week.yourBody} />
          <WeekBlock title="এই সপ্তাহে যা মনে রাখতে পারেন" lines={week.suggestionsThisWeek} />
        </section>
      ))}
    </article>
  );
}

function WeekBlock({ title, lines }: { title: string; lines: string[] }) {
  return (
    <div className="mt-5">
      <h3 className="font-bn! text-base font-semibold text-rose-800">{title}</h3>
      <ul className="font-bn! mt-2 space-y-2 text-sm leading-7 text-rose-900/80">
        {lines.map((line) => (
          <li key={line} className="flex gap-2">
            <span aria-hidden="true">•</span>
            <span>{line}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function toBnDigits(value: number) {
  return String(value).replace(/\d/g, (digit) => "০১২৩৪৫৬৭৮৯"[Number(digit)] ?? digit);
}
