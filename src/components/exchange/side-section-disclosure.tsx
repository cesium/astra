import React from "react";
import Card from "../card";
import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
} from "@headlessui/react";

interface ISideSectionDisclosure {
  title: string;
  children: React.ReactNode;
}

export default function SideSectionDisclosure({
  title,
  children,
}: ISideSectionDisclosure) {
  return (
    <div>
      <Card>
        <Disclosure defaultOpen as="div" className="w-full">
          <DisclosureButton className="group flex w-full items-center justify-between">
            <h2 className="text-sm font-semibold uppercase">{title}</h2>
            <span
              style={{ fontSize: "30px" }}
              className="material-symbols-outlined group-data-open:rotate-180"
            >
              keyboard_arrow_down
            </span>
          </DisclosureButton>
          <div className="overflow-hidden">
            <DisclosurePanel
              transition
              className="origin-top pt-1 transition duration-200 ease-out data-closed:-translate-y-6 data-closed:opacity-0"
            >
              {children}
            </DisclosurePanel>
          </div>
        </Disclosure>
      </Card>
    </div>
  );
}
