/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { AnimatePresence } from "motion/react";
import { useContext, useEffect, useState } from "react";
import { motion } from "motion/react";
import { createContext } from "react";

interface InstallPromptContextData {
  open: boolean;
  setOpen: (open: boolean) => void;
  isStandalone: boolean;
}

const InstallPromptContext = createContext<
  InstallPromptContextData | undefined
>(undefined);

export function InstallPromptProvider({
  children,
}: {
  children?: React.ReactNode;
}) {
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
      const { outcome } = await (deferredPrompt as any).userChoice;
      setDeferredPrompt(null);
      setIsInstallable(false);
      closePrompt();
      console.log(`User response to the install prompt: ${outcome}`);
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

  useEffect(() => {
    const promptState = localStorage.getItem("installPromptDismissed");
    const promptStateDate = promptState ? new Date(promptState) : new Date();
    const currentDate = new Date();
    const daysDifference = Math.floor(
      (currentDate.getTime() - promptStateDate.getTime()) /
        (1000 * 60 * 60 * 24),
    );
    const acc = parseInt(
      localStorage.getItem("installPromptDismissedAcc") || "0",
    );

    // Prompts user to install app if:
    // - compatible device (iOS or Android)
    // - app is not already installed
    // - hasn't been shown the prompt in the last 7 days
    // - hasn't dismissed the prompt more than 2 times
    if (
      !isStandalone &&
      (isIOS || isAndroid) &&
      (promptState === null || daysDifference > 7) &&
      acc < 2
    ) {
      setTimeout(() => {
        setOpen(true);
      }, 2000);
    }
  }, [isStandalone, isIOS, isAndroid]);

  function closePrompt() {
    setOpen(false);
    localStorage.setItem("installPromptDismissed", new Date().toISOString());
    const acc = localStorage.getItem("installPromptDismissedAcc") || "0";
    localStorage.setItem(
      "installPromptDismissedAcc",
      (parseInt(acc) + 1).toString(),
    );
  }

  return (
    <InstallPromptContext.Provider value={{ open, setOpen, isStandalone }}>
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
              className="bg-muted/90 drop-shadow-dark/phone_iphone5 border-dark/10 pointer-events-auto relative mx-5 flex max-w-prose origin-top flex-col gap-4 rounded-2xl border p-4 drop-shadow-2xl backdrop-blur-3xl focus:outline-0"
            >
              <div className="flex w-full items-start justify-between">
                <span className="flex items-center gap-3">
                  <div className="bg-primary-500/20 mt-1 flex items-center justify-center rounded-md p-2">
                    <div className="material-symbols-outlined text-primary-500 text-2xl">
                      phone_iphone
                    </div>
                  </div>
                  <span>
                    <h1 className="text-xl font-semibold">Install App</h1>
                    <p className="text-muted-foreground text-sm">
                      Faster access, better experience.
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
                    Install <strong>Pombo</strong> on your home screen for a
                    better experience, faster loading and offline features.
                  </p>
                  <button
                    onClick={() =>
                      isAndroid && isInstallable
                        ? handleInstallClick()
                        : setClicked(true)
                    }
                    className="bg-primary-400 cursor-pointer rounded-lg p-2 text-white shadow-sm transition-all hover:opacity-90 active:scale-95"
                  >
                    Add to Home Screen
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
                          1. Tap the share button
                        </h1>
                        <p className="text-sm text-black/50">
                          {"Look for the share icon in Safari's toolbar"}
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
                          {'2. Select "Add to Home Screen"'}
                        </h1>
                        <p className="text-sm text-black/50">
                          {"Scroll down in the menu to find this option"}
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
                        <h1 className="font-semibold">{'3. Tap "Add"'}</h1>
                        <p className="text-sm text-black/50">
                          {"Confirm to add the app to your home screen"}
                        </p>
                      </span>
                    </li>
                  </ul>
                  <div className="grid w-full grid-cols-2 gap-2">
                    <button
                      onClick={() => setClicked(false)}
                      className="cursor-pointer rounded-lg border border-black/10 p-2 shadow-sm transition-all hover:opacity-90 active:scale-95"
                    >
                      Back
                    </button>
                    <button
                      onClick={closePrompt}
                      className="bg-primary-400 cursor-pointer rounded-lg p-2 text-white shadow-sm transition-all hover:opacity-90 active:scale-95"
                    >
                      Got it
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <p className="text-black/50">
                    To install this app on your Android device:
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
                          1. On Chrome, tap the three dots
                        </h1>
                        <p className="text-sm text-black/50">
                          {"Look for the three dots in the top right corner"}
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
                          {'2. Select "Add to Home Screen"'}
                        </h1>
                        <p className="text-sm text-black/50">
                          {"Scroll down in the menu to find this option"}
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
                        <h1 className="font-semibold">{'3. Tap "Install"'}</h1>
                        <p className="text-sm text-black/50">
                          {"Confirm to add the app to your home screen"}
                        </p>
                      </span>
                    </li>
                  </ul>
                  <div className="grid w-full grid-cols-2 gap-2">
                    <button
                      onClick={() => setClicked(false)}
                      className="cursor-pointer rounded-lg border border-black/10 p-2 shadow-sm transition-all hover:opacity-90 active:scale-95"
                    >
                      Back
                    </button>
                    <button
                      onClick={closePrompt}
                      className="bg-primary-400 cursor-pointer rounded-lg p-2 text-white shadow-sm transition-all hover:opacity-90 active:scale-95"
                    >
                      Got it
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
    isStandalone: context.isStandalone,
  };
}
