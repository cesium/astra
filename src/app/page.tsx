"use client";

import CalendarView from "@/components/calendar/calendar";
import FeedView from "@/components/calendar/feed-view";
import { useMemo, useState } from "react";

//EVENTOS PARA DEBUG

const events = [
  {
    id: 0,
    title: "Reunião de Equipa",
    place: "Campus",
    link: "",
    start: new Date(2025, 7, 25, 10, 0),
    end: new Date(2025, 7, 25, 11, 0),
    groupId: 1,
    filterId: 1,
  },

  {
    id: 1,
    title: "Nome bué grande mano bro",
    start: new Date(2025, 7, 26, 14, 0),
    end: new Date(2025, 7, 26, 16, 0),
    place: "Campus",
    link: "",
    groupId: 1,
    filterId: 1,
  },

  {
    id: 2,
    title: "Evento Dia Inteiro",
    start: new Date(2025, 7, 14, 9, 0),
    end: new Date(2025, 7, 14, 17, 0),
    place: "Campus",
    link: "",
    groupId: 1,
    filterId: 1,
  },

  {
    id: 3,
    title: "Evento 2 dias",
    start: new Date(2025, 7, 5, 11, 0),
    end: new Date(2025, 7, 9, 13, 0),
    place: "Campus",
    link: "",
    groupId: 1,
    filterId: 1,
  },

  {
    id: 4,
    title: "Evento 2 dias",
    start: new Date(2025, 8, 5, 11, 0),
    end: new Date(2025, 8, 9, 13, 0),
    place: "Campus",
    link: "",
    groupId: 1,
    filterId: 1,
  },
];

export default function Home() {
  const [editing, setEditing] = useState(false);

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
    <div className="flex h-screen w-full gap-8 px-8 py-6">
      <div className="h-full w-83 bg-gray-400">
        <button onClick={() => setEditing(!editing)} className="cursor-pointer">
          Edit
        </button>
      </div>
      <CalendarView
        type="calendar"
        events={events}
        editing={editing}
        views={views}
      />
    </div>
  );
}
