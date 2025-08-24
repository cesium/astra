"use client";

import { IEvent, IShift } from "@/lib/types";
import React, { createContext, useState } from "react";

interface ICalendarProvider {
  events?: IEvent[];
  shifts?: IShift[];
  isEditing: boolean;
  setIsEditing: (curr: boolean) => void;
}

export const CalendarContext = createContext<ICalendarProvider>({
  events: [],
  shifts: [],
  isEditing: false,
  setIsEditing: () => {},
});

export function CalendarProvider({ children }: { children: React.ReactNode }) {
  const [events, setEvents] = useState([]);
  const [shifts, setShifts] = useState([]);
  const [isEditing, setIsEditing] = useState(false);

  return (
    <CalendarContext.Provider
      value={{ events, shifts, isEditing, setIsEditing }}
    >
      {children}
    </CalendarContext.Provider>
  );
}
