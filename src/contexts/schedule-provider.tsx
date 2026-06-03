"use client";

import { useUpdateStudentSchedule } from "@/lib/mutations/courses";
import {
  useGetAllCourses,
  useGetStudentOriginalSchedule,
  useGetStudentSchedule,
} from "@/lib/queries/courses";
import { IShift, IShiftsSorted } from "@/lib/types";
import { extractShifts } from "@/lib/utils";
import { createContext, useEffect, useState } from "react";

interface IScheduleProvider {
  originalSchedule: IShift[];
  currentSchedule: IShift[];
  editingShifts: IShift[];
  setEditingShifts: (curr: IShift[]) => void;
  shiftsToAdd: IShift[];
  removeShift: (id: string) => void;
  addShift: (id: string) => void;
  saveChanges: () => void;
  sortShiftsByYearCourse: (mixedShifts: IShift[]) => IShiftsSorted;

  hasChanges: boolean;
  isEditing: boolean;
  setIsEditing: (curr: boolean) => void;
}

function removeShiftById(shifts: IShift[], id: string): IShift[] {
  return shifts.filter((shift) => shift.id !== id);
}

function addShiftById(
  shifts: IShift[],
  allShifts: IShift[],
  originalShifts: IShift[],
  id: string,
): IShift[] {
  const newShifts = allShifts.filter((shift) => shift.id === id);

  const shiftsToAdd = newShifts.filter(
    (newShift) =>
      !shifts.some((s) => s.id === newShift.id && s.slotId === newShift.slotId),
  );

  const mappedShifts = shiftsToAdd.map((newShift) => {
    const isOriginal = originalShifts.some(
      (shift) =>
        shift.id === id &&
        (shift.status === "inactive" || shift.status === "active"),
    );
    return {
      ...newShift,
      status: (isOriginal ? "active" : "override") as
        | "active"
        | "override"
        | "inactive"
        | null,
    };
  });

  return [...shifts, ...mappedShifts];
}

function sortShiftsByYearCourse(mixedShifts: IShift[]): IShiftsSorted {
  // remove duplicates since timeslots are previously converted to shifts
  const seen = new Set<string>();
  const uniqueShifts = mixedShifts.filter((shift) => {
    if (seen.has(shift.id)) return false;
    seen.add(shift.id);
    return true;
  });

  const byYearSemester = uniqueShifts.reduce(
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

      function sortedIndex(
        array: {
          id: string;
          type: string;
          number: number;
        }[],
        shift: {
          id: string;
          type: string;
          number: number;
        },
      ) {
        let l = 0;
        let d = array.length;

        while (l < d) {
          const curr = (l + d) >>> 1;
          if (
            array[curr].type < shift.type ||
            (array[curr].type === shift.type &&
              array[curr].number < shift.number)
          )
            l = curr + 1;
          else d = curr;
        }

        return l;
      }

      const shiftsArray =
        acc[shift.year][shift.semester][shift.courseId].shifts;
      const newShift = {
        id: shift.id,
        type: shift.shiftType,
        number: shift.shiftNumber,
      };

      shiftsArray.splice(sortedIndex(shiftsArray, newShift), 0, newShift);

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
              type: string;
              number: number;
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

export const ScheduleContext = createContext<IScheduleProvider>({
  originalSchedule: [],
  currentSchedule: [],
  editingShifts: [],
  setEditingShifts: () => {},
  shiftsToAdd: [],
  removeShift: () => {},
  addShift: () => {},
  saveChanges: () => {},
  sortShiftsByYearCourse: () => [],

  hasChanges: false,
  isEditing: false,
  setIsEditing: () => {},
});

export function ScheduleProvider({ children }: { children: React.ReactNode }) {
  const { data: allCourses } = useGetAllCourses();
  const { data: currentCourses } = useGetStudentSchedule();
  const { data: originalCourses } = useGetStudentOriginalSchedule();
  const updateStudentSchedule = useUpdateStudentSchedule();

  const [allShifts, setAllShifts] = useState<IShift[]>([]);
  const [shiftsToAdd, setShiftsToAdd] = useState<IShift[]>([]);
  const [currentSchedule, setCurrentSchedule] = useState<IShift[]>([]);
  const [editingShifts, setEditingShifts] = useState<IShift[]>([]);

  const [hasChanges, setHasChanges] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);

  function extractIds(shifts: IShift[]): string[] {
    const Ids = shifts.map((shift) => shift.id);
    return [...new Set(Ids)];
  }

  function filterCurrentSchedule(
    allShifts: IShift[],
    currentSchedule: IShift[],
  ): IShift[] {
    const currentIds = new Set(currentSchedule.map((s) => s.id));
    return allShifts.filter((shift) => !currentIds.has(shift.id));
  }

  function lookForChanges(schedule1: IShift[], schedule2: IShift[]) {
    if (schedule1.length !== schedule2.length) return true;

    const schedule1Ids = new Set(schedule1.map((shift) => shift.id));
    const schedule2Ids = new Set(schedule2.map((shift) => shift.id));

    if (schedule1Ids.size !== schedule2Ids.size) return true;

    for (const id of schedule1Ids) {
      if (!schedule2Ids.has(id)) return true;
    }

    return false;
  }

  const removeShift = (id: string) => {
    setEditingShifts((prev) => removeShiftById(prev, id));
  };

  const addShift = (id: string) => {
    setEditingShifts((prev) =>
      addShiftById(prev, allShifts, originalSchedule, id),
    );
  };

  const saveChanges = () => {
    const newIds = extractIds(editingShifts);
    updateStudentSchedule.mutate({ shifts: newIds });
  };

  useEffect(() => {
    setAllShifts(extractShifts(allCourses ?? []));
  }, [allCourses]);

  useEffect(() => {
    setCurrentSchedule(extractShifts(currentCourses ?? []));
  }, [currentCourses]);

  useEffect(() => {
    setEditingShifts([...currentSchedule]);
  }, [currentSchedule]);

  useEffect(() => {
    setHasChanges(lookForChanges(currentSchedule, editingShifts));
  }, [currentSchedule, editingShifts]);

  useEffect(() => {
    setShiftsToAdd(filterCurrentSchedule(allShifts, editingShifts));
  }, [allShifts, editingShifts]);

  const originalSchedule = extractShifts(originalCourses ?? []);

  return (
    <ScheduleContext.Provider
      value={{
        originalSchedule,
        currentSchedule,
        editingShifts,
        setEditingShifts,
        shiftsToAdd,
        hasChanges,
        isEditing,
        setIsEditing,
        removeShift,
        addShift,
        saveChanges,
        sortShiftsByYearCourse,
      }}
    >
      {children}
    </ScheduleContext.Provider>
  );
}
