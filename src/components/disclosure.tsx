import {
  DisclosureButton,
  DisclosurePanel,
  Disclosure,
} from "@headlessui/react";
import { AnimatePresence, motion } from "motion/react";
import { Fragment } from "react";

interface ICustomDisclosureProps {
  disclosureChild?: boolean;
  label: string;
  children: React.ReactNode;
}

export default function CustomDisclosure({
  disclosureChild = false,
  label,
  children,
}: ICustomDisclosureProps) {
  return (
    <Disclosure as="div">
      {({ open }) => (
        <>
          <DisclosureButton className="group hover:bg-dark/5 bg-muted z-10 mb-1 flex w-full cursor-pointer items-center rounded-xl px-2 py-3 transition-colors">
            <span className="material-symbols-outlined mr-2 text-xl text-zinc-500 opacity-50 transition duration-150 group-data-[open]:-scale-100">
              keyboard_arrow_down
            </span>
            <h2 className="text-dark w-full text-left font-medium">{label}</h2>
          </DisclosureButton>

          <AnimatePresence>
            {open && (
              <DisclosurePanel static as={Fragment}>
                <motion.div
                  className="flex w-full overflow-hidden"
                  initial={{ height: 0 }}
                  animate={
                    disclosureChild
                      ? {
                          height: "auto",
                          opacity: 1,
                        }
                      : {
                          height: "auto",
                          transition: {
                            type: "spring",
                            stiffness: 120,
                            damping: 20,
                          },
                        }
                  }
                  exit={
                    disclosureChild
                      ? {
                          opacity: 0,
                          height: 0,
                        }
                      : {
                          height: 0,
                          transition: {
                            type: "spring",
                            stiffness: 2000,
                            damping: 200,
                            mass: 5,
                          },
                        }
                  }
                >
                  {children}
                </motion.div>
              </DisclosurePanel>
            )}
          </AnimatePresence>
        </>
      )}
    </Disclosure>
  );
}
