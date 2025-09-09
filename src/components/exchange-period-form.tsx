"use client";
import React from "react";
import Input from "./input";
import { useUpdateExchangeDate } from "@/lib/mutations/exchange";

export default function ExchangePeriodForm() {
  const updateExchangeDate = useUpdateExchangeDate();
  const [alert, setAlert] = React.useState<string | null>(null);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setAlert(null);

    const formData = new FormData(event.currentTarget);
    const startLocal = formData.get("start") as string;
    const endLocal = formData.get("end") as string;

    const startUTC = new Date(startLocal);
    const endUTC = new Date(endLocal);

    updateExchangeDate.mutate(
      {
        request: {
          start: startUTC.toISOString(),
          end: endUTC.toISOString(),
        },
      },
      {
        onSuccess: () => {
          setAlert("Exchange period updated successfully!");
        },
        onError: () => {
          setAlert("There was a problem updating the exchange period.");
        },
      },
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex max-w-sm flex-col gap-4">
      <label>Start Date:</label>
      <Input
        type="datetime-local"
        name="start"
        required
        className="rounded border p-2"
      />

      <label>End Date:</label>
      <Input
        type="datetime-local"
        name="end"
        required
        className="rounded border p-2"
      />

      <button
        type="submit"
        className="bg-primary-500 hover:bg-primary-400 cursor-pointer rounded-xl px-4 py-2 text-white transition"
      >
        Submit
      </button>
      {alert && <p className="text-warning">{alert}</p>}
    </form>
  );
}
