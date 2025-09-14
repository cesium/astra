"use client";
import React, { useEffect, useState } from "react";
import Input from "./input";
import { useUpdateExchangeDate } from "@/lib/mutations/exchange";
import { SubmitHandler, useForm } from "react-hook-form";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useGetExchangeDate } from "@/lib/queries/exchange";

const toDateTimeLocal = (date: Date | undefined | null) => {
  if (!date) return "";
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  return `${year}-${month}-${day}T${hours}:${minutes}`;
};

const formSchema = z
  .object({
    start: z.date(),
    end: z.date(),
  })
  .refine((data) => data.end > data.start, {
    message: "End date must be after start date",
    path: ["end"],
  })
  .refine((data) => data.start.getFullYear() === 2025, {
    message: "Start date must be in the year 2025",
    path: ["start"],
  })
  .refine((data) => data.end.getFullYear() === 2025, {
    message: "End date must be in the year 2025",
    path: ["end"],
  });

type FormSchema = z.infer<typeof formSchema>;

export default function ExchangePeriodForm() {
  const { data: exchangeDate } = useGetExchangeDate();
  const startDate = exchangeDate?.data.start;
  const endDate = exchangeDate?.data.end;

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      start: exchangeDate?.data.start ? new Date(startDate) : undefined,
      end: exchangeDate?.data.end ? new Date(endDate) : undefined,
    },
  });

  useEffect(() => {
    if (exchangeDate?.data.start && exchangeDate?.data.end) {
      setValue("start", new Date(exchangeDate.data.start));
      setValue("end", new Date(exchangeDate.data.end));
    }
  }, [exchangeDate, setValue]);

  const updateExchangeDate = useUpdateExchangeDate();
  const [alert, setAlert] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const onSubmit: SubmitHandler<FormSchema> = (data: FormSchema) => {
    setAlert(null);
    setError(null);
    const startUTC = new Date(data.start).toISOString();
    const endUTC = new Date(data.end).toISOString();

    updateExchangeDate.mutate(
      {
        request: {
          start: startUTC,
          end: endUTC,
        },
      },
      {
        onSuccess: () => {
          setAlert("Exchange period updated successfully!");
        },
        onError: () => {
          setError("There was a problem updating the exchange period.");
        },
      },
    );
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex max-w-sm flex-col gap-4"
    >
      <label>Start Date:</label>
      <Input
        {...register("start", { valueAsDate: true, required: true })}
        type="datetime-local"
        name="start"
        id="start"
        required
        value={toDateTimeLocal(watch("start"))}
        className="rounded border p-2"
      />
      <span className="text-danger px-1">{errors.start?.message}</span>

      <label>End Date:</label>
      <Input
        {...register("end", { valueAsDate: true, required: true })}
        type="datetime-local"
        name="end"
        id="end"
        required
        value={toDateTimeLocal(watch("end"))}
        className="rounded border p-2"
      />
      <span className="text-danger px-1">{errors.end?.message}</span>
      <button
        type="submit"
        className="bg-primary-500 hover:bg-primary-400 cursor-pointer rounded-xl px-4 py-2 text-white transition"
      >
        Submit
      </button>
      {alert && <p className="text-success">{alert}</p>}
      {error && <p className="text-danger">{error}</p>}
    </form>
  );
}
