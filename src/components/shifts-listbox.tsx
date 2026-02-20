import {
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
} from "@headlessui/react";
import { twMerge } from "tailwind-merge";
import clsx from "clsx";
import Card from "@/components/card";

interface IShiftsListbox {
  selectedItem: string;
  setSelectedItem: (item: string) => void;
  collection: { id: string; name: string }[];
  label?: string;
  className?: string;
}

export function ShiftsListbox({
  selectedItem,
  setSelectedItem,
  collection,
  label,
  className,
}: IShiftsListbox) {
  return (
    <Listbox
      as="div"
      value={selectedItem}
      onChange={setSelectedItem}
      className={"w-full"}
    >
      <ListboxButton
        className={twMerge(
          clsx(
            "group flex w-full cursor-pointer items-center justify-center rounded-md border border-gray-300 p-2 text-left select-none",
          ),
          className,
        )}
      >
        <div className={clsx("flex-1")}>
          <h3 className="text-xs sm:text-sm">{label}</h3>
          {selectedItem ? (
            <span className={clsx("block text-lg text-black")}>
              {collection.find((item) => item.id === selectedItem)?.name}
            </span>
          ) : (
            <span className={clsx("sm:block")}>Select an item</span>
          )}
        </div>
      </ListboxButton>
      <ListboxOptions
        as={Card}
        anchor={"bottom start"}
        transition
        className={twMerge(
          clsx(
            "flex w-(--button-width) origin-top flex-col gap-4 rounded-2xl border border-gray-300 p-4 transition duration-200 ease-out [--anchor-gap:-8px] data-closed:scale-95 data-closed:opacity-0 sm:translate-x-2",
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
              className="flex cursor-pointer items-center gap-3 select-none"
            >
              <div
                className={clsx(
                  "flex h-7 w-7 items-center justify-center rounded-full",
                  { "bg-primary-400": selectedItem === item.id },
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
