import { Metadata } from "next";
import ScheduleCalendar from "@/components/schedule-calendar";

export const metadata: Metadata = {
  title: "Pombo | Schedule",
};

export default function Schedule() {
  return (
    <div className="flex h-full w-full gap-8">
      <div className="hidden w-23 bg-gray-400 md:block">
        <button className="cursor-pointer">Edit</button>
      </div>
      <ScheduleCalendar />
    </div>
  );
}
