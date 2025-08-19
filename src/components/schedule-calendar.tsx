"use client";

import { IShift } from "@/lib/types";
import CalendarView from "./calendar/calendar";
import { useEffect, useState } from "react";
import moment from "moment";

//Fix remove debug values
const shiftsDebug: IShift[] = [
  // Monday (August 11, 2025)
  {
    id: 0,
    courseName: "Programação Imperativa",
    shortCourseName: "PI",
    professor: "Prof. Name",
    day: 0, // Monday
    start: "08:00",
    end: "09:00",
    shiftType: "T",
    shiftNumber: 2,
    building: "CP1",
    room: "1.05",
    year: 1,
    semester: 1,
    eventColor: "#C3E5F9",
    textColor: "#227AAE",
  },
  {
    id: 1,
    courseName: "Sistemas de Computação",
    shortCourseName: "SC",
    professor: "Prof. Name",
    day: 0, // Monday
    start: "09:00",
    end: "10:00",
    shiftType: "T",
    shiftNumber: 1,
    building: "DI",
    room: "0.12",
    year: 1,
    semester: 1,
    eventColor: "#C3E5F9",
    textColor: "#227AAE",
  },
  {
    id: 2,
    courseName: "Programação Imperativa",
    shortCourseName: "PI",
    day: 0, // Monday
    start: "10:00",
    end: "12:00",
    shiftType: "TP",
    shiftNumber: 4,
    building: "CP2",
    room: "2.08",
    year: 1,
    semester: 1,
    eventColor: "#C3E5F9",
    textColor: "#227AAE",
  },
  // Tuesday (August 12, 2025)
  {
    id: 3,
    courseName: "Elementos de Probabilidade e Teoria dos Números",
    shortCourseName: "EPTN",
    professor: "Prof. Name",
    day: 1, // Tuesday
    start: "08:00",
    end: "10:00",
    shiftType: "T",
    shiftNumber: 2,
    building: "CP3",
    room: "1.15",
    year: 1,
    semester: 1,
    eventColor: "#C3E5F9",
    textColor: "#227AAE",
  },
  {
    id: 4,
    courseName: "Lógica",
    shortCourseName: "L",
    professor: "Prof. Name",
    day: 1, // Tuesday
    start: "10:00",
    end: "12:00",
    shiftType: "T",
    shiftNumber: 2,
    building: "DI",
    room: "0.09",
    year: 1,
    semester: 1,
    eventColor: "#C3E5F9",
    textColor: "#227AAE",
  },
  // Wednesday (August 13, 1)
  {
    id: 5,
    courseName: "Programação Imperativa",
    shortCourseName: "PI",
    day: 2, // Wednesday
    start: "08:00",
    end: "09:00",
    shiftType: "T",
    shiftNumber: 2,
    building: "CP1",
    room: "0.03",
    year: 1,
    semester: 1,
    eventColor: "#C3E5F9",
    textColor: "#227AAE",
  },
  {
    id: 6,
    courseName: "Sistemas de Computação",
    shortCourseName: "SC",
    professor: "Prof. Name",
    day: 2, // Wednesday
    start: "09:00",
    end: "11:00",
    shiftType: "PL",
    shiftNumber: 7,
    building: "CP2",
    room: "1.22",
    year: 1,
    semester: 1,
    eventColor: "#C3E5F9",
    textColor: "#227AAE",
  },
  {
    id: 7,
    courseName: "Sistemas de Computação",
    shortCourseName: "SC",
    professor: "Prof. Name",
    day: 2, // Wednesday
    start: "11:00",
    end: "12:00",
    shiftType: "T",
    shiftNumber: 1,
    building: "DI",
    room: "2.14",
    year: 1,
    semester: 1,
    eventColor: "#C3E5F9",
    textColor: "#227AAE",
  },
  // Thursday (August 14, 2025)
  {
    id: 8,
    courseName: "Laboratórios de Informática II",
    shortCourseName: "LI2",
    day: 3, // Thursday
    start: "14:00",
    end: "16:00",
    shiftType: "PL",
    shiftNumber: 6,
    building: "DI",
    room: "0.09",
    year: 1,
    semester: 1,
    eventColor: "#C3E5F9",
    textColor: "#227AAE",
  },
  {
    id: 9,
    courseName: "Lógica",
    shortCourseName: "L",
    day: 3, // Thursday
    start: "16:00",
    end: "17:00",
    shiftType: "TP",
    shiftNumber: 2,
    building: "CP3",
    room: "1.07",
    year: 1,
    semester: 1,
    eventColor: "#C3E5F9",
    textColor: "#227AAE",
  },
  // Friday (August 15, 2025)
  {
    id: 10,
    courseName: "Álgebra",
    shortCourseName: "A",
    professor: "Prof. Name",
    day: 4, // Friday
    start: "08:00",
    end: "10:00",
    shiftType: "TP",
    shiftNumber: 3,
    building: "CP1",
    room: "2.11",
    year: 1,
    semester: 1,
    eventColor: "#C3E5F9",
    textColor: "#227AAE",
  },
  {
    id: 11,
    courseName: "Álgebra",
    shortCourseName: "A",
    day: 4, // Friday
    start: "10:00",
    end: "12:00",
    shiftType: "T",
    shiftNumber: 1,
    building: "CP2",
    room: "0.18",
    year: 1,
    semester: 1,
    eventColor: "#C3E5F9",
    textColor: "#227AAE",
  },
  {
    id: 12,
    courseName: "Álgebra",
    shortCourseName: "A",
    professor: "Prof. Name",
    day: 4, // Friday
    start: "10:00",
    end: "12:00",
    shiftType: "TP",
    shiftNumber: 1,
    building: "CP1",
    room: "0.21",
    year: 1,
    semester: 1,
    eventColor: "#C3E5F9",
    textColor: "#227AAE",
  },
];

export default function ScheduleCalendar() {
  const [shifts, setShifts] = useState<IShift[]>([]);

  //Fix remove debug values
  useEffect(() => {
    setShifts(shiftsDebug);
  }, []);

  // Converts an IShift to an Event
  const formattedEvents = shifts.map((shift) => {
    const [startHour, startMinute] = shift.start.split(":");
    const [endHour, endMinute] = shift.end.split(":");

    return {
      title: `${shift.shortCourseName} - ${shift.shiftType}${shift.shiftNumber}`,
      start: moment()
        .day(shift.day + 1)
        .hour(+startHour)
        .minute(+startMinute)
        .toDate(),
      /* (*) we're subtracting 1 minute here to solve an issue that occurs when
       * the end time of an event is equal to the start time of another.
       * this issue causes the event bellow to think it is overlapping with the top one,
       * when the `dayLayoutAlgorithm` is set to `no-overlap`.
       */
      end: moment()
        .day(shift.day + 1)
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
        editing={false}
        className="schedule" // This class enables styles for the schedule view
      />
    </div>
  );
}
