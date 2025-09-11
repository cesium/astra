"use client";

import { useEffect, useMemo, useState } from "react";
import CalendarView from "./calendar/calendar";
import FeedView from "./calendar/feed-view";
import { IEvent } from "@/lib/types";
import moment from "moment";

export default function EventsCalendar() {
  const [events, setEvents] = useState<IEvent[]>([]);

  useEffect(() => {
    setEvents([]);
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
