/** Temporary short labels for “মায়ের শারীরিক/ মানসিক পরিবর্তন”. Replace each week later. */

export const motherChangeIcons = [
  "activity",
  "baby",
  "battery",
  "bed",
  "bone",
  "brain",
  "circle",
  "droplet",
  "droplets",
  "flame",
  "foot",
  "frown",
  "heart",
  "house",
  "meh",
  "moon",
  "smile",
  "sun",
  "timer",
  "utensils",
  "utensilsOff",
  "waves",
  "wind",
] as const;

export type MotherChangeIcon = (typeof motherChangeIcons)[number];

export type MotherChangeBullet = {
  icon: MotherChangeIcon;
  label: string;
};

export const motherChangeBullets: Record<number, MotherChangeBullet[]> = {
  1: [
    { icon: "droplet", label: "মাসিকের সময়" },
    { icon: "activity", label: "পেটব্যথা" },
    { icon: "bone", label: "কোমরব্যথা" },
    { icon: "battery", label: "ক্লান্তি" },
    { icon: "frown", label: "মেজাজের পরিবর্তন" },
  ],
  2: [
    { icon: "activity", label: "তলপেটে অস্বস্তি" },
    { icon: "droplet", label: "পাতলা স্রাব" },
    { icon: "heart", label: "স্তনে সংবেদন" },
  ],
  3: [
    { icon: "smile", label: "লক্ষণ নাও থাকতে পারে" },
    { icon: "droplet", label: "হালকা দাগ" },
    { icon: "activity", label: "তলপেটে অস্বস্তি" },
  ],
  4: [
    { icon: "droplet", label: "মাসিক বন্ধ" },
    { icon: "heart", label: "স্তনে ভারী ভাব" },
    { icon: "battery", label: "ক্লান্তি" },
    { icon: "droplets", label: "ঘন প্রস্রাব" },
    { icon: "waves", label: "বমি বমি ভাব" },
  ],
  5: [
    { icon: "waves", label: "বমি বমি ভাব" },
    { icon: "battery", label: "ক্লান্তি" },
    { icon: "heart", label: "স্তনে সংবেদন" },
    { icon: "wind", label: "গন্ধে অস্বস্তি" },
    { icon: "utensilsOff", label: "খাবারে অরুচি" },
    { icon: "droplets", label: "ঘন প্রস্রাব" },
  ],
  6: [
    { icon: "waves", label: "বমি ভাব" },
    { icon: "moon", label: "ঘুম ঘুম ভাব" },
    { icon: "heart", label: "স্তনে ভারী ভাব" },
    { icon: "frown", label: "মেজাজের পরিবর্তন" },
    { icon: "utensils", label: "খাবারের পছন্দ" },
  ],
  7: [
    { icon: "waves", label: "বমি বমি ভাব" },
    { icon: "battery", label: "বেশি ক্লান্তি" },
    { icon: "bed", label: "ঘুমের প্রয়োজন" },
    { icon: "wind", label: "গন্ধে অস্বস্তি" },
    { icon: "utensilsOff", label: "খাবারে অনীহা" },
  ],
  8: [
    { icon: "waves", label: "বমি ভাব" },
    { icon: "battery", label: "ক্লান্তি" },
    { icon: "heart", label: "স্তনে ব্যথা" },
    { icon: "frown", label: "মেজাজের পরিবর্তন" },
    { icon: "meh", label: "পেটে অস্বস্তি" },
  ],
  9: [
    { icon: "waves", label: "বমি ভাব" },
    { icon: "battery", label: "ক্লান্তি" },
    { icon: "brain", label: "মাথাব্যথা" },
    { icon: "meh", label: "মাথা ঘোরা" },
    { icon: "bone", label: "কোমরে টান" },
  ],
  10: [
    { icon: "circle", label: "পেট বাড়ছে" },
    { icon: "waves", label: "বমি ভাব" },
    { icon: "flame", label: "বুকজ্বালা" },
    { icon: "meh", label: "কোষ্ঠকাঠিন্য" },
    { icon: "battery", label: "ক্লান্তি" },
    { icon: "frown", label: "মেজাজের পরিবর্তন" },
  ],
  11: [
    { icon: "smile", label: "বমি কমছে" },
    { icon: "battery", label: "ক্লান্তি" },
    { icon: "sun", label: "শক্তি ফিরছে" },
    { icon: "circle", label: "পেট একটু বড়" },
  ],
  12: [
    { icon: "smile", label: "বমি কমছে" },
    { icon: "sun", label: "ক্লান্তি কমছে" },
    { icon: "bone", label: "কোমরে চাপ" },
    { icon: "circle", label: "পেটের আকার" },
  ],
  13: [
    { icon: "smile", label: "বমি কমছে" },
    { icon: "utensils", label: "ক্ষুধা বাড়ছে" },
    { icon: "sun", label: "শক্তি ফিরছে" },
    { icon: "activity", label: "পেটে টান" },
  ],
  14: [
    { icon: "sun", label: "শক্তি বাড়ছে" },
    { icon: "utensils", label: "ক্ষুধা বাড়ছে" },
    { icon: "circle", label: "পেট দৃশ্যমান" },
    { icon: "wind", label: "নাক বন্ধ" },
  ],
  15: [
    { icon: "circle", label: "পেট স্পষ্ট" },
    { icon: "droplet", label: "মাড়িতে অস্বস্তি" },
    { icon: "bone", label: "কোমরব্যথা" },
  ],
  16: [
    { icon: "circle", label: "পেট স্পষ্ট" },
    { icon: "bone", label: "কোমরে চাপ" },
    { icon: "activity", label: "পিঠে চাপ" },
    { icon: "sun", label: "ত্বকে দাগ" },
  ],
  17: [
    { icon: "activity", label: "পেটে টান" },
    { icon: "bone", label: "পিঠে ব্যথা" },
    { icon: "bed", label: "ঘুমে অস্বস্তি" },
  ],
  18: [
    { icon: "circle", label: "নাভির কাছে জরায়ু" },
    { icon: "circle", label: "পেট স্পষ্ট" },
    { icon: "foot", label: "পা ফোলা" },
  ],
  19: [
    { icon: "meh", label: "ত্বকে চুলকানি" },
    { icon: "bone", label: "কোমরব্যথা" },
    { icon: "activity", label: "পেলভিসে ব্যথা" },
    { icon: "foot", label: "পা ফোলা" },
  ],
  20: [
    { icon: "circle", label: "পেটের চাপ" },
    { icon: "bone", label: "পিঠে ব্যথা" },
    { icon: "flame", label: "বুকজ্বালা" },
    { icon: "meh", label: "কোষ্ঠকাঠিন্য" },
    { icon: "foot", label: "পায়ে টান" },
  ],
  21: [
    { icon: "sun", label: "স্ট্রেচ মার্ক" },
    { icon: "bone", label: "পিঠে ব্যথা" },
    { icon: "activity", label: "কোমরব্যথা" },
    { icon: "foot", label: "পায়ে খিঁচুনি" },
  ],
  22: [
    { icon: "flame", label: "বুকজ্বালা" },
    { icon: "meh", label: "ত্বকে চুলকানি" },
    { icon: "sun", label: "স্ট্রেচ মার্ক" },
    { icon: "foot", label: "হাত-পা ফোলা" },
  ],
  23: [
    { icon: "foot", label: "পা ফোলা" },
    { icon: "bone", label: "কোমরব্যথা" },
    { icon: "activity", label: "পিঠে ব্যথা" },
    { icon: "flame", label: "বুকজ্বালা" },
  ],
  24: [
    { icon: "bone", label: "পিঠে ব্যথা" },
    { icon: "activity", label: "পেলভিসে চাপ" },
    { icon: "flame", label: "বুকজ্বালা" },
    { icon: "bed", label: "ঘুমে অস্বস্তি" },
  ],
  25: [
    { icon: "bone", label: "কোমরব্যথা" },
    { icon: "foot", label: "পায়ে খিঁচুনি" },
    { icon: "foot", label: "গোড়ালি ফোলা" },
    { icon: "moon", label: "ঘুমের সমস্যা" },
    { icon: "droplets", label: "রাতে প্রস্রাব" },
  ],
  26: [
    { icon: "bone", label: "পিঠে ব্যথা" },
    { icon: "foot", label: "পায়ে খিঁচুনি" },
    { icon: "flame", label: "বুকজ্বালা" },
    { icon: "foot", label: "হাত-পা ফোলা" },
  ],
  27: [
    { icon: "bone", label: "পিঠে ব্যথা" },
    { icon: "flame", label: "বুকজ্বালা" },
    { icon: "foot", label: "পায়ে খিঁচুনি" },
    { icon: "bed", label: "ঘুমে অসুবিধা" },
    { icon: "foot", label: "হালকা ফোলা" },
  ],
  28: [
    { icon: "bone", label: "পিঠে ব্যথা" },
    { icon: "foot", label: "পায়ে খিঁচুনি" },
    { icon: "flame", label: "বুকজ্বালা" },
    { icon: "foot", label: "হাত-পা ফোলা" },
    { icon: "bed", label: "ঘুমে অস্বস্তি" },
  ],
  29: [
    { icon: "wind", label: "শ্বাসে চাপ" },
    { icon: "flame", label: "বদহজম" },
    { icon: "battery", label: "ক্লান্তি" },
    { icon: "moon", label: "ঘুমে কষ্ট" },
  ],
  30: [
    { icon: "activity", label: "লিগামেন্টে টান" },
    { icon: "bone", label: "পিঠে ব্যথা" },
    { icon: "meh", label: "বসলে অস্বস্তি" },
  ],
  31: [
    { icon: "battery", label: "শক্তি কম" },
    { icon: "heart", label: "আবেগ তীব্র" },
    { icon: "baby", label: "স্তন থেকে তরল" },
  ],
  32: [
    { icon: "circle", label: "পেট দ্রুত বাড়ছে" },
    { icon: "activity", label: "পেলভিসে ব্যথা" },
    { icon: "foot", label: "হাঁটা কষ্ট" },
    { icon: "circle", label: "নাভি বেরোনো" },
  ],
  33: [
    { icon: "foot", label: "পায়ে খিঁচুনি" },
    { icon: "bone", label: "পিঠে ব্যথা" },
    { icon: "flame", label: "বুকজ্বালা" },
    { icon: "foot", label: "পা ফোলা" },
    { icon: "droplets", label: "ঘন প্রস্রাব" },
  ],
  34: [
    { icon: "battery", label: "ক্লান্তি" },
    { icon: "activity", label: "শরীরে ব্যথা" },
    { icon: "moon", label: "ঘুমের ব্যাঘাত" },
    { icon: "bone", label: "ঊরুতে ব্যথা" },
  ],
  35: [{ icon: "timer", label: "হালকা সংকোচন" }],
  36: [
    { icon: "circle", label: "জরায়ু উপরে" },
    { icon: "activity", label: "পেলভিসে চাপ" },
    { icon: "droplets", label: "ঘন প্রস্রাব" },
    { icon: "wind", label: "শ্বাস একটু সহজ" },
    { icon: "droplet", label: "স্রাব বেড়েছে" },
  ],
  37: [
    { icon: "activity", label: "পেলভিসে ভারী ভাব" },
    { icon: "baby", label: "শালদুধ" },
    { icon: "bone", label: "পিঠে ব্যথা" },
    { icon: "droplet", label: "মিউকাস" },
  ],
  38: [
    { icon: "activity", label: "পেলভিসে চাপ" },
    { icon: "bone", label: "পিঠে ব্যথা" },
    { icon: "droplet", label: "মিউকাস" },
    { icon: "house", label: "ঘর গোছানোর ইচ্ছে" },
  ],
  39: [
    { icon: "meh", label: "জরায়ুমুখ নরম" },
    { icon: "droplet", label: "মিউকাস শো" },
  ],
  40: [
    { icon: "timer", label: "আনুমানিক তারিখ" },
    { icon: "moon", label: "তারিখ পেরোনো" },
    { icon: "smile", label: "প্রসবের অপেক্ষা" },
  ],
};

export function motherChangeBulletsForWeek(week: number) {
  return motherChangeBullets[week] ?? [];
}
