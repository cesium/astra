import { Metadata } from "next";
import ScheduleCalendar from "@/components/schedule-calendar";

import { ScheduleProvider } from "@/contexts/schedule-provider";
import CalendarOptions from "@/components/calendarOptions/schedule-options";

export const metadata: Metadata = {
  title: "Pombo | Schedule",
};

export default function Schedule() {
  return (
    <div className="flex h-full flex-col-reverse gap-5 md:flex-row md:gap-8">
      <ScheduleProvider>
        <CalendarOptions schedule />
        <ScheduleCalendar />
      </ScheduleProvider>
    </div>
  );
}
