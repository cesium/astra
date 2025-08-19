"use client";

import { useEffect, useMemo, useState } from "react";
import CalendarView from "./calendar/calendar";
import FeedView from "./calendar/feed-view";
import { IEvent } from "@/lib/types";
import moment from "moment";

// FIx remove:
const eventsDebug: IEvent[] = [
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

export default function EventsCalendar() {
  const [events, setEvents] = useState<IEvent[]>([]);

  useEffect(() => {
    setEvents(eventsDebug);
  }, []);

  const formattedEvents = events.map((event) => ({
    title: event.title,
    start: moment(event.start).toDate(),
    end: moment(event.end).toDate(),
    allDay: event.allDay,
    resource: event,
  }));

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
    <div className="w-full">
      <CalendarView
        type="calendar"
        events={formattedEvents}
        editing={false}
        views={views}
      />
    </div>
  );
}
