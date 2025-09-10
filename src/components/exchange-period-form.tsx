"use client";
import React from "react";
import Input from "./input";
import { useUpdateExchangeDate } from "@/lib/mutations/exchange";
import { SubmitHandler, useForm } from "react-hook-form";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

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
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
  });

  const updateExchangeDate = useUpdateExchangeDate();
  const [alert, setAlert] = React.useState<string | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  const onSubmit: SubmitHandler<FormSchema> = (data: FormSchema) => {
    setAlert(null);
    setError(null);

    const startUTC = new Date(data.start);
    const endUTC = new Date(data.end);

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
