"use client";

import { useLanguage } from "@/components/language-provider";

export function LanguageToggle() {
  const { locale, setLocale, t } = useLanguage();

  return (
    <div
      className="inline-flex items-center rounded-full border border-rose-200 bg-white/80 p-1 shadow-sm"
      role="group"
      aria-label={t.language}
    >
      <button
        type="button"
        onClick={() => setLocale("en")}
        className={`min-h-9 min-w-11 rounded-full px-3 text-sm font-semibold transition ${
          locale === "en"
            ? "bg-rose-700 text-white shadow-sm"
            : "text-rose-800 hover:bg-rose-50"
        }`}
        aria-pressed={locale === "en"}
      >
        {t.english}
      </button>
      <button
        type="button"
        onClick={() => setLocale("bn")}
        className={`min-h-9 min-w-11 rounded-full px-3 text-sm font-semibold transition ${
          locale === "bn"
            ? "bg-rose-700 text-white shadow-sm"
            : "text-rose-800 hover:bg-rose-50"
        }`}
        aria-pressed={locale === "bn"}
      >
        {t.bangla}
      </button>
    </div>
  );
}
