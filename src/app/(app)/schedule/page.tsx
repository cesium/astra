import { Metadata } from "next";
import ScheduleCalendar from "@/components/schedule-calendar";

import { CalendarProvider } from "@/contexts/calendar-provider";
import CalendarOptions from "@/components/calendar-options";

export const metadata: Metadata = {
  title: "Pombo | Schedule",
};

export default function Schedule() {
  return (
    <div className="flex gap-8">
      <CalendarProvider>
        <CalendarOptions />
        <ScheduleCalendar />
      </CalendarProvider>
    </div>
  );
}
