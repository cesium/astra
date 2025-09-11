"use client";

import { useState } from "react";
import ExchangeCard from "./utils/card";
import ExchangeModal from "./utils/modal";
import AddExchangeContent from "./add-exchange-content";
import { twMerge } from "tailwind-merge";

interface ICardSectionProps {
  title?: string;
  drafts?: boolean;
  pending?: boolean;
  completed?: boolean;
  data?: {
    uc: string;
    from: string;
    to: string;
    state: string;
    exchange_id: string;
  }[];
}

export default function CardsSection({
  title,
  drafts,
  pending,
  completed,
  data,
}: ICardSectionProps) {
  const [exchangeModalState, setExchangeModalState] = useState(false);
  return (
    <div className={twMerge("flex flex-col gap-6", drafts ? "gap-0" : "")}>
      <h2 className="text-xl font-semibold">{title}</h2>
      {drafts && (
        <button
          onClick={() => setExchangeModalState(true)}
          className="mb-2 flex w-full cursor-pointer place-items-center justify-center gap-2 rounded-2xl border border-gray-100 bg-gray-100 p-4 transition-all duration-150 hover:border-gray-200 hover:bg-gray-200 lg:hidden lg:min-w-[294px]"
        >
          <span
            className="material-symbols-outlined"
            style={{ fontSize: "24px" }}
          >
            add
          </span>
          <span>Create a shift exchange request</span>
        </button>
      )}
      <div className="relative">
        <div className="no-scrollbar flex gap-2 overflow-x-auto lg:flex-wrap">
          {data &&
            data.map((exchange, index) => (
              <ExchangeCard
                key={index}
                uc={exchange.uc}
                from={exchange.from}
                to={exchange.to}
                pending={pending}
                completed={completed}
                exchange_id={exchange.exchange_id}
              />
            ))}
          {!drafts && data && data.length === 0 && (
            <>
              {pending && (
                <p className="text-gray-500">No pending requests to show.</p>
              )}
              {completed && (
                <p className="text-gray-500">No completed requests to show.</p>
              )}
            </>
          )}
          {drafts && (
            <>
              <button
                onClick={() => setExchangeModalState(true)}
                className="hidden cursor-pointer place-items-center justify-center gap-2 rounded-2xl border border-gray-100 bg-gray-100 p-4 transition-all duration-150 hover:border-gray-200 hover:bg-gray-200 lg:flex lg:min-w-[294px]"
              >
                <span
                  className="material-symbols-outlined"
                  style={{ fontSize: "24px" }}
                >
                  add
                </span>
                <span>Create a shift exchange request</span>
              </button>
            </>
          )}
          <div className="pointer-events-none absolute top-0 right-0 z-10 h-full w-20 bg-gradient-to-l from-white via-white/80 to-transparent md:hidden"></div>
        </div>
      </div>

      <ExchangeModal
        modalState={exchangeModalState}
        setModalState={setExchangeModalState}
        title="Add an exchange"
      >
        <AddExchangeContent setModalState={setExchangeModalState} />
      </ExchangeModal>
    </div>
  );
}
