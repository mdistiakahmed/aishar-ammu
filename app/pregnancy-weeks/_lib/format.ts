const BN_DIGITS = "০১২৩৪৫৬৭৮৯";

export function toBnDigits(value: number | string) {
  return String(value).replace(/\d/g, (digit) => BN_DIGITS[Number(digit)] ?? digit);
}

/** "সপ্তাহ ১৪" or "সপ্তাহ ১৩–১৬". */
export function weekSpanLabel(from: number, to = from) {
  if (from === to) return `সপ্তাহ ${toBnDigits(from)}`;
  return `সপ্তাহ ${toBnDigits(from)}–${toBnDigits(to)}`;
}
