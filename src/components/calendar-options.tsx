"use client";

import { useContext, useRef, useState, createContext, useEffect } from "react";
import TabsGroup, {
  PanelContainer,
  Tab,
  TabPanel,
  TabsContainer,
} from "./tabs";
import { CalendarContext } from "@/contexts/calendar-provider";
import AnimatedOptionsSection from "./animated-options-section";
import { twMerge } from "tailwind-merge";
import clsx from "clsx";
import { IShiftsSorted } from "@/lib/types";

import CustomDisclosure from "./disclosure";

interface ICalendarOptionsProvider {
  removeShift: (id: string) => void;
  addShift: (id: string) => void;
}

function EditButton({
  state,
  id,
  schedule = false,
}: {
  state: "add" | "remove";
  id?: string;
  schedule?: boolean;
}) {
  const { addShift, removeShift } = useContext(CalendarOptionsContext);

  return (
    <button
      onClick={
        schedule && state === "add"
          ? () => addShift(id!)
          : () => removeShift(id!)
      }
      className={twMerge(
        clsx(
          "text-light material-symbols-outlined cursor-pointer rounded-full p-0.5 font-semibold transition-all duration-250 hover:p-1",
          state === "add" ? "bg-success" : "bg-danger",
        ),
      )}
    >
      {state === "add" ? "add" : "remove"}
    </button>
  );
}

function EventHeader({
  name,
  color,
  shifts,
  isEditing,
  state,
}: {
  name: string;
  color: string;
  shifts: {
    id: string;
    name: string;
  }[];
  isEditing: boolean;
  state?: "add" | "remove";
}) {
  return (
    <div className={twMerge(clsx("flex flex-col pb-3", shifts && "gap-2"))}>
      <div className="inline-flex items-center pr-4">
        <div
          className="mr-2 h-3 w-1.5 rounded-full"
          style={{ backgroundColor: color }}
        />
        <p className="max-w-2xs flex-1 truncate">{name}</p>
        {!shifts && isEditing && <EditButton state={state!} />}
      </div>
      <div className="flex w-fit flex-wrap gap-2">
        {shifts &&
          shifts.map((shift) => (
            <ShiftTag
              key={shift.id}
              name={shift.name}
              id={shift.id}
              isEditing={isEditing}
              state={state!}
            />
          ))}
      </div>
    </div>
  );
}

function ShiftTag({
  name,
  id,
  isEditing,
  state,
}: {
  name: string;
  id: string;
  isEditing: boolean;
  state: "add" | "remove";
}) {
  return (
    <div
      className={twMerge(
        clsx(
          "bg-dark/5 inline-flex w-fit items-center gap-2.5 rounded-2xl py-1.5",
          isEditing ? "pr-1 pl-3" : "px-3",
        ),
      )}
    >
      <p>{name}</p>
      {isEditing && <EditButton schedule id={id} state={state} />}
    </div>
  );
}

function DisplayCourses({
  shiftsSorted,
  isEditing = false,
  state,
}: {
  shiftsSorted: IShiftsSorted;
  isEditing?: boolean;
  state?: "add" | "remove";
}) {
  const [isScrolledTop, setIsScrolledTop] = useState(true);
  const [isScrolledBottom, setIsScrolledBottom] = useState(false);
  const scrollableRef = useRef<HTMLDivElement>(null);

  // Handle scroll events to determine if the user is at the top or bottom
  const handleScroll = () => {
    if (scrollableRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = scrollableRef.current;

      const isTop = scrollableRef.current.scrollTop === 0;
      setIsScrolledTop(isTop);
      const isBottom = scrollTop + clientHeight >= scrollHeight;
      const hasOverflow = scrollHeight > clientHeight;
      setIsScrolledBottom(isBottom || !hasOverflow);
    }
  };

  // Check scroll state on mount and when content changes
  useEffect(() => {
    handleScroll();
  }, [shiftsSorted]);

  if (!(shiftsSorted.length > 0)) {
    return (
      <div className="text-dark/50 flex h-full justify-center pt-40">
        There are no shifts to be displayed
      </div>
    );
  } else if (state === "add") {
    return (
      <div className="h-full overflow-y-scroll">
        {shiftsSorted.map((yearGroup) => (
          <CustomDisclosure
            disclosureChild
            label={`${yearGroup.year}º Ano`}
            key={`${yearGroup.year}º Ano`}
          >
            <div className="mt-1 ml-4 h-full w-full">
              {Object.entries(yearGroup.semesters).map(
                ([semester, courses]) => (
                  <CustomDisclosure
                    label={`${semester}º Semestre`}
                    key={`${semester}º Semestre`}
                  >
                    <div
                      className="divide-dark/8 bg-light w-full space-y-2 divide-y rounded-lg pt-3 pl-4"
                      onScroll={handleScroll}
                      ref={scrollableRef}
                    >
                      {Object.entries(courses).map(([courseID, courseData]) => (
                        <EventHeader
                          key={courseID}
                          name={courseData.courseName}
                          color={courseData.color}
                          shifts={courseData.shifts}
                          isEditing={isEditing}
                          state={state}
                        />
                      ))}
                    </div>
                  </CustomDisclosure>
                ),
              )}
            </div>
          </CustomDisclosure>
        ))}
      </div>
    );
  } else {
    return (
      <div className="relative h-full min-h-0">
        {!isScrolledTop && (
          <div className="pointer-events-none absolute top-0 right-0 left-0 z-10 hidden h-12 bg-gradient-to-b from-red-400 to-transparent md:block" />
        )}

        <div
          className="divide-dark/8 bg-light max-h-full w-full space-y-2 divide-y overflow-y-scroll rounded-lg pt-3 pl-4"
          onScroll={handleScroll}
          ref={scrollableRef}
        >
          {shiftsSorted.map((yearGroup) =>
            Object.entries(yearGroup.semesters).map(([, courses]) =>
              Object.entries(courses).map(([courseID, courseData]) => (
                <EventHeader
                  key={courseID}
                  name={courseData.courseName}
                  color={courseData.color}
                  shifts={courseData.shifts}
                  isEditing={isEditing}
                  state={state}
                />
              )),
            ),
          )}
        </div>

        {!isScrolledBottom && (
          <div className="pointer-events-none absolute right-0 bottom-0 left-0 z-10 hidden h-12 bg-gradient-to-t from-red-400 to-transparent md:block" />
        )}
      </div>
    );
  }
}

const CalendarOptionsContext = createContext<ICalendarOptionsProvider>({
  removeShift: () => {},
  addShift: () => {},
});

export default function CalendarOptions({
  schedule = false,
}: {
  schedule?: boolean;
}) {
  const context = useContext(CalendarContext);

  const {
    currentSchedule,
    editingShifts,
    shiftsToAdd,
    sortShiftsByYearCourse,
    removeShift,
    addShift,
  } = context;

  return (
    <CalendarOptionsContext.Provider value={{ removeShift, addShift }}>
      <AnimatedOptionsSection classNameOpenedSection="p-4 flex flex-col h-full">
        <section className="box-border flex h-full min-h-0 flex-1 flex-col">
          <div className="text-primary-400 mb-8 inline-flex flex-shrink-0 space-x-3.5 px-2">
            <div className="inline-flex space-x-2">
              <span className="material-symbols-outlined z-10 text-2xl">
                share
              </span>
              <p>Share</p>
            </div>
            <div className="inline-flex space-x-2">
              <span className="material-symbols-outlined z-10 text-2xl">
                download
              </span>
              <p>Export {schedule ? "Schedule" : "Calendar"}</p>
            </div>
          </div>

          <div className="flex h-full min-h-0 flex-1 flex-col space-y-2.5">
            <div className="flex-shrink-0 px-2">
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-semibold">
                  {schedule ? "Schedule" : "Calendar"}
                </h3>
                <button
                  data-edit-button
                  className="text-primary-400 cursor-pointer transition duration-300 hover:opacity-70"
                >
                  Edit
                </button>
              </div>
              <p>
                {schedule
                  ? "Choose the courses and respective shifts you wish to attend."
                  : "Choose the type of events you want to see on your calendar"}
              </p>
            </div>

            <div className="h-full min-h-0">
              <DisplayCourses
                shiftsSorted={sortShiftsByYearCourse(currentSchedule)}
              />
            </div>
          </div>
        </section>

        <section className="box-border flex h-full min-h-0 flex-1 flex-col items-center">
          <TabsGroup
            defaultPanel="added"
            layoutId="options"
            className="flex h-full w-full flex-col items-center space-y-5"
          >
            <TabsContainer>
              <Tab
                name="Adicionados"
                icon="format_list_bulleted"
                refTo="added"
              />
              <Tab name="Adicionar" icon="add_circle" refTo="add" />
            </TabsContainer>

            <PanelContainer className="min-h-0 w-full flex-1 self-start">
              <TabPanel id="added" className="flex h-full min-h-0 flex-col">
                <h3 className="text-dark/50 mb-4 flex-shrink-0">Adicionados</h3>
                <div className="min-h-0 flex-1">
                  <DisplayCourses
                    isEditing
                    shiftsSorted={sortShiftsByYearCourse(editingShifts)}
                    state="remove"
                  />
                </div>
              </TabPanel>
              <TabPanel id="add" className="flex h-full min-h-0 flex-col">
                <h3 className="text-dark/50 mb-4 flex-shrink-0">
                  Disponíveis para adicionar
                </h3>
                <div className="h-full min-h-0">
                  <DisplayCourses
                    isEditing
                    shiftsSorted={sortShiftsByYearCourse(shiftsToAdd)}
                    state="add"
                  />
                </div>
              </TabPanel>
            </PanelContainer>
          </TabsGroup>
        </section>
      </AnimatedOptionsSection>
    </CalendarOptionsContext.Provider>
  );
}
