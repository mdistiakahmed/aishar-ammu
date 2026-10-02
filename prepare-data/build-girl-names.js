const fs = require("fs");
const path = require("path");
const XLSX = require("xlsx");

const WORKBOOK_PATH = path.join(__dirname, "bd_girl_names.xlsx");
const OUTPUT_DIR = path.join(__dirname, "output");

/** Cyrillic letters that look like Latin and showed up in the workbook. */
const CYRILLIC_LOOKALIKES = {
  А: "A",
  а: "a",
  В: "B",
  Е: "E",
  е: "e",
  К: "K",
  М: "M",
  Н: "H",
  О: "O",
  о: "o",
  Р: "P",
  р: "p",
  С: "C",
  с: "c",
  Т: "T",
  У: "y",
  у: "y",
  Х: "X",
  х: "x",
  І: "I",
  і: "i",
};

function latinize(value) {
  return value.replace(/[\u0400-\u04FF]/g, (char) => CYRILLIC_LOOKALIKES[char] ?? "");
}

/**
 * Lowercase a cell and tidy spaces. Drops the header label, blank cells,
 * rank notes marked "MERIT", and parenthetical text that contains digits.
 */
function normalizeFullName(raw) {
  let value = latinize(String(raw ?? ""));
  value = value.toLowerCase().replace(/\s+/g, " ").trim();
  if (!value || value === "full_name") {
    return "";
  }

  value = value.replace(/\([^)]*\d[^)]*\)/g, " ");
  value = value.replace(/\bmerit\b/g, " ");
  value = value.replace(/^[^a-z]+|[^a-z)]+$/g, "");
  value = value.replace(/\s+/g, " ").trim();
  return value;
}

/** Unique letter tokens. Spaces, hyphens, and other punctuation are separators. */
function tokenize(fullName) {
  return [...new Set(fullName.split(/[^a-z]+/).filter(Boolean))];
}

function readFullNames(workbookPath) {
  const workbook = XLSX.readFile(workbookPath);
  const counts = new Map();

  for (const sheetName of workbook.SheetNames) {
    const rows = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], {
      header: 1,
      defval: "",
      raw: false,
    });

    for (const row of rows) {
      const fullName = normalizeFullName(row[0]);
      if (!fullName) {
        continue;
      }
      counts.set(fullName, (counts.get(fullName) ?? 0) + 1);
    }
  }

  return counts;
}

function indexByToken(nameCounts) {
  const tokens = new Map();

  for (const [fullName, popularityValue] of nameCounts) {
    for (const token of tokenize(fullName)) {
      if (!tokens.has(token)) {
        tokens.set(token, []);
      }
      tokens.get(token).push({
        full_name: fullName,
        popularity_value: popularityValue,
      });
    }
  }

  for (const names of tokens.values()) {
    names.sort((left, right) => {
      if (right.popularity_value !== left.popularity_value) {
        return right.popularity_value - left.popularity_value;
      }
      return left.full_name.localeCompare(right.full_name);
    });
  }

  return tokens;
}

function groupByLetter(tokens) {
  const letters = new Map();

  for (const [token, names] of tokens) {
    const letter = token[0].toUpperCase();
    if (!/^[A-Z]$/.test(letter)) {
      continue;
    }
    if (!letters.has(letter)) {
      letters.set(letter, []);
    }
    letters.get(letter).push({ token, names });
  }

  for (const entries of letters.values()) {
    entries.sort((left, right) => left.token.localeCompare(right.token));
  }

  return letters;
}

function writeLetterFiles(letters) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });

  for (const fileName of fs.readdirSync(OUTPUT_DIR)) {
    if (/^girl-name-[A-Z]\.json$/.test(fileName)) {
      fs.unlinkSync(path.join(OUTPUT_DIR, fileName));
    }
  }

  const written = [];

  for (const letter of [...letters.keys()].sort()) {
    const entries = letters.get(letter);
    const payload = {
      letter,
      token_count: entries.length,
      tokens: entries,
    };
    const fileName = `girl-name-${letter}.json`;
    fs.writeFileSync(path.join(OUTPUT_DIR, fileName), `${JSON.stringify(payload, null, 2)}\n`, "utf8");
    written.push(fileName);
  }

  return written;
}

function main() {
  const nameCounts = readFullNames(WORKBOOK_PATH);
  const tokens = indexByToken(nameCounts);
  const letters = groupByLetter(tokens);
  const written = writeLetterFiles(letters);

  const nameTotal = [...nameCounts.values()].reduce((sum, count) => sum + count, 0);
  console.log(`Read ${nameTotal} names (${nameCounts.size} distinct).`);
  console.log(`Indexed ${tokens.size} tokens into ${written.length} files in ${OUTPUT_DIR}.`);
}

main();
