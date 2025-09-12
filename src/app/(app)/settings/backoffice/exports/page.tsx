"use client";

import { AuthCheck } from "@/components/auth-check";
import CustomCombobox from "@/components/combobox";
import SettingsWrapper from "@/components/settings-wrapper";
import { useGetAllCourses } from "@/lib/queries/courses";
import { ICourse } from "@/lib/types";
import clsx from "clsx";
import { useState } from "react";
import { twMerge } from "tailwind-merge";

function formatCourses(courses: ICourse[] | undefined) {
  if (!courses) return [];

  return courses.map((course) => {
    return { id: course.id, name: course.name };
  });
}

export default function Exports() {
  const [selectedCourse, setSelectedCourse] = useState<{
    id: string;
    name: string;
  } | null>(null);

  const { data: allCourses } = useGetAllCourses();

  const formattedCourses = formatCourses(allCourses);

  // const handleShiftsGroupExport = () => {
  //   const {data: exportShiftsGroup} = useExportShiftGroups(selectedCourse?.id || "")
  //   console.log(exportShiftsGroup)
  // }

  // const handleGroupEnrollmentsExport = () => {
  //   const {data: exportGroupEnrollments} = useExportGroupEnrollments(selectedCourse?.id || "")
  //   console.log(exportGroupEnrollments)
  // }

  const validCourse = selectedCourse !== null;

  return (
    <AuthCheck userTypes={["admin", "professor"]}>
      <title>Pombo | Exports</title>

      <SettingsWrapper title="Schedule Generator">
        <div className="flex h-full flex-col gap-8">
          <section className="space-y-2">
            <h2 className="text-2xl font-semibold">Generate new schedule</h2>
            <p>Trigger the schedule generator with a few clicks</p>
          </section>

          <section className="space-y-6">
            <div className="max-w-2xl space-y-6">
              <div className="space-y-1">
                <p className="pl-2 font-semibold select-none">Courses</p>
                <CustomCombobox
                  items={formattedCourses}
                  selectedItem={selectedCourse}
                  setSelectedItem={setSelectedCourse}
                />
              </div>
            </div>

            <div className="mt-6 inline-flex w-full items-center gap-4">
              <button
                disabled={!validCourse}
                onClick={() => {}}
                className={twMerge(
                  clsx(
                    "w-1/3 rounded-lg px-4 py-2 font-semibold text-white transition-all duration-200",
                    !validCourse
                      ? "cursor-not-allowed bg-gray-400"
                      : "bg-primary-400 hover:bg-primary-400/95 cursor-pointer hover:scale-98",
                  ),
                )}
              >
                Download Shift Groups
              </button>

              <span className="text-dark/80 font-semibold">or</span>

              <button
                disabled={!validCourse}
                onClick={() => {}}
                className={twMerge(
                  clsx(
                    "w-1/3 rounded-lg px-4 py-2 font-semibold text-white transition-all duration-200",
                    !validCourse
                      ? "cursor-not-allowed bg-gray-400"
                      : "bg-primary-400 hover:bg-primary-400/95 cursor-pointer hover:scale-98",
                  ),
                )}
              >
                Download Group Enrollments
              </button>
            </div>

            {/* {generateSchedule.isPending && (
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
            )} */}
          </section>
        </div>
      </SettingsWrapper>
    </AuthCheck>
  );
}
