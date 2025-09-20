"use client";

import { createContext, useContext, useEffect, useState } from "react";
import type { Dictionary, Language } from "@/internationalization/dictionaries";
import { getDictionary } from "@/internationalization/dictionaries";
import { useGetUserInfo } from "@/lib/queries/session";
import { useGetUserPreference } from "@/lib/queries/preferences";

export type DictionaryLanguage = Language;

interface DictionaryContextData {
  dictionary: Dictionary;
  language: DictionaryLanguage;
  setLanguage?: (language: DictionaryLanguage) => void;
}

const DictionaryContext = createContext<DictionaryContextData | undefined>(
  undefined,
);

export function usePreferredLanguage(): DictionaryLanguage {
  const { data: language} = useGetUserPreference("language");
  return language?.data.language;
}

export function getBrowserLanguage(): DictionaryLanguage {
  if (typeof navigator !== "undefined" && navigator.language) {
    console.log("NAVIGATOr",navigator.language)
    return navigator.language as DictionaryLanguage;
  }
  return "en-US";
}

export function DictionaryProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [language, setLanguage] = useState<DictionaryLanguage>("en-US");

  const user = useGetUserInfo();
  const preferredLanguage = usePreferredLanguage();

  useEffect(() => {
      try {
        if (user && preferredLanguage) {
          setLanguage(preferredLanguage);
        } else {
          setLanguage(getBrowserLanguage());
        }
      } catch {
        setLanguage("en-US");
    }
  }, [user, preferredLanguage]);
  console.log("FINAL", language)
  const dictionary = getDictionary(language);
  return (
    <DictionaryContext.Provider value={{ dictionary, language, setLanguage }}>
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
