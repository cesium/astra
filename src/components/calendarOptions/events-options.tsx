"use client";

import { useContext } from "react";

import { EventsContext } from "@/contexts/events-provider";
import CalendarOptions from "./common/calendar-options";
import DisplayCategories from "./events/display-events";

export default function EventsOptions() {
  const context = useContext(EventsContext);

  const {
    selectedCategories,
    activeCategories,
    setActiveCategories,
    categoriesToAdd,
    removeCategory,
    addCategory,
    hasChanges,
    saveChanges,
    isEditing,
    setIsEditing,
    sortCategoriesByYear,
  } = context;

  return (
    <CalendarOptions
      currentItems={selectedCategories} //todo
      editingItems={activeCategories}
      itemsToAdd={categoriesToAdd}
      isEditing={isEditing}
      hasChanges={hasChanges}
      setIsEditing={setIsEditing}
      setEditingItems={setActiveCategories}
      removeItem={removeCategory}
      addItem={addCategory}
      saveChanges={saveChanges}
      clearItems={() => setActiveCategories([])}
      resetItems={() => setActiveCategories(selectedCategories)}
      title="Calendar"
      description="Select the types of events you want to see on your calendar."
      DisplayComponent={DisplayCategories}
      sortItems={sortCategoriesByYear}
    />
  );
}
