import { useDictionary } from "@/providers/dictionary-provider";
import { useChangePreference } from "@/lib/mutations/preferences";
import CustomCombobox from "@/components/combobox";
import { useState } from "react";
import Label from "@/components/label";
import { twMerge } from "tailwind-merge";
import clsx from "clsx";

function LanguageForm() {
  const dict = useDictionary();
  const [selectedLanguage, setSelectedLanguage] = useState<{
    id: string;
    name: string;
  } | null>(null);

  const changeLanguage = useChangePreference();

  const languageOptions = [
    { id: "en-US", name: "English" },
    { id: "pt-PT", name: "Português" },
  ];

  const handleSave = () => {
    if (selectedLanguage) {
      changeLanguage.mutate({
        language: selectedLanguage.id as "en-US" | "pt-PT",
      });
    }
  };

  return (
    <div className={twMerge(clsx("mb-10 space-y-1.5"))}>
      <div className="flex flex-col gap-2">
        <Label size="large" className="text-dark/50">
          {dict.settings.sections.account.fields.language}
        </Label>

        <CustomCombobox
          items={languageOptions}
          selectedItem={selectedLanguage}
          setSelectedItem={setSelectedLanguage}
          placeholder="Select a language"
          inputClassName="bg-white px-2 md:p-2.5 rounded-xl w-full bg-transparent text-md outline-none placeholder:text-black/30 invalid:border-red-500 invalid:text-red-600"
        />
      </div>

      <button
        type="button"
        onClick={handleSave}
        disabled={!selectedLanguage}
        className="bg-primary-400 hover:bg-primary-400/95 mt-6 cursor-pointer rounded-lg px-4 py-2 font-semibold text-white transition-all duration-200 hover:scale-98 disabled:cursor-not-allowed disabled:opacity-50 md:w-1/3"
      >
        {dict.settings.sections.account.actions.change_language}
      </button>

      {changeLanguage.isSuccess && (
        <p className="text-dark/50">
          {dict.alerts.settings.account.updated_language}
        </p>
      )}

      {changeLanguage.isError && (
        <p className="text-dark/50">
          {dict.alerts.settings.account.error_language}
        </p>
      )}
    </div>
  );
}

export default LanguageForm;
