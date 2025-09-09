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
        onError: (error: any) => {
          setAlert(
            `Error: ${error.response?.data?.message || error.message}`
          );
        },
      }
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-w-sm">
      <label>
        Start Date:
        </label>
        <Input
          type="datetime-local"
          name="start"
          required
          className="border p-2 rounded"
        />

      <label>
        End Date:
        </label>
        <Input
          type="datetime-local"
          name="end"
          required
          className="border p-2 rounded"
        />

      <button
        type="submit"
        className="bg-primary-500 text-white py-2 px-4 rounded-xl hover:bg-primary-400 transition cursor-pointer"
      >
        Submit
      </button>
      {alert && <p className="text-warning">{alert}</p>}
    </form>
  );
}