import ScheduleCalendar from "@/components/schedule-calendar";
import { ScheduleProvider } from "@/contexts/schedule-provider";
import { AuthCheck } from "@/components/auth-check";
import ScheduleOptions from "@/components/calendarOptions/schedule-options";

export default function Schedule() {
  return (
    <AuthCheck userTypes={["student"]}>
      <div className="flex h-full flex-col-reverse gap-5 md:flex-row md:gap-8">
        <ScheduleProvider>
          <ScheduleOptions />
          <ScheduleCalendar />
        </ScheduleProvider>
      </div>
    </AuthCheck>
  );
}
