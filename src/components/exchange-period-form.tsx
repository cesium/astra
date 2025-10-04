"use client";
import { useEffect, useState } from "react";
import Input from "./input";
import { useUpdateExchangeDate } from "@/lib/mutations/exchange";
import { SubmitHandler, useForm } from "react-hook-form";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useGetExchangeDate } from "@/lib/queries/exchange";
import { useDictionary } from "@/providers/dictionary-provider";

const toDateTimeLocal = (date: Date | undefined | null) => {
  if (!date) return "";
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  return `${year}-${month}-${day}T${hours}:${minutes}`;
};

export default function ExchangePeriodForm() {
  const dict = useDictionary();

  const formSchema = z
    .object({
      start: z.date(),
      end: z.date(),
    })
    .refine((data) => data.end > data.start, {
      message: `${dict.alerts.exchange_period.end_before_start}`,
      path: ["end"],
    })
    .refine((data) => data.start.getFullYear() === 2025, {
      message: `${dict.alerts.exchange_period.start_in_year}`,
      path: ["start"],
    })
    .refine((data) => data.end.getFullYear() === 2025, {
      message: `${dict.alerts.exchange_period.end_in_year}`,
      path: ["end"],
    });

  type FormSchema = z.infer<typeof formSchema>;

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
          setAlert(dict.alerts.exchange_period.updated_successfully);
        },
        onError: () => {
          setError(dict.alerts.exchange_period.problem_updating);
        },
      },
    );
  };

  return (
    <>
      <h2 className="text-xl font-semibold">
        {
          dict.settings.sections.backoffice.modules.configurations.exchange
            .title
        }
      </h2>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="mt-4 flex max-w-sm flex-col gap-3"
      >
        <label>
          {
            dict.settings.sections.backoffice.modules.configurations.exchange
              .start_date
          }
          :
        </label>
        <Input
          {...register("start", { valueAsDate: true, required: true })}
          type="datetime-local"
          name="start"
          id="start"
          required
          value={toDateTimeLocal(watch("start"))}
        />
        <span className="text-danger px-1">{errors.start?.message}</span>

        <label>
          {
            dict.settings.sections.backoffice.modules.configurations.exchange
              .end_date
          }
          :
        </label>
        <Input
          {...register("end", { valueAsDate: true, required: true })}
          type="datetime-local"
          name="end"
          id="end"
          required
          value={toDateTimeLocal(watch("end"))}
        />
        <span className="text-danger px-1">{errors.end?.message}</span>
        <button
          type="submit"
          className="bg-primary-400 hover:bg-primary-400/95 mt-2 cursor-pointer rounded-lg px-4 py-2 font-semibold text-white transition-all duration-200 hover:scale-98 md:w-1/3"
        >
          {dict.ui.common.buttons.submit}
        </button>
        {alert && <p className="text-success">{alert}</p>}
        {error && <p className="text-danger">{error}</p>}
      </form>
    </>
  );
}
