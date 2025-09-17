import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ExchangeListbox from "./utils/listbox";
import {
  useGetAllCourses,
  useGetStudentOriginalSchedule,
} from "@/lib/queries/courses";
import { useCreateExchange } from "@/lib/mutations/exchange";
import clsx from "clsx";
import { twMerge } from "tailwind-merge";
import { ICourse } from "@/lib/types";

const getShortShiftType = (shiftType: string) => {
  switch (shiftType) {
    case "theoretical":
      return "T";
    case "theoretical_practical":
      return "TP";
    case "practical_laboratory":
      return "PL";
    case "tutorial_guidance":
      return "TG";
    default:
      return shiftType;
  }
};

export default function AddExchangeContent({
  setModalState,
}: {
  setModalState: (state: boolean) => void;
}) {
  const { data: originalCourses } = useGetStudentOriginalSchedule();
  const { data: allCourses } = useGetAllCourses();
  const createExchange = useCreateExchange();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [isGoingBack, setIsGoingBack] = useState(false);
  
  const normalCourses: ICourse[] = originalCourses
    ? originalCourses.filter((course) => course.courses.length === 0)
    : [];

  const ucs =
    normalCourses?.map((course) => ({ id: course.id, name: course.name })) ||
    [];
  const [selectedUC, setSelectedUC] = useState("");

  const shiftsTypesToTrade = originalCourses
    ? [
        ...new Set(
          originalCourses
            .filter((course) => course.id === selectedUC)
            .flatMap((course) =>
              course.shifts.map((shift) => getShortShiftType(shift.type)),
            ),
        ),
      ].map((shiftType) => ({ id: shiftType, name: shiftType }))
    : [];

  const [selectedShift, setSelectedShift] = useState("");

  const shiftsToLeave = useMemo(() => {
    return originalCourses
      ? originalCourses
          .filter((course) => course.id === selectedUC)
          .flatMap((course) => course.shifts)
          .filter((shift) => getShortShiftType(shift.type) === selectedShift)
          .map((shift) => ({
            id: shift.id,
            name: `${getShortShiftType(shift.type)}${shift.number}`,
          }))
      : [];
  }, [originalCourses, selectedUC, selectedShift]);
  const [selectedShiftFrom, setSelectedShiftFrom] = useState("");

  const shiftsToJoin = useMemo(() => {
    return allCourses
      ? allCourses
          .filter((course) => course.id === selectedUC)
          .flatMap((course) => course.shifts)
          .filter((shift) => getShortShiftType(shift.type) === selectedShift)
          .filter((shift) => shift.id !== selectedShiftFrom)
          .map((shift) => ({
            id: shift.id,
            name: `${getShortShiftType(shift.type)}${shift.number}`,
          }))
      : [];
  }, [allCourses, selectedUC, selectedShift, selectedShiftFrom]);

  const [selectedShiftTo, setSelectedShiftTo] = useState("");

  useEffect(() => {
    if (!selectedShiftFrom && shiftsToLeave.length) {
      setSelectedShiftFrom(shiftsToLeave[0].id);
    }
    if (!selectedShiftTo && shiftsToJoin.length) {
      setSelectedShiftTo(shiftsToJoin[0].id);
    }
  }, [
    selectedUC,
    selectedShift,
    shiftsToLeave,
    shiftsToJoin,
    selectedShiftFrom,
    selectedShiftTo,
  ]);

  useEffect(() => {
    setSelectedShift("");
    setSelectedShiftFrom("");
    setSelectedShiftTo("");
  }, [selectedUC]);

  useEffect(() => {
    if (shiftsToLeave.length === 1) {
      setSelectedShiftFrom(shiftsToLeave[0].id);
    } else {
      setSelectedShiftFrom("");
    }
    setSelectedShiftTo("");
  }, [selectedShift, shiftsToLeave]);

  const handleCreateRequest = () => {
    setErrorMessage(null);

    if (!selectedShiftFrom || !selectedShiftTo) {
      setErrorMessage("Please select both shifts.");
      return;
    }

    setShowConfirmation(true);
  };

  const handleConfirmSubmit = () => {
    createExchange.mutate(
      { request: { shift_from: selectedShiftFrom, shift_to: selectedShiftTo } },
      {
        onSuccess: () => setModalState(false),
        onError: () => {
          setErrorMessage(
            "This exchange request already exists or an error occurred.",
          );
          setShowConfirmation(false);
        },
      },
    );
  };

  const handleCancel = () => {
    setIsGoingBack(true);
    setShowConfirmation(false);
    setErrorMessage(null);
  };

  const isFormFilled =
    !!selectedUC && !!selectedShift && !!selectedShiftFrom && !!selectedShiftTo;

  // Get selected course and shift names for confirmation display
  const selectedCourse = ucs.find(uc => uc.id === selectedUC);
  const selectedShiftFromName = shiftsToLeave.find(shift => shift.id === selectedShiftFrom)?.name;
  const selectedShiftToName = shiftsToJoin.find(shift => shift.id === selectedShiftTo)?.name;

  const slideVariants = {
    enter: { x: "100%", opacity: 0 },
    enterFromRight: { x: "100%", opacity: 0 },
    center: { x: 0, opacity: 1 },
    exit: { x: "-100%", opacity: 0 },
    exitToLeft: { x: "-100%", opacity: 0 },
    exitToRight: { x: "100%", opacity: 0 },
  };

  const transition = {
    type: "tween",
    ease: "easeInOut",
    duration: 0.3,
  };

  return (
    <div className="relative overflow-hidden h-[550px] flex flex-col justify-center">
      <AnimatePresence mode="wait">
        {!showConfirmation ? (
          <motion.div
            key="form"
            variants={slideVariants}
            initial={isGoingBack ? "exitToLeft" : "center"}
            animate="center"
            exit="exit"
            transition={transition}
            className="flex flex-col gap-4"
            onAnimationComplete={() => setIsGoingBack(false)}
          >
            <div className="flex flex-col gap-2">
              <h2 className="px-2 py-1 text-sm font-semibold">
                Select the curricular unit
              </h2>
              <ExchangeListbox
                selectedItem={selectedUC}
                setSelectedItem={setSelectedUC}
                collection={ucs}
                arrowDown
              />
              <h2 className="px-2 py-1 text-sm font-semibold">
                Select the shift type
              </h2>
              <ExchangeListbox
                selectedItem={selectedShift}
                setSelectedItem={setSelectedShift}
                collection={shiftsTypesToTrade}
                arrowDown
              />
            </div>

            <div className="flex flex-col justify-center gap-4">
              <h2 className="px-2 text-sm font-semibold">
                Select your preferred shift
              </h2>
              <div className="flex w-full flex-col items-center gap-4 sm:flex-row">
                <div className="w-1/2">
                  <ExchangeListbox
                    selectedItem={selectedShiftFrom}
                    setSelectedItem={setSelectedShiftFrom}
                    collection={shiftsToLeave}
                    rounded
                    label="Current shift"
                  />
                </div>
                <span
                  className="material-symbols-outlined rotate-90 sm:rotate-0"
                  style={{ fontSize: "28px" }}
                >
                  arrow_forward
                </span>
                <div className="w-1/2">
                  <ExchangeListbox
                    selectedItem={selectedShiftTo}
                    setSelectedItem={setSelectedShiftTo}
                    collection={shiftsToJoin}
                    rounded
                    label="Preferred shift"
                    highlightText
                  />
                </div>
              </div>
            </div>

            {errorMessage && (
              <p className="text-danger mt-2 text-center text-sm">{errorMessage}</p>
            )}

            <p className="text-center text-sm text-black/50">
              You will be notified if the request is fulfilled successfully.
            </p>

            <button
              onClick={handleCreateRequest}
              disabled={!isFormFilled}
              className={twMerge(
                clsx(
                  "bg-celeste mt-4 cursor-pointer rounded-lg px-4 py-2 text-white/90 transition-all duration-150 select-none",
                  !isFormFilled
                    ? "cursor-not-allowed opacity-50"
                    : "hover:bg-celeste/80",
                ),
              )}
            >
              Create request
            </button>
          </motion.div>
        ) : (
          <motion.div
            key="confirmation"
            custom={true}
            variants={slideVariants}
            initial="enterFromRight"
            animate="center"
            exit="exitToRight"
            transition={transition}
            className="flex flex-col gap-6 py-4"
          >
            <div className="text-center">
              <h2 className="text-lg font-semibold mb-2">
                Confirm Exchange Request
              </h2>
              <p className="text-sm text-black/70 mb-4">
                Are you sure you want to place this request?
              </p>
            </div>

            <div className="bg-gray-50 rounded-lg p-4 space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-600">Course:</span>
                <span className="text-sm">{selectedCourse?.name}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-600">From:</span>
                <span className="text-sm">{selectedShiftFromName}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-600">To:</span>
                <span className="text-sm font-medium text-celeste">{selectedShiftToName}</span>
              </div>
            </div>

            <p className="text-center text-xs text-black/50">
              You will be notified if the request is fulfilled successfully.
            </p>

            <div className="flex gap-3 mt-6">
              <button
                onClick={handleCancel}
                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg px-4 py-2 transition-all duration-150 text-sm font-medium cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmSubmit}
                className="flex-1 bg-celeste hover:bg-celeste/80 text-white/90 rounded-lg px-4 py-2 transition-all duration-150 text-sm font-medium cursor-pointer"
              >
                Confirm
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}