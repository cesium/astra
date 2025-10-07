"use client";

import { useGetEvents } from "@/lib/queries/events";
import { IEventResponse } from "@/lib/types";
import moment from "moment";
import { createContext, useState } from "react";

interface IEventsProvider {
  hasChanges: boolean;
  isEditing: boolean;
  setIsEditing: (curr: boolean) => void;
}

function formatEvents(events: IEventResponse[]) {
  return events.map((event) => {
    const start = moment(event.start);
    const end = moment(event.end);

    const allday = moment.duration(end.diff(start)).asHours() > 24;

    return {
      id: event.id,
      title: event.title,
      category: event.category,
      start: event.start,
      end: event.end,
      place: event.place,
      link: event.link,
      eventColor: "",
      textColor: "",
      allDay: allday,
    };
  });
}

export const EventsContext = createContext<IEventsProvider>({
  hasChanges: false,
  isEditing: false,
  setIsEditing: () => {},
});

export function EventsProvider({ children }: { children: React.ReactNode }) {
  const [hasChanges, setHasChanges] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);

  const { data: allEvents } = useGetEvents();
  console.log(allEvents);

  return (
    <EventsContext.Provider value={{ hasChanges, isEditing, setIsEditing }}>
      {children}
    </EventsContext.Provider>
  );
}
