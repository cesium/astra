"use client";

import { ICourse, IShift, IShiftsSorted } from "@/lib/types";
import React, { createContext, useState } from "react";

function removeShiftById(shifts: IShift[], id: string): IShift[] {
  return shifts.filter((shift) => shift.id !== id);
}

function addShiftById(
  shifts: IShift[],
  allShifts: IShift[],
  id: string,
): IShift[] {
  const newShift = allShifts.find((shift) => shift.id === id);
  if (newShift && !shifts.some((s) => s.id === id)) {
    return [...shifts, newShift];
  }
  return shifts;
}

function sortShiftsByYearCourse(mixedShifts: IShift[]): IShiftsSorted {
  const byYearSemester = mixedShifts.reduce(
    (acc, shift) => {
      if (!acc[shift.year]) acc[shift.year] = {};

      if (!acc[shift.year][shift.semester])
        acc[shift.year][shift.semester] = {};

      if (!acc[shift.year][shift.semester][shift.courseId]) {
        acc[shift.year][shift.semester][shift.courseId] = {
          courseName: shift.courseName,
          color: shift.eventColor,
          shifts: [],
        };
      }

      acc[shift.year][shift.semester][shift.courseId].shifts.push({
        id: shift.id,
        name: `${shift.shiftType}${shift.shiftNumber}`,
      });

      return acc;
    },
    {} as Record<
      number,
      Record<
        number,
        Record<
          string,
          {
            courseName: string;
            color: string;
            shifts: {
              id: string;
              name: string;
            }[];
          }
        >
      >
    >,
  );

  return Object.entries(byYearSemester).map(([year, semesters]) => ({
    year: Number(year),
    semesters,
  }));
}

interface ICalendarProvider {
  // relative to schedule
  currentSchedule: IShift[];
  editingShifts: IShift[];
  setEditingShifts: (curr: IShift[]) => void;
  shiftsToAdd: IShift[];
  removeShift: (id: string) => void;
  addShift: (id: string) => void;
  sortShiftsByYearCourse: (mixedShifts: IShift[]) => IShiftsSorted;

  // relative to calendar

  // global
  isEditing: boolean;
  setIsEditing: (curr: boolean) => void;
}

export const CalendarContext = createContext<ICalendarProvider>({
  currentSchedule: [],
  editingShifts: [],
  setEditingShifts: () => {},
  shiftsToAdd: [],
  removeShift: () => {},
  addShift: () => {},
  sortShiftsByYearCourse: () => [],

  isEditing: false,
  setIsEditing: () => {},
});

export function CalendarProvider({ children }: { children: React.ReactNode }) {
  const [courses, setCourses] = useState<ICourse[]>([]);

  const [currentSchedule, setCurrentSchedule] = useState<IShift[]>([]);
  const [editingShifts, setEditingShifts] = useState<IShift[]>([]);
  const [isEditing, setIsEditing] = useState<boolean>(false);

  function extractShifts(courses: ICourse[]): IShift[] {
    const { parentCourse, normalCourses } = courses.reduce(
      (acc: { parentCourse: ICourse[]; normalCourses: ICourse[] }, course) => {
        if (course.courses.length > 0) {
          acc.parentCourse.push(course);
        } else {
          acc.normalCourses.push(course);
        }
        return acc;
      },
      { parentCourse: [], normalCourses: [] },
    );

    const shiftsWithNoParents = normalCourses.flatMap((course) => {
      if (course.shifts && course.shifts.length > 0) {
        return course.shifts.flatMap((shiftGroup) =>
          shiftGroup.timeslots.map((shift) => {
            const WEEK_DAYS = [
              "monday",
              "tuesday",
              "wednesday",
              "thursday",
              "friday",
            ];

            const SHIFT_TYPES: Record<string, "PL" | "T" | "TP" | "OL"> = {
              theoretical: "T",
              theoretical_practical: "TP",
              practical_laboratory: "PL",
              tutorial_guidance: "OL",
            };

            const convertShiftType = (
              type: string,
            ): "PL" | "T" | "TP" | "OL" => {
              return SHIFT_TYPES[type as keyof typeof SHIFT_TYPES];
            };

            return {
              id: shiftGroup.id,
              courseName: course.name,
              courseId: course.id,
              shortCourseName: course.shortname,
              professor: shiftGroup.professor ?? undefined,
              weekday: WEEK_DAYS.indexOf(shift.weekday),
              start: shift.start,
              end: shift.end,
              shiftType: convertShiftType(shiftGroup.type),
              shiftNumber: shiftGroup.number,
              building:
                Number(shift.building) <= 3
                  ? `CP${shift.building}`
                  : `Building ${shift.building}`,
              room: shift.room,
              year: course.year,
              semester: course.semester,
              //todo Get colors from stores preferences
              eventColor: "#C3E5F9",
              textColor: "#227AAE",
              //todo Add status "active" | "inactive" | "is_overwritten"
            };
          }),
        );
      }
      return [];
    });

    const childShifts =
      parentCourse.length > 0
        ? extractShifts(parentCourse.flatMap((c) => c.courses))
        : [];

    return [...shiftsWithNoParents, ...childShifts];
  }

  function filtercurrentSchedule(
    allShifts: IShift[],
    currentSchedule: IShift[],
  ): IShift[] {
    const currentIds = new Set(currentSchedule.map((s) => s.id));
    return allShifts.filter((shift) => !currentIds.has(shift.id));
  }

  const removeShift = (id: string) => {
    setEditingShifts((prev) => removeShiftById(prev, id));
  };

  const addShift = (id: string) => {
    setEditingShifts((prev) => addShiftById(prev, allShifts, id));
  };

  const allShifts = extractShifts(courses);

  const shiftsToAdd = filtercurrentSchedule(allShifts, editingShifts);

  return (
    <CalendarContext.Provider
      value={{
        currentSchedule,
        editingShifts,
        setEditingShifts,
        shiftsToAdd,
        isEditing,
        setIsEditing,
        removeShift,
        addShift,
        sortShiftsByYearCourse,
      }}
    >
      {children}
    </CalendarContext.Provider>
  );
}
