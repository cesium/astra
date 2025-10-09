"use client";

import { useContext } from "react";

import { EventsContext } from "@/contexts/events-provider";
import CalendarOptions from "./common/calendar-options";
import DisplayCategories from "./events/display-events";

export default function EventsOptions() {
  const context = useContext(EventsContext);

  const {
    hasChanges,
    isEditing,
    setIsEditing,
    allCategories,
    sortCategoriesByYear,
  } = context;

  return (
    <CalendarOptions
      currentItems={allCategories ?? []} //todo
      editingItems={allCategories ?? []}
      itemsToAdd={allCategories ?? []}
      isEditing={isEditing}
      hasChanges={hasChanges}
      setIsEditing={setIsEditing}
      setEditingItems={() => {}}
      removeItem={() => {}}
      addItem={() => {}}
      saveChanges={() => {}}
      clearItems={() => {}}
      resetItems={() => {}}
      title="Calendar"
      description="Select the types of events you want to see on your calendar."
      DisplayComponent={DisplayCategories}
      sortItems={sortCategoriesByYear}
    />
  );
}
