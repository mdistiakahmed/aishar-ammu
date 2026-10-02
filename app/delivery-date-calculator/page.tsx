import type { Metadata } from "next";
import Link from "next/link";
import { DueDateCalculator } from "@/app/delivery-date-calculator/DueDateCalculator";

export const metadata: Metadata = {
  title: "Delivery Date Calculator",
  description:
    "শেষ পিরিয়ড বা আল্ট্রাসাউন্ডের তারিখ থেকে সম্ভাব্য প্রসবের তারিখের একটি সাধারণ হিসাব। চিকিৎসকের তারিখের বদলি নয়।",
};

export default function PregnancyDueDatePage() {
  return (
    <article className="space-y-5">
      <nav
        aria-label="ব্রেডক্রাম্ব"
        className="font-bn text-sm text-rose-900/55"
      >
        <ol className="flex flex-wrap items-center gap-x-1.5 gap-y-1">
          <li>
            <Link
              href="/"
              className="inline-flex min-h-11 items-center hover:text-rose-800"
            >
              Home
            </Link>
          </li>
          <li aria-hidden="true" className="text-rose-300">
            ›
          </li>
          <li className="inline-flex min-h-11 items-center">
            Learn about Pregnancy
          </li>
          <li aria-hidden="true" className="text-rose-300">
            ›
          </li>
          <li className="font-semibold text-rose-950">
            Delivery Date Calculator
          </li>
        </ol>
      </nav>

      <header className="overflow-hidden rounded-[1.75rem] border border-rose-100 bg-[#fff6f8] px-5 py-6 sm:px-8 sm:py-7">
        <div className="grid items-center gap-2 sm:grid-cols-[minmax(0,1fr)_14rem] sm:gap-6">
          <div>
            <h1 className="font-bn! text-[1.65rem] font-bold leading-tight tracking-tight text-[#7a2340] sm:text-4xl">
              Delivery Date Calculator
            </h1>
            <p className="font-bn mt-3 max-w-xl text-sm leading-7 text-rose-950/75 sm:text-[15px]">
              আপনার শেষ period এর তারিখ বা আল্ট্রাসাউন্ডের তারিখ দিয়ে একটি
              সম্ভাব্য প্রসবের তারিখ বের করে নিন। এটি সাধারণ হিসাব, আপনার
              চিকিৎসকের তারিখের বিকল্প নয়।
            </p>
          </div>
          <div
            className="flex items-end justify-center gap-1 mr-4"
            aria-hidden="true"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/baby-fingers.png"
              alt=""
              className="h-24 w-20 object-contain sm:h-32 sm:w-24"
            />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/baby-toe.png"
              alt=""
              className="h-24 w-20 object-contain sm:h-32 sm:w-24"
            />
          </div>
        </div>
      </header>

      <DueDateCalculator />

      <section className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_18rem] lg:items-start">
        <div>
          <h2 className="font-bn! text-xl font-bold text-[#9d3350] sm:text-2xl">
            Delivery Date কীভাবে হিসাব করা হয়?
          </h2>
          <p className="font-bn mt-3 text-sm leading-7 text-rose-950/75">
            সাধারণ হিসাবে শেষ period এর প্রথম দিন ধরা হয়। সেই দিনের সঙ্গে ২৮০
            দিন (৪০ সপ্তাহ) যোগ হয়। একে নেগেলে&apos;র সূত্র (Naegele&apos;s
            rule) বলা হয়। মাসিক চক্র ২৮ দিনের চেয়ে লম্বা বা ছোট হলে চিকিৎসকের
            তারিখ একটু আলাদা হতে পারে।
          </p>
        </div>
        <aside className="rounded-2xl border border-emerald-100 bg-[#f4faf6] p-4">
          <p className="font-bn flex items-center gap-2 text-sm font-bold text-emerald-900">
            নেগেলে&apos;র সূত্র
          </p>
          <p className="font-bn mt-2 text-sm leading-6 text-emerald-950/80">
            শেষ period এর প্রথম দিন + ২৮০ দিন = সম্ভাব্য Delivery Date
          </p>
        </aside>
      </section>

      <section className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_18rem] lg:items-start">
        <div>
          <h2 className="font-bn! text-xl font-bold text-[#9d3350] sm:text-2xl">
            শেষ period এর তারিখ দিয়ে কীভাবে হিসাব করা হয়?
          </h2>
          <ol className="mt-4 space-y-3">
            {[
              ["১", "শেষ period এর প্রথম তারিখ নিন।"],
              ["২", "সেই তারিখের সঙ্গে ২৮০ দিন যোগ করুন।"],
              ["৩", "যে তারিখ পাবেন, সেটিই একটি সম্ভাব্য Delivery Date।"],
            ].map(([number, step]) => (
              <li key={number} className="flex gap-3">
                <span className="font-bn inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-rose-100 text-sm font-bold text-[#c2255c]">
                  {number}
                </span>
                <span className="font-bn text-sm leading-7 text-rose-950/80">
                  {step}
                </span>
              </li>
            ))}
          </ol>
        </div>
        <aside className="rounded-2xl border border-emerald-100 bg-[#f4faf6] p-4">
          <p className="font-bn flex items-center gap-2 text-sm font-bold text-emerald-900">
            Period cycle ২৮ দিনের বেশি বা কম হলে কী হয়?
          </p>
          <p className="font-bn mt-2 text-sm leading-6 text-emerald-950/80">
            তারিখ কিছুটা আগে বা পরে সরে যেতে পারে। সন্দেহ থাকলে এই হিসাব
            চিকিৎসকের তারিখের সঙ্গে মিলিয়ে নিন। নিজে থেকে চিকিৎসার সিদ্ধান্ত
            নেবেন না।
          </p>
        </aside>
      </section>

      <div className="grid gap-4 lg:grid-cols-2">
        <section className="rounded-[1.35rem] border border-rose-100 bg-white p-5 shadow-sm">
          <h2 className="font-bn! text-lg font-bold text-rose-950">
            আল্ট্রাসাউন্ড ও এই হিসাবের তারিখ আলাদা হলে?
          </h2>
          <p className="font-bn mt-3 text-sm leading-7 text-rose-950/75">
            আল্ট্রাসাউন্ডের রিপোর্টে আলাদা একটি সম্ভাব্য তারিখ থাকতে পারে। বিশেষ
            করে প্রথমদিকের স্ক্যান তারিখ মেলাতে সাহায্য করে। দুই তারিখ না মিললে
            কোনটি ধরবেন, সেটি আপনার চিকিৎসক বলবেন।
          </p>
        </section>
        <section className="flex flex-col items-center gap-4 rounded-[1.35rem] border border-rose-100 bg-white p-5 shadow-sm sm:flex-row sm:items-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/doctor.png"
            alt=""
            className="h-28 w-28 shrink-0 rounded-3xl object-cover object-top sm:h-36 sm:w-32"
          />
          <div className="min-w-0 flex-1">
            <h2 className="font-bn! text-lg font-bold text-rose-950">
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
          </div>
        </section>
      </div>
    </article>
  );
}
