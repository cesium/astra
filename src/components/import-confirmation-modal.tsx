"use client";

import {
  Dialog,
  DialogPanel,
  DialogTitle,
  Transition,
  TransitionChild,
} from "@headlessui/react";
import { Fragment, useEffect, useState } from "react";

interface ImportConfirmationModalProps {
  selectedFile: File | null;
  onConfirm: () => void;
  onCancel: () => void;
  title: string;
  description: string;
  isLoading?: boolean;
  isSuccess?: boolean;
  isError?: boolean;
}

export default function ImportConfirmationModal({
  selectedFile,
  onConfirm,
  onCancel,
  title,
  description,
  isLoading = false,
  isSuccess = false,
  isError = false,
}: ImportConfirmationModalProps) {
  const [isMobile, setIsMobile] = useState(false);
  const isOpen = !!selectedFile;

  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkIsMobile();
    window.addEventListener("resize", checkIsMobile);
    return () => window.removeEventListener("resize", checkIsMobile);
  }, []);

  if (!selectedFile) return null;

  const getButtonState = () => {
    if (isLoading)
      return {
        text: "Importing...",
        color: "bg-primary-400 hover:bg-primary-500",
      };
    if (isSuccess)
      return { text: "Imported!", color: "bg-green-600 hover:bg-green-700" };
    if (isError)
      return { text: "Try Again", color: "bg-red-600 hover:bg-red-700" };
    return {
      text: "Confirm Import",
      color: "bg-primary-400 hover:bg-primary-500",
    };
  };

  const buttonState = getButtonState();

  if (isMobile) {
    return (
      <Transition show={isOpen} as={Fragment}>
        <Dialog onClose={onCancel} className="relative z-50">
          <TransitionChild
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/20 backdrop-blur-sm" />
          </TransitionChild>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-end justify-center">
              <TransitionChild
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 translate-y-full"
                enterTo="opacity-100 translate-y-0"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 translate-y-0"
                leaveTo="opacity-0 translate-y-full"
              >
                <DialogPanel className="w-full max-w-md transform rounded-t-2xl bg-white p-6 shadow-xl transition-all">
                  <div className="mx-auto mb-4 h-1 w-12 rounded-full bg-gray-300" />

                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-orange-100">
                      <span className="material-symbols-outlined text-primary-400">
                        upload_file
                      </span>
                    </div>

                    <div className="flex-1">
                      <DialogTitle className="mb-2 text-lg font-semibold text-gray-900">
                        {title}
                      </DialogTitle>
                      <p className="mb-1 text-sm text-gray-600">
                        Are you sure you want to import the file{" "}
                        <span className="font-medium">
                          "{selectedFile.name}"
                        </span>
                        ?
                      </p>
                      <p className="text-xs text-gray-500">{description}</p>

                      {isSuccess && (
                        <div className="mt-3 flex items-center gap-2 rounded-md bg-green-50 px-3 py-2 text-sm text-green-700">
                          <span className="material-symbols-outlined text-base">
                            check_circle
                          </span>
                          File imported successfully!
                        </div>
                      )}

                      {isError && (
                        <div className="mt-3 flex items-center gap-2 rounded-md bg-red-50 px-3 py-2 text-sm text-red-600">
                          <span className="material-symbols-outlined text-base">
                            error
                          </span>
                          Error importing file. Please try again.
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="mt-6 flex gap-3">
                    <button
                      onClick={onCancel}
                      disabled={isLoading}
                      className="flex-1 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={onConfirm}
                      disabled={isLoading}
                      className={`flex-1 rounded-lg px-4 py-2 text-sm font-medium text-white transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${buttonState.color}`}
                    >
                      {buttonState.text}
                    </button>
                  </div>
                </DialogPanel>
              </TransitionChild>
            </div>
          </div>
        </Dialog>
      </Transition>
    );
  }

  return (
    <Transition show={isOpen} as={Fragment}>
      <Dialog onClose={onCancel} className="relative z-50">
        <TransitionChild
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/25 backdrop-blur-sm" />
        </TransitionChild>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <TransitionChild
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <DialogPanel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 shadow-xl transition-all">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-orange-100">
                    <span className="material-symbols-outlined text-primary-400">
                      upload_file
                    </span>
                  </div>

                  <div className="flex-1">
                    <DialogTitle className="mb-2 text-lg font-semibold text-gray-900">
                      {title}
                    </DialogTitle>
                    <p className="mb-1 text-sm text-gray-600">
                      Are you sure you want to import the file{" "}
                      <span className="font-medium">"{selectedFile.name}"</span>
                      ?
                    </p>
                    <p className="text-xs text-gray-500">{description}</p>

                    {isSuccess && (
                      <div className="mt-3 flex items-center gap-2 rounded-md bg-green-50 px-3 py-2 text-sm text-green-700">
                        <span className="material-symbols-outlined text-base">
                          check_circle
                        </span>
                        File imported successfully!
                      </div>
                    )}

                    {isError && (
                      <div className="mt-3 flex items-center gap-2 rounded-md bg-red-50 px-3 py-2 text-sm text-red-600">
                        <span className="material-symbols-outlined text-base">
                          error
                        </span>
                        Error importing file. Please try again.
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-6 flex gap-3 sm:flex-row-reverse">
                  <button
                    onClick={onConfirm}
                    disabled={isLoading}
                    className={`flex-1 rounded-lg px-4 py-2 text-sm font-medium text-white transition-colors disabled:cursor-not-allowed disabled:opacity-50 sm:flex-initial sm:px-6 ${buttonState.color}`}
                  >
                    {buttonState.text}
                  </button>
                  <button
                    onClick={onCancel}
                    disabled={isLoading}
                    className="flex-1 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 sm:flex-initial sm:px-6"
                  >
                    Cancel
                  </button>
                </div>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
