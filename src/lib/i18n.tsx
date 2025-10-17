"use client";

import React, { createContext, useContext, useMemo, useState } from "react";
import sr from "@/locales/sr/common.json";
import en from "@/locales/en/common.json";

type Lang = "sr" | "en";
type Dict = Record<string, string>;

const dictionaries: Record<Lang, Dict> = { sr, en } as const;

const LanguageContext = createContext<{
  lang: Lang;
  setLang: (l: Lang) => void;
}>({ lang: "sr", setLang: () => {} });

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLang] = useState<Lang>("sr");
  const value = useMemo(() => ({ lang, setLang }), [lang]);
  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  return useContext(LanguageContext);
}

export function useTranslations() {
  const { lang } = useLanguage();
  const dict = dictionaries[lang] || dictionaries.sr;
  return (key: string) => dict[key] ?? key;
}


