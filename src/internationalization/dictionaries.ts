import en from "./dictionaries/en.json";
import pt from "./dictionaries/pt.json";

const dictionaries = {
  "en-US": en,
  "pt-PT": pt,
};

export type Language = keyof typeof dictionaries;
export type Dictionary = (typeof dictionaries)[Language];

export const getDictionary = (lang: Language): Dictionary => {
  return dictionaries[lang] || dictionaries["en-US"];
};
