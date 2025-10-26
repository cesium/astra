"use client";

import { useContext, useMemo } from "react";
import CalendarView from "./calendar/calendar";
import FeedView from "./calendar/feed-view";
import { EventsContext } from "@/contexts/events-provider";
import { Event } from "react-big-calendar";
import { IEvent } from "@/lib/types";

export default function EventsCalendar() {
  const context = useContext(EventsContext);

  const { isEditing, activeEvents } = context;

  // Converts an IEvent to an Event
  const formattedEvents = activeEvents.map((event: IEvent): Event => {
    return {
      title: event.category.course
        ? `[${event.category.course?.shortname}] ${event.title}`
        : event.title,
      start: event.start.toDate(),
      end: event.end.toDate(),
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
