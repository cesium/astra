"use client";

import { AuthCheck } from "@/components/auth-check";
import SettingsWrapper from "@/components/settings-wrapper";
import { useListJobs } from "@/lib/queries/backoffice";
import { IJobProps } from "@/lib/types";
import clsx from "clsx";
import moment from "moment";
import { twMerge } from "tailwind-merge";

function getStateStyle(state: string) {
  const STATE_COLORS = {
    completed: "text-success",
    executing: "text-celeste",
    available: "text-primary-400",
    retryable: "text-primary-400",
    scheduled: "text-primary-400",
    discarded: "text-danger",
    cancelled: "text-danger",
  };

  const STATE_ICON = {
    completed: "task_alt",
    executing: "keyboard_double_arrow_right",
    available: "schedule",
    retryable: "update",
    scheduled: "hourglass",
    discarded: "cancel",
    cancelled: "cancel",
  };

  const textColor = STATE_COLORS[state as keyof typeof STATE_COLORS];
  const icon = STATE_ICON[state as keyof typeof STATE_ICON];

  return { textColor, icon };
}

interface IJobCardProps {
  state: string;
  title: string;
  type: string;
  id: number;
  created_at: Date;
  start_at: Date;
  completed_at: Date;
}

function SummaryCard({
  title,
  textColor,
  icon,
  value,
}: {
  title: string;
  textColor: string;
  icon?: string;
  value: number;
}) {
  return (
    <div className="border-dark/5 flex flex-1 items-center justify-between rounded-xl border py-6 pr-5 pl-3 shadow-sm md:min-w-48">
      <div className="flex flex-col">
        <p className="text-dark/50 text-sm font-medium">{title}</p>
        <p className={twMerge(clsx("text-dark/50 text-2xl font-bold"))}>
          {value}
        </p>
      </div>

      <span
        className={twMerge(
          clsx("material-symbols-outlined text-4xl", textColor),
        )}
      >
        {icon}
      </span>
    </div>
  );
}

function Label({
  title,
  label,
  side = "right",
}: {
  title: string;
  label: string;
  side?: "left" | "right";
}) {
  return (
    <div
      className={`flex flex-col ${side === "left" ? "items-start" : "items-end"}`}
    >
      <p className="max-w-46 truncate font-medium xl:max-w-none">{title}</p>
      <label className="text-dark/50 text-sm">{label}</label>
    </div>
  );
}

function StateTag({
  state,
  color,
  icon,
  className,
}: {
  state: string;
  color: string;
  icon: string;
  className?: string;
}) {
  return (
    <div className={twMerge(clsx("inline-flex items-center gap-2", className))}>
      <span
        className={twMerge(clsx("material-symbols-outlined text-xl", color))}
      >
        {icon}
      </span>
      <div className="bg-smoke border-dark/8 hidden h-fit items-center rounded-full border px-2.5 py-0.5 text-xs sm:inline-flex lg:hidden xl:inline-flex">
        {state === "available"
          ? "Pending"
          : state === "discarded"
            ? "Failed"
            : state.charAt(0).toUpperCase() + state.slice(1)}
      </div>
    </div>
  );
}

function JobCard({
  state,
  title,
  type,
  id,
  created_at,
  start_at,
  completed_at,
}: IJobCardProps) {
  const created = moment(created_at);
  const start = start_at ? moment(start_at) : null;
  const end = completed_at ? moment(completed_at) : null;

  const duration = start && end ? moment.duration(end.diff(start)) : null;
  const minutes = duration ? Math.floor(duration.asMinutes()) : 0;
  const seconds = duration ? Math.floor(duration.asSeconds() % 60) : 0;

  const typeIcon =
    type === "import"
      ? "upload"
      : type === "generate"
        ? "edit_calendar"
        : "info";
  const { textColor, icon } = getStateStyle(state);

  return (
    <div className="border-dark/8 flex flex-col gap-6 rounded-xl border p-4 lg:flex-row lg:gap-0">
      <div className="flex flex-1 items-center gap-4">
        <span className="material-symbols-outlined text-xl">{typeIcon}</span>
        <Label title={title} label={`ID: ${id}`} side="left" />

        <div className="flex flex-1 justify-end pb-4">
          <StateTag
            state={state}
            color={textColor}
            icon={icon}
            className="inline-flex lg:hidden"
          />
        </div>
      </div>

      <div className="flex items-center justify-end gap-6">
        <Label title={created.format("HH:mm")} label="Created" />
        {start && <Label title={start.format("D MMM HH:mm")} label="Started" />}
        {duration && (
          <Label title={`${minutes}m ${seconds}s`} label="Duration" />
        )}

        <StateTag
          state={state}
          color={textColor}
          icon={icon}
          className="hidden lg:inline-flex"
        />
      </div>
    </div>
  );
}

export default function Jobs() {
  function sortJobs(jobs: IJobProps[]) {
    const groupDate = jobs.reduce(
      (acc, job) => {
        const createdFormat = moment(job.inserted_at).format("D MMM YYYY");

        if (!acc[createdFormat]) acc[createdFormat] = [];

        acc[createdFormat].push(job);

        return acc;
      },
      {} as Record<string, IJobProps[]>,
    );

    Object.keys(groupDate).map((key) =>
      groupDate[key].sort((jobA, jobB) =>
        moment(jobB.inserted_at).diff(moment(jobA.inserted_at)),
      ),
    );

    const reversed = Object.fromEntries(Object.entries(groupDate).reverse());

    return reversed;
  }

  const initialCount = {
    completed: 0,
    available: 0,
    discarded: 0,
    executing: 0,
  };

  function trackStates(jobs: IJobProps[]) {
    return jobs.reduce(
      (acc, job) => {
        acc[job.state as keyof typeof initialCount] += 1;

        return acc;
      },
      { ...initialCount },
    );
  }

  function formatTitle(tile: string) {
    return (tile.charAt(0).toUpperCase() + tile.slice(1)).split("_").join(" ");
  }

  const { data: jobsList } = useListJobs();
  const sortedJobList = sortJobs(jobsList ?? []);
  const stateCount = trackStates(jobsList ?? []);

  return (
    <>
      <title>Jobs | Backoffice | Pombo</title>
      <AuthCheck userTypes={["admin", "professor"]}>
        <SettingsWrapper title="Current jobs">
          <div className="flex h-full flex-col gap-8">
            <section className="space-y-2">
              <h2 className="text-2xl font-semibold">Monitor Your Jobs</h2>
              <p>
                Track the progress and state of imports and exports in real time
              </p>
            </section>

            <section className="flex flex-wrap gap-4">
              <SummaryCard
                title="Running"
                textColor="text-celeste"
                icon="keyboard_double_arrow_right"
                value={stateCount.executing}
              ></SummaryCard>
              <SummaryCard
                title="Pending"
                textColor="text-primary-400"
                icon="schedule"
                value={stateCount.available}
              ></SummaryCard>
              <SummaryCard
                title="Complete"
                textColor="text-success"
                icon="task_alt"
                value={stateCount.completed}
              ></SummaryCard>
              <SummaryCard
                title="Failed"
                textColor="text-danger"
                icon="cancel"
                value={stateCount.discarded}
              ></SummaryCard>
            </section>

            <section className="border-dark/5 flex h-full min-h-0 w-full flex-col gap-6 rounded-xl border p-3 shadow-sm md:p-6">
              <h2 className="text-lg font-semibold">Recent Jobs</h2>

              {jobsList && jobsList.length > 0 ? (
                <div className="h-full overflow-y-scroll">
                  {Object.entries(sortedJobList).map(([groupDate, jobs]) => (
                    <div className="mb-6 flex flex-col gap-2" key={groupDate}>
                      <p className="self-end pr-4 text-sm font-semibold">
                        {groupDate}
                      </p>

                      <div className="flex flex-col gap-4">
                        {jobs.map((job) => (
                          <JobCard
                            key={job.id}
                            title={formatTitle(job.type)}
                            type={job.type.split("_")[0]}
                            state={job.state}
                            id={job.id}
                            created_at={job.inserted_at}
                            start_at={job.attempted_at}
                            completed_at={job.completed_at}
                          />
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-dark/50 flex h-full w-full items-center justify-center pb-24">
                  There are no recent jobs on record
                </div>
              )}
            </section>
          </div>
        </SettingsWrapper>
      </AuthCheck>
    </>
  );
}
