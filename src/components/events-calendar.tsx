"use client";

import { useEffect, useMemo, useState } from "react";
import CalendarView from "./calendar/calendar";
import FeedView from "./calendar/feed-view";
import { IEvent } from "@/lib/types";
import moment from "moment";

//Fix remove debug values
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
    start: "2025-08-05T14:00:00",
    end: "2025-08-05T16:00:00",
    place: "Campus",
    link: { label: "Link do insta", href: "https://instagram.com" },
    eventColor: "#C3E5F9",
    textColor: "#227AAE",
    allDay: false,
  },
  {
    id: 14,
    title: "Evento Random",
    start: "2025-08-06T08:00:00",
    end: "2025-08-08T09:00:00",
    place: "Campus",
    eventColor: "#C3E5F9",
    textColor: "#227AAE",
    allDay: true,
  },
  {
    id: 2,
    title: "Evento Dia Inteiro",
    start: "2025-08-06T08:00:00",
    end: "2025-08-07T09:00:00",
    place: "Campus",
    eventColor: "#C3E5F9",
    textColor: "#227AAE",
    allDay: true,
  },
  {
    id: 3,
    title: "Evento vários dias",
    start: "2025-08-05T11:00:00",
    end: "2025-08-07T13:00:00",
    place: "Campus",
    eventColor: "#C3E5F9",
    textColor: "#227AAE",
    allDay: true,
  },
];

export default function EventsCalendar() {
  const [events, setEvents] = useState<IEvent[]>([]);

  //Fix remove debug values
  useEffect(() => {
    setEvents(eventsDebug);
  }, []);

  // Converts an IEvent to an Event
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
