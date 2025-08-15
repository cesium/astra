import CalendarView from "@/components/calendar/calendar";
import { Metadata } from "next";
import { IShift } from "@/lib/types";

const shifts: IShift[] = [
  // Monday (August 11, 2025)
  {
    id: 0,
    courseName: "Programação Imperativa",
    shortCourseName: "PI",
    day: 1, // Monday
    start: "08:00",
    end: "09:00",
    shiftType: "T",
    shiftNumber: 2,
    building: "Campus",
    room: "",
    year: 1,
    semester: 1,
    eventColor: "#C3E5F9",
    textColor: "#227AAE",
  },
  {
    id: 1,
    courseName: "Sistemas de Computação",
    shortCourseName: "SC",
    day: 1, // Monday
    start: "09:00",
    end: "10:00",
    shiftType: "T",
    shiftNumber: 1,
    building: "Campus",
    room: "",
    year: 1,
    semester: 1,
    eventColor: "#C3E5F9",
    textColor: "#227AAE",
  },
  {
    id: 2,
    courseName: "Programação Imperativa",
    shortCourseName: "PI",
    day: 1, // Monday
    start: "10:00",
    end: "12:00",
    shiftType: "TP",
    shiftNumber: 4,
    building: "Campus",
    room: "",
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
    day: 2, // Tuesday
    start: "08:00",
    end: "10:00",
    shiftType: "T",
    shiftNumber: 2,
    building: "Campus",
    room: "",
    year: 1,
    semester: 1,
    eventColor: "#C3E5F9",
    textColor: "#227AAE",
  },
  {
    id: 4,
    courseName: "Lógica",
    shortCourseName: "L",
    day: 2, // Tuesday
    start: "10:00",
    end: "12:00",
    shiftType: "T",
    shiftNumber: 2,
    building: "Campus",
    room: "",
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
    day: 3, // Wednesday
    start: "08:00",
    end: "09:00",
    shiftType: "T",
    shiftNumber: 2,
    building: "Campus",
    room: "",
    year: 1,
    semester: 1,
    eventColor: "#C3E5F9",
    textColor: "#227AAE",
  },
  {
    id: 6,
    courseName: "Sistemas de Computação",
    shortCourseName: "SC",
    day: 3, // Wednesday
    start: "09:00",
    end: "11:00",
    shiftType: "PL",
    shiftNumber: 7,
    building: "Campus",
    room: "",
    year: 1,
    semester: 1,
    eventColor: "#C3E5F9",
    textColor: "#227AAE",
  },
  {
    id: 7,
    courseName: "Sistemas de Computação",
    shortCourseName: "SC",
    day: 3, // Wednesday
    start: "11:00",
    end: "12:00",
    shiftType: "T",
    shiftNumber: 1,
    building: "Campus",
    room: "",
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
    day: 4, // Thursday
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
    day: 4, // Thursday
    start: "16:00",
    end: "17:00",
    shiftType: "TP",
    shiftNumber: 2,
    building: "Campus",
    room: "",
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
    day: 5, // Friday
    start: "08:00",
    end: "10:00",
    shiftType: "TP",
    shiftNumber: 3,
    building: "Campus",
    room: "",
    year: 1,
    semester: 1,
    eventColor: "#C3E5F9",
    textColor: "#227AAE",
  },
  {
    id: 11,
    courseName: "Álgebra",
    shortCourseName: "A",
    day: 5, // Friday
    start: "10:00",
    end: "12:00",
    shiftType: "T",
    shiftNumber: 1,
    building: "Campus",
    room: "",
    year: 1,
    semester: 1,
    eventColor: "#C3E5F9",
    textColor: "#227AAE",
  },
  // Saturday (August 16, 2025)
  {
    id: 12,
    courseName: "Elementos de Probabilidade e Teoria dos Números",
    shortCourseName: "EPTN",
    day: 6, // Saturday
    start: "14:00",
    end: "16:00",
    shiftType: "TP",
    shiftNumber: 6,
    building: "Campus",
    room: "",
    year: 1,
    semester: 1,
    eventColor: "#C3E5F9",
    textColor: "#227AAE",
  },
];

export const metadata: Metadata = {
  title: "Pombo | Schedule",
};

export default function Schedule() {
  return (
    <div className="flex h-full w-full gap-8">
      <div className="hidden w-23 bg-gray-400 md:block">
        <button className="cursor-pointer">Edit</button>
      </div>
      <div className="max-h-[754px] w-full">
        <CalendarView
          type="schedule"
          shifts={shifts}
          views={{ work_week: true }}
          editing={false}
          className="schedule"
        />
      </div>
    </div>
  );
}
