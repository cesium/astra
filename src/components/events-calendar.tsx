"use client";

import { useContext, useMemo } from "react";
import CalendarView from "./calendar/calendar";
import FeedView from "./calendar/feed-view";
import moment from "moment";
import { EventsContext } from "@/contexts/events-provider";
import { Event } from "react-big-calendar";

export default function EventsCalendar() {
  const context = useContext(EventsContext);

  const { isEditing, activeEvents } = context;

  // Converts an IEvent to an Event
  const formattedEvents = activeEvents.map((event): Event => {
    return {
      title: event.title,
      start: moment(event.start).toDate(), //fix: make sure there are no overlapping bugs
      end: moment(event.end).toDate(),
      allDay: event.allDay,
      resource: event,
    };
  });

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
        editing={isEditing}
        views={views}
      />
    </div>
  );
}
