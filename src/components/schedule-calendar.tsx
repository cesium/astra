"use client";

import CalendarView from "./calendar/calendar";
import { useContext } from "react";
import { ScheduleContext } from "@/contexts/schedule-provider";
import { formatIShift } from "@/lib/utils";

export default function ScheduleCalendar() {
  const context = useContext(ScheduleContext);

  const { isEditing, editingShifts = [] } = context;

  // Converts an IShift to an Event
  const formattedEvents = formatIShift(editingShifts);

  return (
    <div className="w-full">
      <CalendarView
        type="schedule"
        events={formattedEvents}
        views={{ work_week: true }}
        editing={isEditing}
        className="schedule" // This class enables styles for the schedule view
      />
    </div>
  );
}
