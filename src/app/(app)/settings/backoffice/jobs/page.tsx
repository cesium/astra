"use client";

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
    discarded: "text-danger",
  };

  const STATE_ICON = {
    completed: "task_alt",
    executing: "progress_activity",
    available: "schedule",
    discarded: "cancel",
  };

  const textColor = STATE_COLORS[state as keyof typeof STATE_COLORS];
  const icon = STATE_ICON[state as keyof typeof STATE_ICON];

  return { textColor, icon };
}

interface IJobCardProps {
  state: string;
  title: string;
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
  icon: string;
  value: number;
}) {
  return (
    <div className="border-dark/5 flex flex-1 items-center justify-between rounded-xl border px-3 py-6 shadow-sm md:min-w-48">
      <div className="flex flex-col">
        <p className="text-dark/50 text-sm font-medium">{title}</p>
        <p className={twMerge(clsx("text-2xl font-bold", textColor))}>
          {value}
        </p>
      </div>

      <span
        className={twMerge(
          clsx("material-symbols-outlined text-3xl", textColor),
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
      <p className="truncate font-medium">{title}</p>
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
      <div className="bg-smoke border-dark/8 hidden h-fit items-center rounded-full border px-2.5 py-0.5 text-xs xl:inline-flex">
        {state === "available"
          ? "pending"
          : state === "discarded"
            ? "failed"
            : state}
      </div>
    </div>
  );
}

function JobCard({
  state,
  title,
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

  const { textColor, icon } = getStateStyle(state);

  return (
    <div className="border-dark/8 flex flex-col gap-6 rounded-xl border p-4 md:flex-row md:gap-0">
      <div className="flex flex-1 items-center gap-4">
        <span className="material-symbols-outlined text-xl">upload</span>
        <Label title={title} label={`ID: ${id}`} side="left" />

        <div className="flex flex-1 justify-end pb-4">
          <StateTag
            state={state}
            color={textColor}
            icon={icon}
            className="inline-flex md:hidden"
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
          className="hidden md:inline-flex"
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
      <title>Pombo | Jobs Monitor</title>

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
            icon="progress_activity"
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

        <section className="border-dark/5 scroll- flex h-full min-h-0 w-full flex-col gap-6 rounded-xl border p-3 shadow-sm md:p-6">
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
    </>
  );
}
