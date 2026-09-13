"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { dictionaries, type Dictionary, type Locale } from "@/lib/i18n";

type LanguageContextValue = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: Dictionary;
};

const LanguageContext = createContext<LanguageContextValue | null>(null);

const STORAGE_KEY = "aishar-ammu-locale";

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("bn");

  useEffect(() => {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (saved === "en" || saved === "bn") {
      setLocaleState(saved);
    }
  }, []);

  useEffect(() => {
    document.documentElement.lang = locale === "bn" ? "bn" : "en";
    document.documentElement.dataset.locale = locale;
  }, [locale]);

  const setLocale = (next: Locale) => {
    setLocaleState(next);
    window.localStorage.setItem(STORAGE_KEY, next);
  };

  const value = useMemo(
    () => ({
      locale,
      setLocale,
      t: dictionaries[locale],
    }),
    [locale],
  );

  return (
    <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within LanguageProvider");
  }
  return context;
}
