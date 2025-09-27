import moment from "moment";
import { ICourse, IShift } from "./types";

export function firstLastName(name: string | undefined) {
  if (!name) return "";

  if (name?.split(" ").length > 1) {
    return (
      name?.split(" ").filter(Boolean)[0] +
      " " +
      name?.split(" ").filter(Boolean).slice(-1)[0]
    );
  }

  return name?.split(" ").filter(Boolean);
}

// Converts a hex color to rgba, enabling opacity and darkening options
export const editColor = (color: string, opacity: number, darken: number) => {
  const r = Math.floor(parseInt(color.slice(1, 3), 16) * darken);
  const g = Math.floor(parseInt(color.slice(3, 5), 16) * darken);
  const b = Math.floor(parseInt(color.slice(5, 7), 16) * darken);
  const a = opacity;
  const rgbaColor = `rgba(${r}, ${g}, ${b}, ${a})`;

  return rgbaColor;
};

// Converts an IShift to an Event
export function formatIShift(shifts: IShift[]) {
  return shifts.map((shift) => {
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
}

// Extracts IShifts from ICourses
export function extractShifts(courses: ICourse[]): IShift[] {
  const { parentCourse, normalCourses } = courses.reduce(
    (acc: { parentCourse: ICourse[]; normalCourses: ICourse[] }, course) => {
      if (course.courses.length > 0) {
        acc.parentCourse.push(course);
      } else {
        acc.normalCourses.push(course);
      }
      return acc;
    },
    { parentCourse: [], normalCourses: [] },
  );

  const shiftsWithNoParents = normalCourses.flatMap((course) => {
    if (course.shifts && course.shifts.length > 0) {
      return course.shifts.flatMap((shiftGroup) =>
        shiftGroup.timeslots.map((shift) => {
          const WEEK_DAYS = [
            "monday",
            "tuesday",
            "wednesday",
            "thursday",
            "friday",
          ];

          const SHIFT_TYPES: Record<string, "PL" | "T" | "TP" | "OL"> = {
            theoretical: "T",
            theoretical_practical: "TP",
            practical_laboratory: "PL",
            tutorial_guidance: "OL",
          };

          const convertShiftType = (type: string): "PL" | "T" | "TP" | "OL" => {
            return SHIFT_TYPES[type as keyof typeof SHIFT_TYPES];
          };

          return {
            id: shiftGroup.id,
            courseName: course.name,
            courseId: course.id,
            shortCourseName: course.shortname,
            professor: shiftGroup.professor ?? undefined,
            weekday: WEEK_DAYS.indexOf(shift.weekday),
            start: shift.start,
            end: shift.end,
            shiftType: convertShiftType(shiftGroup.type),
            shiftNumber: shiftGroup.number,
            building: shift.building
              ? Number(shift.building) <= 3
                ? `CP${shift.building}`
                : `Building ${shift.building}`
              : null,
            room: shift.room || null,
            year: course.year,
            semester: course.semester,
            eventColor: "#C3E5F9",
            textColor: "#227AAE",
            status: shiftGroup.enrollment_status,
          };
        }),
      );
    }
    return [];
  });

  const childShifts =
    parentCourse.length > 0
      ? extractShifts(parentCourse.flatMap((c) => c.courses))
      : [];

  return [...shiftsWithNoParents, ...childShifts];
}
