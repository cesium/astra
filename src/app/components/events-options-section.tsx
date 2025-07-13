"use client"

import { useState } from "react"

interface IEventsOptionsSection {
  sendEditInfoToParent?: (isEditing: boolean) => void
}

export default function EventsOptionsSection({sendEditInfoToParent} : IEventsOptionsSection) {

  const [isEditing, setIsEditing] = useState(false) 

  function handleEditClick() {
    let newValue = isEditing ? false : true
    setIsEditing(newValue)
    sendEditInfoToParent?.(newValue)
  }

  return (
      <div className="bg-amber-300 w-96 h-80">
        <div>
          {isEditing ? <span onClick={handleEditClick} className="material-symbols-outlined">arrow_back</span> : ""}
        </div>
        <div>
          <span>Partilhar</span>
          <span>Exportar conjunto</span>
        </div>
        <div>
          <span onClick={handleEditClick}>Edit</span>
        </div>
      </div>
  )
}
