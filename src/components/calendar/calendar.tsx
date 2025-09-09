"use client";

import {
  Calendar,
  DateLocalizer,
  Event,
  momentLocalizer,
  View,
  Views,
  ViewsProps,
} from "react-big-calendar";

import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";

import { useMemo, useState, useEffect } from "react";

import CustomToolbar from "./toolbar";
import EventModal from "./event-modal";
import EventCard from "./event-card";

interface ICalendarViewProps {
  type: "calendar" | "schedule";
  events: Event[];
  views: ViewsProps;
  editing: boolean;
  defaultView?: string;
  className?: string;
}

const localizer = momentLocalizer(moment);

export default function CalendarView({
  type,
  events,
  views,
  editing,
  defaultView: propDefaultView,
  className,
}: ICalendarViewProps) {
  // adds transparency and darkness to the normal color by converting hex to rgba
  const getEditingColor = (color: string, opacity: number, darken: number) => {
    const r = Math.floor(parseInt(color.slice(1, 3), 16) * darken);
    const g = Math.floor(parseInt(color.slice(3, 5), 16) * darken);
    const b = Math.floor(parseInt(color.slice(5, 7), 16) * darken);
    const a = opacity;
    const rgbaColor = `rgba(${r}, ${g}, ${b}, ${a})`;

    return rgbaColor;
  };

  const getEventColor = (event: Event) => {
    const eventColor = event.resource?.eventColor;
    const textColor = event.resource?.textColor;

    const bgColor = editing ? getEditingColor(eventColor, 0.4, 1) : eventColor;

    return { eventColor, bgColor, textColor };
  };

  // Waits for the current time indicator element to load in the DOM
  // Prevents rendering issues caused by code running before the DOM is fully loaded
  const waitForElement = (selector: string, callback: () => void) => {
    // Check if the element is already in the DOM
    const element = document.querySelector(selector);
    if (element) {
      callback();
      return;
    }

    // If the element is not found, observe the DOM for changes
    const observer = new MutationObserver((mutations, obs) => {
      const element = document.querySelector(selector);
      if (element) {
        obs.disconnect();
        callback();
      }
    });

    observer.observe(document, {
      childList: true,
      subtree: true,
    });
  };

  // Updates the position and size of the current time indicator
  // This extends the time indicator width to the entire width of the view port
  const updateTimeIndicator = (view: View) => {
    const timeIndicator = document.querySelector(
      ".rbc-current-time-indicator",
    ) as HTMLElement;

    if (timeIndicator) {
      const nDayOfWeek = new Date().getDay();
      let left;
      let width;

      if (view === Views.DAY) {
        left = 0;
        width = 100;
      } else if (view === Views.WEEK) {
        left = nDayOfWeek * -100;
        width = 700;
      } else if (view === Views.WORK_WEEK) {
        if (nDayOfWeek === 0 || nDayOfWeek === 6) {
          left = 0;
          width = 0;
        } else {
          const workDayIndex = nDayOfWeek - 1;
          left = workDayIndex * -100;
          width = 500;
        }
      } else {
        left = 0;
        width = 100;
      }

      timeIndicator.style.setProperty("--width", `${width}%`);
      timeIndicator.style.setProperty("--left", `${left}%`);

      timeIndicator.style.left = `${left}%`;
      timeIndicator.style.width = `${width}%`;
    }
  };

  // Date formatting options
  const formats = useMemo(
    () => ({
      // Removes event time range
      eventTimeRangeFormat: () => {
        return "";
      },

      // Changes the format of the time gutter
      timeGutterFormat: (
        date: Date,
        culture: string | undefined,
        localizer?: DateLocalizer,
      ) => localizer?.format(date, "HH\\h", culture)?.replace(/^0+/, "") || "",

      // Displays only the day of the week for schedule view
      ...(type === "schedule" && {
        dayFormat: (
          date: Date,
          _: string | undefined,
          localizer?: DateLocalizer,
        ) => localizer?.format(date, "ddd") || "",
      }),
    }),
    [type],
  );

  // Determines the initial view based on the calendar type
  const getInitialView = (): View => {
    if (propDefaultView) {
      // For custom view feed
      return propDefaultView as View;
    }
    return type === "calendar" ? Views.MONTH : Views.WORK_WEEK;
  };

  const [view, setView] = useState<View>(getInitialView());
  const [date, setDate] = useState(new Date());

  useEffect(() => {
    setDate(new Date());
  }, []);

  // Handles navigation between dates (ex: changing month)
  const handleNavigate = (newDate: Date) => {
    setDate(newDate);
  };

  // Handles view changes (ex: switching between month/week)
  const handleViewChange = (newView: View) => {
    setView(newView);
    updateTimeIndicator(newView);
  };

  // Waits for the current time indicator element to load in the DOM and applies the necessary styles
  useEffect(() => {
    waitForElement(".rbc-current-time-indicator", () => {
      updateTimeIndicator(view);
    });
  }, [view, date]);

  const [selectedEvent, setSelectedEvent] = useState<Event | undefined>(
    undefined,
  );
  const [inspectEvent, setInspectEvent] = useState<boolean>(false);

  // Handles event selection
  const handleSelection = (event: Event) => {
    setSelectedEvent(event);
    setInspectEvent(!inspectEvent);
  };

  // Sets the min and max date for the calendar view port
  // useMemo fixes client-side hydration issues
  const { minDate, maxDate } = useMemo(() => {
    const min = new Date();
    min.setHours(8, 0, 0);

    const max = new Date();
    max.setHours(20, 0, 0);

    return { minDate: min, maxDate: max };
  }, []);

  return (
    <div id="calendar-view" className="w-full">
      <Calendar
        components={{ toolbar: CustomToolbar, work_week: { event: EventCard } }}
        toolbar={type === "calendar" ? true : false}
        localizer={localizer}
        formats={formats}
        events={events}
        selected={selectedEvent}
        onSelectEvent={(event) => handleSelection(event)}
        startAccessor="start"
        endAccessor="end"
        allDayAccessor="allDay"
        view={view}
        views={views}
        onView={handleViewChange}
        date={date}
        onNavigate={handleNavigate}
        dayLayoutAlgorithm={"no-overlap"}
        min={minDate}
        max={maxDate}
        key={date.getTime()}
        tooltipAccessor={() => ""}
        eventPropGetter={(event) => {
          const { eventColor, bgColor, textColor } = getEventColor(event);

          // Applies custom event colors and editing mode styles
          const newStyle = {
            backgroundColor: bgColor,
            color: textColor,
            boxShadow: editing ? `inset 0 0 0 2px ${eventColor}` : "",
            "--gradient-color": bgColor,
          } as React.CSSProperties & { "--gradient-color": string };

          return { style: newStyle };
        }}
        className={className}
      />
      {/* Opens the event modal for the selected event */}
      {selectedEvent && (
        <EventModal
          selectedEvent={selectedEvent}
          setInspectEvent={setInspectEvent}
          inspectEvent={inspectEvent}
          type={type}
        />
      )}
    </div>
  );
}
