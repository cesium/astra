"use client";

import { useUpdateStudentCategories } from "@/lib/mutations/events";
import {
  useGetCategories,
  useGetEvents,
  useGetSelectedCategories,
} from "@/lib/queries/events";
import {
  IEvent,
  IEventCategoriesSorted,
  IEventCategory,
  IEventResponse,
} from "@/lib/types";
import { getContrastColor } from "@/lib/utils";
import moment from "moment";
import { createContext, useEffect, useState } from "react";

interface IEventsProvider {
  activeEvents: IEvent[];
  setActiveEvents: (prev: IEvent[]) => void;
  activeCategories: IEventCategory[];
  setActiveCategories: (prev: IEventCategory[]) => void;
  allCategories: IEventCategory[];
  selectedCategories: IEventCategory[];
  categoriesToAdd: IEventCategory[];

  removeCategory: (id: string) => void;
  addCategory: (id: string) => void;
  hasChanges: boolean;
  saveChanges: () => void;
  isEditing: boolean;
  setIsEditing: (curr: boolean) => void;

  sortCategoriesByYear: (
    categories: IEventCategory[],
  ) => IEventCategoriesSorted;
}

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

  return otherCategories.length > 0
    ? [...courseCategoriesFormatted, otherFormatted]
    : courseCategoriesFormatted;
}

function lookForChanges(
  categories1: IEventCategory[],
  categories2: IEventCategory[],
) {
  if (categories1.length !== categories2.length) return true;

  const categories1Ids = new Set(categories1.map((shift) => shift.id));
  const categories2Ids = new Set(categories2.map((shift) => shift.id));

  if (categories1Ids.size !== categories2Ids.size) return true;

  for (const id of categories1Ids) {
    if (!categories2Ids.has(id)) return true;
  }

  return false;
}

function formatEvents(events: IEventResponse[]) {
  return events.map((event) => {
    const start = moment.utc(event.start);
    const end = moment.utc(event.end);

    const startsAtMidnight =
      start.hours() === 0 && start.minutes() === 0 && start.seconds() === 0;
    const endsAtMidnight =
      end.hours() === 0 && end.minutes() === 0 && end.seconds() === 0;
    const allday =
      (startsAtMidnight && endsAtMidnight) ||
      end.diff(start, "days", true) >= 1;

    return {
      id: event.id,
      name: event.title,
      category: event.category,
      start: start,
      end: end,
      place: event.place,
      link: event.link,
      eventColor: event.category.color,
      textColor: getContrastColor(event.category.color, 5),
      allDay: allday,
    };
  });
}

function removeCategoryById(
  categories: IEventCategory[],
  id: string,
): IEventCategory[] {
  return categories.filter((category) => category.id !== id);
}

function addCategoryById(
  categories: IEventCategory[],
  allCategories: IEventCategory[],
  id: string,
): IEventCategory[] {
  const newCategory = allCategories.find((category) => category.id === id);
  if (newCategory && !categories.some((s) => s.id === id)) {
    return [...categories, newCategory];
  }
  return categories;
}

function extractIds(categories: IEventCategory[]): string[] {
  const Ids = categories.map((shift) => shift.id);
  return Ids;
}

function filterNotActiveCategories(
  allCategories: IEventCategory[],
  activeCategories: IEventCategory[],
): IEventCategory[] {
  const activeIds = new Set(activeCategories.map((category) => category.id));
  return allCategories.filter((category) => !activeIds.has(category.id));
}

export const EventsContext = createContext<IEventsProvider>({
  activeEvents: [],
  setActiveEvents: () => {},
  activeCategories: [],
  setActiveCategories: () => {},
  allCategories: [],
  selectedCategories: [],
  categoriesToAdd: [],

  removeCategory: () => {},
  addCategory: () => {},
  hasChanges: false,
  saveChanges: () => {},
  isEditing: false,
  setIsEditing: () => {},

  sortCategoriesByYear,
});

export function EventsProvider({ children }: { children: React.ReactNode }) {
  const [activeCategories, setActiveCategories] = useState<IEventCategory[]>(
    [],
  );
  const [activeEvents, setActiveEvents] = useState<IEvent[]>([]);
  const [categoriesToAdd, setcategoriesToAdd] = useState<IEventCategory[]>([]);

  const [hasChanges, setHasChanges] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);

  const { data: allEvents } = useGetEvents();
  const { data: allCategories } = useGetCategories();
  const { data: selectedCategories } = useGetSelectedCategories();

  const updateCategories = useUpdateStudentCategories();

  useEffect(() => {
    const activeCategoriesIds = activeCategories.map((category) => category.id);

    const visibleEvents = allEvents.filter((event) =>
      activeCategoriesIds.includes(event.category.id),
    );

    setActiveEvents(formatEvents(visibleEvents));
  }, [activeCategories, allEvents]);

  useEffect(() => {
    setActiveCategories([...selectedCategories]);
  }, [selectedCategories]);

  const removeCategory = (id: string) => {
    setActiveCategories((prev) => removeCategoryById(prev, id));
  };

  const addCategory = (id: string) => {
    setActiveCategories((prev) => addCategoryById(prev, allCategories, id));
  };

  useEffect(() => {
    setHasChanges(lookForChanges(selectedCategories, activeCategories));
  }, [selectedCategories, activeCategories]);

  useEffect(() => {
    setcategoriesToAdd(
      filterNotActiveCategories(allCategories, activeCategories),
    );
  }, [allCategories, activeCategories]);

  const saveChanges = () => {
    const newIds = extractIds(activeCategories);
    updateCategories.mutate({ event_categories: newIds });
  };

  return (
    <EventsContext.Provider
      value={{
        activeEvents,
        setActiveEvents,
        activeCategories,
        setActiveCategories,
        allCategories,
        selectedCategories,
        categoriesToAdd,
        removeCategory,
        addCategory,
        hasChanges,
        saveChanges,
        isEditing,
        setIsEditing,
        sortCategoriesByYear,
      }}
    >
      {children}
    </EventsContext.Provider>
  );
}
