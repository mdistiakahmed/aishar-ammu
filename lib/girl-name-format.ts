const GIRL_NAME_ID = /^[a-z][a-z(). -]*$/;

export function girlNameFavouriteId(fullName: string) {
  return fullName.trim().toLowerCase();
}

export function isListedGirlName(value: string) {
  return value.length <= 160 && GIRL_NAME_ID.test(value);
}

export function displayName(value: string) {
  return value.replace(/\b[a-z]/g, (letter) => letter.toUpperCase());
}