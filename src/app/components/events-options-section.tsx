"use client";
import { motion } from "motion/react";
import React, {
  cloneElement,
  ReactNode,
  useState,
  isValidElement,
  ReactElement,
} from "react";

interface IEventsOptionsSection {
  titleEdit?: string;
  children: [ReactNode, ReactNode];
  sendEditInfoToParent: (isEditing: boolean) => void;
}

export default function EventsOptionsSection({
  sendEditInfoToParent,
  titleEdit = "Editar Opções",
  children,
}: IEventsOptionsSection) {
  const [isEditing, setIsEditing] = useState(false);

  function handleEditClick() {
    const newValue = isEditing ? false : true;
    setIsEditing(newValue);
    sendEditInfoToParent(newValue);
  }

  function addEditActionToChildren(child: ReactNode): ReactNode {
    const element = child as ReactElement<any>;

    if (!isValidElement(child)) return child;

    if ("data-edit-button" in element.props) {
      return cloneElement(element, { onClick: handleEditClick });
    }

    const children = element.props.children;
    if (children) {
      const childrenWithEditButtonAction = React.Children.map(
        children,
        (nestedChild) => addEditActionToChildren(nestedChild),
      );

      return cloneElement(element, {
        children: childrenWithEditButtonAction,
      });
    }

    return child;
  }

  let width

  isEditing ? (width = "756px") : (width = "379px")

  return (
    <div>
      {isEditing && (
        <div className="flex justify-between place-items-center p-4">
          <span
            className="material-symbols-outlined cursor-pointer text-gray-500"
            onClick={handleEditClick}
          >
            arrow_back_ios_new
          </span>
          <span className="text-xl font-semibold">{titleEdit}</span>
          <span></span>
        </div>
      )}
      <motion.div
        initial={{ opacity: 0, width: "5rem" }}
        animate={{ opacity: 1, width: width }}
        exit={{ opacity: 0, width: "5rem" }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
        className="h-80 bg-amber-300"
      >
        {!isEditing && addEditActionToChildren(children[0])}
        {isEditing && children[1]}
      </motion.div>
    </div>
  );
}
