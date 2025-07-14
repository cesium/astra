"use client"
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
          <div>
            {isEditing && <span onClick={handleEditClick} className="material-symbols-outlined">arrow_back_ios_new</span>}
          </div>
        <div className="bg-amber-300 w-96 h-80">
            {!isEditing && addEditActionToChildren(children[0])}
            {isEditing && children[1]}
        </div>
      </div>
  )
}