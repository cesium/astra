import { Metadata } from "next";
import ScheduleCalendar from "@/components/schedule-calendar";

import { CalendarProvider } from "@/contexts/calendar-provider";
import CalendarOptions from "@/components/calendar-options";

export const metadata: Metadata = {
  title: "Pombo | Schedule",
};

export default function Schedule() {
  return (
    <div className="flex flex-col-reverse gap-5 md:flex-row md:gap-8">
      <CalendarProvider>
        <CalendarOptions schedule />
        <ScheduleCalendar />
      </CalendarProvider>
    </div>
  );
}
