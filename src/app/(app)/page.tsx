import { Metadata } from "next";
import EventsCalendar from "@/components/events-calendar";
import { EventsProvider } from "@/contexts/events-provider";
import EventsOptions from "@/components/calendarOptions/events-options";

export const metadata: Metadata = {
  title: "Pombo | Calendar",
};

export default function Home() {
  return (
    <div className="flex h-full flex-col-reverse gap-5 md:flex-row md:gap-8">
      <EventsProvider>
        <EventsOptions />
        <EventsCalendar />
      </EventsProvider>
    </div>
  );
}
