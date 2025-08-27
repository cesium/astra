"use client";
import {
  Popover,
  PopoverButton,
  PopoverPanel,
} from "@headlessui/react";
import ExchangeModal from "./exchange-modal";
import ExchangeStateContent from "../exchange-state-content";
import { useState } from 'react';


interface IExchangeCardProps {
  uc: string;
  from: string;
  to: string;
  state?: "waiting" | "found";
  pending?: boolean;
  completed?: boolean;
}

export default function ExchangeCard({
  uc,
  from,
  to,
  state,
  pending,
  completed,
}: IExchangeCardProps) {
  const [modalState, setModalState] = useState(false);

  const stateText = (() => {
    switch (state) {
      case "waiting":
        return (
          <span className="text-yellow-500">
            Waiting for slot.
          </span>
        );
      case "found":
        return (
          <span className="text-green-500">
            Slot found. Processing exchange.
          </span>
        );
      default:
        return null;
    }
  })();

  return (
    <div className="flex w-[294px] flex-shrink-0 flex-col justify-between gap-2 rounded-2xl border border-gray-300 p-4">
      <div className="flex justify-between">
        <div className="flex-col">
          <span className="line-clamp-1">{uc}</span>
          <div className="flex items-center gap-2">
            <span>{from}</span>
            <span className="material-symbols-outlined">arrow_forward</span>
            <span>{to}</span>
          </div>
        </div>
        <div className="flex items-center">
          <Popover className="relative">
            <PopoverButton
              className="material-symbols-outlined outline-none cursor-pointer"
              style={{ fontSize: "24px" }}
            >
              more_horiz
            </PopoverButton>

            <PopoverPanel
              anchor="bottom"
              transition
              className="flex w-[310px] origin-top flex-col gap-3 rounded-2xl border border-gray-300 bg-white p-4 transition duration-200 ease-out data-closed:scale-95 data-closed:opacity-0"
            >
              {!pending && !completed && (
                <button className="flex cursor-pointer items-center justify-start gap-2" onClick={() => setModalState(true)}>
                  <span
                    style={{ fontSize: "20px" }}
                    className="material-symbols-outlined"
                  >
                    delete
                  </span>
                  <span>Apagar troca</span>
                </button>
              )}

              {pending && (
                <>
                
                <button
                  onClick={() => setModalState(true)}
                  className="flex cursor-pointer items-center justify-start gap-2"
                  >
                  <span
                    className="material-symbols-outlined"
                    style={{ fontSize: "20px" }}
                    >
                    info
                  </span>
                  <span>See exchange state</span>
                </button>
                              <button className="flex cursor-pointer items-center justify-start gap-2">
                <span
                  style={{ fontSize: "20px" }}
                  className="material-symbols-outlined"
                >
                  undo
                </span>
                <span>Cancelar troca</span>
              </button>
                    </>
              )}
            </PopoverPanel>
          </Popover>
        </div>
      </div>
      {pending && (
        <>
          <span className="text-gray-500">State: {stateText}</span>
          <button
            onClick={() => setModalState(true)}
            className="text-celeste flex items-center gap-1"
          >
            <span
              className="material-symbols-outlined"
              style={{ fontSize: "16px" }}
            >
              info
            </span>
            <span>See exchange state</span>
          </button>
        </>
      )}
      {completed && (
        <>
          <span className="text-gray-500">
            State: <span className="text-green-500">Exchange completed.</span>
          </span>
          <button
            onClick={() => setModalState(true)}
            className="text-celeste flex items-center gap-1"
          >
            <span
              className="material-symbols-outlined"
              style={{ fontSize: "16px" }}
            >
              info
            </span>
            <span>See exchange state</span>
          </button>
        </>
      )}
      <ExchangeModal
        modalState={modalState}
        setModalState={setModalState}
        title="Exchange state"
      >
        <ExchangeStateContent uc={uc} from={from} to={to} shift="T" />
      </ExchangeModal>
    </div>
  );
}

