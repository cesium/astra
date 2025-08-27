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

export interface IShiftResponse {
  id: string;
  type: string;
  number: number;
  professor?: string | null;
  timeslots: {
    id: string;
    start: string;
    end: string;
    weekday: string;
    room: string;
    building: string;
  }[];
}

export interface ICourse {
  code: string;
  id: string;
  name: string;
  year: number;
  courses: ICourse[];
  semester: number;
  shortname: string;
  shifts: IShiftResponse[];
}

export interface IShift {
  id: string;
  courseName: string;
  courseId: string;
  shortCourseName: string;
  professor?: string;
  weekday: number;
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
  status?: "active" | "inactive" | "is_overwritten";
}

export type IShiftsSorted = {
  year: number;
  semesters: Record<
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
  >;
}[];

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
