import { Metadata } from "next";
import EventsCalendar from "@/components/events-calendar";
import CalendarOptions from "@/components/calendarOptions/schedule-options";
import { EventsProvider } from "@/contexts/events-provider";

export const metadata: Metadata = {
  title: "Pombo | Calendar",
};

export default function Home() {
  return (
    <div className="flex h-full flex-col-reverse gap-5 md:flex-row md:gap-8">
      <EventsProvider>
        <CalendarOptions />

        <EventsCalendar />
      </EventsProvider>
    </div>
  );
}
