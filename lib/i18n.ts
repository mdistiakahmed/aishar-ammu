export type Locale = "en" | "bn";

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

export type Dictionary = {
  brand: string;
  brandBn: string;
  tagline: string;
  menu: string;
  closeMenu: string;
  language: string;
  english: string;
  bangla: string;
  nav: {
    home: string;
    months: string;
    tools: string;
    dueDate: string;
    doctorVisit: string;
    expectedWeight: string;
  };
  heroEyebrow: string;
  heroTitle: string;
  heroBody: string;
  heroCtaMonths: string;
  heroCtaTools: string;
  monthsTitle: string;
  monthsSubtitle: string;
  motherLabel: string;
  babyLabel: string;
  openMonth: string;
  toolsTitle: string;
  toolsSubtitle: string;
  openTool: string;
  footerExplore: string;
  footerTools: string;
  footerNote: string;
  footerRights: string;
  footerPrivacy: string;
  footerContact: string;
  months: MonthCare[];
  tools: ToolCard[];
};

export const dictionaries: Record<Locale, Dictionary> = {
  en: {
    brand: "Aishar Ammu",
    brandBn: "আয়শার আম্মু",
    tagline: "Pregnancy, Mother and Baby Care",
    menu: "Open menu",
    closeMenu: "Close menu",
    language: "Language",
    english: "EN",
    bangla: "বাং",
    nav: {
      home: "Home",
      months: "Monthly care",
      tools: "Care tools",
      dueDate: "Delivery date calculator",
      doctorVisit: "Doctor visit reminder",
      expectedWeight: "Expected weight calculator",
    },
    heroEyebrow: "For mothers and little ones",
    heroTitle: "Gentle care for every month of the journey",
    heroBody:
      "From the first month to the tenth, Aishar Ammu walks beside you with mother care, baby milestones, and simple tools you can trust.",
    heroCtaMonths: "Explore monthly care",
    heroCtaTools: "Open care tools",
    monthsTitle: "Baby and mother care, month by month",
    monthsSubtitle:
      "Ten months of guidance for how you feel and how your baby grows.",
    motherLabel: "Mother",
    babyLabel: "Baby",
    openMonth: "View this month",
    toolsTitle: "Everyday care tools",
    toolsSubtitle:
      "Plan the due date, stay ready for checkups, and track expected weight.",
    openTool: "Open tool",
    footerExplore: "Explore",
    footerTools: "Tools",
    footerNote:
      "Care guidance for everyday wellbeing. Always follow your doctor’s advice for medical decisions.",
    footerRights: "All rights reserved.",
    footerPrivacy: "Privacy",
    footerContact: "Contact",
    months: [
      {
        id: 1,
        title: "1st month",
        mother: "Rest more, start prenatal vitamins, and ease into softer meals if nausea begins.",
        baby: "A tiny embryo forms. The heart and neural tube begin their first work.",
      },
      {
        id: 2,
        title: "2nd month",
        mother: "Eat small frequent meals, sip water often, and tell your doctor about strong symptoms.",
        baby: "Facial features start to appear and tiny limb buds grow.",
      },
      {
        id: 3,
        title: "3rd month",
        mother: "Keep up gentle walks, protect sleep, and complete first-trimester checkups.",
        baby: "Organs take clearer shape. The baby is now about the size of a lime.",
      },
      {
        id: 4,
        title: "4th month",
        mother: "Energy often returns. Support your back and choose iron-rich foods.",
        baby: "Bones strengthen and the baby may start small movements.",
      },
      {
        id: 5,
        title: "5th month",
        mother: "Feel for first flutters, wear supportive clothes, and keep your anatomy scan date.",
        baby: "Hearing develops. You may feel the first kicks around now.",
      },
      {
        id: 6,
        title: "6th month",
        mother: "Sleep on the side, stretch tight hips, and notice swelling in hands or feet.",
        baby: "Skin, lungs, and senses keep maturing as weight rises.",
      },
      {
        id: 7,
        title: "7th month",
        mother: "Practice birth-breathing, pack a hospital list, and ask about birth preferences.",
        baby: "The baby practices breathing motions and responds to your voice.",
      },
      {
        id: 8,
        title: "8th month",
        mother: "Shorten standing time, keep snacks nearby, and confirm your delivery hospital.",
        baby: "Fat stores build and the baby settles into a birth position.",
      },
      {
        id: 9,
        title: "9th month",
        mother: "Watch for labor signs, rest whenever you can, and keep emergency numbers close.",
        baby: "Most babies are nearly ready, with strong kicks and less room to turn.",
      },
      {
        id: 10,
        title: "10th month",
        mother: "Stay ready for birth or early postpartum rest, feeding support, and recovery care.",
        baby: "Arrival window and first-week care: warmth, feeding, and close watching.",
      },
    ],
    tools: [
      {
        id: "due-date",
        title: "Delivery Date Calculator",
        description:
          "Estimate the expected delivery date from the last menstrual period or conception week.",
        href: "#tool-due-date",
      },
      {
        id: "doctor-visit",
        title: "Next Doctor Visit Reminder",
        description:
          "Save the next checkup date and get a gentle reminder before you walk into the clinic.",
        href: "#tool-doctor-visit",
      },
      {
        id: "expected-weight",
        title: "Personalized Expected Weight Calculator",
        description:
          "See a personal expected weight range for mother and baby based on month and starting weight.",
        href: "#tool-expected-weight",
      },
    ],
  },
  bn: {
    brand: "Aishar Ammu",
    brandBn: "আয়শার আম্মু",
    tagline: "গর্ভাবস্থা, মা ও শিশুর যত্ন",
    menu: "মেনু খুলুন",
    closeMenu: "মেনু বন্ধ করুন",
    language: "ভাষা",
    english: "EN",
    bangla: "বাং",
    nav: {
      home: "হোম",
      months: "মাসিক যত্ন",
      tools: "যত্নের টুলস",
      dueDate: "প্রসবের তারিখ ক্যালকুলেটর",
      doctorVisit: "ডাক্তার ভিজিট রিমাইন্ডার",
      expectedWeight: "প্রত্যাশিত ওজন ক্যালকুলেটর",
    },
    heroEyebrow: "মা ও ছোট্ট শিশুর জন্য",
    heroTitle: "যাত্রার প্রতিটি মাসে কোমল যত্ন",
    heroBody:
      "প্রথম মাস থেকে দশম মাস পর্যন্ত আয়শার আম্মু আপনার পাশে থাকে—মায়ের যত্ন, শিশুর মাইলফলক এবং বিশ্বাসযোগ্য সহজ টুলস নিয়ে।",
    heroCtaMonths: "মাসিক যত্ন দেখুন",
    heroCtaTools: "টুলস খুলুন",
    monthsTitle: "মাস অনুযায়ী মা ও শিশুর যত্ন",
    monthsSubtitle: "আপনি কেমন অনুভব করছেন এবং শিশু কীভাবে বাড়ছে—দশ মাসের নির্দেশনা।",
    motherLabel: "মা",
    babyLabel: "শিশু",
    openMonth: "এই মাসটি দেখুন",
    toolsTitle: "দৈনন্দিন যত্নের টুলস",
    toolsSubtitle:
      "প্রসবের তারিখ পরিকল্পনা করুন, চেকআপ মনে রাখুন এবং প্রত্যাশিত ওজন অনুসরণ করুন।",
    openTool: "টুল খুলুন",
    footerExplore: "ঘুরে দেখুন",
    footerTools: "টুলস",
    footerNote:
      "এটি দৈনন্দিন সুস্থতার জন্য সাধারণ যত্নের নির্দেশনা। চিকিৎসা সিদ্ধান্তে সবসময় আপনার ডাক্তারের পরামর্শ অনুসরণ করুন।",
    footerRights: "সর্বস্বত্ব সংরক্ষিত।",
    footerPrivacy: "গোপনীয়তা",
    footerContact: "যোগাযোগ",
    months: [
      {
        id: 1,
        title: "১ম মাস",
        mother: "বেশি বিশ্রাম নিন, প্রসবপূর্ব ভিটামিন শুরু করুন এবং বমিভাব হলে হালকা খাবার খান।",
        baby: "ছোট্ট ভ্রূণ গঠিত হয়। হৃদপিণ্ড ও নিউরাল টিউবের কাজ শুরু হয়।",
      },
      {
        id: 2,
        title: "২য় মাস",
        mother: "অল্প অল্প করে ঘন ঘন খান, পানি পান করুন এবং তীব্র উপসর্গ ডাক্তারকে জানান।",
        baby: "মুখমণ্ডলের আদল ফুটে ওঠে এবং হাত-পায়ের কুঁড়ি বাড়ে।",
      },
      {
        id: 3,
        title: "৩য় মাস",
        mother: "হালকা হাঁটাচলা রাখুন, ঘুমের যত্ন নিন এবং প্রথম ত্রৈমাসিকের চেকআপ শেষ করুন।",
        baby: "অঙ্গগুলো আরও স্পষ্ট হয়। শিশুর আকার প্রায় একটি লেবুর মতো।",
      },
      {
        id: 4,
        title: "৪র্থ মাস",
        mother: "শক্তি ফিরে আসতে পারে। কোমরকে সাপোর্ট দিন এবং আয়রনসমৃদ্ধ খাবার খান।",
        baby: "হাড় মজবুত হয় এবং শিশু ছোট ছোট নড়াচড়া শুরু করতে পারে।",
      },
      {
        id: 5,
        title: "৫ম মাস",
        mother: "প্রথম নড়াচড়া অনুভব করুন, আরামদায়ক পোশাক পরুন এবং অ্যানাটমি স্ক্যানের তারিখ রাখুন।",
        baby: "শ্রবণশক্তি গড়ে ওঠে। এই সময়ে প্রথম লাথি অনুভূত হতে পারে।",
      },
      {
        id: 6,
        title: "৬ষ্ঠ মাস",
        mother: "পাশ ফিরে ঘুমান, কোমর ও পায়ের টান কমান এবং হাত-পা ফোলা কিনা খেয়াল করুন।",
        baby: "ত্বক, ফুসফুস ও ইন্দ্রিয় পরিণত হতে থাকে এবং ওজন বাড়ে।",
      },
      {
        id: 7,
        title: "৭ম মাস",
        mother: "প্রসবের শ্বাস-প্রশ্বাস অনুশীলন করুন, হাসপাতালের তালিকা তৈরি করুন এবং জন্মপরিকল্পনা জানুন।",
        baby: "শিশু শ্বাসের অনুশীলন করে এবং আপনার কণ্ঠস্বর চেনে।",
      },
      {
        id: 8,
        title: "৮ম মাস",
        mother: "দাঁড়িয়ে থাকা কমান, কাছে হালকা খাবার রাখুন এবং ডেলিভারি হাসপাতাল নিশ্চিত করুন।",
        baby: "চর্বি জমে এবং শিশু জন্মের অবস্থানে স্থির হতে পারে।",
      },
      {
        id: 9,
        title: "৯ম মাস",
        mother: "প্রসবের লক্ষণ খেয়াল রাখুন, যখন পারেন বিশ্রাম নিন এবং জরুরি নম্বর কাছে রাখুন।",
        baby: "অধিকাংশ শিশু প্রায় প্রস্তুত—লাথি জোরালো হয়, ঘোরার জায়গা কমে।",
      },
      {
        id: 10,
        title: "১০ম মাস",
        mother: "প্রসব বা প্রসব-পরবর্তী বিশ্রাম, দুধ খাওয়ানোর সহায়তা এবং সুস্থ হয়ে ওঠার যত্নে প্রস্তুত থাকুন।",
        baby: "আসার সময় ও প্রথম সপ্তাহের যত্ন: উষ্ণতা, খাওয়ানো এবং নিবিড় খেয়াল।",
      },
    ],
    tools: [
      {
        id: "due-date",
        title: "প্রসবের তারিখ ক্যালকুলেটর",
        description:
          "শেষ মাসিক বা গর্ভধারণের সপ্তাহ থেকে সম্ভাব্য প্রসবের তারিখ হিসাব করুন।",
        href: "#tool-due-date",
      },
      {
        id: "doctor-visit",
        title: "পরবর্তী ডাক্তার ভিজিট রিমাইন্ডার",
        description:
          "পরের চেকআপের তারিখ সেভ করুন এবং ক্লিনিকে যাওয়ার আগে একটি কোমল রিমাইন্ডার পান।",
        href: "#tool-doctor-visit",
      },
      {
        id: "expected-weight",
        title: "ব্যক্তিগত প্রত্যাশিত ওজন ক্যালকুলেটর",
        description:
          "মাস ও শুরুর ওজন অনুযায়ী মা ও শিশুর ব্যক্তিগত প্রত্যাশিত ওজনের পরিসর দেখুন।",
        href: "#tool-expected-weight",
      },
    ],
  },
};
