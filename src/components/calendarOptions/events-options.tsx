"use client";

import { useContext } from "react";

import { EventsContext } from "@/contexts/events-provider";
import DisplayEvents from "./events/display-events";
import CalendarOptions from "./common/calendar-options";

export default function EventsOptions() {
  const context = useContext(EventsContext);

  const { hasChanges, isEditing, setIsEditing } = context;

  return (
    <CalendarOptions
      currentItems={[]} //todo
      editingItems={[]}
      itemsToAdd={[]}
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
      DisplayComponent={DisplayEvents}
      sortItems={(items) => items}
    />
  );
}
