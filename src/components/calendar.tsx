"use client";

import {
  Calendar,
  momentLocalizer,
  Views,
  ToolbarProps,
} from "react-big-calendar";

import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";

import {
  Dialog,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";
import { motion } from "motion/react";
import { useState } from "react";

//FIX: Interface temporária para Eventos
interface IEventProps {
  title: string;
  place: string;
  link: string;
  start: string | Date;
  end: string | Date;
  groupId: number;
  filterId: number;
}

interface IEventModalProps {
  selectedEvent: IEventProps;
  setInspectEvent: (arg: boolean) => void;
  inspectEvent: boolean;
}

const localizer = momentLocalizer(moment);

function CustomToolbar(toolbar: ToolbarProps<any, object>) {
  const goToBack = () => toolbar.onNavigate("PREV");
  const goToNext = () => toolbar.onNavigate("NEXT");
  const goToToday = () => toolbar.onNavigate("TODAY");

  const label = toolbar.label;
  const currentView = toolbar.view;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-center gap-4 lg:hidden">
        <button
          className="material-symbols-outlined text-dark/30 hover:text-dark/50 cursor-pointer transition-all duration-200 ease-in-out hover:-translate-x-0.5"
          onClick={goToBack}
        >
          arrow_back
        </button>
        <span className="font-semibold">{label}</span>
        <button
          className="material-symbols-outlined text-dark/30 hover:text-dark/50 cursor-pointer transition-all duration-200 ease-in-out hover:translate-x-0.5"
          onClick={goToNext}
        >
          arrow_forward
        </button>
      </div>

      <div className="mb-4.5 flex items-center justify-center gap-4 lg:justify-between">
        <button
          className="text-primary bg-primary/20 hover:ring-primary/40 shadow-primary/15 inline-flex cursor-pointer items-center gap-2 rounded-full px-4 py-1.5 transition-all duration-200 ease-in-out hover:shadow-md hover:ring-1 lg:mr-38.5"
          onClick={goToToday}
        >
          Today
        </button>

        <div className="hidden items-center justify-between gap-4 lg:flex">
          <button
            className="material-symbols-outlined text-dark/30 hover:text-dark/50 cursor-pointer transition-all duration-200 ease-in-out hover:-translate-x-0.5"
            onClick={goToBack}
          >
            arrow_back
          </button>
          <span className="font-semibold">{label}</span>
          <button
            className="material-symbols-outlined text-dark/30 hover:text-dark/50 cursor-pointer transition-all duration-200 ease-in-out hover:translate-x-0.5"
            onClick={goToNext}
          >
            arrow_forward
          </button>
        </div>

        <div className="flex h-8.5 items-center gap-0.5 rounded-full bg-gray-100">
          {["month", "week", "day"].map((viewName) => (
            <button
              key={viewName}
              onClick={() => toolbar.onView(viewName as any)}
              className={`relative inline-flex cursor-pointer items-center gap-2 rounded-full px-4 py-1.5 transition-colors duration-200 ease-in-out ${
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
              <p className="relative z-10">
                {viewName.charAt(0).toUpperCase() + viewName.slice(1)}
              </p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function EventModal({
  selectedEvent,
  setInspectEvent,
  inspectEvent,
}: IEventModalProps) {
  return (
    <Dialog
      open={inspectEvent}
      onClose={() => setInspectEvent(false)}
      transition
      className="fixed inset-0 z-50 flex w-screen items-center justify-center bg-black/50 p-4 transition duration-300 ease-out data-closed:opacity-0"
    >
      <div className="fixed inset-0 flex w-screen items-center justify-center p-4">
        <DialogPanel className="max-w-xs flex-1 space-y-4 rounded-xl border border-gray-200 bg-white p-6 shadow-xl">
          <div className="flex items-center justify-between pb-2">
            <DialogTitle className="text-lg font-semibold text-gray-900">
              {selectedEvent.title}
            </DialogTitle>
            <button
              className="material-symbols-outlined cursor-pointer transition-opacity ease-in-out hover:opacity-65"
              style={{ fontSize: "22px" }}
              onClick={() => setInspectEvent(false)}
            >
              close
            </button>
          </div>

          <div className="flex flex-col gap-4">
            <div className="inline-flex items-center gap-2">
              <span
                className="material-symbols-outlined h-fit rounded-lg border border-gray-200 bg-gray-50 p-1 text-gray-800"
                style={{ fontSize: "18px" }}
              >
                calendar_today
              </span>
              <div className="flex flex-col">
                <label className="text-xs text-gray-500">Data</label>
                <p className="text-sm font-medium text-gray-900">01/12</p>
              </div>
            </div>
            <div className="inline-flex items-center gap-2">
              <span
                className="material-symbols-outlined h-fit rounded-lg border border-gray-200 bg-gray-50 p-1 text-gray-800"
                style={{ fontSize: "18px" }}
              >
                schedule
              </span>
              <div className="flex flex-col">
                <label className="text-xs text-gray-500">Horário</label>
                <p className="text-sm font-medium text-gray-900">
                  9:00 - 10:00
                </p>
              </div>
            </div>
            <div className="inline-flex items-center gap-2">
              <span
                className="material-symbols-outlined h-fit rounded-lg border border-gray-200 bg-gray-50 p-1 text-gray-800"
                style={{ fontSize: "18px" }}
              >
                location_on
              </span>
              <div className="flex flex-col">
                <label className="text-xs text-gray-500">Local</label>
                <p className="text-sm font-medium text-gray-900">Campus</p>
              </div>
            </div>
            <div className="inline-flex items-center gap-2">
              <span
                className="material-symbols-outlined h-fit rounded-lg border border-gray-200 bg-gray-50 p-1 text-gray-800"
                style={{ fontSize: "18px" }}
              >
                school
              </span>
              <div className="flex flex-col">
                <label className="text-xs text-gray-500">Ano</label>
                <p className="text-sm font-medium text-gray-900">1º Ano</p>
              </div>
            </div>
          </div>
        </DialogPanel>
      </div>
    </Dialog>
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

  //EVENTOS PARA DEBUG
  const events = [
    {
      id: 0,
      title: "Reunião de Equipa",
      place: "Campus",
      link: "",
      start: new Date(2025, 6, 25, 10, 0), // 25 July 2025, 10:00
      end: new Date(2025, 6, 25, 11, 0), // 25 July 2025, 11:00
      groupId: 1,
      filterId: 1,
    },
    {
      id: 1,
      title: "Nome bué grande mano bro",
      start: new Date(2025, 6, 26, 14, 0),
      end: new Date(2025, 6, 26, 16, 0),
      place: "Campus",
      link: "",
      groupId: 1,
      filterId: 1,
    },
    {
      id: 2,
      title: "Evento Dia Inteiro",
      allDay: true,
      start: new Date(2025, 6, 27),
      end: new Date(2025, 6, 27),
      place: "Campus",
      link: "",
      groupId: 1,
      filterId: 1,
    },
    {
      id: 3,
      title: "Evento 2 dias",
      start: new Date(2025, 6, 16),
      end: new Date(2025, 6, 18),
      place: "Campus",
      link: "",
      groupId: 1,
      filterId: 1,
    },
  ];

  const [selectedEvent, setSelectedEvent] = useState<IEventProps>(events[0]);
  const [inspectEvent, setInspectEvent] = useState<boolean>(false);

  const handleSelection = (event: IEventProps) => {
    setSelectedEvent(event);
    setInspectEvent(!inspectEvent);
  };

  return (
    <div id="calendar-view" className="w-full">
      <Calendar
        components={{ toolbar: CustomToolbar }}
        localizer={localizer}
        events={events}
        selected={selectedEvent}
        onSelectEvent={(event) => handleSelection(event)}
        startAccessor="start"
        endAccessor="end"
        allDayAccessor="all_day"
        style={{ height: 754, width: "100%" }}
        view={view}
        views={["month", "week", "day"]}
        onView={handleViewChange}
        date={date}
        onNavigate={handleNavigate}
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
