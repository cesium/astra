import {
  Dialog,
  DialogPanel,
  Transition,
  TransitionChild,
} from "@headlessui/react";
import clsx from "clsx";
import { Fragment } from "react";
import { twMerge } from "tailwind-merge";

interface IModalProps {
  modalState: boolean;
  onClose: () => void;
  children: React.ReactNode;
  className?: string;
}

export default function Modal({
  modalState,
  onClose,
  children,
  className,
}: IModalProps) {
  return (
    <Transition appear show={modalState} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <TransitionChild
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="bg-dark/5 fixed inset-0 backdrop-blur-sm" />
        </TransitionChild>
        <div className="fixed inset-0 flex w-screen items-center justify-center p-4">
          <TransitionChild
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <DialogPanel
              className={twMerge(
                clsx(
                  "bg-muted/65 relative max-w-lg flex-1 space-y-4 rounded-2xl border border-black/10 p-6 shadow-xl focus:outline-0",
                  className,
                ),
              )}
            >
              <div className="flex h-full w-full items-center justify-center">
                {children}
              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </Dialog>
    </Transition>
  );
}
