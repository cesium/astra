import { Metadata } from "next";
import ScheduleCalendar from "@/components/schedule-calendar";

import { ScheduleProvider } from "@/contexts/schedule-provider";
import CalendarOptions from "@/components/calendar-options";
import { AuthCheck } from "@/components/auth_check";

export const metadata: Metadata = {
  title: "Pombo | Schedule",
};

export default function Schedule() {
  return (
    <AuthCheck userTypes={["student"]}>
      <div className="flex h-full flex-col-reverse gap-5 md:flex-row md:gap-8">
        <ScheduleProvider>
          <CalendarOptions schedule />
          <ScheduleCalendar />
        </ScheduleProvider>
      </div>
    </AuthCheck>
  );
}
