"use client";

import { createContext, useContext, useEffect, useState } from "react";
import type { Dictionary, Language } from "@/internationalization/dictionaries";
import { getDictionary } from "@/internationalization/dictionaries";

export type DictionaryLanguage = Language;

interface DictionaryContextData {
  dictionary: Dictionary;
  language: DictionaryLanguage;
}

const DictionaryContext = createContext<DictionaryContextData | undefined>(
  undefined,
);

/* FIXME: Check this function when the api is available */
export async function PreferedLanguage(): Promise<DictionaryLanguage> {
  const data = await fetch("https://api/preferences/language");
  if (!data.ok) {
    throw new Error("Failed to fetch preferred language");
  }
  const { language } = await data.json();
  return language as DictionaryLanguage;
}

export function getBrowserLanguage(): DictionaryLanguage {
  if (typeof navigator !== "undefined" && navigator.language) {
    return navigator.language as DictionaryLanguage;
  }
  return "en-US";
}

export function DictionaryProvider({
  children,
  language: propLanguage,
}: {
  children: React.ReactNode;
  language?: DictionaryLanguage;
}) {
  const [language, setLanguage] = useState<DictionaryLanguage>(
    propLanguage || "en-US",
  );

  useEffect(() => {
    if (!propLanguage) {
      (async () => {
        try {
          const preferredLanguage = await PreferedLanguage();
          setLanguage(preferredLanguage);
        } catch {
          setLanguage(getBrowserLanguage());
        }
      })();
    }
  }, [propLanguage]);

  const dictionary = getDictionary(language);

  return (
    <DictionaryContext.Provider value={{ dictionary, language }}>
      {children}
    </DictionaryContext.Provider>
  );
}

export function useDictionary() {
  const context = useContext(DictionaryContext);
  if (!context) {
    throw new Error("useDictionary must be used within a DictionaryProvider");
  }
  return context.dictionary;
}

export function useLanguage() {
  const context = useContext(DictionaryContext);
  if (!context) {
    throw new Error("useLanguage must be used within a DictionaryProvider");
  }
  return context.language;
}
