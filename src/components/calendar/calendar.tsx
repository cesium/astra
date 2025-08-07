"use client";

import { Calendar, momentLocalizer, View, Views, ViewsProps } from "react-big-calendar";

import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";

import { useMemo, useState, useEffect } from "react";

import CustomToolbar from "./toolbar";
import EventModal from "./eventModal";

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
  className?: string;
}

const localizer = momentLocalizer(moment);

export default function CalendarView({ type, events, views, className }: ICalendarViewProps) {

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
      subtree: true
    });
  };

  const updateTimeIndicator = (view: View) => {
    const timeIndicator = document.querySelector('.rbc-current-time-indicator') as HTMLElement;

    if (timeIndicator) {
      const nDayOfWeek = new Date().getDay()
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

      timeIndicator.style.setProperty('--width', `${width}%`);
      timeIndicator.style.setProperty('--left', `${left}%`);
      
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

  const defaultView = type === "calendar" ? Views.MONTH : Views.WORK_WEEK
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
    waitForElement('.rbc-current-time-indicator', () => {
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
        toolbar={type==="calendar" ? true : false}
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
