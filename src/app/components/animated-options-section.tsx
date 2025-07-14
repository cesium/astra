"use client"

import EventsOptionsSection from "./events-options-section"

import {
  useState,
  ReactNode,
} from "react"

interface IAnimatedOptionsSection {
  children: [ReactNode, ReactNode]
  title?: string
  classNameOpenedSection?: string
}

export default function AnimatedOptionsSection({
  children,
  title = "Opções",
  classNameOpenedSection,
}: IAnimatedOptionsSection) {

  const [isOpen, setIsOpen] = useState(false)
  const [isEditingFromChild, setIsEditingFromChild] = useState(false)

  function handleIsEditingFromChild(editing: boolean) {
    setIsEditingFromChild(editing)
  }

  return (
    <div
      onClick={!isOpen ? () => setIsOpen(true) : undefined}
      className={`border border-gray-200 shadow-sm rounded-xl w-20 h-96 flex items-center justify-center ${
        !isOpen ? "cursor-pointer" : "w-fit"
      }`}
    >
      {!isOpen && (
        <div className="-rotate-90 flex">
          <span className="text-center flex w-30 text-gray-500 font-light text-sm">
            Mostrar opções
          </span>
          <span className="material-symbols-outlined text-center rotate-90 text-gray-500">
            arrow_forward_ios
          </span>
        </div>
      )}
      {isOpen && (
        <div
          className={`flex flex-col bg-muted rounded-xl ${classNameOpenedSection}`}
        > 
        {!isEditingFromChild && (
            <>
                <div className="flex justify-between">
                    <span className="text-2xl font-semibold">{title}</span>
                    <span className="material-symbols-outlined cursor-pointer text-gray-500" onClick={() => setIsOpen(false)}>
                        arrow_back_ios_new
                    </span>
                </div>
            </>
        )}
        <EventsOptionsSection sendEditInfoToParent={handleIsEditingFromChild}>
        {children}
        </EventsOptionsSection>
        </div>
      )}
    </div>
  )
}
