export enum UserType {
  student,
  admin,
  professor,
}

export interface User {
  id: string;
  name: string;
  email: string;
  type: string;
  student?: Student;
}

export interface Student {
  id: string;
  number: string;
  degree_year: number | null;
  special_status: string;
}

export interface ITimeSlot {
  id: string;
  start: string;
  end: string;
  weekday: string;
  room: string | null;
  building: string | null;
}

export interface IShiftResponse {
  id: string;
  type: string;
  number: number;
  professor?: string | null;
  timeslots: ITimeSlot[];
  enrollment_status: "active" | "inactive" | "override" | null;
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
  building: string | null;
  room: string | null;
  year: number;
  semester: number;
  eventColor: string;
  textColor: string;
  status: "active" | "inactive" | "override" | null;
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
          type: string;
          number: number;
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

export interface IJobProps {
  id: number;
  type: string;
  state: string;
  attempted_at: Date;
  completed_at: Date;
  inserted_at: Date;
  user_id: string;
}

export interface IItemProps {
  id: string;
  name: string;
}

export enum SortDirection {
  NONE = "none",
  ASC = "asc",
  DESC = "desc",
}

export interface FlopMetaParams {
  "order_by[]"?: string;
  "order_directions[]"?: string;
  filters: { field: string; op: string; value: string }[];
  page_size: number;
  page: number;
}

export interface FlopMetaResponse {
  sort: string[];
  filters: string[];
  page_size: number;
  current_page: number;

  next_page?: number | null;
  previous_page?: number | null;
  total_pages?: number;
  has_next_page?: boolean;
  has_previous_page?: boolean;
  total_entries?: number;
}
