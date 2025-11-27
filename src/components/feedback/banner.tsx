"use client";

import { useState } from "react";
import { twMerge } from "tailwind-merge";
import FeedbackModal from "./modal";
import AddFeedbackContent from "./add-feedback-content";
import { useGetUserInfo } from "@/lib/queries/session";

interface IFeedbackBanner {
  bannerText: string;
  linkText: string;
}

function FeedbackBanner({ bannerText, linkText }: IFeedbackBanner) {
  const [isVisible, setIsVisible] = useState(true);
  const [isClosing, setIsClosing] = useState(false);
  const [isModalVisible, setModalVisible] = useState(false);

  const { data: user } = useGetUserInfo();
  const type = user?.type;
  if (type === "admin") return null;

  function handleCloseBanner() {
    setIsClosing(true);
    setTimeout(() => {
      setIsVisible(false);
    }, 500);
  }

  if (!isVisible) return null;

  return (
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
            mode_comment
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
        <button onClick={handleCloseBanner} className="ml-auto shrink-0">
          <span className="material-symbols-outlined cursor-pointer pl-6 align-bottom text-xl font-bold">
            cancel
          </span>
        </button>
      </div>
      <FeedbackModal
        modalState={isModalVisible}
        setModalState={setModalVisible}
        title="Give feedback"
      >
        <AddFeedbackContent setModalState={setModalVisible} />
      </FeedbackModal>
    </div>
  );
}

export default FeedbackBanner;
