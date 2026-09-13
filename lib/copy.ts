export type MonthCare = {
  id: number;
  title: string;
  mother: string;
  baby: string;
};

export type ToolCard = {
  id: "due-date" | "doctor-visit" | "expected-weight";
  title: string;
  description: string;
  href: string;
};

export const brand = "Aishar Ammu";
export const brandBn = "আয়শার আম্মু";
export const tagline = "Pregnancy, Mother and Baby Care";
export const taglineBn = "গর্ভাবস্থা, মা ও শিশুর যত্ন";

export const nav = {
  home: "Home",
  months: "Monthly care",
  tools: "Care tools",
  dueDate: "Delivery date calculator",
  doctorVisit: "Doctor visit reminder",
  expectedWeight: "Expected weight calculator",
};

export const months: MonthCare[] = [
  {
    id: 1,
    title: "1st month",
    mother: "বেশি বিশ্রাম নিন, প্রসবপূর্ব ভিটামিন শুরু করুন এবং বমিভাব হলে হালকা খাবার খান।",
    baby: "ছোট্ট ভ্রূণ গঠিত হয়। হৃদপিণ্ড ও নিউরাল টিউবের কাজ শুরু হয়।",
  },
  {
    id: 2,
    title: "2nd month",
    mother: "অল্প অল্প করে ঘন ঘন খান, পানি পান করুন এবং তীব্র উপসর্গ ডাক্তারকে জানান।",
    baby: "মুখমণ্ডলের আদল ফুটে ওঠে এবং হাত-পায়ের কুঁড়ি বাড়ে।",
  },
  {
    id: 3,
    title: "3rd month",
    mother: "হালকা হাঁটাচলা রাখুন, ঘুমের যত্ন নিন এবং প্রথম ত্রৈমাসিকের চেকআপ শেষ করুন।",
    baby: "অঙ্গগুলো আরও স্পষ্ট হয়। শিশুর আকার প্রায় একটি লেবুর মতো।",
  },
  {
    id: 4,
    title: "4th month",
    mother: "শক্তি ফিরে আসতে পারে। কোমরকে সাপোর্ট দিন এবং আয়রনসমৃদ্ধ খাবার খান।",
    baby: "হাড় মজবুত হয় এবং শিশু ছোট ছোট নড়াচড়া শুরু করতে পারে।",
  },
  {
    id: 5,
    title: "5th month",
    mother: "প্রথম নড়াচড়া অনুভব করুন, আরামদায়ক পোশাক পরুন এবং অ্যানাটমি স্ক্যানের তারিখ রাখুন।",
    baby: "শ্রবণশক্তি গড়ে ওঠে। এই সময়ে প্রথম লাথি অনুভূত হতে পারে।",
  },
  {
    id: 6,
    title: "6th month",
    mother: "পাশ ফিরে ঘুমান, কোমর ও পায়ের টান কমান এবং হাত-পা ফোলা কিনা খেয়াল করুন।",
    baby: "ত্বক, ফুসফুস ও ইন্দ্রিয় পরিণত হতে থাকে এবং ওজন বাড়ে।",
  },
  {
    id: 7,
    title: "7th month",
    mother: "প্রসবের শ্বাস-প্রশ্বাস অনুশীলন করুন, হাসপাতালের তালিকা তৈরি করুন এবং জন্মপরিকল্পনা জানুন।",
    baby: "শিশু শ্বাসের অনুশীলন করে এবং আপনার কণ্ঠস্বর চেনে।",
  },
  {
    id: 8,
    title: "8th month",
    mother: "দাঁড়িয়ে থাকা কমান, কাছে হালকা খাবার রাখুন এবং ডেলিভারি হাসপাতাল নিশ্চিত করুন।",
    baby: "চর্বি জমে এবং শিশু জন্মের অবস্থানে স্থির হতে পারে।",
  },
  {
    id: 9,
    title: "9th month",
    mother: "প্রসবের লক্ষণ খেয়াল রাখুন, যখন পারেন বিশ্রাম নিন এবং জরুরি নম্বর কাছে রাখুন।",
    baby: "অধিকাংশ শিশু প্রায় প্রস্তুত—লাথি জোরালো হয়, ঘোরার জায়গা কমে।",
  },
  {
    id: 10,
    title: "10th month",
    mother: "প্রসব বা প্রসব-পরবর্তী বিশ্রাম, দুধ খাওয়ানোর সহায়তা এবং সুস্থ হয়ে ওঠার যত্নে প্রস্তুত থাকুন।",
    baby: "আসার সময় ও প্রথম সপ্তাহের যত্ন: উষ্ণতা, খাওয়ানো এবং নিবিড় খেয়াল।",
  },
];

export const tools: ToolCard[] = [
  {
    id: "due-date",
    title: "Delivery Date Calculator",
    description:
      "শেষ মাসিক বা গর্ভধারণের সপ্তাহ থেকে সম্ভাব্য প্রসবের তারিখ হিসাব করুন।",
    href: "#tool-due-date",
  },
  {
    id: "doctor-visit",
    title: "Next Doctor Visit Reminder",
    description:
      "পরের চেকআপের তারিখ সেভ করুন এবং ক্লিনিকে যাওয়ার আগে একটি কোমল রিমাইন্ডার পান।",
    href: "#tool-doctor-visit",
  },
  {
    id: "expected-weight",
    title: "Personalized Expected Weight Calculator",
    description:
      "মাস ও শুরুর ওজন অনুযায়ী মা ও শিশুর ব্যক্তিগত প্রত্যাশিত ওজনের পরিসর দেখুন।",
    href: "#tool-expected-weight",
  },
];
