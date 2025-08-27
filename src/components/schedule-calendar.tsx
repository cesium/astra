"use client";

import CalendarView from "./calendar/calendar";
import { useContext } from "react";
import moment from "moment";
import { CalendarContext } from "@/contexts/calendar-provider";

export default function ScheduleCalendar() {
  const context = useContext(CalendarContext);

  const { isEditing, editingShifts = [] } = context;

  // Converts an IShift to an Event
  const formattedEvents = editingShifts.map((shift) => {
    const [startHour, startMinute] = shift.start.split(":");
    const [endHour, endMinute] = shift.end.split(":");

    return {
      title: `${shift.shortCourseName} - ${shift.shiftType}${shift.shiftNumber}`,
      start: moment()
        .day(shift.weekday + 1)
        .hour(+startHour)
        .minute(+startMinute)
        .toDate(),
      /* (*) we're subtracting 1 minute here to solve an issue that occurs when
       * the end time of an event is equal to the start time of another.
       * this issue causes the event bellow to think it is overlapping with the top one,
       * when the `dayLayoutAlgorithm` is set to `no-overlap`.
       */
      end: moment()
        .day(shift.weekday + 1)
        .hour(+endHour)
        .minute(+endMinute - 1) // (*)
        .toDate(),
      allDay: false,
      resource: shift,
    };
  });

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
