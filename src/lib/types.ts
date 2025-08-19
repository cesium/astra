export enum UserType {
  student,
  admin,
  professor,
}

export interface User {
  id: string;
  name: string;
  email: string;
}

export interface IShift {
  id: number;
  courseName: string;
  shortCourseName: string;
  professor?: string;
  day: number;
  start: string; // hour only
  end: string; // hour only
  shiftType: "T" | "TP" | "PL" | "OL";
  shiftNumber: number;
  building: string;
  room: string;
  year: number;
  semester: number;
  eventColor: string;
  textColor: string;
}

export interface IEvent {
  id: number;
  title: string;
  category: string;
  start: string;
  end: string;
  place: string;
  link?: { label: string; href: string };
  eventColor: string;
  textColor: string;
  allDay?: boolean;
}
