"use client";

import {
  Dialog,
  DialogPanel,
  DialogTitle,
  Transition,
  TransitionChild,
} from "@headlessui/react";
import { Fragment, useRef, useState } from "react";

interface ModalProps {
  modalState: boolean;
  setModalState: (state: boolean) => void;
  title?: string;
  url: string; // Adding URL here
}

export default function CalendarExportModal({
  modalState,
  setModalState,
  title = "Export Calendar",
  url,
}: ModalProps) {
  const [isCopied, setIsCopied] = useState(false);
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({});

  const sectionRefs = {
    how: useRef<HTMLDivElement>(null),
    google: useRef<HTMLDivElement>(null),
    apple: useRef<HTMLDivElement>(null),
    outlook: useRef<HTMLDivElement>(null),
  };

  function copyToClipboard() {
    navigator.clipboard.writeText(url).then(() => {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 1200);
    });
  }

  const toggleSection = (key: string) => {
    setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const sections = [
    {
      key: "how",
      title: "How does it work?",
      content: (
        <div className="space-y-2 text-justify text-sm">
          <p>
            The URL above allows you to{" "}
            <span className="font-medium">subscribe</span> to your shifts.
          </p>
          <p>You will see your shifts in your calendar app.</p>
          <div className="bg-warning/30 text-warning flex items-center gap-2 rounded-lg p-3 text-sm">
            <span className="material-symbols-outlined text-base">warning</span>
            If you change shifts, you will need to re-export and re-subscribe.
          </div>
        </div>
      ),
    },
    {
      key: "google",
      title: "Google Calendar",
      content: (
        <ol className="ml-6 list-decimal space-y-1 text-sm">
          <li>
            Open{" "}
            <a href="https://calendar.google.com" className="text-primary-400">
              Google Calendar
            </a>
            .
          </li>
          <li>On the left, click Add → From URL.</li>
          <li>Enter the above calendar’s address.</li>
          <li>Click Add Calendar.</li>
        </ol>
      ),
    },
    {
      key: "apple",
      title: "Apple Calendar",
      content: (
        <ol className="ml-6 list-decimal space-y-1 text-sm">
          <li>Open Calendar on your iPhone or Mac.</li>
          <li>Click Add Calendar → Add Subscription Calendar.</li>
          <li>Enter the above calendar’s address and subscribe.</li>
        </ol>
      ),
    },
    {
      key: "outlook",
      title: "Outlook Calendar",
      content: (
        <ol className="ml-6 list-decimal space-y-1 text-sm">
          <li>Sign in to Outlook.com.</li>
          <li>Select Add Calendar → Subscribe from web.</li>
          <li>Enter the above calendar’s address.</li>
        </ol>
      ),
    },
  ];

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
          <div className="bg-dark/5 fixed inset-0 backdrop-blur-sm" />
        </TransitionChild>

        <div className="fixed inset-0 flex items-center justify-center p-4">
          <TransitionChild
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <DialogPanel className="bg-muted/65 relative w-full max-w-lg flex-1 space-y-4 rounded-2xl border border-black/10 p-6 shadow-xl focus:outline-0">
              {title && (
                <div className="flex items-center justify-between pb-4">
                  <DialogTitle className="text-dark text-2xl font-semibold">
                    {title}
                  </DialogTitle>
                  <button
                    className="material-symbols-outlined text-dark/50 cursor-pointer text-2xl transition-opacity ease-in-out hover:opacity-70"
                    onClick={() => setModalState(false)}
                  >
                    close
                  </button>
                </div>
              )}

              <div
                onClick={copyToClipboard}
                className={`text-dark bg-light/70 border-dark/10 w-full cursor-pointer rounded-lg border px-3 py-2 transition-colors duration-200 ${
                  isCopied
                    ? "bg-green-100 hover:bg-green-200"
                    : "hover:bg-primary-100"
                }`}
              >
                <div className="no-scrollbar overflow-x-auto text-sm whitespace-nowrap">
                  {url}
                </div>
                <div
                  className={`mt-1 text-xs ${isCopied ? "text-green-700" : "text-dark/50"}`}
                >
                  {isCopied ? "Copied!" : "Click to copy"}
                </div>
              </div>

              <div className="divide-dark/10 divide-y">
                {sections.map((section) => (
                  <div key={section.key} className="py-2">
                    <button
                      onClick={() => toggleSection(section.key)}
                      className="text-dark flex w-full items-center justify-between text-left text-base font-medium"
                    >
                      {section.title}
                      <span className="material-symbols-outlined text-dark/60">
                        {openSections[section.key]
                          ? "expand_less"
                          : "expand_more"}
                      </span>
                    </button>
                    <div
                      ref={sectionRefs[section.key as keyof typeof sectionRefs]}
                      className="overflow-hidden transition-[max-height] duration-300"
                      style={{
                        maxHeight: openSections[section.key]
                          ? `${
                              sectionRefs[
                                section.key as keyof typeof sectionRefs
                              ].current?.scrollHeight || 0
                            }px`
                          : 0,
                      }}
                    >
                      <div className="mt-2">{section.content}</div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="text-dark/80 mt-4 flex items-center gap-2 text-sm">
                <span className="material-symbols-outlined text-base">
                  lightbulb
                </span>
                <span>
                  You can also{" "}
                  <a href={url} className="text-primary-400 font-medium">
                    download as .ics file
                  </a>
                  .
                </span>
              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </Dialog>
    </Transition>
  );
}
