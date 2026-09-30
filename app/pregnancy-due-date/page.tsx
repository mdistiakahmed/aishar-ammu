import type { Metadata } from "next";
import Link from "next/link";
import { ExpectingIllustration } from "@/app/pregnancy-weeks/_lib/illustrations";
import { DueDateCalculator } from "@/app/pregnancy-due-date/DueDateCalculator";

export const metadata: Metadata = {
  title: "গর্ভাবস্থার সম্ভাব্য প্রসবের তারিখ",
  description:
    "শেষ মাসিক বা আল্ট্রাসাউন্ডের তারিখ থেকে সম্ভাব্য প্রসবের তারিখের একটি সাধারণ হিসাব। চিকিৎসকের তারিখের বদলি নয়।",
};

export default function PregnancyDueDatePage() {
  return (
    <article className="space-y-5">
      <nav aria-label="ব্রেডক্রাম্ব" className="font-bn text-sm text-rose-900/55">
        <ol className="flex flex-wrap items-center gap-x-1.5 gap-y-1">
          <li>
            <Link href="/" className="inline-flex min-h-11 items-center hover:text-rose-800">
              হোম
            </Link>
          </li>
          <li aria-hidden="true" className="text-rose-300">
            ›
          </li>
          <li className="inline-flex min-h-11 items-center">গর্ভাবস্থা সম্পর্কে জানুন</li>
          <li aria-hidden="true" className="text-rose-300">
            ›
          </li>
          <li className="font-semibold text-rose-950">সম্ভাব্য প্রসবের তারিখ</li>
        </ol>
      </nav>

      <header className="overflow-hidden rounded-[1.75rem] border border-rose-100 bg-[#fff6f8] px-5 py-6 sm:px-8 sm:py-7">
        <div className="grid items-center gap-2 sm:grid-cols-[minmax(0,1fr)_14rem] sm:gap-6">
          <div>
            <h1 className="font-bn! text-[1.65rem] font-bold leading-tight tracking-tight text-[#7a2340] sm:text-4xl">
              গর্ভাবস্থার সম্ভাব্য প্রসবের তারিখ
            </h1>
            <p className="font-bn mt-3 max-w-xl text-sm leading-7 text-rose-950/75 sm:text-[15px]">
              আপনার শেষ মাসিকের তারিখ বা আল্ট্রাসাউন্ডের তারিখ দিয়ে একটি সম্ভাব্য প্রসবের তারিখ
              বের করে নিন। এটি সাধারণ পাঠ, আপনার চিকিৎসকের তারিখের বদলি নয়।
            </p>
          </div>
          <ExpectingIllustration className="mx-auto h-40 w-full max-w-60 sm:h-44 sm:max-w-none" />
        </div>
      </header>

      <DueDateCalculator />

      <section className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_18rem] lg:items-start">
        <div>
          <h2 className="font-bn! text-xl font-bold text-[#9d3350] sm:text-2xl">
            গর্ভাবস্থার সম্ভাব্য প্রসবের তারিখ কীভাবে হিসাব করা হয়?
          </h2>
          <p className="font-bn mt-3 text-sm leading-7 text-rose-950/75">
            সাধারণ হিসাবে শেষ মাসিকের প্রথম দিন এবং মাসিক চক্রের দৈর্ঘ্য ধরা হয়। ২৮ দিনের চক্রে শেষ
            মাসিকের প্রথম দিনের সঙ্গে ২৮০ দিন (৪০ সপ্তাহ) যোগ হয়। একে নেগেলে&apos;র সূত্র (Naegele&apos;s
            rule) বলা হয়। চক্র ২৮ দিনের চেয়ে লম্বা বা ছোট হলে তারিখ সেই পার্থক্য অনুযায়ী একটু
            এগোয় বা পিছোয়।
          </p>
        </div>
        <aside className="rounded-2xl border border-emerald-100 bg-[#f4faf6] p-4">
          <p className="font-bn flex items-center gap-2 text-sm font-bold text-emerald-900">
            <span aria-hidden="true">📅</span>
            নেগেলে&apos;র সূত্র
          </p>
          <p className="font-bn mt-2 text-sm leading-6 text-emerald-950/80">
            শেষ মাসিকের প্রথম দিন + ২৮০ দিন = সম্ভাব্য প্রসবের তারিখ
          </p>
        </aside>
      </section>

      <section className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_18rem] lg:items-start">
        <div>
          <h2 className="font-bn! text-xl font-bold text-[#9d3350] sm:text-2xl">
            শেষ মাসিকের তারিখ দিয়ে কীভাবে হিসাব করা হয়?
          </h2>
          <ol className="mt-4 space-y-3">
            {[
              ["১", "শেষ মাসিকের প্রথম তারিখ নিন।"],
              ["২", "সেই তারিখের সঙ্গে ২৮০ দিন যোগ করুন। চক্র ২৮ দিন না হলে পার্থক্য যোগ বা বিয়োগ হয়।"],
              ["৩", "যে তারিখ পাবেন, সেটিই একটি সম্ভাব্য প্রসবের তারিখ।"],
            ].map(([number, step]) => (
              <li key={number} className="flex gap-3">
                <span className="font-bn inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-rose-100 text-sm font-bold text-[#c2255c]">
                  {number}
                </span>
                <span className="font-bn text-sm leading-7 text-rose-950/80">{step}</span>
              </li>
            ))}
          </ol>
        </div>
        <aside className="rounded-2xl border border-emerald-100 bg-[#f4faf6] p-4">
          <p className="font-bn flex items-center gap-2 text-sm font-bold text-emerald-900">
            <span aria-hidden="true">✓</span>
            মাসিক চক্র ২৮ দিনের বেশি বা কম হলে কী হয়?
          </p>
          <p className="font-bn mt-2 text-sm leading-6 text-emerald-950/80">
            তারিখ কিছুটা আগে বা পরে সরে যেতে পারে। সন্দেহ থাকলে এই হিসাব চিকিৎসকের তারিখের সঙ্গে
            মিলিয়ে নিন। নিজে থেকে চিকিৎসার সিদ্ধান্ত নেবেন না।
          </p>
        </aside>
      </section>

      <div className="grid gap-4 lg:grid-cols-2">
        <section className="rounded-[1.35rem] border border-rose-100 bg-white p-5 shadow-sm">
          <h2 className="font-bn! text-lg font-bold text-rose-950">
            আল্ট্রাসাউন্ড ও এই হিসাবের তারিখ আলাদা হলে?
          </h2>
          <p className="font-bn mt-3 text-sm leading-7 text-rose-950/75">
            আল্ট্রাসাউন্ডের রিপোর্টে আলাদা একটি সম্ভাব্য তারিখ থাকতে পারে। বিশেষ করে প্রথমদিকের
            স্ক্যান তারিখ মেলাতে সাহায্য করে। দুই তারিখ না মিললে কোনটি ধরবেন, সেটি আপনার চিকিৎসক
            বলবেন।
          </p>
        </section>
        <section className="rounded-[1.35rem] border border-rose-100 bg-white p-5 shadow-sm">
          <h2 className="font-bn! flex items-center gap-2 text-lg font-bold text-rose-950">
            <span className="text-rose-400" aria-hidden="true">
              ♥
            </span>
            সুস্থ থাকার কিছু পরামর্শ
          </h2>
          <ul className="font-bn mt-3 space-y-2 text-sm leading-6 text-rose-950/80">
            {[
              "নিয়মিত প্রসবপূর্ব চেকআপ করুন।",
              "সুষম খাবার খান এবং পর্যাপ্ত পানি পান করুন।",
              "হালকা নড়াচড়া চিকিৎসকের পরামর্শে করতে পারেন।",
              "কোনো নতুন সমস্যা হলে দ্রুত চিকিৎসকের সঙ্গে যোগাযোগ করুন।",
            ].map((tip) => (
              <li key={tip} className="flex gap-2">
                <span className="text-emerald-600" aria-hidden="true">
                  ✓
                </span>
                <span>{tip}</span>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </article>
  );
}
