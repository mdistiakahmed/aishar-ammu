import type { Metadata } from "next";
import { MotherWeightTracker } from "./MotherWeightTracker";

export const metadata: Metadata = {
  title: "Mother Weight Tracker",
  description:
    "Track weekly mother weight against a typical educational curve in this browser.",
};

export default function MotherWeightPage() {
  return (
    <article className="mx-auto w-full max-w-4xl px-4 py-6 sm:px-6">
      {/* Page introduction */}
      <header className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
          গর্ভাবস্থায় মায়ের ওজন ট্র্যাকার
        </h1>

        <p className="mt-3 text-base leading-7 text-muted-foreground">
          গর্ভাবস্থার প্রতি সপ্তাহে আপনার ওজন লিখে রাখুন এবং সময়ের সঙ্গে ওজনের
          পরিবর্তন সহজেই পর্যবেক্ষণ করুন। আপনার ওজনের প্রকৃত পরিবর্তন এবং
          গর্ভাবস্থায় প্রত্যাশিত ওজন বৃদ্ধির একটি তুলনামূলক চিত্রও দেখতে
          পারবেন।
        </p>
      </header>

      {/* Weight tracker */}
      <MotherWeightTracker />

      {/* SEO Article */}
      <section className="mt-12 space-y-10">
        <section>
          <h2 className="text-2xl font-bold">
            গর্ভাবস্থায় ওজন বৃদ্ধি কেন গুরুত্বপূর্ণ?
          </h2>

          <p className="mt-4 leading-7 text-muted-foreground">
            গর্ভাবস্থায় মায়ের শরীরে স্বাভাবিকভাবেই বিভিন্ন পরিবর্তন ঘটে।
            গর্ভের শিশুর বৃদ্ধি, প্লাসেন্টা, অ্যামনিওটিক তরল, জরায়ুর আকার
            বৃদ্ধি এবং মায়ের শরীরে অতিরিক্ত রক্ত ও তরল তৈরির কারণে ধীরে ধীরে
            ওজন বাড়তে পারে। তাই গর্ভাবস্থায় কিছুটা ওজন বৃদ্ধি সাধারণত
            স্বাভাবিক এবং প্রত্যাশিত।
          </p>

          <p className="mt-4 leading-7 text-muted-foreground">
            তবে সবার ওজন একই হারে বাড়ে না। গর্ভাবস্থার আগে আপনার ওজন, উচ্চতা,
            BMI, গর্ভাবস্থার সময়কাল এবং আপনি একাধিক শিশুর মা হচ্ছেন কি না—এসব
            বিষয় ওজন বৃদ্ধির প্রয়োজনীয়তাকে প্রভাবিত করতে পারে।
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold">
            গর্ভাবস্থায় প্রতি সপ্তাহে কতটা ওজন বাড়তে পারে?
          </h2>

          <p className="mt-4 leading-7 text-muted-foreground">
            গর্ভাবস্থার শুরু থেকেই প্রতি সপ্তাহে একই পরিমাণ ওজন বাড়বে—এমন কোনো
            নিয়ম নেই। প্রথম ত্রৈমাসিকে অনেকের ওজন খুব কম বাড়তে পারে, আবার বমি
            বমি ভাব বা খাবারে অনীহার কারণে কারও ওজন কিছুটা কমতেও পারে। দ্বিতীয়
            ও তৃতীয় ত্রৈমাসিকে সাধারণত ওজন বৃদ্ধির হার তুলনামূলকভাবে বেশি হয়।
          </p>

          <p className="mt-4 leading-7 text-muted-foreground">
            তাই শুধু একটি সপ্তাহের ওজন দেখে সিদ্ধান্ত না নিয়ে কয়েক সপ্তাহের
            পরিবর্তন বা সামগ্রিক প্রবণতা দেখা বেশি কার্যকর। এই ওজন ট্র্যাকারটি
            সেই পরিবর্তনগুলো সহজে অনুসরণ করতে সাহায্য করে।
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold">
            গর্ভাবস্থায় কত ওজন বাড়ানো উচিত?
          </h2>

          <p className="mt-4 leading-7 text-muted-foreground">
            গর্ভাবস্থায় কতটা ওজন বৃদ্ধি উপযুক্ত তা মূলত গর্ভধারণের আগের BMI-এর
            ওপর নির্ভর করে। তাই সবার জন্য একই ওজন বৃদ্ধির লক্ষ্য প্রযোজ্য নয়।
          </p>

          <div className="mt-5 overflow-hidden rounded-2xl border">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[600px] text-sm">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="px-4 py-3 text-left font-semibold">
                      গর্ভধারণের আগের BMI
                    </th>
                    <th className="px-4 py-3 text-left font-semibold">
                      BMI-এর ধরন
                    </th>
                    <th className="px-4 py-3 text-left font-semibold">
                      এক শিশুর গর্ভাবস্থায় মোট ওজন বৃদ্ধির সাধারণ পরিসর
                    </th>
                  </tr>
                </thead>

                <tbody>
                  <tr className="border-b">
                    <td className="px-4 py-3">&lt; 18.5</td>
                    <td className="px-4 py-3">কম ওজন</td>
                    <td className="px-4 py-3">প্রায় 12.5–18 কেজি</td>
                  </tr>

                  <tr className="border-b">
                    <td className="px-4 py-3">18.5–24.9</td>
                    <td className="px-4 py-3">স্বাভাবিক ওজন</td>
                    <td className="px-4 py-3">প্রায় 11.5–16 কেজি</td>
                  </tr>

                  <tr className="border-b">
                    <td className="px-4 py-3">25–29.9</td>
                    <td className="px-4 py-3">অতিরিক্ত ওজন</td>
                    <td className="px-4 py-3">প্রায় 7–11.5 কেজি</td>
                  </tr>

                  <tr>
                    <td className="px-4 py-3">≥ 30</td>
                    <td className="px-4 py-3">স্থূলতা</td>
                    <td className="px-4 py-3">প্রায় 5–9 কেজি</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <p className="mt-4 text-sm leading-6 text-muted-foreground">
            এগুলো সাধারণ নির্দেশনা। আপনার ব্যক্তিগত পরিস্থিতি অনুযায়ী চিকিৎসক
            বা প্রসূতি বিশেষজ্ঞ ভিন্ন পরামর্শ দিতে পারেন।
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold">ওজন হঠাৎ বেড়ে গেলে কী করবেন?</h2>

          <p className="mt-4 leading-7 text-muted-foreground">
            এক সপ্তাহে সামান্য বেশি ওজন বাড়লেই সাধারণত আতঙ্কিত হওয়ার কারণ নেই।
            শরীরে পানি জমা, খাবার, দিনের সময় এবং পোশাকের কারণেও ওজনের কিছুটা
            ওঠানামা হতে পারে।
          </p>

          <p className="mt-4 leading-7 text-muted-foreground">
            তবে অল্প সময়ের মধ্যে অস্বাভাবিকভাবে ওজন বেড়ে যাওয়ার পাশাপাশি মুখ
            বা হাত হঠাৎ ফুলে যাওয়া, তীব্র মাথাব্যথা, চোখে ঝাপসা দেখা বা
            অন্যান্য অস্বাভাবিক উপসর্গ দেখা দিলে দ্রুত চিকিৎসকের সঙ্গে যোগাযোগ
            করা উচিত।
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold">ওজন কম বাড়লে কী করবেন?</h2>

          <p className="mt-4 leading-7 text-muted-foreground">
            গর্ভাবস্থার কোনো পর্যায়ে ওজন প্রত্যাশার তুলনায় কম বাড়ছে মনে হলে
            নিজে থেকে বেশি খাবার খাওয়া বা কোনো ওজন বাড়ানোর সাপ্লিমেন্ট গ্রহণ
            করা উচিত নয়। আপনার খাবারের ধরন, গর্ভাবস্থার পর্যায় এবং শিশুর
            বৃদ্ধির অবস্থা বিবেচনা করে চিকিৎসক বা পুষ্টিবিদ প্রয়োজনীয় পরামর্শ
            দিতে পারেন।
          </p>

          <p className="mt-4 leading-7 text-muted-foreground">
            বিশেষ করে যদি দীর্ঘদিন ধরে ওজন না বাড়ে, বারবার বমি হয়, খাবার বা
            পানি গ্রহণ করতে সমস্যা হয় অথবা ওজন কমতে থাকে, তাহলে চিকিৎসকের
            পরামর্শ নেওয়া গুরুত্বপূর্ণ।
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold">
            গর্ভাবস্থায় স্বাস্থ্যকরভাবে ওজন নিয়ন্ত্রণের উপায়
          </h2>

          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border p-5">
              <h3 className="font-semibold">🥗 পুষ্টিকর খাবার</h3>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                শাকসবজি, ফল, ডাল, ডিম, মাছ, মাংস, দুধ বা উপযুক্ত বিকল্পসহ
                বিভিন্ন ধরনের পুষ্টিকর খাবার রাখুন।
              </p>
            </div>

            <div className="rounded-2xl border p-5">
              <h3 className="font-semibold">💧 পর্যাপ্ত পানি</h3>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                পর্যাপ্ত পানি পান করুন এবং অতিরিক্ত চিনিযুক্ত পানীয়ের পরিবর্তে
                স্বাস্থ্যকর পানীয় বেছে নিন।
              </p>
            </div>

            <div className="rounded-2xl border p-5">
              <h3 className="font-semibold">🚶 হালকা শারীরিক কার্যক্রম</h3>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                চিকিৎসক অনুমতি দিলে হাঁটা বা উপযুক্ত হালকা ব্যায়াম দৈনন্দিন
                রুটিনের অংশ হতে পারে।
              </p>
            </div>

            <div className="rounded-2xl border p-5">
              <h3 className="font-semibold">📅 নিয়মিত ওজন মাপুন</h3>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                একই ধরনের পরিস্থিতিতে নিয়মিত ওজন মাপলে সময়ের সঙ্গে পরিবর্তনের
                প্রবণতা বোঝা সহজ হয়।
              </p>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold">
            কীভাবে সঠিকভাবে গর্ভাবস্থার ওজন মাপবেন?
          </h2>

          <p className="mt-4 leading-7 text-muted-foreground">
            ওজনের পরিবর্তন তুলনা করার জন্য সম্ভব হলে প্রতিবার একই সময়ে এবং একই
            ধরনের পরিস্থিতিতে ওজন মাপুন। যেমন, সকালে নাশতার আগে এবং হালকা পোশাকে
            ওজন মাপা যেতে পারে। প্রতিদিনের সামান্য ওঠানামার পরিবর্তে কয়েক
            সপ্তাহের সামগ্রিক প্রবণতার দিকে নজর দেওয়া বেশি উপকারী।
          </p>
        </section>

        <section className="rounded-2xl border bg-muted/30 p-5 sm:p-6">
          <h2 className="text-xl font-bold">মনে রাখবেন</h2>

          <p className="mt-3 leading-7 text-muted-foreground">
            এই ওজন ট্র্যাকারটি আপনার নিজের ওজনের পরিবর্তন পর্যবেক্ষণ করার একটি
            সহজ উপায়। চার্টের প্রত্যাশিত ওজন কোনো ব্যক্তিগত চিকিৎসা পরামর্শ বা
            নির্দিষ্ট লক্ষ্য নয়। আপনার গর্ভাবস্থার জন্য উপযুক্ত ওজন বৃদ্ধি এবং
            শিশুর স্বাভাবিক বৃদ্ধি সম্পর্কে আপনার চিকিৎসকের পরামর্শকে অগ্রাধিকার
            দিন।
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold">
            গর্ভাবস্থায় ওজন বৃদ্ধি সম্পর্কে সাধারণ প্রশ্ন
          </h2>

          <div className="mt-5 divide-y rounded-2xl border">
            <details className="p-5">
              <summary className="cursor-pointer font-semibold">
                গর্ভাবস্থায় ওজন বাড়া কি স্বাভাবিক?
              </summary>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">
                হ্যাঁ। শিশুর বৃদ্ধি এবং মায়ের শরীরে গর্ভাবস্থাজনিত বিভিন্ন
                পরিবর্তনের কারণে সাধারণত কিছুটা ওজন বৃদ্ধি স্বাভাবিক। তবে কতটা
                ওজন বাড়া উপযুক্ত তা ব্যক্তি ও গর্ভাবস্থার পরিস্থিতির ওপর নির্ভর
                করে।
              </p>
            </details>

            <details className="p-5">
              <summary className="cursor-pointer font-semibold">
                গর্ভাবস্থায় প্রতি সপ্তাহে ওজন মাপা কি দরকার?
              </summary>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">
                নিয়মিত ওজন পর্যবেক্ষণ করলে সামগ্রিক পরিবর্তন বোঝা সহজ হয়। তবে
                প্রতিদিনের ছোটখাটো ওঠানামা নিয়ে অতিরিক্ত চিন্তা করার প্রয়োজন
                নেই।
              </p>
            </details>

            <details className="p-5">
              <summary className="cursor-pointer font-semibold">
                গর্ভাবস্থায় ওজন কমে গেলে কী করা উচিত?
              </summary>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">
                সামান্য ওঠানামা বিভিন্ন কারণে হতে পারে। কিন্তু ওজন ক্রমাগত কমতে
                থাকলে বা খাবার গ্রহণে সমস্যা হলে চিকিৎসকের সঙ্গে যোগাযোগ করা
                উচিত।
              </p>
            </details>

            <details className="p-5">
              <summary className="cursor-pointer font-semibold">
                সবার কি একই পরিমাণ ওজন বাড়া উচিত?
              </summary>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">
                না। গর্ভধারণের আগের BMI, গর্ভাবস্থার ধরন এবং ব্যক্তিগত স্বাস্থ্য
                পরিস্থিতির ওপর উপযুক্ত ওজন বৃদ্ধির পরিমাণ নির্ভর করে।
              </p>
            </details>
          </div>
        </section>
      </section>
    </article>
  );
}
