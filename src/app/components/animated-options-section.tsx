"use client"
import { motion } from "motion/react"
import EventsOptionsSection from "./events-options-section"
import {
 useState,
 ReactNode,
} from "react"

interface IAnimatedOptionsSection {
  children: [ReactNode, ReactNode]
  title?: string
  titleEdit?: string
  classNameOpenedSection?: string
}

export default function AnimatedOptionsSection({
  children,
  title = "Opções",
  titleEdit = "Editar Opções",
  classNameOpenedSection,
}: IAnimatedOptionsSection) {
  const [isOpen, setIsOpen] = useState(false)
  const [applyClosedClasses, setApplyClosedClasses] = useState(true)
  const [isEditingFromChild, setIsEditingFromChild] = useState(false)

  function handleIsEditingFromChild(editing: boolean) {
    setIsEditingFromChild(editing)
  }

  const handleClose = () => {
    setIsOpen(false)
    setTimeout(() => {
      setApplyClosedClasses(true)
    }, 600)
  }

  const handleOpen = () => {
    setIsOpen(true)
    setApplyClosedClasses(false)
  }

  let width
  isEditingFromChild ? (width = "756px") : (width = "379px")

  const showClosedState = !isOpen && applyClosedClasses

  return (
    <motion.div
      onClick={showClosedState ? handleOpen : undefined}
      className={`h-full flex items-start justify-end box-border ${
        showClosedState ? "cursor-pointer" : "justify-start border rounded-[15px] border-[#eeeeee] bg-[#fafafa]"
      }`}
      initial={{ width: "5rem" }}
      animate={
        isOpen
          ? { width: width }
          : { width: "5rem" }
      }
      exit={{ width: "5rem" }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
    >
      {showClosedState && (
        <div className="-rotate-90 flex translate-y-20">
          <span className="text-center flex w-30 text-gray-500 font-light text-sm">
            Mostrar opções
          </span>
          <span className="material-symbols-outlined text-center rotate-90 text-gray-500">
            arrow_forward_ios
          </span>
        </div>
      )}
      {isOpen && (
        <motion.div
          className={`h-full flex flex-col ${classNameOpenedSection}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
        >
          {!isEditingFromChild && (
            <div className="flex justify-between place-items-center p-4 flex-shrink-0">
              <span className="text-2xl font-semibold">{title}</span>
              <span
                className="material-symbols-outlined cursor-pointer text-gray-500 font-bold"
                onClick={handleClose}
              >
                arrow_back_ios_new
              </span>
            </div>
          )}
          <div className="flex-1 min-h-0">
            <EventsOptionsSection titleEdit={titleEdit} sendEditInfoToParent={handleIsEditingFromChild}>
              {children}
            </EventsOptionsSection>
          </div>
        </motion.div>
      )}
    </motion.div>
  )
}