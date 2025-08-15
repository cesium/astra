"use client";

import CalendarView from "@/components/calendar/calendar";
import { useMemo, useState } from "react";
import FeedView from "@/components/calendar/feed-view";
import { IEvent } from "@/lib/types";

const events: IEvent[] = [
  {
    id: 0,
    title: "Reunião de Equipa",
    start: "2025-08-25T10:00:00",
    end: "2025-08-25T11:00:00",
    place: "Campus",
    link: "",
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
    link: "",
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
    link: "",
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
    link: "",
    eventColor: "#C3E5F9",
    textColor: "#227AAE",
    allDay: false,
  },
];

export default function Feed() {
  const [editing, setEditing] = useState(false);
  console.log("Editing mode:", editing);

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
    <div className="flex h-screen w-full gap-8 p-8">
      <div className="h-full w-94.5 bg-gray-400">
        <button className="cursor-pointer" onClick={() => setEditing(!editing)}>
          Edit
        </button>
      </div>
      <CalendarView
        type="calendar"
        calendarEvents={events}
        views={views}
        defaultView="feed"
        editing={editing}
      />
    </div>
  );
}
