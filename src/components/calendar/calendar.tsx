"use client";

import { IShift, IEvent } from "@/lib/types";

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
  calendarEvents?: IEvent[];
  shifts?: IShift[];
  views: ViewsProps;
  editing: boolean;
  defaultView?: string;
  className?: string;
}

const localizer = momentLocalizer(moment);

export default function CalendarView({
  type,
  calendarEvents,
  shifts,
  views,
  editing,
  defaultView: propDefaultView,
  className,
}: ICalendarViewProps) {
  // adds transparency and darkness to the normal color
  const getEditingColor = (color: string, opacity: number, darken: number) => {
    const r = Math.floor(parseInt(color.slice(1, 3), 16) * darken);
    const g = Math.floor(parseInt(color.slice(3, 5), 16) * darken);
    const b = Math.floor(parseInt(color.slice(5, 7), 16) * darken);
    const a = opacity;
    const rgbaColor = `rgba(${r}, ${g}, ${b}, ${a})`;

    return rgbaColor;
  };

  const formatedEvents = shifts
    ? shifts.map((shift) => {
        const [startHour, startMinute] = shift.start.split(":");
        const [endHour, endMinute] = shift.end.split(":");

        return {
          title: `${shift.shortCourseName} - ${shift.shiftType}${shift.shiftNumber}`,
          start: moment()
            .day(shift.day + 1)
            .hour(+startHour)
            .minute(+startMinute)
            .toDate(),
          /* (*) we're subtracting 1 minute here to solve an issue that occurs when
           * the end time of an event is equal to the start time of another.
           * this issue causes the event bellow to think it is overlaping with the top one,
           * when the `dayLayoutAlgorithm` is set to `no-overlap`.
           */
          end: moment()
            .day(shift.day + 1)
            .hour(+endHour)
            .minute(+endMinute - 1) // (*)
            .toDate(),
          allDay: false,
          resource: shift,
        };
      })
    : calendarEvents
      ? calendarEvents.map((event) => ({
          title: event.title,
          start: moment(event.start).toDate(),
          end: moment(event.end).toDate(),
          allDay: event.allDay,
          resource: event,
        }))
      : [];

  const getEventColor = (event: Event) => {
    const eventColor = event.resource?.eventColor;
    const textColor = event.resource?.textColor;

    const bgColor = editing ? getEditingColor(eventColor, 0.4, 1) : eventColor;

    return { eventColor, bgColor, textColor };
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

      timeGutterFormat: (
        date: Date,
        culture: string | undefined,
        localizer?: DateLocalizer,
      ) => localizer?.format(date, "HH\\h", culture)?.replace(/^0+/, "") || "",

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

  const handleNavigate = (newDate: Date) => {
    setDate(newDate);
  };

  const handleViewChange = (newView: View) => {
    setView(newView);
    updateTimeIndicator(newView);
  };

  useEffect(() => {
    waitForElement(".rbc-current-time-indicator", () => {
      updateTimeIndicator(view);
    });
  }, [view, date]);

  const [selectedEvent, setSelectedEvent] = useState<Event | undefined>(
    undefined,
  );
  const [inspectEvent, setInspectEvent] = useState<boolean>(false);

  useEffect(() => {
    if (formatedEvents.length > 0) {
      setSelectedEvent((event) => event ?? formatedEvents[0]);
    }
  }, [formatedEvents]);

  const handleSelection = (event: Event) => {
    setSelectedEvent(event);
    setInspectEvent(!inspectEvent);

    console.log("Selected event:", event);
  };

  // Fix para o erro de Client-side hydration
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
        events={formatedEvents}
        selected={selectedEvent}
        onSelectEvent={(event) => handleSelection(event)}
        startAccessor="start"
        endAccessor="end"
        allDayAccessor="allDay"
        style={{ height: "calc(100vh - 124px)", width: "100%" }}
        view={view}
        views={views}
        onView={handleViewChange}
        date={date}
        onNavigate={handleNavigate}
        dayLayoutAlgorithm={"no-overlap"}
        min={minDate}
        max={maxDate}
        key={date.getTime()}
        eventPropGetter={(event) => {
          const { eventColor, bgColor, textColor } = getEventColor(event);

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
          type={type}
        />
      )}
    </div>
  );
}
