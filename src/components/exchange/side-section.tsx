"use client";

import { Fragment } from "react";
import SideSectionDisclosure from "./side-section-disclosure";
import { useGetStudentOriginalSchedule } from "@/lib/queries/courses";
import { useGetExchangeDate } from "@/lib/queries/exchange";

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

export default function SideSection() {
  const { data: originalCourses } = useGetStudentOriginalSchedule();
  const { data: exchangeDate } = useGetExchangeDate();
  const parsed = parseDate(exchangeDate?.data.end ?? new Date().toISOString());

  return (
    <div className="flex flex-col gap-2 lg:w-[412px]">
      <SideSectionDisclosure title="Deadline for exchanges">
        You can exchange your shifts until {parsed.month}/{parsed.day}/
        {parsed.year}, {parsed.hour}:{parsed.minute}.
      </SideSectionDisclosure>
      <SideSectionDisclosure title="Current state">
        <div className="my-2 flex w-full items-center gap-2">
          <span className="w-1/2 text-center font-semibold text-black/50 sm:w-2/3">
            Your curricular units
          </span>
          <span className="w-1/2 text-center font-semibold text-black/50 sm:w-1/3">
            Shifts
          </span>
        </div>
        <div className="flex flex-col gap-2">
          {originalCourses?.map((uc, index) => (
            <div key={index} className="flex w-full items-center gap-2">
              <div className="line-clamp-1 flex h-12 w-1/2 items-center rounded-2xl bg-black/5 px-3 text-sm sm:w-2/3">
                <span className="line-clamp-1">{uc.name}</span>
              </div>
              <div
                className={`flex h-12 w-1/2 flex-wrap items-center justify-center gap-1 rounded-full bg-black/5 sm:w-1/3`}
              >
                {uc.shifts.map((shift, index) => (
                  <Fragment key={index}>
                    <span className="rounded-full px-2 py-1 text-xs font-medium">
                      {`${getShortShiftType(shift.type)}${shift.number}`}
                    </span>
                    {index < uc.shifts.length - 1 && (
                      <div className="h-full w-[2px] bg-black/5"></div>
                    )}
                  </Fragment>
                ))}
              </div>
            </div>
          ))}
        </div>
      </SideSectionDisclosure>
    </div>
  );
}
