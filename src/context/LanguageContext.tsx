import React, { createContext, useContext, useState, useEffect } from "react";
import {
  Language,
  LanguageOption,
  SUPPORTED_LANGUAGES,
  TranslationDictionary,
  TRANSLATIONS,
} from "../translations";

export type LanguageCode = Language;
export { SUPPORTED_LANGUAGES };
export type { LanguageOption, TranslationDictionary };

export interface LanguageContextType {
  language: LanguageCode;
  setLanguage: (lang: LanguageCode) => void;
  currentOption: LanguageOption;
  t: TranslationDictionary;
  dir: "ltr" | "rtl";
}

const LANGUAGE_STORAGE_KEY = "afriversty_language";

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<LanguageCode>(() => {
    try {
      const stored = localStorage.getItem(LANGUAGE_STORAGE_KEY) as LanguageCode | null;
      if (stored && SUPPORTED_LANGUAGES.some((l) => l.code === stored)) {
        return stored;
      }
    } catch {
      // Ignore localStorage errors
    }
    return "en";
  });

  const currentOption =
    SUPPORTED_LANGUAGES.find((l) => l.code === language) || SUPPORTED_LANGUAGES[0];

  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute("lang", language);
    root.setAttribute("dir", currentOption.dir);

    try {
      localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
    } catch {
      // Ignore
    }
  }, [language, currentOption.dir]);

  const setLanguage = (newLang: LanguageCode) => {
    setLanguageState(newLang);
  };

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        currentOption,
        t: TRANSLATIONS[language] || TRANSLATIONS.en,
        dir: currentOption.dir,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};
