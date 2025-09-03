import { Metadata } from "next";
import EventsCalendar from "@/components/events-calendar";
import CalendarOptions from "@/components/calendar-options";

export const metadata: Metadata = {
  title: "Pombo | Calendar",
};

export default function Home() {
  return (
    <div className="flex h-full flex-col-reverse gap-5 md:flex-row md:gap-8">
      <CalendarOptions />

      <EventsCalendar />
    </div>
  );
}
