import letterA from "@/data/girl-names/girl-name-A.json";
import letterB from "@/data/girl-names/girl-name-B.json";
import letterC from "@/data/girl-names/girl-name-C.json";
import letterD from "@/data/girl-names/girl-name-D.json";
import letterE from "@/data/girl-names/girl-name-E.json";
import letterF from "@/data/girl-names/girl-name-F.json";
import letterG from "@/data/girl-names/girl-name-G.json";
import letterH from "@/data/girl-names/girl-name-H.json";
import letterI from "@/data/girl-names/girl-name-I.json";
import letterJ from "@/data/girl-names/girl-name-J.json";
import letterK from "@/data/girl-names/girl-name-K.json";
import letterL from "@/data/girl-names/girl-name-L.json";
import letterM from "@/data/girl-names/girl-name-M.json";
import letterN from "@/data/girl-names/girl-name-N.json";
import letterO from "@/data/girl-names/girl-name-O.json";
import letterP from "@/data/girl-names/girl-name-P.json";
import letterQ from "@/data/girl-names/girl-name-Q.json";
import letterR from "@/data/girl-names/girl-name-R.json";
import letterS from "@/data/girl-names/girl-name-S.json";
import letterT from "@/data/girl-names/girl-name-T.json";
import letterU from "@/data/girl-names/girl-name-U.json";
import letterV from "@/data/girl-names/girl-name-V.json";
import letterW from "@/data/girl-names/girl-name-W.json";
import letterY from "@/data/girl-names/girl-name-Y.json";
import letterZ from "@/data/girl-names/girl-name-Z.json";

type GirlNameFile = typeof letterA;

const FILES: Record<string, GirlNameFile> = {
  A: letterA,
  B: letterB,
  C: letterC,
  D: letterD,
  E: letterE,
  F: letterF,
  G: letterG,
  H: letterH,
  I: letterI,
  J: letterJ,
  K: letterK,
  L: letterL,
  M: letterM,
  N: letterN,
  O: letterO,
  P: letterP,
  Q: letterQ,
  R: letterR,
  S: letterS,
  T: letterT,
  U: letterU,
  V: letterV,
  W: letterW,
  Y: letterY,
  Z: letterZ,
};

export const GIRL_NAME_LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

export type GirlNameInGroup = {
  fullName: string;
  popularity: number;
};

export type GirlNameGroup = {
  token: string;
  names: GirlNameInGroup[];
};

export function parseGirlNameLetter(value: string | string[] | undefined) {
  const raw = (Array.isArray(value) ? value[0] : value)?.trim().toUpperCase();
  if (raw && GIRL_NAME_LETTERS.includes(raw)) return raw;
  return "A";
}

export function parseGirlNameToken(value: string | string[] | undefined) {
  const raw = Array.isArray(value) ? value[0] : value;
  if (!raw) return null;
  const token = decodeURIComponent(String(raw)).trim().toLowerCase();
  return token || null;
}

export function findGirlNameGroup(letter: string, token: string | null, groups: GirlNameGroup[]) {
  if (!token) return null;
  return groups.find((group) => group.token === token) ?? null;
}

export function girlNameGroupsForLetter(letter: string): GirlNameGroup[] {
  const file = FILES[letter];
  if (!file) return [];

  const groups: GirlNameGroup[] = file.tokens.map((entry) => ({
    token: entry.token,
    names: entry.names
      .map((name) => ({
        fullName: name.full_name,
        popularity: name.popularity_value,
      }))
      .sort((left, right) => {
        if (right.popularity !== left.popularity) return right.popularity - left.popularity;
        return left.fullName.localeCompare(right.fullName);
      }),
  }));

  groups.sort((left, right) => {
    const byPopularity = (right.names[0]?.popularity ?? 0) - (left.names[0]?.popularity ?? 0);
    if (byPopularity !== 0) return byPopularity;
    return left.token.localeCompare(right.token);
  });

  return groups;
}
