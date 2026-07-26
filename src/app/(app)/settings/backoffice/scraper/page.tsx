"use client";

import z from "zod";
import clsx from "clsx";
import Card from "@/components/card";
import { twMerge } from "tailwind-merge";
import { SubmitHandler, useForm } from "react-hook-form";
import { Switch } from "@headlessui/react";
import { AuthCheck } from "@/components/auth-check";
import { zodResolver } from "@hookform/resolvers/zod";
import SettingsWrapper from "@/components/settings-wrapper";
import Input from "@/components/input";
import Label from "@/components/label";
import { useGetAutoSyncState } from "@/lib/queries/backoffice";
import {
  useLinkTimeslots,
  useSyncTimeslots,
  useToggleAutoSync,
} from "@/lib/mutations/backoffice";
import { useState } from "react";
import Modal from "@/components/modal";
import { IScrapeConfig } from "@/lib/types";
import Link from "next/link";

interface IConfigurationCardProps {
  title: string;
  timestamp?: string;
  description: string;
  textColor: string;
  icon: string;
  Actions?: React.ComponentType;
  onTrigger: () => void;
}

interface IModalStateProps {
  isOpen: boolean;
  type: TriggerType | null;
}

type TriggerType = "link" | "sync";

const ConfigurationCard = ({
  title,
  timestamp,
  description,
  textColor,
  icon,
  Actions,
  onTrigger,
}: IConfigurationCardProps) => {
  return (
    <Card className="bg-muted flex flex-col gap-4 drop-shadow-none">
      <div className="flex w-full flex-col justify-between gap-2 md:flex-row">
        <span className="inline-flex gap-2">
          <span
            className={twMerge(
              clsx("material-symbols-outlined text-2xl", textColor),
            )}
          >
            {icon}
          </span>

          <h2 className="font-semibold">{title}</h2>
        </span>

        {Actions && <Actions />}
      </div>

      <div>
        <span className="inline-flex items-center gap-1">
          <span className="material-symbols-outlined text-dark/60 text-lg">
            history_2
          </span>
          <p className="text-dark/70 text-sm">
            Last ran:{" "}
            <span className="font-semibold">
              {timestamp ? timestamp : "never"}
            </span>
          </p>
        </span>

        <p className="text-dark/80 text-sm">{description}</p>
        <div className="w-full">
          <button
            disabled={false}
            onClick={() => onTrigger()}
            className={twMerge(
              clsx(
                "mt-6 min-w-1/5 rounded-lg px-2 py-1 font-semibold text-white transition-all duration-200",
                !true
                  ? "cursor-not-allowed bg-gray-400"
                  : [
                      "cursor-pointer hover:scale-98",
                      {
                        "bg-celeste hover:bg-celeste/95":
                          textColor === "text-celeste",
                        "bg-primary-400 hover:bg-primary-400/95":
                          textColor === "text-primary-400",
                      },
                    ],
              ),
            )}
          >
            {title}
          </button>
        </div>
      </div>
    </Card>
  );
};

const AutoSyncToggle = () => {
  const { data: auto_sync } = useGetAutoSyncState();
  const toggleAutoSync = useToggleAutoSync();
  const enabled = auto_sync ?? false;

  const switchState = enabled ? "On" : "Off";

  return (
    <div className="inline-flex items-center gap-2">
      <p className="text-dark/50 mb-1 text-sm font-semibold">Auto-sync</p>
      <Switch
        checked={enabled}
        onChange={() => toggleAutoSync.mutate()}
        disabled={toggleAutoSync.isPending}
        className="group bg-dark/15 data-checked:bg-celeste inline-flex h-5 w-10 items-center rounded-full transition"
      >
        <span className="size-3 translate-x-1 rounded-full bg-white transition group-data-checked:translate-x-6" />
      </Switch>
      <p
        className={`text-xs transition-all duration-300 ${enabled ? "text-celeste" : "text-dark/70"}`}
      >
        {switchState}
      </p>
    </div>
  );
};

export default function Scraper() {
  const triggerLink = useLinkTimeslots();
  const triggerSync = useSyncTimeslots();
  const [modalState, setModalState] = useState<IModalStateProps>({
    isOpen: false,
    type: null,
  });
  const [triggerFeedback, setTriggerFeedback] = useState<{
    type: TriggerType;
    message: string;
    isError: boolean;
  } | null>(null);

  const onClose = () => {
    setModalState({
      isOpen: false,
      type: null,
    });
  };

  const onOpen = (type: TriggerType) => {
    setModalState({ isOpen: true, type: type });
  };

  const handleTrigger = (
    type: TriggerType,
    data: {
      course: string;
      timeout: number;
      years: number[];
      week: { start: string; end: string };
    },
  ) => {
    const mutation = type === "link" ? triggerLink : triggerSync;

    mutation.mutate(data, {
      onSuccess: (response) => {
        setTriggerFeedback({
          type,
          message:
            (response as { message?: string })?.message ?? "Done successfully.",
          isError: false,
        });
      },
      onError: (error) => {
        setTriggerFeedback({
          type,
          message:
            error instanceof Error
              ? error.message
              : "Failed to trigger the job. Please try again later.",
          isError: true,
        });
      },
    });

    onClose();
  };

  const feedbackTitle = triggerFeedback
    ? triggerFeedback.type === "link"
      ? "Link Timeslots"
      : "Sync Timeslots"
    : null;

  return (
    <>
      <title>Scraper | Pombo</title>
      <AuthCheck userTypes={["admin", "professor"]}>
        <SettingsWrapper title="Scraper Settings">
          <div className="flex h-full flex-col gap-8">
            <section className="space-y-2">
              <h2 className="text-2xl font-semibold">Configure Telescopium</h2>
              <p>
                Trigger and automate Telescopium scrapes and timeslots syncing
              </p>
            </section>

            {triggerFeedback && feedbackTitle && (
              <div
                className={twMerge(
                  clsx(
                    "flex items-center gap-2 rounded-lg border px-4 py-3 text-sm font-semibold",
                    triggerFeedback.isError
                      ? "border-danger/40 bg-danger/10 text-danger"
                      : "border-success-400/50 bg-success-400/10 text-success-500/80",
                  ),
                )}
              >
                <span className="material-symbols-outlined text-base">
                  {triggerFeedback.isError ? "error" : "check_circle"}
                </span>
                <span>
                  {feedbackTitle}: {triggerFeedback.message}
                </span>

                {triggerFeedback.isError! && (
                  <Link href="/jobs" className="font-extrabold underline">
                    Follow job
                  </Link>
                )}
              </div>
            )}

            <section className="flex h-full w-full flex-col gap-8">
              <ConfigurationCard
                title="Link Timeslots"
                icon="anchor"
                description="Links your database timeslots to scraper IDs, while updating room data, using the natural key. Run this once at the start of semester, or after a new import."
                timestamp="3 days ago"
                textColor="text-primary-400"
                onTrigger={() => onOpen("link")}
              />
              <ConfigurationCard
                title="Sync Timeslots"
                icon="sync"
                description="Updates room data for all anchored timeslots. Safe to run repeatedly."
                textColor="text-celeste"
                Actions={AutoSyncToggle}
                onTrigger={() => onOpen("sync")}
              />
            </section>
          </div>

          <Modal modalState={modalState.isOpen} onClose={onClose}>
            <TriggerModalLayout
              type={modalState.type}
              onClose={onClose}
              onSubmit={handleTrigger}
            />
          </Modal>
        </SettingsWrapper>
      </AuthCheck>
    </>
  );
}

function TriggerModalLayout({
  type,
  onClose,
  onSubmit,
}: {
  type: TriggerType | null;
  onClose: () => void;
  onSubmit: (type: TriggerType, data: IScrapeConfig) => void;
}) {
  const formSchema = z.object({
    course: z.string().min(1, {
      message: "Please select a course.",
    }),

    timeout: z
      .number()
      .int({
        message: "Timeout must be an integer.",
      })
      .min(1, {
        message: "Timeout must be at least 1.",
      }),

    years: z
      .array(
        z
          .number()
          .int({
            message: "Each year must be an integer.",
          })
          .min(1, {
            message: "Year must be at least 1.",
          }),
      )
      .min(1, {
        message: "Please select at least one year.",
      }),

    week: z
      .object({
        start: z.string().date({
          message: "Start date must be a valid date.",
        }),
        end: z.string().date({
          message: "End date must be a valid date.",
        }),
      })
      .refine((week) => week.end >= week.start, {
        message: "End date must be on or after the start date.",
        path: ["end"],
      }),
  });

  type FormSchema = z.infer<typeof formSchema>;

  const today = new Date();

  // Sunday of the current week
  const start = new Date(today);
  start.setDate(today.getDate() - today.getDay());
  const defaultDate = start.toISOString().split("T")[0];

  const {
    register,
    watch,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      course: "Licenciatura em Engenharia Informática",
      timeout: 1,
      years: [1, 2, 3],
      week: {
        start: defaultDate,
        end: defaultDate,
      },
    },
  });

  const handleSave: SubmitHandler<FormSchema> = (data) => {
    if (type) {
      onSubmit(type, data);
    }
  };

  const title = type === "link" ? "Link Timeslots" : "Sync Timeslots";

  function getWeekSunday(dateString: string): string {
    const [y, m, d] = dateString.split("-").map(Number);
    const date = new Date(y, m - 1, d);

    date.setDate(date.getDate() - date.getDay());

    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, "0");
    const dd = String(date.getDate()).padStart(2, "0");

    return `${yyyy}-${mm}-${dd}`;
  }

  const { onChange: startOnChange, ...startField } = register("week.start");
  const { onChange: endOnChange, ...endField } = register("week.end");

  return (
    <form onSubmit={handleSubmit(handleSave)} className="w-full space-y-8">
      <div className="space-y-2">
        <h3 className="text-2xl font-semibold">{title}</h3>
        <p className="text-lg text-gray-600">
          Configure scraping or use default configuration.
        </p>
      </div>

      <div className="flex flex-col gap-6">
        <div className="space-y-0.5">
          <Label size="large" className="text-dark font-semibold">
            Course
          </Label>

          <Input
            disabled
            className="bg-muted !py-1 opacity-50"
            {...register("course")}
          />

          <span className="text-danger px-1">{errors.course?.message}</span>
        </div>

        <div className="flex gap-10">
          <div className="flex-1 space-y-0.5">
            <Label size="large" className="text-dark font-semibold">
              Timeout (seconds)
            </Label>

            <Input
              type="number"
              min={1}
              className="bg-muted !py-1"
              {...register("timeout", { valueAsNumber: true })}
            />

            <span className="text-danger px-1">{errors.timeout?.message}</span>
          </div>

          <div className="flex-1 space-y-0.5">
            <Label size="large" className="text-dark font-semibold">
              Years
            </Label>

            <div className="flex h-10 items-center gap-5">
              {[1, 2, 3].map((year) => {
                const selectedYears = watch("years");

                return (
                  <label
                    key={year}
                    className="flex items-center gap-2 font-medium"
                  >
                    <input
                      type="checkbox"
                      className="text-primary-400 accent-primary-400 size-4.5 cursor-pointer rounded border-gray-300"
                      checked={selectedYears.includes(year)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setValue("years", [...selectedYears, year], {
                            shouldValidate: true,
                          });
                        } else {
                          setValue(
                            "years",
                            selectedYears.filter((y) => y !== year),
                            { shouldValidate: true },
                          );
                        }
                      }}
                    />
                    {year}º
                  </label>
                );
              })}
            </div>

            <span className="text-danger px-1">{errors.years?.message}</span>
          </div>
        </div>

        <div className="flex gap-10">
          {/* Week start */}
          <div className="flex-1 space-y-0.5">
            <Label size="large" className="text-dark font-semibold">
              Week start
            </Label>

            <Input
              type="date"
              className="bg-muted !py-1 [&>input]:!text-black [&>input:invalid]:!text-black"
              {...startField}
              onChange={(e) => {
                const snapped = getWeekSunday(e.target.value);

                setValue("week.start", snapped, { shouldValidate: true });
                startOnChange(e);
              }}
            />

            <span className="text-danger px-1">
              {errors.week?.start?.message}
            </span>
          </div>

          {/* Week end */}
          <div className="flex-1 space-y-0.5">
            <Label size="large" className="text-dark font-semibold">
              Week end
            </Label>

            <Input
              type="date"
              className="bg-muted !py-1 [&>input]:!text-black [&>input:invalid]:!text-black"
              {...endField}
              onChange={(e) => {
                const snapped = getWeekSunday(e.target.value);

                setValue("week.end", snapped, { shouldValidate: true });
                endOnChange(e);
              }}
            />

            <span className="text-danger px-1">
              {errors.week?.end?.message}
            </span>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-end gap-2">
        <button
          type="button"
          onClick={onClose}
          className="hover:bg-smoke border-dark/5 inline-flex h-fit cursor-pointer items-center justify-center rounded-lg border px-3 py-2 transition-all duration-200 hover:scale-95"
        >
          Cancel
        </button>

        <button
          type="submit"
          className="bg-primary-400 hover:bg-primary-400/95 inline-flex h-fit cursor-pointer items-center justify-center rounded-lg px-3 py-2 text-white transition-all duration-200 hover:scale-95"
        >
          Generate
        </button>
      </div>
    </form>
  );
}
