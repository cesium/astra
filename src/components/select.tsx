import {
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
} from "@headlessui/react";
import clsx from "clsx";

interface IItemProps {
  id: string;
  name: string;
}

interface ICustomSelectProps {
  items: IItemProps[];
  selectedItem: IItemProps;
  setSelectedItem: (item: IItemProps) => void;
  className?: string;
}

export default function CustomSelect({
  items,
  selectedItem,
  setSelectedItem,
  className,
}: ICustomSelectProps) {
  return (
    <div className={className}>
      <Listbox value={selectedItem} onChange={setSelectedItem}>
        <ListboxButton
          className={clsx(
            "bg-muted relative block w-full cursor-pointer rounded-lg py-1.5 pr-8 pl-3 text-left text-sm/6",
            "data-focus:outline-dark/25 focus:not-data-focus:outline-none data-focus:outline-2 data-focus:-outline-offset-2",
          )}
        >
          {selectedItem.name}
          <span className="material-symbols-outlined group pointer-events-none absolute top-2.5 right-2.5 text-2xl">
            keyboard_arrow_down
          </span>
        </ListboxButton>
        <ListboxOptions
          transition
          anchor="bottom"
          className={clsx(
            "border-dark/5 bg-muted w-(--button-width) rounded-xl border p-1 [--anchor-gap:--spacing(1)] focus:outline-none",
            "origin-top transition duration-200 ease-out data-closed:scale-95 data-closed:opacity-0 data-leave:data-closed:opacity-0",
          )}
        >
          {items.map((item) => (
            <ListboxOption
              key={item.name}
              value={item}
              className="group data-focus:bg-primary-400/10 flex cursor-pointer items-center gap-3 rounded-lg px-3 py-1.5 transition duration-200 select-none"
            >
              <span className="material-symbols-outlined invisible size-4 text-xl group-data-selected:visible">
                check
              </span>
              <div className="text-sm">{item.name}</div>
            </ListboxOption>
          ))}
        </ListboxOptions>
      </Listbox>
    </div>
  );
}
