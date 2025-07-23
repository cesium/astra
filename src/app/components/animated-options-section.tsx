"use client"
import { motion } from "motion/react"
import React, {
  cloneElement,
  ReactNode,
  useState,
  isValidElement,
  ReactElement,
  useEffect,
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
  const [isEditing, setIsEditing] = useState(false)

  const handleClose = () => {
    setIsOpen(false)
    setIsEditing(false)
    setTimeout(() => {
      setApplyClosedClasses(true)
    }, 600)
  }

  const handleOpen = () => {
    setIsOpen(true)
    setApplyClosedClasses(false)
  }

  function handleEditClick() {
    setIsEditing(!isEditing)
  }

  const useIsMobile = () => {
    const [isMobile, setIsMobile] = useState(false)

    useEffect(() => {
      const checkMobile = () => setIsMobile(window.innerWidth < 768)
      checkMobile()
      window.addEventListener("resize", checkMobile)
      return () => window.removeEventListener("resize", checkMobile)
    }, [])

    return isMobile
  }

  function addEditActionToChildren(child: ReactNode): ReactNode {
    const element = child as ReactElement<any>
    if (!isValidElement(child)) return child

    if ("data-edit-button" in element.props) {
      return cloneElement(element, { onClick: handleEditClick })
    }

    const children = element.props.children
    if (children) {
      const childrenWithEditButtonAction = React.Children.map(
        children,
        (nestedChild) => addEditActionToChildren(nestedChild),
      )
      return cloneElement(element, {
        children: childrenWithEditButtonAction,
      })
    }
    return child
  }

  const isMobile = useIsMobile()
  const width = isMobile ? "100vw" : (isEditing ? "756px" : "379px")
  const showClosedState = !isOpen && applyClosedClasses

  return (
    <div className={`h-full ${isEditing ? "relative" : ""}`}>
      {isEditing && (
        <div className="absolute top-0 left-0 w-screen h-screen backdrop-blur-lg z-10"></div>
      )}
      <motion.div
        onClick={showClosedState ? handleOpen : undefined}
        className={`h-full flex items-start justify-end box-border ${
          showClosedState
            ? "cursor-pointer"
            : "justify-start border rounded-2xl border-[#eeeeee] bg-[#f5f5f5]"
        } ${isEditing ? "absolute z-50" : ""}`}
        initial={{ width: "5rem" }}
        animate={isOpen ? { width: width } : { width: "5rem" }}
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
            className={`h-full flex flex-col w-full ${classNameOpenedSection} overflow-hidden rounded-[15px]`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            {!isEditing && (
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
                  <div className="overflow-auto h-full w-full box-border rounded-b-2xl rounded-t-none">
                    {addEditActionToChildren(children[0])}
                  </div>
                )}
                {isEditing && (
                  <div className="overflow-auto h-full w-full box-border rounded-b-2xl rounded-t-none">
                    {children[1]}
                  </div>
                )}
              </motion.div>
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  )
}