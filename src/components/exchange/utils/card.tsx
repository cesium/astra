"use client";
import { Popover, PopoverButton, PopoverPanel } from "@headlessui/react";
import ExchangeModal from "./modal";
import ExchangeStateContent from "../exchange-state-content";
import { useState } from "react";
import { useDeleteExchange } from "@/lib/mutations/exchange";

interface IExchangeCardProps {
  uc: string;
  from: string;
  to: string;
  pending?: boolean;
  completed?: boolean;
  exchange_id?: string;
}

const getShift = (shift: string) => {
  return shift.replace(/[0-9]/g, "");
};

export default function ExchangeCard({
  uc,
  from,
  to,
  pending,
  completed,
  exchange_id,
}: IExchangeCardProps) {
  const [modalState, setModalState] = useState(false);
  const cancelExchange = useDeleteExchange();

  const handleCancelExchange = (close: () => void) => {
    cancelExchange.mutate(exchange_id as string, {
      onSuccess: () => close(),
    });
  };

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
              className="material-symbols-outlined cursor-pointer outline-none"
              style={{ fontSize: "24px" }}
            >
              more_horiz
            </PopoverButton>

            <PopoverPanel
              anchor="bottom"
              transition
              className="flex w-[310px] origin-top flex-col gap-3 rounded-2xl border border-gray-300 bg-white p-4 transition duration-200 ease-out data-closed:scale-95 data-closed:opacity-0"
            >
              {({ close }) => (
                <>
                  {pending && (
                    <>
                      <button
                        onClick={() => handleCancelExchange(close)}
                        className="flex cursor-pointer items-center justify-start gap-2"
                      >
                        <span
                          style={{ fontSize: "20px" }}
                          className="material-symbols-outlined"
                        >
                          undo
                        </span>
                        <span>Cancelar troca</span>
                      </button>
                      <button
                        onClick={() => {
                          close();
                          setModalState(true);
                        }}
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
                    </>
                  )}
                  {completed && (
                    <button
                      onClick={() => {
                        close();
                        setModalState(true);
                      }}
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
                  )}
                </>
              )}
            </PopoverPanel>
          </Popover>
        </div>
      </div>

      {pending && (
        <>
          <span className="text-gray-500">
            State:{" "}
            {pending ? (
              <span className="text-yellow-500">Waiting for slot.</span>
            ) : (
              <span className="text-green-500">Exchange completed.</span>
            )}
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
        <ExchangeStateContent
          uc={uc}
          from={from}
          to={to}
          shift={getShift(from)}
          status={pending ? "pending" : "completed"}
        />
      </ExchangeModal>
    </div>
  );
}
