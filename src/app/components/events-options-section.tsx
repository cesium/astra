"use client"
import { motion } from "motion/react"
import React, { cloneElement, ReactNode, useState, isValidElement, ReactElement } from "react"

interface IEventsOptionsSection {
  children: [ReactNode, ReactNode]
  sendEditInfoToParent: (isEditing: boolean) => void
}

export default function EventsOptionsSection({sendEditInfoToParent, children} : IEventsOptionsSection) {


  const [isEditing, setIsEditing] = useState(false) 

  function handleEditClick() {
    let newValue = isEditing ? false : true
    setIsEditing(newValue)
    sendEditInfoToParent(newValue)
  }

  function addEditActionToChildren(child: ReactNode) : ReactNode {

    const element = child as ReactElement<any>

    if(!isValidElement(child)) return child

    if("data-edit-button" in element.props) {
      return cloneElement(element, {onClick: handleEditClick})
    }

    const children = element.props.children
    if (children) {
      const childrenWithEditButtonAction = React.Children.map(children, (nestedChild) =>
        addEditActionToChildren(nestedChild)
      )

      return cloneElement(element, {
        children: childrenWithEditButtonAction,
      })
    }

    return child
  }

  return (
      <div>
          
          {isEditing && (
            <div className="h-8 flex place-items-center">
              <motion.span onClick={handleEditClick} className="material-symbols-outlined text-gray-500 cursor-pointer">arrow_back_ios_new</motion.span>
            </div>
          )}
          <motion.div 
            initial={{ opacity: 0, width: "5rem" }}
            animate={{ opacity: 1, width: "24rem" }}
            exit={{ opacity: 0, width: "5rem" }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className="bg-amber-300 h-80"
        >
            {!isEditing && addEditActionToChildren(children[0])}
            {isEditing && children[1]}
        </motion.div>
      </div>
  )
}