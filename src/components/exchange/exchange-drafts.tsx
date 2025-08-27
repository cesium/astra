"use client";

import { useState } from "react";
import ExchangeModal from "./utils/exchange-modal";
import AddExchangeContent from "./add-exchange-content";
import ExchangeCard from "./utils/exchange-card";

export default function ExchangeDrafts() {
  const [exchangeModalState, setExchangeModalState] = useState(false);

  const data = [
    {uc: "Álgebra Linear Aplicada A Matrizes Para Inteligência Artificial", from: "TP1", to: "TP2"},
    {uc: "Geometria Analítica", from: "TP3", to: "TP4"},
    {uc: "Cálculo", from: "T1", to: "T2"},
  ]

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-semibold">Exchanges</h1>
      <h2 className="text-xl font-semibold">Drafts</h2>
        <button
          onClick={() => setExchangeModalState(true)}
          className="lg:hidden flex cursor-pointer place-items-center justify-center w-full gap-2 rounded-2xl border border-gray-100 bg-gray-100 p-4 transition-all duration-150 hover:border-gray-200 hover:bg-gray-200 lg:min-w-[294px] mb-2"
        >
          <span
            className="material-symbols-outlined"
            style={{ fontSize: "24px" }}
          >
            add
          </span>
          <span>Add an exchange</span>
        </button>
      <div className="relative">

        <div className="no-scrollbar flex gap-2 overflow-x-auto lg:flex-wrap">
          {data.map((exchange, index) => (
            <ExchangeCard
              key={index}
              uc={exchange.uc} 
              from={exchange.from} 
              to={exchange.to} 
            />
          ))}

          <button
            onClick={() => setExchangeModalState(true)}
            className="hidden lg:flex cursor-pointer place-items-center justify-center gap-2 rounded-2xl border border-gray-100 bg-gray-100 p-4 transition-all duration-150 hover:border-gray-200 hover:bg-gray-200 lg:min-w-[294px]"
          >
            <span
              className="material-symbols-outlined"
              style={{ fontSize: "24px" }}
            >
              add
            </span>
            <span>Add an exchange</span>
          </button>
          <div className="pointer-events-none absolute top-0 right-0 z-10 h-full w-20 bg-gradient-to-l from-white via-white/80 to-transparent md:hidden"></div>
        </div>
      </div>

      <button className="bg-celeste hover:bg-celeste/90 cursor-pointer flex w-fit items-center gap-2 rounded-xl px-4 py-2 text-white">
        <span
          className="material-symbols-outlined"
          style={{ fontSize: "24px" }}
        >
          send
        </span>
        Send exchanges
      </button>

      <ExchangeModal
        modalState={exchangeModalState}
        setModalState={setExchangeModalState}
        title="Add an exchange"
      >
        <AddExchangeContent />
      </ExchangeModal>
    </div>
  );
}
