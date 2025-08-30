import clsx from "clsx";
import React from "react";
import { twMerge } from "tailwind-merge";

function SummaryCard({
  title,
  textColor,
  icon,
}: {
  title: string;
  textColor: string;
  icon: string;
}) {
  return (
    <div className="border-dark/8 flex min-w-48 flex-1 items-center justify-between rounded-xl border px-3 py-6 shadow-sm">
      <div className="flex flex-col">
        <p className="text-dark/50 text-sm font-medium">{title}</p>
        <p className={twMerge(clsx("text-2xl font-bold", textColor))}>1</p>
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

export default function Jobs() {
  return (
    <div className="flex flex-col gap-8">
      <section className="space-y-2">
        <h2 className="text-2xl font-semibold">Monitor Your Jobs</h2>
        <p>Track the progress and state of imports and exports in real time</p>
      </section>

      <section className="flex flex-wrap gap-4">
        <SummaryCard
          title="Running"
          textColor="text-celeste"
          icon="progress_activity"
        ></SummaryCard>
        <SummaryCard
          title="Queued"
          textColor="text-primary-400"
          icon="schedule"
        ></SummaryCard>
        <SummaryCard
          title="Complete"
          textColor="text-success"
          icon="task_alt"
        ></SummaryCard>
        <SummaryCard
          title="Failed"
          textColor="text-danger"
          icon="cancel"
        ></SummaryCard>
      </section>

      <section className="border-dark/8 min-h-96 w-full space-y-6 rounded-xl border p-6 shadow-sm">
        <h2 className="text-lg font-semibold">Recent Jobs</h2>
        <div className="text-dark/50 flex h-full w-full items-center justify-center">
          There are no recent jobs on record
        </div>
      </section>
    </div>
  );
}
