import {
  Listbox,
  ListboxButton,
  ListboxOptions,
  ListboxOption,
} from "@headlessui/react";
import Card from "../../card";
import clsx from "clsx";
import { twMerge } from "tailwind-merge";

interface IExchangeListbox {
  selectedItem: string;
  setSelectedItem: (item: string) => void;
  collection: { id: string; name: string }[];
  rounded?: boolean;
  label?: string;
  highlightText?: boolean;
  arrowDown?: boolean;
}

export default function ExchangeListbox({
  selectedItem,
  setSelectedItem,
  collection,
  rounded,
  label,
  highlightText,
  arrowDown,
}: IExchangeListbox) {
  return (
    <Listbox as="div" value={selectedItem} onChange={setSelectedItem}>
      <ListboxButton
        className={twMerge(
          clsx(
            "group flex w-full cursor-pointer items-center justify-center rounded-md border border-gray-300 p-2 text-left",
            { "h-16 rounded-full p-4 sm:h-20 sm:p-6 md:h-25": rounded },
            {
              "text-celeste hover:text-celeste/80 transition-all duration-150":
                highlightText,
            },
          ),
        )}
      >
        <div
          className={clsx(
            "flex-1",
            { "text-center": rounded },
            { "mt-4": rounded && arrowDown },
          )}
        >
          <h3 className="text-xs sm:text-sm">{label}</h3>
          {selectedItem ? (
            <span
              className={clsx("block text-lg", { "font-semibold": rounded })}
            >
              {collection.find((item) => item.id === selectedItem)?.name}
            </span>
          ) : (
            <span className={clsx("sm:block", { "hidden": rounded })}>
              Select an item
            </span>
          )}
          {arrowDown && rounded && (
            <span
              className="material-symbols-outlined text-dark/50 block group-data-open:rotate-180"
              style={{ fontSize: "20px" }}
            >
              keyboard_arrow_down
            </span>
          )}
        </div>
        {arrowDown && !rounded && (
          <span
            className="material-symbols-outlined block group-data-open:rotate-180"
            style={{ fontSize: "28px" }}
          >
            keyboard_arrow_down
          </span>
        )}
      </ListboxButton>
      <ListboxOptions
        as={Card}
        anchor={`${rounded ? "top start" : "bottom start"}`}
        transition
        className={twMerge(
          clsx(
            "flex w-(--button-width) origin-top flex-col gap-4 rounded-2xl border border-gray-300 p-4 transition duration-200 ease-out [--anchor-gap:-8px] data-closed:scale-95 data-closed:opacity-0 sm:w-[310px] sm:translate-x-2",
            { "sm:-translate-x-10": rounded },
          ),
        )}
      >
        {collection.length === 0 ? (
          <div className="text-center text-sm text-gray-500">
            No options available
          </div>
        ) : (
          collection.map((item) => (
            <ListboxOption
              key={item.id}
              value={item.id}
              className="flex items-center gap-3"
            >
              <div
                className={clsx(
                  "flex h-7 w-7 items-center justify-center rounded-full",
                  { "bg-celeste": selectedItem === item.id },
                  { "border-2 border-gray-300": selectedItem !== item.id },
                )}
              >
                <div
                  className={clsx("flex h-2 w-2 rounded-full", {
                    "bg-white": selectedItem === item.id,
                  })}
                ></div>
              </div>
              <span className="line-clamp-1 text-lg leading-5">
                {item.name}
              </span>
            </ListboxOption>
          ))
        )}
      </ListboxOptions>
    </Listbox>
  );
}
