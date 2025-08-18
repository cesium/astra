import { Metadata } from "next";

import CalendarView from "@/components/calendar/calendar";
import FeedView from "@/components/calendar/feed-view";
import { useMemo } from "react";
import { IEvent } from "@/lib/types";

const events: IEvent[] = [
  {
    id: 0,
    title: "Reunião de Equipa",
    start: "2025-08-25T10:00:00",
    end: "2025-08-25T11:00:00",
    place: "Campus",
    eventColor: "#C3E5F9",
    textColor: "#227AAE",
    allDay: false,
  },
  {
    id: 1,
    title: "Nome bué grande mano bro",
    start: "2025-08-26T14:00:00",
    end: "2025-08-26T16:00:00",
    place: "Campus",
    link: { label: "Link do insta", href: "https://instagram.com" },
    eventColor: "#C3E5F9",
    textColor: "#227AAE",
    allDay: false,
  },
  {
    id: 2,
    title: "Evento Dia Inteiro",
    start: "2025-08-14T09:00:00",
    end: "2025-08-14T17:00:00",
    place: "Campus",
    eventColor: "#C3E5F9",
    textColor: "#227AAE",
    allDay: false,
  },
  {
    id: 3,
    title: "Evento 2 dias",
    start: "2025-08-05T11:00:00",
    end: "2025-08-09T13:00:00",
    place: "Campus",
    eventColor: "#C3E5F9",
    textColor: "#227AAE",
    allDay: false,
  },
];

export const metadata: Metadata = {
  title: "Pombo | Calendar",
};

export default function Home() {
  const views = useMemo(
    () => ({
      month: true,
      week: true,
      day: true,
      feed: FeedView,
    }),
    [],
  );

  return (
    <div className="flex h-full w-full gap-8">
      <div className="hidden w-83 bg-gray-400 md:block">
        <button className="cursor-pointer">Edit</button>
      </div>
      <div className="max-h-[754px] w-full">
        <CalendarView
          type="calendar"
          calendarEvents={events}
          editing={false}
          views={views}
        />
      </div>
    </div>
  );
}
