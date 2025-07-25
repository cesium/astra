"use client";

import {
  Calendar,
  momentLocalizer,
  Views,
  ToolbarProps,
} from "react-big-calendar";
import moment, { Moment } from "moment";
import { motion } from "motion/react";
import { useState } from "react";
import "react-big-calendar/lib/css/react-big-calendar.css";

interface ITabProps {
  name: string;
  icon: string;
  href: string;
}

const localizer = momentLocalizer(moment);

function CustomToolbar(toolbar: ToolbarProps<any, object>) {
  const goToBack = () => toolbar.onNavigate("PREV");
  const goToNext = () => toolbar.onNavigate("NEXT");
  const goToToday = () => toolbar.onNavigate("TODAY");

  const label = toolbar.label;
  const currentView = toolbar.view; // Usar o view do toolbar

  return (
    <div className="mb-4.5 flex items-center justify-between">
      <button className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-primary bg-primary/20 hover:ring-1 hover:ring-primary/40 hover:shadow-md shadow-primary/15 transition-all duration-200 ease-in-out cursor-pointer" onClick={goToToday}>
				Today
			</button>

      <div className="flex items-center justify-between gap-4">
        <button className="material-symbols-outlined text-dark/30 cursor-pointer hover:text-dark/50 transition-all ease-in-out duration-200 hover:-translate-x-0.5" onClick={goToBack}>arrow_back</button>
        <span className="font-semibold">{label}</span>
        <button className="material-symbols-outlined text-dark/30 cursor-pointer hover:text-dark/50 transition-all ease-in-out duration-200 hover:translate-x-0.5" onClick={goToNext}>arrow_forward</button>
      </div>

      <div className="flex h-8.5 items-center gap-0.5 rounded-full bg-gray-100">
        {["month", "week", "day"].map((viewName) => (
          <button
            key={viewName}
            onClick={() => toolbar.onView(viewName as any)}
            className={`relative inline-flex items-center gap-2 rounded-full px-4 py-1.5 transition-colors duration-200 ease-in-out ${
              currentView === viewName
                ? "text-white"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
						        {currentView === viewName && (
          <motion.div
            layoutId="activeTab"
            transition={{
              type: "spring",
              bounce: 0.2,
              duration: 0.6,
            }}
            className="bg-dark absolute inset-0 rounded-full shadow-sm"
          />
        )}
					<p className="relative z-10">{viewName.charAt(0).toUpperCase() + viewName.slice(1)}</p>
          </button>
        ))}
      </div>
    </div>
  );
}

export default function CalendarView() {
  const [view, setView] = useState(Views.MONTH);
  const [date, setDate] = useState(new Date());

  const handleNavigate = (newDate: Date) => {
    setDate(newDate);
  };
  const handleViewChange = (newView: any) => {
    setView(newView);
  };

  const events = [
  {
    id: 0,
    title: "Reunião de Equipa",
    start: new Date(2025, 6, 25, 10, 0), // 25 July 2025, 10:00
    end: new Date(2025, 6, 25, 11, 0),   // 25 July 2025, 11:00
  },
  {
    id: 1,
    title: "Trabalho Focado",
    start: new Date(2025, 6, 26, 14, 0),
    end: new Date(2025, 6, 26, 16, 0),
  },
  {
    id: 2,
    title: "Evento Dia Inteiro",
    allDay: true,
    start: new Date(2025, 6, 27),
    end: new Date(2025, 6, 27),
  },
  {
    id: 3,
    title: "Evento 2 dias",
    start: new Date(2025, 6, 16),
    end: new Date(2025, 6, 18),
  }
];

  return (
    <div id="calendar-view">
      <Calendar
        components={{ toolbar: CustomToolbar }}
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        allDayAccessor="all_day"
        style={{ height: 754, width: '100%' }}
        view={view}
        views={["month", "week", "day"]}
        onView={handleViewChange}
        date={date}
        onNavigate={handleNavigate}
      />
    </div>
  );
}
