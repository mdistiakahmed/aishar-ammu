export type BabyName = {
  id: string;
  name: string;
  meaning: string;
};

export const BABY_NAMES: BabyName[] = [
  { id: "a.json:nm_aisha_01", name: "Aisha", meaning: "A well-known name often linked with living or life." },
  { id: "m.json:nm_maryam_01", name: "Maryam", meaning: "A classic name used across many families and stories." },
  { id: "n.json:nm_noor_01", name: "Noor", meaning: "A short name people often connect with light." },
  { id: "z.json:nm_zayd_01", name: "Zayd", meaning: "A traditional name sometimes associated with growth." },
  { id: "i.json:nm_ibrahim_01", name: "Ibrahim", meaning: "A widely used name with a long history in many cultures." },
  { id: "f.json:nm_fatima_01", name: "Fatima", meaning: "A familiar name chosen in many households." },
  { id: "y.json:nm_yusuf_01", name: "Yusuf", meaning: "A well-known name that appears in many family trees." },
  { id: "h.json:nm_hana_01", name: "Hana", meaning: "A gentle name people often relate to happiness." },
];

export function isListedBabyNameId(value: string) {
  return BABY_NAMES.some((item) => item.id === value);
}
