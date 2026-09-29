import type { Metadata } from "next";
import { COMMON_CONCERNS } from "@/lib/common-concerns";

export const metadata: Metadata = {
  title: "সাধারণ সমস্যা ও সমাধান",
  description:
    "গর্ভাবস্থার সাধারণ অস্বস্তির জন্য ঘরোয়া আরামের কথা। এটি চিকিৎসা নয় এবং ডাক্তারের পরামর্শের বিকল্প নয়।",
};

export default function CommonConcernsPage() {
  return (
    <article className="mx-auto max-w-2xl space-y-4">
      <header className="rounded-[2rem] border border-rose-100 bg-white p-6 shadow-sm sm:p-8">
        <p className="font-bn text-sm font-semibold text-rose-700">গর্ভাবস্থা সম্পর্কে জানুন</p>
        <h1 className="font-bn! mt-3 text-3xl font-semibold tracking-tight text-rose-950">
          সাধারণ সমস্যা ও সমাধান
        </h1>
        <p className="font-bn! mt-3 text-sm leading-7 text-rose-900/75">
          এখানে গর্ভাবস্থায় অনেক মা যেসব অস্বস্তি বলেন, সেগুলোর সাধারণ আরামের কথা আছে। এটি
          রোগনির্ণয় বা চিকিৎসা নয়। ওষুধ বা পরীক্ষার সিদ্ধান্ত আপনার চিকিৎসক নেবেন।
        </p>
      </header>

      {COMMON_CONCERNS.map((concern) => (
        <section
          key={concern.title}
          className="rounded-[2rem] border border-rose-100 bg-white p-6 shadow-sm sm:p-8"
        >
          <h2 className="font-bn! text-xl font-semibold text-rose-950">{concern.title}</h2>
          <p className="font-bn! mt-3 text-sm leading-7 text-rose-900/80">{concern.summary}</p>
          <h3 className="font-bn! mt-5 text-base font-semibold text-rose-950">যা আরাম দিতে পারে</h3>
          <ul className="font-bn! mt-2 space-y-2 text-sm leading-7 text-rose-900/80">
            {concern.comfort.map((line) => (
              <li key={line} className="flex gap-2">
                <span aria-hidden="true">•</span>
                <span>{line}</span>
              </li>
            ))}
          </ul>
          <p className="font-bn! mt-4 rounded-2xl bg-rose-50 px-4 py-3 text-sm leading-7 text-rose-900">
            {concern.seekCare}
          </p>
        </section>
      ))}
    </article>
  );
}
