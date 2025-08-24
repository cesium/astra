import { Metadata } from "next";
import EventsCalendar from "@/components/events-calendar";
import CalendarOptions from "@/components/calendar-options";
import { CalendarProvider } from "@/contexts/calendar-provider";

export const metadata: Metadata = {
  title: "Pombo | Calendar",
};

export default function Home() {
  return (
    <div className="flex flex-col-reverse gap-5 md:flex-row md:gap-8">
      <CalendarProvider>
        <CalendarOptions />

        {/*FIXME: Implementar Context no EventsCalendar*/}
        <EventsCalendar />
      </CalendarProvider>
    </div>
  );
}
