"use client";

import { IItemProps } from "@/lib/types";
import {
  ComboboxInput,
  ComboboxOptions,
  Combobox,
  ComboboxOption,
  ComboboxButton,
} from "@headlessui/react";
import clsx from "clsx";
import { useState } from "react";

interface ICustomCombobox {
  items: IItemProps[];
  selectedItem: IItemProps | null;
  setSelectedItem: (item: IItemProps | null) => void;
  className?: string;
  placeholder?: string;
}

export default function CustomCombobox({
  items,
  selectedItem,
  setSelectedItem,
  className,
  placeholder,
}: ICustomCombobox) {
  const [query, setQuery] = useState("");

  const filteredItems =
    query === ""
      ? items
      : Object.values(items).filter((item) => {
          return item.name.toLowerCase().includes(query.toLowerCase());
        });

  return (
    <Combobox
      value={selectedItem}
      onChange={setSelectedItem}
      onClose={() => setQuery("")}
    >
      <div className={clsx("relative", className)}>
        <ComboboxInput
          aria-label="Assignee"
          placeholder={placeholder}
          displayValue={(item: IItemProps) => item?.name || ""}
          onChange={(event) => setQuery(event.target.value)}
          className={clsx(
            "bg-muted border-dark/10 w-full rounded-lg border py-1.5 pr-8 pl-3 text-sm/6",
            "focus:not-data-focus:outline-none data-focus:outline-2 data-focus:-outline-offset-2 data-focus:outline-white/25",
          )}
        />

        <ComboboxButton className="absolute inset-y-2 right-0 px-2.5">
          <span className="material-symbols-outlined text-2xl">
            keyboard_arrow_down
          </span>
        </ComboboxButton>
      </div>
      <ComboboxOptions
        anchor="bottom"
        transition
        className={clsx(
          "border-dark/5 bg-muted w-(--input-width) rounded-xl border p-1 [--anchor-gap:--spacing(1)] empty:invisible",
          "transition duration-100 ease-in data-leave:data-closed:opacity-0",
        )}
      >
        {filteredItems.map((item) => (
          <ComboboxOption
            key={item.id}
            value={item}
            className="group data-focus:bg-primary-400/10 flex cursor-default items-center gap-2 rounded-lg px-3 py-1.5 select-none"
          >
            <span className="material-symbols-outlined invisible size-4 text-xl group-data-selected:visible">
              check
            </span>
            <div>{item.name}</div>
          </ComboboxOption>
        ))}
      </ComboboxOptions>
    </Combobox>
  );
}
