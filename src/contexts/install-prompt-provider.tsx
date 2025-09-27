/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { AnimatePresence } from "motion/react";
import { useContext, useEffect, useState } from "react";
import { motion } from "motion/react";
import { createContext } from "react";
import { useDictionary } from "@/providers/dictionary-provider";
import Markdown from "markdown-to-jsx"

interface InstallPromptContextData {
  open: boolean;
  setOpen: (open: boolean) => void;
  isCompatible: boolean;
}

const InstallPromptContext = createContext<
  InstallPromptContextData | undefined
>(undefined);

export function InstallPromptProvider({
  children,
}: {
  children?: React.ReactNode;
}) {
  const dict = useDictionary();
  const [open, setOpen] = useState(false);
  const [clicked, setClicked] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isAndroid, setIsAndroid] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<Event | null>(null);
  const [isInstallable, setIsInstallable] = useState(false);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsInstallable(true);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    return () =>
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt,
      );
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      (deferredPrompt as any).prompt();
      await (deferredPrompt as any).userChoice;
      setDeferredPrompt(null);
      setIsInstallable(false);
      closePrompt();
    }
  };

  useEffect(() => {
    setIsIOS(
      /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream,
    );
    setIsAndroid(
      /Android/.test(navigator.userAgent) && !(window as any).MSStream,
    );

    setIsStandalone(window.matchMedia("(display-mode: standalone)").matches);
  }, []);

  function closePrompt() {
    setOpen(false);
  }

  return (
    <InstallPromptContext.Provider
      value={{
        open,
        setOpen,
        isCompatible: !isStandalone && (isIOS || isAndroid),
      }}
    >
      {children}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute top-0 right-0 bottom-0 left-0 z-50 flex items-center justify-center backdrop-blur-xs"
          >
            <motion.div
              initial={{
                opacity: 0,
                y: 0,
                scale: 0.5,
                transition: {
                  type: "spring",
                  duration: 0.4,
                  bounce: 0.2,
                  ease: [0.4, 0, 0.2, 1],
                },
              }}
              animate={{
                opacity: 1,
                y: 0,
                scale: 1,
                transition: {
                  type: "spring",
                  duration: 0.4,
                  bounce: 0.2,
                  ease: [0.4, 0, 0.2, 1],
                },
              }}
              exit={{
                opacity: 0,
                y: 0,
                scale: 0.5,
                transition: {
                  type: "spring",
                  duration: 0.4,
                  bounce: 0.2,
                  ease: [0.4, 0, 0.2, 1],
                },
              }}
              className="bg-muted/90 drop-shadow-dark/5 border-dark/10 pointer-events-auto relative mx-5 flex max-w-prose origin-top flex-col gap-4 rounded-2xl border p-4 drop-shadow-2xl backdrop-blur-3xl focus:outline-0"
            >
              <div className="flex w-full items-start justify-between">
                <span className="flex items-center gap-3">
                  <div className="bg-primary-500/20 mt-1 flex items-center justify-center rounded-md p-2">
                    <div className="material-symbols-outlined text-primary-500 text-2xl">
                      phone_iphone
                    </div>
                  </div>
                  <span>
                    <h1 className="text-xl font-semibold">
                      {dict.pwa.install.title}
                    </h1>
                    <p className="text-muted-foreground text-sm">
                      {dict.pwa.install.subtitle}
                    </p>
                  </span>
                </span>
                {!clicked && (
                  <button
                    onClick={closePrompt}
                    className="material-symbols-outlined cursor-pointer text-2xl text-black/50 transition-colors hover:text-black"
                  >
                    close
                  </button>
                )}
              </div>
              {!clicked ? (
                <>
                  <p className="text-sm text-black/50">
                  <Markdown
                    className="text-base font-normal"
                    options={{
                      overrides: { strong: { props: { className: "font-semibold" } } },
                    }}
                  >
                    {dict.pwa.install.description}
                  </Markdown>
                  </p>
                  <button
                    onClick={() =>
                      isAndroid && isInstallable
                        ? handleInstallClick()
                        : setClicked(true)
                    }
                    className="bg-primary-400 cursor-pointer rounded-lg p-2 text-white shadow-sm transition-all hover:opacity-90 active:scale-95"
                  >
                    {dict.pwa.install.actions.add_to_home}
                  </button>
                </>
              ) : isIOS ? (
                <>
                  <p className="text-black/50">
                    To install this app on your iOS device:
                  </p>
                  <ul className="flex flex-col gap-5">
                    <li className="flex items-start gap-3">
                      <div className="bg-primary-500/20 mt-1 flex items-center justify-center rounded-md p-2">
                        <div className="material-symbols-outlined text-primary-500 text-xl">
                          ios_share
                        </div>
                      </div>
                      <span>
                        <h1 className="font-semibold">
                          {dict.pwa.instructions.ios.one}
                        </h1>
                        <p className="text-sm text-black/50">
                          {dict.pwa.instructions.ios.one_description}
                        </p>
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="bg-primary-500/20 mt-1 flex items-center justify-center rounded-md p-2">
                        <div className="material-symbols-outlined text-primary-500 text-xl">
                          add
                        </div>
                      </div>
                      <span>
                        <h1 className="font-semibold">
                          {dict.pwa.instructions.ios.two}
                        </h1>
                        <p className="text-sm text-black/50">
                          {dict.pwa.instructions.ios.two_description}
                        </p>
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="bg-primary-500/20 mt-1 flex items-center justify-center rounded-md p-2">
                        <div className="material-symbols-outlined text-primary-500 text-xl">
                          touch_app
                        </div>
                      </div>
                      <span>
                        <h1 className="font-semibold">{dict.pwa.instructions.ios.three}</h1>
                        <p className="text-sm text-black/50">
                          {dict.pwa.instructions.ios.three_description}
                        </p>
                      </span>
                    </li>
                  </ul>
                  <div className="grid w-full grid-cols-2 gap-2">
                    <button
                      onClick={() => setClicked(false)}
                      className="cursor-pointer rounded-lg border border-black/10 p-2 shadow-sm transition-all hover:opacity-90 active:scale-95"
                    >
                      {dict.ui.common.navigation.back}
                    </button>
                    <button
                      onClick={closePrompt}
                      className="bg-primary-400 cursor-pointer rounded-lg p-2 text-white shadow-sm transition-all hover:opacity-90 active:scale-95"
                    >
                      {dict.ui.common.buttons.got_it}
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <p className="text-black/50">
                    {dict.pwa.instructions.android.description}
                  </p>
                  <ul className="flex flex-col gap-5">
                    <li className="flex items-start gap-3">
                      <div className="bg-primary-500/20 mt-1 flex items-center justify-center rounded-md p-2">
                        <div className="material-symbols-outlined text-primary-500 text-xl">
                          more_vert
                        </div>
                      </div>
                      <span>
                        <h1 className="font-semibold">
                          {dict.pwa.instructions.android.one}
                        </h1>
                        <p className="text-sm text-black/50">
                          {dict.pwa.instructions.android.one_description}
                        </p>
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="bg-primary-500/20 mt-1 flex items-center justify-center rounded-md p-2">
                        <div className="material-symbols-outlined text-primary-500 text-xl">
                          add_to_home_screen
                        </div>
                      </div>
                      <span>
                        <h1 className="font-semibold">
                          {dict.pwa.instructions.android.two}
                        </h1>
                        <p className="text-sm text-black/50">
                          {dict.pwa.instructions.android.two_description}
                        </p>
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="bg-primary-500/20 mt-1 flex items-center justify-center rounded-md p-2">
                        <div className="material-symbols-outlined text-primary-500 text-xl">
                          touch_app
                        </div>
                      </div>
                      <span>
                        <h1 className="font-semibold">{dict.pwa.instructions.android.three}</h1>
                        <p className="text-sm text-black/50">
                          {dict.pwa.instructions.android.three_description}
                        </p>
                      </span>
                    </li>
                  </ul>
                  <div className="grid w-full grid-cols-2 gap-2">
                    <button
                      onClick={() => setClicked(false)}
                      className="cursor-pointer rounded-lg border border-black/10 p-2 shadow-sm transition-all hover:opacity-90 active:scale-95"
                    >
                      {dict.ui.common.navigation.back}
                    </button>
                    <button
                      onClick={closePrompt}
                      className="bg-primary-400 cursor-pointer rounded-lg p-2 text-white shadow-sm transition-all hover:opacity-90 active:scale-95"
                    >
                      {dict.ui.common.buttons.got_it}
                    </button>
                  </div>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </InstallPromptContext.Provider>
  );
}

export function useInstallPrompt() {
  const context = useContext(InstallPromptContext);
  if (context === undefined) {
    throw new Error(
      "useInstallPrompt must be used within an InstallPromptProvider",
    );
  }
  return {
    open: context.open,
    setOpen: context.setOpen,
    isCompatible: context.isCompatible,
  };
}
