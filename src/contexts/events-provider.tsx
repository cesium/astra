"use client";

import { useGetCategories, useGetEvents } from "@/lib/queries/events";
import {
  IEvent,
  IEventCategoriesSorted,
  IEventCategory,
  IEventResponse,
} from "@/lib/types";
import moment from "moment";
import { createContext, useEffect, useState } from "react";

interface IEventsProvider {
  editingEvents: IEvent[];
  setEditingEvents: (prev: IEvent[]) => void;
  allCategories: IEventCategory[];

  hasChanges: boolean;
  isEditing: boolean;
  setIsEditing: (curr: boolean) => void;

  sortCategoriesByYear: (
    categories: IEventCategory[],
  ) => IEventCategoriesSorted;
}

const { Generator } = require("contrast-color-generator");
const generator = new Generator(0, {
  minimumRatio: 4,
});

function sortCategoriesByYear(
  categories: IEventCategory[],
): IEventCategoriesSorted {
  const { otherCategories, courseCategories } = categories.reduce(
    (
      acc: {
        otherCategories: IEventCategory[];
        courseCategories: IEventCategory[];
      },
      category,
    ) => {
      if (!category.course) acc.otherCategories.push(category);
      else acc.courseCategories.push(category);

      return acc;
    },
    { otherCategories: [], courseCategories: [] },
  );

  const otherFormatted = { categories: otherCategories };

  const courseCategoriesMap = courseCategories.reduce(
    (acc, category) => {
      const yearKey = category.course ? String(category.course.year) : "0";

      if (!acc[yearKey]) {
        acc[yearKey] = {
          year: category.course ? Number(category.course.year) : 0,
          categories: [category],
        };
      } else {
        acc[yearKey].categories.push(category);
      }

      return acc;
    },
    {} as Record<string, { year: number; categories: IEventCategory[] }>,
  );

  const courseCategoriesFormatted = Object.values(courseCategoriesMap);

  console.log("Other:", otherFormatted);
  console.log("Course", courseCategoriesFormatted);

  return [...courseCategoriesFormatted, otherFormatted];
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
      eventColor: event.category.color,
      textColor: generator.generate(event.category.color).hexStr,
      allDay: allday,
    };
  });
}

export const EventsContext = createContext<IEventsProvider>({
  editingEvents: [],
  setEditingEvents: () => {},
  allCategories: [],

  hasChanges: false,
  isEditing: false,
  setIsEditing: () => {},

  sortCategoriesByYear,
});

export function EventsProvider({ children }: { children: React.ReactNode }) {
  const [editingEvents, setEditingEvents] = useState<IEvent[]>([]);

  const [hasChanges, setHasChanges] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);

  const { data: allEvents } = useGetEvents();
  const { data: allCategories } = useGetCategories();

  useEffect(() => {
    setEditingEvents(formatEvents(allEvents || []));
  }, [allEvents]);

  return (
    <EventsContext.Provider
      value={{
        editingEvents,
        setEditingEvents,
        allCategories,
        hasChanges,
        isEditing,
        setIsEditing,
        sortCategoriesByYear,
      }}
    >
      {children}
    </EventsContext.Provider>
  );
}
