"use client";

import { AuthCheck } from "@/components/auth-check";
import CustomCombobox from "@/components/combobox";
import SettingsWrapper from "@/components/settings-wrapper";
import {
  useExportGroupEnrollments,
  useExportShiftGroups,
} from "@/lib/queries/backoffice";
import { useGetAllCourses } from "@/lib/queries/courses";
import { ICourse } from "@/lib/types";
import { useDictionary } from "@/providers/dictionary-provider";
import clsx from "clsx";
import { useState } from "react";
import { twMerge } from "tailwind-merge";

function downloadFile({
  data,
  fileName,
  fileType,
}: {
  data: string;
  fileName: string;
  fileType: string;
}) {
  const blob = new Blob([data], { type: fileType });

  const a = document.createElement("a");
  a.download = fileName;
  a.href = window.URL.createObjectURL(blob);
  const clickEvt = new MouseEvent("click", {
    view: window,
    bubbles: true,
    cancelable: true,
  });
  a.dispatchEvent(clickEvt);
  a.remove();
}

function formatCourses(courses: ICourse[] | undefined) {
  if (!courses) return [];

  return courses.map((course) => {
    return { id: course.id, name: course.name };
  });
}

export default function Exports() {
  const dict = useDictionary();
  const [selectedCourse, setSelectedCourse] = useState<{
    id: string;
    name: string;
  } | null>(null);

  const { data: allCourses } = useGetAllCourses();
  const { refetch: getShiftGroups, isError: exportShiftsGroupError } =
    useExportShiftGroups(selectedCourse?.id || "");
  const { refetch: getGroupEnrollment, isError: exportGroupEnrollmentsError } =
    useExportGroupEnrollments(selectedCourse?.id || "");

  const formattedCourses = formatCourses(allCourses);

  const handleShiftsGroupExport = async () => {
    const result = await getShiftGroups();
    downloadFile({
      data: result.data,
      fileName: `${selectedCourse?.name}-turmas.csv`,
      fileType: "text/csv",
    });
  };

  const handleGroupEnrollmentsExport = async () => {
    const result = await getGroupEnrollment();
    downloadFile({
      data: result.data,
      fileName: `${selectedCourse?.name}-inscrições.csv`,
      fileType: "text/csv",
    });
  };

  const validCourse = selectedCourse !== null;

  return (
    <AuthCheck userTypes={["admin", "professor"]}>
      <title>Pombo | Exports</title>

      <SettingsWrapper title="Schedule Generator">
        <div className="flex h-full flex-col gap-8">
          <section className="space-y-2">
            <h2 className="text-2xl font-semibold">
              {dict.settings.sections.backoffice.modules.export.title}
            </h2>
            <p>
              {dict.settings.sections.backoffice.modules.export.description}
            </p>
          </section>

          <section className="space-y-6">
            <div className="max-w-2xl space-y-6">
              <div className="space-y-1">
                <p className="pl-2 font-semibold select-none">
                  {
                    dict.settings.sections.backoffice.modules.export.options
                      .courses
                  }
                </p>
                <CustomCombobox
                  items={formattedCourses}
                  selectedItem={selectedCourse}
                  setSelectedItem={setSelectedCourse}
                />
              </div>
            </div>

            <div className="mt-6 inline-flex w-full max-w-2xl items-center gap-4">
              <button
                disabled={!validCourse}
                onClick={handleShiftsGroupExport}
                className={twMerge(
                  clsx(
                    "w-1/2 rounded-lg px-4 py-2 text-sm font-semibold text-white transition-all duration-200 md:text-base",
                    !validCourse
                      ? "cursor-not-allowed bg-gray-400"
                      : "bg-primary-400 hover:bg-primary-400/95 cursor-pointer hover:scale-98",
                  ),
                )}
              >
                {
                  dict.settings.sections.backoffice.modules.export.options
                    .shift_groups
                }
              </button>

              <span className="text-dark/80 font-semibold">
                {dict.ui.common.or}
              </span>

              <button
                disabled={!validCourse}
                onClick={handleGroupEnrollmentsExport}
                className={twMerge(
                  clsx(
                    "w-1/2 rounded-lg px-4 py-2 text-sm font-semibold text-white transition-all duration-200 md:text-base",
                    !validCourse
                      ? "cursor-not-allowed bg-gray-400"
                      : "bg-primary-400 hover:bg-primary-400/95 cursor-pointer hover:scale-98",
                  ),
                )}
              >
                {
                  dict.settings.sections.backoffice.modules.export.options
                    .group_enrollments
                }
              </button>
            </div>

            {exportShiftsGroupError && (
              <p className="text-dark/50 font-semibold">
                Failed to download Shifts Group!
              </p>
            )}

            {exportGroupEnrollmentsError && (
              <p className="text-dark/50 font-semibold">
                Failed to download Group Enrollment!
              </p>
            )}
          </section>
        </div>
      </SettingsWrapper>
    </AuthCheck>
  );
}
