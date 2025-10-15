import {
  Dialog,
  DialogPanel,
  Transition,
  TransitionChild,
} from "@headlessui/react";

import { Fragment } from "react";

export default function ExchangeModal({
  modalState,
  setModalState,
  title,
  children,
}: {
  modalState: boolean;
  setModalState: (state: boolean) => void;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <Transition appear show={modalState} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-50"
        onClose={() => setModalState(false)}
      >
        <TransitionChild
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-white/60 backdrop-blur-xl" />
        </TransitionChild>

        <div className="fixed inset-0 flex h-[calc(100vh-80px)] w-screen items-center justify-center p-4">
          <TransitionChild
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <DialogPanel className="relative max-w-[586px] flex-1 space-y-4 p-4 focus:outline-0 sm:p-0">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold sm:text-3xl">{title}</h2>
              </div>
              {children}
            </DialogPanel>
          </TransitionChild>
        </div>
      </Dialog>
    </Transition>
  );
}
