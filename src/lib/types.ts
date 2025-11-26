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
  id: string;
  name: string;
  category: IEventCategory;
  start: moment.Moment;
  end: moment.Moment;
  place?: string;
  link?: string;
  eventColor: string;
  textColor: string;
  allDay?: boolean;
}

export interface IEventResponse {
  id: string;
  title: string;
  category: IEventCategory;
  start: string;
  end: string;
  place?: string;
  link?: string;
}

export type IEventRequest = Omit<IEventResponse, "id" | "category"> & {
  category_id: string;
};

export interface IJobProps {
  id: number;
  type: string;
  state: string;
  attempted_at: Date;
  completed_at: Date;
  inserted_at: Date;
  user_id: string;
}

export interface IEventCategory {
  id: string;
  name: string;
  type: "optional" | "mandatory";
  color: string;
  course?: ICourse;
}

export type IEventCategoryRequest = Omit<IEventCategory, "id" | "course"> & {
  course_id: string;
};

export type IEventCategoriesSorted = {
  year?: number;
  categories: IEventCategory[];
}[];

export interface IItemProps {
  id: string;
  name: string;
}
