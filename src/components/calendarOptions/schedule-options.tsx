"use client";

import { useContext } from "react";
import TabsGroup, {
  PanelContainer,
  Tab,
  TabPanel,
  TabsContainer,
} from "../tabs";
import { ScheduleContext } from "@/contexts/schedule-provider";
import AnimatedOptionsSection from "../animated-options-section";

import DisplayShifts from "./schedule/display-shifts";

export default function CalendarOptions() {
  const context = useContext(ScheduleContext);

  const {
    originalSchedule,
    currentSchedule,
    editingShifts,
    shiftsToAdd,
    sortShiftsByYearCourse,
    removeShift,
    addShift,
    saveChanges,
    hasChanges,
    setEditingShifts,
  } = context;

  return (
    <AnimatedOptionsSection classNameOpenedSection="p-4 flex flex-col h-full">
      <section className="box-border flex h-full min-h-0 flex-1 flex-col">
        <div className="flex h-full min-h-0 flex-1 flex-col space-y-2.5">
          <div className="flex-shrink-0 px-2">
            <div className="flex items-center justify-between">
              <h3 className="text-2xl font-semibold">
                Schedule
              </h3>
              <button
                data-edit-button
                className="text-primary-400 cursor-pointer transition duration-300 hover:opacity-70"
              >
                Edit
              </button>
            </div>
            <p>
              Choose the courses and respective shifts you wish to attend.
            </p>
          </div>

          <div className="h-full min-h-0">
            <DisplayShifts
              shiftsSorted={sortShiftsByYearCourse(currentSchedule)}
              onAdd={addShift}
              onRemove={removeShift}
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
            <Tab name="Selected" icon="format_list_bulleted" refTo="added" />
            <Tab name="Add New" icon="add_circle" refTo="add" />
          </TabsContainer>

          <PanelContainer className="min-h-0 w-full flex-1 self-start">
            <TabPanel id="added" className="flex h-full min-h-0 flex-col">
              <h3 className="text-dark/50 mb-4 flex-shrink-0 pl-3">
                Already Selected
              </h3>

              <div className="mb-3 space-x-3 px-2">
                <button
                  onClick={() => {
                    setEditingShifts([]);
                  }}
                  className="text-danger group inline-flex cursor-pointer items-center gap-1 transition-all duration-300 hover:opacity-75"
                >
                  <span className="material-symbols-outlined text-xl transition-all duration-300 group-hover:-rotate-20">
                    delete
                  </span>
                  Clear
                </button>

                <button
                  onClick={() => {
                    setEditingShifts(originalSchedule);
                  }}
                  className="group inline-flex cursor-pointer items-center gap-1 text-[#625FEE] transition-all duration-300 hover:opacity-75"
                >
                  <span className="material-symbols-outlined text-xl transition-all duration-300 group-hover:-rotate-20">
                    autorenew
                  </span>
                  Reset
                </button>
              </div>

              <div className="relative min-h-0 flex-1">
                <DisplayShifts
                  isEditing
                  shiftsSorted={sortShiftsByYearCourse(editingShifts)}
                  state="remove"
                  onAdd={addShift}
                  onRemove={removeShift}
                />
                {hasChanges && (
                  <div className="absolute bottom-0 z-10 flex h-20 w-full items-center justify-center">
                    <button
                      onClick={saveChanges}
                      className="bg-primary-400 text-light w-44 cursor-pointer rounded-full px-2 py-4 font-semibold transition-transform duration-200 hover:scale-95"
                    >
                      Save
                    </button>
                  </div>
                )}
              </div>
            </TabPanel>
            <TabPanel id="add" className="flex h-full min-h-0 flex-col">
              <h3 className="text-dark/50 mb-4 flex-shrink-0 pl-3">
                Available to add
              </h3>

              <div className="mb-3 space-x-3 px-2">
                <button
                  onClick={() => {
                    setEditingShifts([]);
                  }}
                  className="text-danger group inline-flex cursor-pointer items-center gap-1 transition-all duration-300 hover:opacity-75"
                >
                  <span className="material-symbols-outlined text-xl transition-all duration-300 group-hover:-rotate-20">
                    delete
                  </span>
                  Clear
                </button>

                <button
                  onClick={() => {
                    setEditingShifts(originalSchedule);
                  }}
                  className="group inline-flex cursor-pointer items-center gap-1 text-[#625FEE] transition-all duration-300 hover:opacity-75"
                >
                  <span className="material-symbols-outlined text-xl transition-all duration-300 group-hover:-rotate-20">
                    autorenew
                  </span>
                  Reset
                </button>
              </div>

              <div className="relative h-full min-h-0">
                <DisplayShifts
                  isEditing
                  shiftsSorted={sortShiftsByYearCourse(shiftsToAdd)}
                  state="add"
                  onAdd={addShift}
                  onRemove={removeShift}
                />
                {hasChanges && (
                  <div className="absolute bottom-0 z-10 flex h-20 w-full items-center justify-center">
                    <button
                      onClick={saveChanges}
                      className="bg-primary-400 text-light w-44 cursor-pointer rounded-full px-2 py-4 font-semibold transition-transform duration-200 hover:scale-95"
                    >
                      Save
                    </button>
                  </div>
                )}
              </div>
            </TabPanel>
          </PanelContainer>
        </TabsGroup>
      </section>
    </AnimatedOptionsSection>
  );
}
