"use client";

import SideSectionDisclosure from "./side-section-disclosure";
import { useGetStudentOriginalSchedule } from "@/lib/queries/courses";
import { useGetExchangeDate } from "@/lib/queries/exchange";
import { ICourse } from "@/lib/types";

function parseDate(iso: string) {
  const date = new Date(iso);
  return {
    year: date.getFullYear(),
    month: date.getMonth(),
    day: date.getDate(),
    hour: date.getHours(),
    minute: date.getMinutes(),
  };
}

const getShortShiftType = (shiftType: string) => {
  switch (shiftType) {
    case "theoretical":
      return "T";
    case "theoretical_practical":
      return "TP";
    case "practical_laboratory":
      return "PL";
    case "tutorial_guidance":
      return "TG";
    default:
      return shiftType;
  }
};

interface DateStateTextProps {
  exchangeDate: { data: { start: string; end: string } } | undefined;
}

const getExchangeDateStateText = (
  exchangeDate: DateStateTextProps["exchangeDate"],
) => {
  if (!exchangeDate?.data.end) return "No deadline available";

  const now = new Date();
  const opening = new Date(exchangeDate.data.start);
  const deadline = new Date(exchangeDate.data.end);
  const parsedStart = parseDate(
    exchangeDate?.data.start ?? new Date().toISOString(),
  );
  const parsedEnd = parseDate(
    exchangeDate?.data.end ?? new Date().toISOString(),
  );

  if (opening < now && now < deadline) {
    return (
      "The exchange period ends on " +
      parsedEnd.day.toString() +
      "/" +
      (parsedEnd.month + 1).toString().padStart(2, "0") +
      "/" +
      parsedEnd.year +
      " at " +
      parsedEnd.hour.toString().padStart(2, "0") +
      ":" +
      parsedEnd.minute.toString().padStart(2, "0")
    );
  } else if (now < opening) {
    return (
      "The exchange period starts on " +
      parsedStart.day.toString() +
      "/" +
      (parsedStart.month + 1).toString().padStart(2, "0") +
      "/" +
      parsedStart.year +
      " at " +
      parsedStart.hour.toString().padStart(2, "0") +
      ":" +
      parsedStart.minute.toString().padStart(2, "0")
    );
  } else {
    return "The exchange period has ended.";
  }
};

export default function SideSection() {
  const { data: originalCourses } = useGetStudentOriginalSchedule();
  const { data: exchangeDate } = useGetExchangeDate();
  const normalCourses: ICourse[] = originalCourses
    ? originalCourses.filter((course) => course.courses.length === 0)
    : [];

  return (
    <div className="flex flex-shrink-0 flex-col gap-2 lg:w-[317px]">
      <SideSectionDisclosure title="Exchange period">
        {getExchangeDateStateText(exchangeDate)}
      </SideSectionDisclosure>
      <SideSectionDisclosure title="Current state">
        <div className="my-2 flex w-full items-center gap-2">
          <span className="w-1/2 text-center font-semibold text-black/50 sm:w-1/2">
            Your curricular units
          </span>
          <span className="w-1/2 text-center font-semibold text-black/50 sm:w-1/2">
            Shifts
          </span>
        </div>
        <div className="flex flex-col gap-2">
          {normalCourses.map((uc, index) => (
            <div key={index} className="flex w-full items-center gap-2">
              <div className="line-clamp-1 flex h-12 w-1/2 items-center justify-center rounded-2xl bg-black/5 px-3 text-sm sm:w-1/2">
                <span className="line-clamp-1">{uc.shortname}</span>
              </div>
              <div
                className={`flex h-12 w-1/2 flex-wrap items-center justify-center gap-1 rounded-full bg-black/5 sm:w-1/2`}
              >
                {uc.shifts.length > 1 && (
                  <div className="flex h-full justify-between gap-4">
                    <div className="flex w-4 flex-1 items-center justify-center">
                      {getShortShiftType(uc.shifts[0].type)}
                      {uc.shifts[0].number}
                    </div>
                    <div className="w-[2px] bg-black/10"></div>
                    <div className="flex w-4 flex-1 items-center justify-center">
                      {getShortShiftType(uc.shifts[1].type)}
                      {uc.shifts[1].number}
                    </div>
                  </div>
                )}

                {uc.shifts.length === 1 && (
                  <div className="">
                    {getShortShiftType(uc.shifts[0].type)}
                    {uc.shifts[0].number}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </SideSectionDisclosure>
    </div>
  );
}
