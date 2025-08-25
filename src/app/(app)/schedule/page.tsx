import { Metadata } from "next";
import ScheduleCalendar from "@/components/schedule-calendar";
import { AuthCheck } from "@/components/auth_check";

export const metadata: Metadata = {
  title: "Pombo | Schedule",
};

export default function Schedule() {
  return (
    <AuthCheck userTypes={['student']}>
    <div className="flex gap-8">
      <div className="hidden w-23 bg-gray-400 md:block">
        <button className="cursor-pointer">Edit</button>
      </div>
      <ScheduleCalendar />
    </div>
    </AuthCheck>
  );
}
