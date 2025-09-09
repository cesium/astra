"use client";

import { useContext } from "react";
import { ScheduleContext } from "@/contexts/schedule-provider";

import DisplayShifts from "./schedule/display-shifts";
import CalendarOptions from "./common/calendar-options";

export default function ScheduleOptions() {
  const context = useContext(ScheduleContext);

  const {
    originalSchedule,
    currentSchedule,
    editingShifts,
    shiftsToAdd,
    sortShiftsByYearCourse,
    removeShift,
    addShift,
    saveChanges,
    hasChanges,
    setEditingShifts,
    isEditing,
    setIsEditing,
  } = context;

  return (
    <CalendarOptions
      currentItems={currentSchedule}
      editingItems={editingShifts}
      itemsToAdd={shiftsToAdd}
      isEditing={isEditing}
      hasChanges={hasChanges}
      setIsEditing={setIsEditing}
      setEditingItems={setEditingShifts}
      removeItem={removeShift}
      addItem={addShift}
      saveChanges={saveChanges}
      clearItems={() => setEditingShifts([])}
      resetItems={() => setEditingShifts(originalSchedule)}
      title="Schedule"
      description="Choose the courses and respective shifts you wish to attend."
      DisplayComponent={DisplayShifts}
      sortItems={sortShiftsByYearCourse}
    />
  );
}
