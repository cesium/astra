"use client"
import { motion } from "motion/react"
import React, {
  cloneElement,
  ReactNode,
  useState,
  isValidElement,
  ReactElement,
  useEffect,
  useCallback,
  useMemo,
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

  const handleClose = useCallback(() => {
    setIsOpen(false)
    setIsEditing(false)
  }, [])

  const handleOpen = useCallback(() => {
    setIsOpen(true)
    setApplyClosedClasses(false)
  }, [])

  const handleEditClick = useCallback(() => {
    setIsEditing(prev => !prev)
  }, [])

  const useIsMobile = () => {
    const [isMobile, setIsMobile] = useState(false)

    useEffect(() => {
      const checkMobile = () => setIsMobile(window.innerWidth < 800)
      checkMobile()
      window.addEventListener("resize", checkMobile)
      return () => window.removeEventListener("resize", checkMobile)
    }, [])

    return isMobile
  }

  const isMobile = useIsMobile()

  const addEditActionToChildren = useCallback((child: ReactNode): ReactNode => {
    if (!isValidElement(child)) return child

    const element = child as ReactElement<Record<string, unknown>>

    if (element.props && "data-edit-button" in element.props) {
      return cloneElement(element, {
        ...element.props,
        onClick: handleEditClick
      })
    }

    const children = element.props?.children
    if (children && (isValidElement(children) || Array.isArray(children))) {
      const processedChildren = React.Children.map(
        children as ReactNode,
        (nestedChild: ReactNode) => addEditActionToChildren(nestedChild),
      )
      return cloneElement(element, {
        ...element.props,
        children: processedChildren,
      })
    }

    return child
  }, [handleEditClick])

  const variants = useMemo(() => ({
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
        width: "379px",
        height: "100%"
      },
      editing: {
        width: "756px",
        height: "100%"
      }
    }
  }), [])

  const transition = useMemo(() => ({
    duration: 0.4,
    ease: [0.4, 0.0, 0.2, 1] as const,
    editingDuration: 0.3,
    type: "tween" as const
  }), [])

  const getAnimationState = useCallback(() => {
    if (!isOpen) return 'closed'
    return isEditing ? 'editing' : 'open'
  }, [isOpen, isEditing])

  const animationState = getAnimationState()
  const currentVariants = isMobile ? variants.mobile : variants.desktop
  const showClosedState = !isOpen && applyClosedClasses

  const getContainerClasses = useCallback(() => {
    const base = isMobile ? "fixed bottom-0 left-0 w-full z-50" : "h-full"
    const editing = (isOpen && !isMobile) ? "relative" : ""
    const background = showClosedState && isMobile ? "bg-white"  : ""

    return `${base} ${editing} ${background}`
  }, [isMobile, isEditing, showClosedState, isOpen])

  const getMotionClasses = useCallback(() => {
    const base = isMobile ? "w-full" : "h-full"
    const flex = `flex ${isMobile ? "items-end" : "items-start"} justify-end box-border`

    let state = ""
    if (showClosedState) {
      state = "cursor-pointer"
    } else if (isMobile) {
      state = "justify-start"
    } else {
      state = "justify-start rounded-2xl"
    }

    const editing = (isEditing) && !isMobile ? "absolute z-50" : ""
    const mobile = isMobile ? "rounded-t-2xl" : ""

    const backgroundAndBorder = isOpen ? isMobile ? "bg-muted/50 backdrop-blur-3xl border border-black/5" : "bg-muted/50 backdrop-blur-3xl border border-black/5" : ""

    return `${base} ${flex} ${state} ${editing} ${mobile} ${backgroundAndBorder}`
  }, [isMobile, showClosedState, isEditing, isOpen])

  const getContentClasses = useCallback(() => {
    const base = isMobile ? "w-full h-full" : "h-full"
    const flex = "flex flex-col w-full overflow-hidden"
    const styling = isMobile ? "rounded-t-2xl" : "rounded-2xl"
    const custom = classNameOpenedSection || ""

    const background = !showClosedState
      ? "rounded-2xl border border-black/5"
      : ""

    return `${base} ${flex} ${styling} ${custom} ${background}`
  }, [isMobile, showClosedState, classNameOpenedSection])


  const contentVariants = useMemo(() => ({
    hidden: {
      opacity: 0
    },
    visible: {
      opacity: 1
    },
    exit: {
      opacity: 0
    }
  }), [])

  const handleAnimationComplete = useCallback((definition: string) => {
    if (definition === 'closed') {
      setApplyClosedClasses(true)
    }
  }, [])

  const handleMotionClick = useCallback(() => {
    if (showClosedState) {
      handleOpen()
    }
  }, [showClosedState, handleOpen])

  return (
    <div className={getContainerClasses()}>
      <motion.div
        onClick={handleMotionClick}
        className={getMotionClasses()}
        animate={animationState}
        variants={currentVariants}
        initial="closed"
        transition={{
          duration: isEditing ? transition.editingDuration : transition.duration,
          ease: transition.ease,
          type: transition.type
        }}
        onAnimationComplete={handleAnimationComplete}
        role={showClosedState ? "button" : undefined}
        tabIndex={showClosedState ? 0 : undefined}
        onKeyDown={showClosedState ? (e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            handleOpen()
          }
        } : undefined}
        aria-label={showClosedState ? "Abrir opções" : undefined}
      >
        {showClosedState && (
          <motion.div
            className={`flex gap-2 ${isMobile ? "justify-center items-start w-full h-20 flex-row-reverse" : "-rotate-90 translate-y-20"}`}
            variants={contentVariants}
            initial="visible"
            animate="visible"
          >
            <span className="flex items-center justify-center whitespace-nowrap text-gray-500 font-light text-sm">
              Abrir opções
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
                className="flex justify-between place-items-center p-4 flex-shrink-0"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3, delay: 0.15 }}
              >
                <span className="text-2xl font-semibold">{title}</span>
                <button
                  className="material-symbols-outlined cursor-pointer text-gray-500 font-bold hover:text-gray-700 transition-colors duration-200 border-none p-1"
                  onClick={handleClose}
                  aria-label="Fechar opções"
                  type="button"
                  style={{fontSize: "20px"}}
                >
                  arrow_back_ios_new
                </button>
              </motion.div>
            )}

            {isEditing && (
              <motion.div
                className="flex justify-between place-items-center p-4 flex-shrink-0"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3, delay: 0.15 }}
              >
                <button
                  className="material-symbols-outlined cursor-pointer text-gray-500 hover:text-gray-700 transition-colors duration-200 border-none p-1"
                  onClick={handleEditClick}
                  aria-label="Voltar às opções"
                  type="button"
                  style={{fontSize: "20px"}}
                >
                  arrow_back_ios_new
                </button>
                <span className="text-lg font-semibold">{titleEdit}</span>
                <div className="h-8 w-8"></div>
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