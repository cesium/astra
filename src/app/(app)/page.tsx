import { Metadata } from "next";

import EventsCalendar from "@/components/events-calendar";

export const metadata: Metadata = {
  title: "Pombo | Calendar",
};

export default function Home() {
  return (
    <div className="flex h-full w-full gap-8">
      <div className="hidden w-83 bg-gray-400 md:block">
        <button className="cursor-pointer">Edit</button>
      </div>
      <EventsCalendar />
    </div>
  );
}
