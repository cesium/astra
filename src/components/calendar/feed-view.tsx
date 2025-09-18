"use client";

import { useState, useRef, useEffect } from "react";
import { Navigate, NavigateAction, ViewProps } from "react-big-calendar";

interface IEventCardProps {
  start: Date;
  title: string;
  eventColor: { bgColor: string; textColor: string };
  onClick: () => void;
}

function EventCard({ start, title, eventColor, onClick }: IEventCardProps) {
  return (
    <div
      onClick={onClick}
      className="flex cursor-pointer items-center gap-3.5 rounded-2xl border border-gray-200 p-2.5 py-2 transition-all duration-300 ease-in-out"
    >
      <p className="min-w-10.5 text-sm text-gray-500">{start.toString()}</p>
      <div
        style={{ backgroundColor: eventColor.bgColor }}
        className="flex h-10 flex-1 items-center justify-start overflow-hidden rounded-md p-2.5"
      >
        <p
          style={{ color: eventColor.textColor }}
          className="truncate font-semibold"
        >
          {title}
        </p>
      </div>
    </div>
  );
}

export default function FeedView({
  events,
  localizer,
  date,
  onSelectEvent,
}: ViewProps) {
  const [groupedEvents, setGroupedEvents] = useState<
    Record<string, typeof events>
  >({});
  const [filteredLength, setFilteredLength] = useState(0);
  const [hasEvents, setHasEvents] = useState(false);

  useEffect(() => {
    // filter events based on the selected date
    const filterEvents = () => {
      if (!date) return events ?? [];

      const currentDate = new Date(date);

      return (events ?? []).filter((event) => {
        if (!event.start) return false;
        const eventDate = new Date(event.start);
        return (
          eventDate.getFullYear() === currentDate.getFullYear() &&
          eventDate.getMonth() === currentDate.getMonth()
        );
      });
    };

    const filtered = filterEvents();

    // join events by day
    const groupedEvents = filtered.reduce(
      (group: Record<string, typeof events>, event) => {
        const day = localizer.format(event.start, "d MMMM");
        if (!group[day]) group[day] = [];
        group[day].push(event);
        return group;
      },
      {},
    );

    const hasEvents =
      events && events.length > 0 && Object.keys(groupedEvents).length > 0
        ? true
        : false;

    setGroupedEvents(groupedEvents);
    setFilteredLength(filtered.length);
    setHasEvents(hasEvents);
  }, [events, date, localizer]);

  const [isScrolledTop, setIsScrolledTop] = useState(true);
  const [isScrolledBottom, setIsScrolledBottom] = useState(false);
  const scrollableRef = useRef<HTMLDivElement>(null);

  // Handle scroll events to determine if the user is at the top or bottom
  const handleScroll = () => {
    if (scrollableRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = scrollableRef.current;

      const isTop = scrollableRef.current.scrollTop === 0;
      setIsScrolledTop(isTop);
      const isBottom = scrollTop + clientHeight >= scrollHeight;
      setIsScrolledBottom(isBottom);
    }
  };

  return (
    <div className="relative flex h-full min-h-0 flex-col">
      {!isScrolledTop && (
        <div className="pointer-events-none absolute top-0 right-0 left-0 z-10 h-12 bg-gradient-to-b from-white to-transparent" />
      )}

      <div
        className="no-scrollbar flex h-full flex-col overflow-y-scroll px-2"
        onScroll={handleScroll}
        ref={scrollableRef}
      >
        {hasEvents ? (
          <div className="space-y-10">
            <div className="flex flex-col gap-5">
              {Object.entries(groupedEvents).map(([day, events]) => (
                <div className="space-y-2.5" key={day}>
                  <h3 className="font-semibold">{day}</h3>
                  <ul className="space-y-2">
                    {events!.map((event, index) => (
                      <EventCard
                        key={index}
                        start={localizer.format(event.start, "HH:mm")}
                        title={event.title?.toString() ?? ""}
                        eventColor={{
                          bgColor: event.resource?.eventColor,
                          textColor: event.resource?.textColor,
                        }}
                        onClick={() => onSelectEvent(event)}
                      />
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            {filteredLength < 6 && (
              <div className="flex flex-col text-center">
                <p className="text-dark/60">
                  For now, there are no more events...
                </p>
              </div>
            )}
          </div>
        ) : (
          <div className="flex h-full flex-col justify-center text-center">
            <p className="text-dark/60">For now, there are no events...</p>
          </div>
        )}
      </div>

      {!isScrolledBottom && (
        <div className="pointer-events-none absolute right-0 bottom-0 left-0 z-10 h-12 bg-gradient-to-t from-white to-transparent" />
      )}
    </div>
  );
}

// Sets the title for the FeedView (month and year on the toolbar)
FeedView.title = (date: Date, { localizer }: ViewProps) => {
  return localizer.format(date, "monthHeaderFormat");
};

// Defines the navigation behavior for the FeedView
FeedView.navigate = (
  date: Date,
  action: NavigateAction,
  { localizer }: ViewProps,
) => {
  switch (action) {
    case Navigate.PREVIOUS:
      return localizer.add(date, -1, "month");

    case Navigate.NEXT:
      return localizer.add(date, 1, "month");

    default:
      return date;
  }
};
