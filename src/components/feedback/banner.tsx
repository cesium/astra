"use client";

import { useEffect, useState } from "react";
import { twMerge } from "tailwind-merge";
import FeedbackModal from "./feedback-modal";
import { useGetUserInfo } from "@/lib/queries/session";

const DISMISSED_AT_KEY = "feedback_banner_dismissed_at";
const DISMISS_DURATION_MS = 7 * 24 * 60 * 60 * 1000;
const CLOSE_ANIMATION_MS = 500;

interface IFeedbackBanner {
  bannerText: string;
  linkText: string;
}

function isDismissed() {
  try {
    const dismissedAt = Number(localStorage.getItem(DISMISSED_AT_KEY));
    if (!dismissedAt) return false;

    return Date.now() - dismissedAt < DISMISS_DURATION_MS;
  } catch {
    return false;
  }
}

function saveDismissed() {
  try {
    localStorage.setItem(DISMISSED_AT_KEY, Date.now().toString());
  } catch {
    // localStorage unavailable (e.g. private mode)
  }
}

function FeedbackBanner({ bannerText, linkText }: IFeedbackBanner) {
  // Starts hidden and is only shown after mount, so the server render and the
  // first client render match (localStorage only exists in the browser).
  const [isVisible, setIsVisible] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [isModalVisible, setModalVisible] = useState(false);

  const { data: user } = useGetUserInfo();

  useEffect(() => {
    setIsVisible(!isDismissed());
  }, []);

  useEffect(() => {
    if (!isClosing) return;

    const timeout = setTimeout(() => setIsVisible(false), CLOSE_ANIMATION_MS);
    return () => clearTimeout(timeout);
  }, [isClosing]);

  function handleCloseBanner() {
    saveDismissed();
    setIsClosing(true);
  }

  // Only signed-in users can send reports. Wait for the user to load so the
  // banner doesn't flash for signed-out visitors.
  if (!user) return null;

  return (
    <>
      {isVisible && (
        <div className="fixed bottom-0 left-1/2 z-50 w-full -translate-x-1/2 transform md:bottom-4 md:w-auto">
          <div
            className={twMerge(
              "bg-primary-400 text-light flex transform px-4 py-3 transition-all duration-500 md:rounded-xl",
              isClosing
                ? "translate-y-full opacity-0"
                : "translate-y-0 opacity-100",
            )}
          >
            <div>
              <span className="material-symbols-outlined align-bottom text-xl font-bold">
                error
              </span>
              <span>
                {" "}
                <strong>Feedback ·</strong> {bannerText}
              </span>
              <button
                onClick={() => setModalVisible(true)}
                className="cursor-pointer pl-1 font-bold underline"
              >
                {linkText}
              </button>
            </div>
            <button
              onClick={handleCloseBanner}
              aria-label="Dismiss feedback banner"
              className="ml-auto shrink-0"
            >
              <span className="material-symbols-outlined cursor-pointer pl-6 align-bottom text-xl font-bold">
                cancel
              </span>
            </button>
          </div>
        </div>
      )}

      <FeedbackModal
        isOpen={isModalVisible}
        onClose={() => setModalVisible(false)}
      />
    </>
  );
}

export default FeedbackBanner;
