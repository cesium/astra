"use client";

import { useGetExchanges } from "@/lib/queries/exchange";
import CardsSection from "./cards-section";

const getShortShiftType = (shiftType: string) => {
  switch (shiftType) {
    case "theoretical":
      return "T";
    case "theoretical_practical":
      return "TP";
    case "practical_laboratory":
      return "PL";
    case "tutorial_guidance":
      return "OT";
    default:
      return shiftType;
  }
};

export interface IExchange {
  id: string;
  status: "pending" | "approved";
  from: {
    id: string;
    type:
      | "theoretical"
      | "theoretical_practical"
      | "practical_laboratory"
      | "tutorial_guidance";
    number: number;
  };
  to: {
    id: string;
    type:
      | "theoretical"
      | "theoretical_practical"
      | "practical_laboratory"
      | "tutorial_guidance";
    number: number;
  };
  course: { id: string; name: string };
}

export default function MainSection() {
  const { data: response } = useGetExchanges();

  const exchanges = response?.data?.requests ?? [];
  const pending_exchanges = exchanges
    .filter((exchange: IExchange) => exchange.status === "pending")
    .map((exchange: IExchange) => ({
      id: exchange.id,
      uc: exchange.course.name,
      status: exchange.status,
      from: `${getShortShiftType(exchange.from.type)}${exchange.from.number}`,
      to: `${getShortShiftType(exchange.to.type)}${exchange.to.number}`,
      exchange_id: exchange.id,
    }));

  const approved_exchanges = exchanges
    .filter((exchange: IExchange) => exchange.status === "approved")
    .map((exchange: IExchange) => ({
      id: exchange.id,
      uc: exchange.course.name,
      status: exchange.status,
      from: `${getShortShiftType(exchange.from.type)}${exchange.from.number}`,
      to: `${getShortShiftType(exchange.to.type)}${exchange.to.number}`,
      exchange_id: exchange.id,
    }));

  return (
    <div className="flex w-full min-w-0 flex-col gap-8 lg:pr-4">
      <h1 className="text-2xl font-semibold">Shift Exchange Requests</h1>
      <CardsSection drafts />
      <CardsSection title="Pending" pending data={pending_exchanges} />
      <CardsSection title="Completed" completed data={approved_exchanges} />
    </div>
  );
}
