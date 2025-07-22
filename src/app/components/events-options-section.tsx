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
    <div className="h-full flex flex-col">
      {isEditing && (
        <div className="flex justify-between place-items-center p-4 flex-shrink-0">
          <span
            className="material-symbols-outlined cursor-pointer text-gray-500"
            onClick={handleEditClick}
          >
            arrow_back_ios_new
          </span>
          <span className="text-lg font-semibold">{titleEdit}</span>
          <span className="h-8"></span>
        </div>
      )}
      <div className="flex-1 min-h-0">
        <motion.div
          transition={{ duration: 0.5, ease: "easeInOut" }}
          className="h-full w-full overflow-hidden box-border"
        >
          {!isEditing && (
            <div className="overflow-auto h-full w-full box-border">
              {addEditActionToChildren(children[0])}
            </div>
          )}
          {isEditing && (
            <div className="overflow-auto h-full w-full box-border">
              {children[1]}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
