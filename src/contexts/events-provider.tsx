'use client'

import { createContext, useState } from "react"

interface IEventsProvider {
	hasChanges: boolean,
  isEditing: boolean,
  setIsEditing: (curr: boolean) => void,
}

export const EventsContext = createContext<IEventsProvider>({
  hasChanges: false,
  isEditing: false,
  setIsEditing: () => {},
})

export function EventsProvider({ children }: { children: React.ReactNode }) {
	
	const [hasChanges, setHasChanges] = useState<boolean>(false);
	const [isEditing, setIsEditing] = useState<boolean>(false);
	
	return (
    <EventsContext.Provider value={{hasChanges, isEditing, setIsEditing}}>
        {children}
    </EventsContext.Provider>
	)
}