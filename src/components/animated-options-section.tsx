"use client";
import { CalendarContext } from "@/contexts/calendar-provider";
import clsx from "clsx";
import { motion, AnimatePresence } from "motion/react";
import {
  cloneElement,
  ReactNode,
  useState,
  isValidElement,
  ReactElement,
  useEffect,
  useCallback,
  useMemo,
  Children,
  useContext,
} from "react";
import { twMerge } from "tailwind-merge";

interface IAnimatedOptionsSection {
  children: [ReactNode, ReactNode];
  title?: string;
  titleEdit?: string;
  classNameOpenedSection?: string;
}

const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [viewportHeight, setViewportHeight] = useState(0);

  useEffect(() => {
    const updateSizes = () => {
      setIsMobile(window.innerWidth < 768);
      setViewportHeight(window.innerHeight);
    };

    updateSizes();
    window.addEventListener("resize", updateSizes);
    return () => window.removeEventListener("resize", updateSizes);
  }, []);

  return { isMobile, viewportHeight };
};

export default function AnimatedOptionsSection({
  children,
  title = "Options",
  titleEdit = "Edit Options",
  classNameOpenedSection,
}: IAnimatedOptionsSection) {
  const [isOpen, setIsOpen] = useState(false);

  const { isEditing, setIsEditing } = useContext(CalendarContext);

  const handleClose = useCallback(() => {
    setIsOpen(false);
    setIsEditing(false);
  }, [setIsEditing]);

  const handleEditClick = useCallback(() => {
    setIsEditing(!isEditing);
  }, [isEditing, setIsEditing]);

  const handleMotionClick = useCallback(() => {
    if (!isOpen) {
      setIsOpen(true);
    }
  }, [isOpen]);

  const { isMobile, viewportHeight } = useIsMobile();

  const addEditActionToChildren = useCallback(
    (child: ReactNode): ReactNode => {
      if (!isValidElement(child)) return child;

      const element = child as ReactElement<Record<string, unknown>>;

      if (element.props && "data-edit-button" in element.props) {
        return cloneElement(element, {
          ...element.props,
          onClick: handleEditClick,
        });
      }

      const children = element.props?.children;
      if (children && (isValidElement(children) || Array.isArray(children))) {
        const processedChildren = Children.map(
          children as ReactNode,
          (nestedChild: ReactNode) => addEditActionToChildren(nestedChild),
        );
        return cloneElement(element, {
          ...element.props,
          children: processedChildren,
        });
      }

      return child;
    },
    [handleEditClick],
  );

  const variants = useMemo(
    () => ({
      mobile: {
        closed: {
          width: "100%",
          height: 24,
        },
        open: {
          width: "100%",
          height: viewportHeight - 75,
        },
      },
      desktop: {
        closed: {
          width: 40,
          height: "100%",
        },
        open: {
          width: 380,
          height: "100%",
        },
      },
    }),
    [viewportHeight],
  );

  const transition = useMemo(
    () => ({
      duration: 0.5,
      ease: [0.25, 0.45, 0.45, 1] as const,
      type: "tween" as const,
    }),
    [],
  );

  const containerVariants = isMobile ? variants.mobile : variants.desktop;

  const contentVariants = useMemo(
    () => ({
      hidden: {
        opacity: 0,
      },
      visible: {
        opacity: 1,
      },
    }),
    [],
  );

  return (
    <div className="bottom-0 left-0 z-20 w-full md:relative md:bottom-auto md:left-auto md:z-auto md:flex md:w-auto">
      <AnimatePresence mode="wait">
        {!isOpen && (
          <motion.div
            key="closed"
            onClick={handleMotionClick}
            className="box-border flex w-full cursor-pointer items-end justify-end rounded-t-2xl bg-white md:h-full md:items-start md:border-none md:bg-transparent"
            animate="closed"
            variants={containerVariants}
            initial="closed"
            exit="closed"
            transition={transition}
            role="button"
            tabIndex={0}
            aria-label="Show options"
            style={{ overflow: "hidden" }}
          >
            <motion.div
              className="flex h-full w-full flex-row-reverse items-start justify-center gap-2 md:h-full md:w-full md:items-start md:justify-center md:pt-20"
              variants={contentVariants}
              initial="visible"
              animate="visible"
            >
              <div className="flex gap-2 md:origin-center md:-rotate-90">
                <span className="text-md flex items-center justify-center font-light whitespace-nowrap text-gray-500">
                  Show options
                </span>
                <span
                  style={{ fontSize: "24px" }}
                  className="material-symbols-outlined -rotate-90 text-center text-gray-500 md:rotate-90"
                >
                  arrow_forward_ios
                </span>
              </div>
            </motion.div>
          </motion.div>
        )}

        {isOpen && (
          <motion.div
            key="open"
            className="absolute bottom-0 left-0 z-20 w-full md:relative md:bottom-auto md:left-auto md:z-auto"
            initial={{ opacity: 1 }}
            animate={{ opacity: 1 }}
            transition={transition}
          >
            <motion.div
              className="bg-muted box-border flex w-full items-end justify-start rounded-t-2xl border border-black/5 backdrop-blur-3xl md:h-full md:items-start md:justify-start md:rounded-2xl"
              animate="open"
              variants={containerVariants}
              initial="closed"
              exit="closed"
              transition={transition}
              style={{ overflow: "hidden" }}
            >
              <motion.div
                key="content"
                className={twMerge(
                  clsx(
                    "flex h-full w-full flex-col rounded-2xl rounded-t-2xl border border-black/5 md:h-full md:rounded-2xl",
                    classNameOpenedSection,
                  ),
                )}
                variants={contentVariants}
                initial="hidden"
                animate="visible"
                exit="hidden"
                transition={transition}
              >
                {!isEditing && (
                  <motion.div
                    className="mb-5.5 flex flex-shrink-0 place-items-center justify-between px-2"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={transition}
                  >
                    <span className="text-2xl font-semibold">{title}</span>
                    <button
                      className="material-symbols-outlined cursor-pointer border-none font-bold text-gray-500 transition-colors duration-200 hover:text-gray-700"
                      onClick={handleClose}
                      aria-label="Close options"
                      type="button"
                    >
                      {!isMobile && (
                        <span
                          style={{ fontSize: "20px" }}
                          className="material-symbols-outlined"
                        >
                          arrow_back_ios_new
                        </span>
                      )}
                      {isMobile && (
                        <span
                          style={{ fontSize: "24px" }}
                          className="material-symbols-outlined"
                        >
                          close
                        </span>
                      )}
                    </button>
                  </motion.div>
                )}
                {isEditing && (
                  <motion.div
                    className="mb-5.5 flex flex-shrink-0 place-items-center justify-between px-2"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={transition}
                  >
                    <button
                      className="material-symbols-outlined cursor-pointer border-none p-1 text-gray-500 transition-colors duration-200 hover:text-gray-700"
                      onClick={handleEditClick}
                      aria-label="Back to options"
                      type="button"
                      style={{ fontSize: "20px" }}
                    >
                      arrow_back_ios_new
                    </button>
                    <span className="text-lg font-semibold">{titleEdit}</span>
                    <div className="h-8 w-8"></div>
                  </motion.div>
                )}
                <motion.div
                  className="min-h-0 flex-1 overflow-auto"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={transition}
                >
                  <div className="box-border h-full w-full">
                    <motion.div
                      className="box-border w-full rounded-t-none rounded-b-2xl"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={transition}
                    >
                      {!isEditing
                        ? addEditActionToChildren(children[0])
                        : children[1]}
                    </motion.div>
                  </div>
                </motion.div>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
