"use client";

import { AuthCheck } from "@/components/auth-check";
import SettingsWrapper from "@/components/settings-wrapper";
import CustomCombobox from "@/components/combobox";
import ShiftForm from "@/components/shift-form";
import { useEffect, useMemo, useState } from "react";
import { useGetAllCourses } from "@/lib/queries/courses";
import { useGetShiftsForCourse } from "@/lib/queries/backoffice";
import { IItemProps } from "@/lib/types";
import { getShortShiftType } from "@/lib/utils";

export default function Shifts() {
  const { data: courses = [] } = useGetAllCourses(false);

  const [selectedCourse, setSelectedCourse] = useState<IItemProps | null>(null);
  const [selectedShift, setSelectedShift] = useState<IItemProps | null>(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  const formattedCourses: IItemProps[] = useMemo(() => {
    return courses.map((course) => ({ id: course.id, name: course.name }));
  }, [courses]);

  const { data: shifts = [] } = useGetShiftsForCourse(selectedCourse?.id);

  const formattedShifts: IItemProps[] = useMemo(() => {
    return shifts.map((shift) => ({
      id: shift.id,
      name: `${getShortShiftType(shift.type)}${shift.number}`,
    }));
  }, [shifts]);

  const selectedShiftData = useMemo(() => {
    return shifts.find((shift) => shift.id === selectedShift?.id);
  }, [shifts, selectedShift]);

  useEffect(() => {
    if (!hasUnsavedChanges) return;

    const onBeforeUnload = (e: BeforeUnloadEvent) => e.preventDefault();

    const onLinkClick = (e: MouseEvent) => {
      const link = (e.target as HTMLElement).closest("a");
      if (
        link &&
        link.target !== "_blank" &&
        !window.confirm(
          "You have unsaved changes. Are you sure you want to leave this page and discard your changes?",
        )
      ) {
        e.preventDefault();
      }
    };

    window.addEventListener("beforeunload", onBeforeUnload);
    document.addEventListener("click", onLinkClick, true);

    return () => {
      window.removeEventListener("beforeunload", onBeforeUnload);
      document.removeEventListener("click", onLinkClick, true);
    };
  }, [hasUnsavedChanges]);

  const confirmDiscard = (action: () => void, target: "course" | "shift") => {
    if (hasUnsavedChanges) {
      const confirmed = window.confirm(
        `You have unsaved changes in this shift. Are you sure you want to change ${target} and discard your changes?`,
      );
      if (!confirmed) return;
    }
    action();
  };

  const handleCourseChange = (course: IItemProps | null) => {
    if (course?.id === selectedCourse?.id) return;

    confirmDiscard(() => {
      setSelectedCourse(course);
      setSelectedShift(null);
    }, "course");
  };

  const handleShiftChange = (shift: IItemProps | null) => {
    if (shift?.id === selectedShift?.id) return;

    confirmDiscard(() => {
      setSelectedShift(shift);
    }, "shift");
  };

  useEffect(() => {
    if (selectedCourse && formattedShifts.length > 0) {
      if (!selectedShift) {
        setSelectedShift(formattedShifts[0]);
      } else {
        const matchingShift = formattedShifts.find(
          (s) => s.id === selectedShift.id,
        );
        if (matchingShift) {
          if (matchingShift.name !== selectedShift.name) {
            setSelectedShift(matchingShift);
          }
        } else {
          setSelectedShift(formattedShifts[0]);
        }
      }
    } else {
      setSelectedShift(null);
    }
  }, [selectedCourse, formattedShifts, selectedShift]);

  return (
    <>
      <title>Configurations | Pombo</title>
      <AuthCheck userTypes={["admin", "professor"]}>
        <SettingsWrapper title="Shifts Editing">
          <div className="flex h-full flex-col gap-4">
            <section className="space-y-2">
              <h2 className="text-2xl font-semibold">Shifts Editing</h2>
              <p>Here you can edit the shifts.</p>
            </section>
            <section className="flex flex-col gap-4 sm:flex-row">
              <div className="flex-1 space-y-1">
                <label className="text-sm font-medium text-gray-700">
                  Course
                </label>
                <CustomCombobox
                  items={formattedCourses}
                  selectedItem={selectedCourse}
                  setSelectedItem={handleCourseChange}
                  placeholder="Search courses..."
                />
              </div>
              <div className="flex-1 space-y-1">
                <label className="text-sm font-medium text-gray-700">
                  Shift
                </label>
                <CustomCombobox
                  items={formattedShifts}
                  selectedItem={selectedShift}
                  setSelectedItem={handleShiftChange}
                  placeholder="Search shifts..."
                />
              </div>
            </section>
            <span className="border-b border-gray-200" />
            <section className="flex flex-1 flex-col gap-4">
              {selectedShift && selectedCourse ? (
                <ShiftForm
                  key={selectedShift.id}
                  selectedCourse={selectedCourse}
                  selectedShift={selectedShift}
                  selectedShiftData={selectedShiftData}
                  onShiftNameChange={(newName) =>
                    setSelectedShift((prev) =>
                      prev ? { ...prev, name: newName } : null,
                    )
                  }
                  onDirtyChange={setHasUnsavedChanges}
                />
              ) : (
                <div className="flex flex-1 flex-col bg-white">
                  <h3 className="mb-4 text-lg font-medium">Shift Details</h3>
                  <p className="text-gray-500">
                    Select a shift to see details.
                  </p>
                </div>
              )}
            </section>
          </div>
        </SettingsWrapper>
      </AuthCheck>
    </>
  );
}
