import { createContext, useContext } from "react";
import { ar } from "./ar";
import { en } from "./en";
import type { Language } from "../lib/types";

const dictionaries = { ar, en };
export type TranslationKey = keyof typeof en;

export function translate(language: Language, key: string, params?: Record<string, string | number>) {
  const dictionary = dictionaries[language] as Record<string, string>;
  let value = dictionary[key] || (dictionaries.en as Record<string, string>)[key] || key;
  if (params) {
    for (const [param, replacement] of Object.entries(params)) {
      value = value.replaceAll(`{${param}}`, String(replacement));
    }
  }
  return value;
}

export const I18nContext = createContext<{
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: string, params?: Record<string, string | number>) => string;
}>({
  language: "ar",
  setLanguage: () => {},
  t: (key) => key,
});

export function useI18n() {
  return useContext(I18nContext);
}
