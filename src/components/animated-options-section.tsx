"use client";
import { motion } from "motion/react";
import React, {
  cloneElement,
  ReactNode,
  useState,
  isValidElement,
  ReactElement,
  useEffect,
  useCallback,
  useMemo,
} from "react";

interface IAnimatedOptionsSection {
  children: [ReactNode, ReactNode];
  title?: string;
  titleEdit?: string;
  classNameOpenedSection?: string;
}

export default function AnimatedOptionsSection({
  children,
  title = "Opções",
  titleEdit = "Editar Opções",
  classNameOpenedSection,
}: IAnimatedOptionsSection) {
  const [isOpen, setIsOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const handleClose = useCallback(() => {
    setIsOpen(false);
    setIsEditing(false);
  }, []);

  const handleEditClick = useCallback(() => {
    setIsEditing((prev) => !prev);
  }, []);

  const handleMotionClick = useCallback(() => {
    if (!isOpen) {
      setIsOpen(true);
    }
  }, [isOpen]);

  const useIsMobile = () => {
    const [isMobile, setIsMobile] = useState(false);
    const [viewportHeight, setViewportHeight] = useState(0);

    useEffect(() => {
      const updateSizes = () => {
        setIsMobile(window.innerWidth < 800);
        setViewportHeight(window.innerHeight);
      };

      updateSizes();
      window.addEventListener("resize", updateSizes);
      return () => window.removeEventListener("resize", updateSizes);
    }, []);

    return { isMobile, viewportHeight };
  };

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
        const processedChildren = React.Children.map(
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
          height: 80,
        },
        open: {
          width: "100%",
          height: viewportHeight - 75,
        },
      },
      desktop: {
        closed: {
          width: 60,
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

  const isClosed = !isOpen;

  return (
    <div
      className={`${isMobile ? "fixed bottom-0 left-0 z-20 w-full" : "flex"} ${!isOpen && isMobile ? "bg-white" : ""}`}
    >
      <motion.div
        onClick={handleMotionClick}
        className={`${isMobile ? "w-full" : "h-full"} flex ${isMobile ? "items-end" : "items-start"} box-border justify-end ${!isOpen ? "cursor-pointer" : isMobile ? "justify-start" : "justify-start rounded-2xl"} ${isMobile ? "rounded-t-2xl" : ""} ${isOpen ? (isMobile ? "bg-muted/50 border border-black/5 backdrop-blur-3xl" : "bg-muted/50 border border-black/5 backdrop-blur-3xl") : ""}`}
        animate={isOpen ? "open" : "closed"}
        variants={containerVariants}
        initial="closed"
        transition={transition}
        role={isClosed ? "button" : undefined}
        tabIndex={isClosed ? 0 : undefined}
        aria-label={isClosed ? "Abrir opções" : undefined}
        style={{ overflow: "hidden" }}
      >
        {isClosed && (
          <motion.div
            className={`flex gap-2 ${isMobile ? "h-20 w-full flex-row-reverse items-start justify-center" : "h-full w-full items-start justify-center pt-20"}`}
            variants={contentVariants}
            initial="visible"
            animate="visible"
          >
            <div
              className={`flex gap-2 ${isMobile ? "" : "origin-center -rotate-90"}`}
            >
              <span className="text-md flex items-center justify-center font-light whitespace-nowrap text-gray-500">
                Abrir opções
              </span>
              <span
                style={{ fontSize: "24px" }}
                className={`material-symbols-outlined text-center text-gray-500 ${isMobile ? "-rotate-90" : "rotate-90"}`}
              >
                arrow_forward_ios
              </span>
            </div>
          </motion.div>
        )}

        {isOpen && (
          <motion.div
            key="content"
            className={`${isMobile ? "h-full w-full rounded-t-2xl" : "h-full rounded-2xl"} flex w-full flex-col ${classNameOpenedSection || ""} ${isOpen ? "rounded-2xl border border-black/5" : ""}`}
            variants={contentVariants}
            initial="hidden"
            animate="visible"
            transition={transition}
          >
            {!isEditing && (
              <motion.div
                className="flex flex-shrink-0 place-items-center justify-between p-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={transition}
              >
                <span className="text-2xl font-semibold">{title}</span>
                <button
                  className="material-symbols-outlined cursor-pointer border-none p-1 font-bold text-gray-500 transition-colors duration-200 hover:text-gray-700"
                  onClick={handleClose}
                  aria-label="Fechar opções"
                  type="button"
                  style={{ fontSize: "20px" }}
                >
                  arrow_back_ios_new
                </button>
              </motion.div>
            )}

            {isEditing && (
              <motion.div
                className="flex flex-shrink-0 place-items-center justify-between p-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={transition}
              >
                <button
                  className="material-symbols-outlined cursor-pointer border-none p-1 text-gray-500 transition-colors duration-200 hover:text-gray-700"
                  onClick={handleEditClick}
                  aria-label="Voltar às opções"
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
        )}
      </motion.div>
    </div>
  );
}
