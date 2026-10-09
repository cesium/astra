"use client";

import { useEffect, useState } from "react";
import Input from "./input";
import { SubmitHandler, useForm } from "react-hook-form";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useGetClassesPeriod } from "@/lib/queries/classes-period";
import {
  useDeleteClassesPeriod,
  useUpdateClassesPeriod,
} from "@/lib/mutations/classes-period";

const toDateTimeLocal = (date: Date | undefined | null) => {
  if (!date || isNaN(date.getTime())) return "";
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  return `${year}-${month}-${day}T${hours}:${minutes}`;
};

const formSchema = z
  .object({
    start: z.date({ required_error: "Start date is required" }),
    end: z.date({ required_error: "End date is required" }),
  })
  .refine((data) => data.end > data.start, {
    message: "End date must be after start date",
    path: ["end"],
  });

type FormSchema = z.infer<typeof formSchema>;

export default function ClassesPeriodForm({
  semester,
}: {
  semester: 1 | 2;
}) {
  const { data: periodData, isLoading } = useGetClassesPeriod(semester);
  const updatePeriod = useUpdateClassesPeriod(semester);
  const deletePeriod = useDeleteClassesPeriod(semester);

  const [alert, setAlert] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
  });

  useEffect(() => {
    if (periodData?.start && periodData?.end) {
      reset({
        start: new Date(periodData.start),
        end: new Date(periodData.end),
      });
    } else {
      reset({ start: undefined, end: undefined });
    }
  }, [periodData, reset]);

  const onSubmit: SubmitHandler<FormSchema> = (data) => {
    setAlert(null);
    setError(null);
    const startUTC = new Date(data.start).toISOString();
    const endUTC = new Date(data.end).toISOString();

    updatePeriod.mutate(
      { start: startUTC, end: endUTC },
      {
        onSuccess: () => {
          setAlert(`Semester ${semester} classes period saved successfully!`);
        },
        onError: () => {
          setError(`Failed to save semester ${semester} classes period.`);
        },
      },
    );
  };

  const handleClear = () => {
    setAlert(null);
    setError(null);

    reset({ start: undefined, end: undefined });

    if (periodData?.start && periodData?.end) {
      deletePeriod.mutate(undefined, {
        onSuccess: () => {
          setAlert(`Semester ${semester} classes period cleared.`);
        },
        onError: () => {
          setError(`Failed to clear semester ${semester} classes period.`);
        },
      });
    }
  };

  if (isLoading) {
    return <p className="text-dark/50 text-sm">Loading...</p>;
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex max-w-sm flex-col gap-3"
    >
      <label className="text-sm font-medium" htmlFor={`start-sem-${semester}`}>
        Start Date:
      </label>
      <Input
        {...register("start", { valueAsDate: true, required: true })}
        type="datetime-local"
        id={`start-sem-${semester}`}
        name="start"
        required
        value={toDateTimeLocal(watch("start"))}
        className="rounded border p-2"
      />
      {errors.start && (
        <span className="text-danger px-1 text-sm">{errors.start.message}</span>
      )}

      <label className="text-sm font-medium" htmlFor={`end-sem-${semester}`}>
        End Date:
      </label>
      <Input
        {...register("end", { valueAsDate: true, required: true })}
        type="datetime-local"
        id={`end-sem-${semester}`}
        name="end"
        required
        value={toDateTimeLocal(watch("end"))}
        className="rounded border p-2"
      />
      {errors.end && (
        <span className="text-danger px-1 text-sm">{errors.end.message}</span>
      )}

      <div className="mt-2 flex items-center gap-3">
        <button
          type="submit"
          disabled={updatePeriod.isPending}
          className="bg-primary-400 hover:bg-primary-400/95 cursor-pointer rounded-lg px-4 py-2 font-semibold text-white transition-all duration-200 hover:scale-98 disabled:opacity-50 md:w-1/3"
        >
          Submit
        </button>

        <button
          type="button"
          onClick={handleClear}
          disabled={deletePeriod.isPending}
          className="border-dark/20 text-dark/70 hover:bg-dark/5 cursor-pointer rounded-lg border px-4 py-2 font-medium transition-all duration-200 hover:scale-98 disabled:opacity-50 md:w-1/3"
        >
          Clear
        </button>
      </div>

      {alert && <p className="text-success text-sm">{alert}</p>}
      {error && <p className="text-danger text-sm">{error}</p>}
    </form>
  );
}
