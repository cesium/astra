"use client";

import { createContext, useContext, useEffect, useState } from "react";
import type { Dictionary, Language } from "@/internationalization/dictionaries";
import { getDictionary } from "@/internationalization/dictionaries";
import { api } from "@/lib/api";
import { useGetUserInfo } from "@/lib/queries/session";

export type DictionaryLanguage = Language;

interface DictionaryContextData {
  dictionary: Dictionary;
  language: DictionaryLanguage;
  setLanguage?: (language: DictionaryLanguage) => void;
}

const DictionaryContext = createContext<DictionaryContextData | undefined>(
  undefined,
);

export async function PreferedLanguage(): Promise<DictionaryLanguage> {
  const response = await api.get("/auth/preferences/language");
  console.log(response);
  if (!response) {
    throw new Error("Failed to fetch preferred language");
  }
  const { language } = response.data;

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

  const user = useGetUserInfo();

  useEffect(() => {
    if (!propLanguage) {
      (async () => {
        try {
          if (user) {
            const preferredLanguage = await PreferedLanguage();
            setLanguage(preferredLanguage);
          } else {
            setLanguage(getBrowserLanguage());
          }
        } catch {
          setLanguage("en-US");
        }
      })();
    }
  }, [propLanguage, user]);

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
