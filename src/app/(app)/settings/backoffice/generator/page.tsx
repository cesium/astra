"use client";

import { AuthCheck } from "@/components/auth-check";
import CustomSelect from "@/components/select";
import SettingsWrapper from "@/components/settings-wrapper";
import { useGenerateSchedule } from "@/lib/mutations/backoffice";
import { useGetDegrees } from "@/lib/queries/backoffice";
import clsx from "clsx";
import { useState } from "react";
import { twMerge } from "tailwind-merge";

export default function GenerateSchedule() {
  const { data: degrees } = useGetDegrees();
  const generateSchedule = useGenerateSchedule();

  const onGenerate = () => {
    if (selectedDegree) {
      generateSchedule.mutate({
        degree: selectedDegree.id,
        semester: Number(selectedSemester.name),
      });
    }
  };

  const [selectedDegree, setselectedDegree] = useState<{
    id: string;
    name: string;
  } | null>(null);
  const [selectedSemester, setSelectedSemester] = useState({
    id: "semester-1",
    name: "1",
  });

  return (
    <AuthCheck userTypes={["admin", "professor"]}>
      <SettingsWrapper title="Schedule Generator">
        <div className="flex h-full flex-col gap-8">
          <section className="space-y-2">
            <h2 className="text-2xl font-semibold">Generate new schedule</h2>
            <p>Trigger the schedule generator with a few clicks</p>
          </section>

          <section className="space-y-6">
            <div className="max-w-2xl space-y-6">
              <div className="space-y-1">
                <p className="pl-2 font-semibold">Degree</p>
                <CustomSelect
                  items={degrees || []}
                  selectedItem={
                    selectedDegree || { id: "", name: "Select a course" }
                  }
                  setSelectedItem={setselectedDegree}
                />
              </div>

              <div className="space-y-1">
                <p className="pl-2 font-semibold">Semester</p>
                <CustomSelect
                  items={[1, 2].map((semester) => ({
                    id: `semester-${semester}`,
                    name: semester.toString(),
                  }))}
                  selectedItem={selectedSemester}
                  setSelectedItem={setSelectedSemester}
                />
              </div>
            </div>

            <button
              disabled={!selectedDegree}
              onClick={onGenerate}
              className={twMerge(
                clsx(
                  "mt-6 min-w-1/4 rounded-lg px-4 py-2 font-semibold text-white transition-all duration-200",
                  !selectedDegree
                    ? "cursor-not-allowed bg-gray-400"
                    : "bg-primary-400 hover:bg-primary-400/95 cursor-pointer hover:scale-98",
                ),
              )}
            >
              Generate Schedule
            </button>

            {generateSchedule.isPending && (
              <p className="text-dark/50 font-semibold">Pending...</p>
            )}

            {generateSchedule.isSuccess && (
              <p className="text-dark/50 font-semibold">
                {generateSchedule.data.message}
              </p>
            )}

            {generateSchedule.isError && (
              <p className="text-dark/50 font-semibold">
                {generateSchedule.error.message}
              </p>
            )}
          </section>
        </div>
      </SettingsWrapper>
    </AuthCheck>
  );
}
