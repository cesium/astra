"use client";

import {
  Calendar,
  momentLocalizer,
  View,
  Views,
  ViewsProps,
} from "react-big-calendar";

import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";

import { useMemo, useState, useEffect } from "react";

import CustomToolbar from "./toolbar";
import EventModal from "./eventModal";
import { da } from "zod/locales";

//TODO: Interface temporária para Eventos
export interface IEventProps {
  title: string;
  place: string;
  link: string;
  start: string | Date;
  end: string | Date;
  groupId: number;
  filterId: number;
}

interface ICalendarViewProps {
  type: "calendar" | "schedule";
  events: any;
  views: ViewsProps;
  editing: boolean
  className?: string;
}

const localizer = momentLocalizer(moment);

export default function CalendarView({
  type,
  events,
  views,
  editing,
  className,
}: ICalendarViewProps) {

  // adds transparency and darkness to the normal color
  const getEditingColor = (color: string, opacity: number, darken: number) => {
    let r = Math.floor(parseInt(color.slice(1, 3), 16) * darken);
    let g = Math.floor(parseInt(color.slice(3, 5), 16) * darken);
    let b = Math.floor(parseInt(color.slice(5, 7), 16) * darken);
    let a = opacity;
    let rgbaColor = `rgba(${r}, ${g}, ${b}, ${a})`;

    return rgbaColor;
  };

  const getEventColor = (event: IEventProps) => {
    // TODO: Implement logic to determine background color based on event properties
    // It's still not determined how colors will be assigned to events

    const eventColor = "#C3E5F9";

    const bgColor = editing ? getEditingColor(eventColor, 0.4, 1) : eventColor;
    const textColor = getEditingColor(eventColor, 1, 0.55);

    return {eventColor, bgColor, textColor};
  };

  const waitForElement = (selector: string, callback: () => void) => {
    const element = document.querySelector(selector);
    if (element) {
      callback();
      return;
    }

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

  const formats = useMemo(
    () => ({
      eventTimeRangeFormat: () => {
        return "";
      },

      timeGutterFormat: (date: any, culture: any, localizer?: any) =>
        localizer?.format(date, "HH\\h", culture)?.replace(/^0+/, "") || "",

      ...(type === "schedule" && {
        dayFormat: (date: any, _: any, localizer?: any) =>
          localizer?.format(date, "ddd"),
      }),
    }),
    [type],
  );

  const defaultView = type === "calendar" ? Views.MONTH : Views.WORK_WEEK;
  const [view, setView] = useState(defaultView);
  const [date, setDate] = useState(new Date());

  const handleNavigate = (newDate: Date) => {
    setDate(newDate);
  };

  const handleViewChange = (newView: any) => {
    setView(newView);
    updateTimeIndicator(newView);
  };

  useEffect(() => {
    waitForElement(".rbc-current-time-indicator", () => {
      updateTimeIndicator(view);
    });
  }, [view, date]);

  const [selectedEvent, setSelectedEvent] = useState<IEventProps>(events[0]);
  const [inspectEvent, setInspectEvent] = useState<boolean>(false);

  const handleSelection = (event: IEventProps) => {
    setSelectedEvent(event);
    setInspectEvent(!inspectEvent);
  };

  const minDate = new Date();
  minDate.setHours(8, 0, 0);

  const maxDate = new Date();
  maxDate.setHours(20, 0, 0);

  return (
    <div id="calendar-view" className="w-full">
      <Calendar
        components={{ toolbar: CustomToolbar }}
        toolbar={type === "calendar" ? true : false}
        localizer={localizer}
        formats={formats}
        events={events}
        selected={selectedEvent}
        onSelectEvent={(event) => handleSelection(event)}
        startAccessor="start"
        endAccessor="end"
        allDayAccessor="all_day"
        style={{ height: 754, width: "100%" }}
        view={view}
        views={views}
        onView={handleViewChange}
        date={date}
        onNavigate={handleNavigate}
        dayLayoutAlgorithm={"no-overlap"}
        min={minDate}
        max={maxDate}
        eventPropGetter={(event) => {
            const {eventColor, bgColor, textColor} = getEventColor(event);
            
            const newStyle = {
              backgroundColor: bgColor,
              color: textColor,
              boxShadow: editing ? `inset 0 0 0 2px ${eventColor}` : "none",
              "--gradient-color": bgColor,
            } as React.CSSProperties & { "--gradient-color": string };

            return { style: newStyle };
        }}
        className={className}
      />
      {selectedEvent && (
        <EventModal
          selectedEvent={selectedEvent}
          setInspectEvent={setInspectEvent}
          inspectEvent={inspectEvent}
        />
      )}
    </div>
  );
}
