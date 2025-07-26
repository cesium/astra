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

  const isMobile = useIsMobile()

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

  const variants = {
    mobile: {
      closed: {
        width: "100%",
        height: "5rem"
      },
      open: {
        width: "100%",
        height: "90vh"
      },
      editing: {
        width: "100%",
        height: "90vh"
      }
    },
    desktop: {
      closed: {
        width: "5rem",
        height: "100%"
      },
      open: {
        width: "380px",
        height: "100%"
      },
      editing: {
        width: "756px",
        height: "100%"
      }
    }
  }

  const transition = {
    duration: 0.4,
    ease: [0.4, 0.0, 0.2, 1] as const,
    editingDuration: 0.3,
    type: "tween" as const
  }

  const getAnimationState = () => {
    if (!isOpen) return 'closed'
    return isEditing ? 'editing' : 'open'
  }

  const animationState = getAnimationState()
  const currentVariants = isMobile ? variants.mobile : variants.desktop
  const showClosedState = !isOpen && applyClosedClasses

  const getContainerClasses = () => {
    const base = isMobile ? "fixed bottom-0 left-0 w-full z-50" : "h-full"
    const editing = isEditing && !isMobile ? "relative" : ""
    return `${base} ${editing}`
  }

  const getMotionClasses = () => {
    const base = isMobile ? "w-full" : "h-full"
    const flex = `flex ${isMobile ? "items-end" : "items-start"} justify-end box-border`

    let state = ""
    if (showClosedState) {
      state = "cursor-pointer"
    } else if (isMobile) {
      state = "justify-start"
    } else {
      state = "justify-start border rounded-2xl border-[#eeeeee] bg-[#f5f5f5]"
    }

    const editing = isEditing && !isMobile ? "absolute z-50" : ""
    const mobile = isMobile ? "rounded-t-2xl bg-white shadow-lg" : ""

    return `${base} ${flex} ${state} ${editing} ${mobile}`
  }

  const getContentClasses = () => {
    const base = isMobile ? "w-full h-full" : "h-full"
    const flex = "flex flex-col w-full overflow-hidden"
    const styling = isMobile ? "rounded-t-2xl" : "rounded-[15px]"
    const custom = classNameOpenedSection || ""

    return `${base} ${flex} ${styling} ${custom}`
  }

  const contentVariants = {
    hidden: {
      opacity: 0
    },
    visible: {
      opacity: 1
    },
    exit: {
      opacity: 0
    }
  }

  return (
    <div className={getContainerClasses()}>
      <motion.div
        onClick={showClosedState ? handleOpen : undefined}
        className={getMotionClasses()}
        animate={animationState}
        variants={currentVariants}
        initial="closed"
        transition={{
          duration: isEditing ? transition.editingDuration : transition.duration,
          ease: transition.ease,
          type: transition.type
        }}
      >
        {showClosedState && (
          <motion.div
            className={`flex gap-2 ${isMobile ? "justify-center items-center w-full h-20 flex-row-reverse" : "-rotate-90 translate-y-20"}`}
            variants={contentVariants}
            initial="visible"
            animate="visible"
          >
            <span className="flex items-center justify-center whitespace-nowrap text-gray-500 font-light text-sm">
              Mostrar opções
            </span>
            <span className={`material-symbols-outlined text-center text-gray-500 ml-2 ${isMobile ? "-rotate-90" : "rotate-90"}`}>
              arrow_forward_ios
            </span>
          </motion.div>
        )}

        {isOpen && (
          <motion.div
            className={getContentClasses()}
            variants={contentVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            {!isEditing && (
              <motion.div
                className={`flex justify-between place-items-center p-4 flex-shrink-0`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3, delay: 0.15 }}
              >
                <span className="text-2xl font-semibold">{title}</span>
                <span
                  className="material-symbols-outlined cursor-pointer text-gray-500 font-bold hover:text-gray-700 transition-colors duration-200"
                  onClick={handleClose}
                >
                  arrow_back_ios_new
                </span>
              </motion.div>
            )}

            {isEditing && (
              <motion.div
                className="flex justify-between place-items-center p-4 flex-shrink-0"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3, delay: 0.15 }}
              >
                <span
                  className="material-symbols-outlined cursor-pointer text-gray-500 hover:text-gray-700 transition-colors duration-200"
                  onClick={handleEditClick}
                >
                  arrow_back_ios_new
                </span>
                <span className="text-lg font-semibold">{titleEdit}</span>
                <span className="h-8"></span>
              </motion.div>
            )}

            <motion.div
              className="flex-1 min-h-0"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.2 }}
            >
              <div className="h-full w-full overflow-hidden box-border">
                <motion.div
                  className="overflow-auto h-full w-full box-border rounded-b-2xl rounded-t-none"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3, delay: 0.25 }}
                >
                  {!isEditing ? addEditActionToChildren(children[0]) : children[1]}
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </motion.div>
    </div>
  )
}