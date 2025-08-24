"use client";

import { useContext } from "react";
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

//fixme: remove
const cadeirasTeste = [
  { name: "Análise", shifts: ["TP1", "T2"] },
  {
    name: "Elementos de Probabilidades e Teoria de Números",
    shifts: ["TP3", "T1"],
  },
  { name: "Laboratórios de Informática II", shifts: ["TP2", "T2"] },
  { name: "CeSIUM" },
  { name: "Feriados" },
];

function EditButton({ state }: { state: "add" | "remove" }) {
  return (
    <button
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
  shifts,
  isEditing,
  state,
}: {
  name: string;
  shifts: string[] | undefined;
  isEditing: boolean;
  state?: "add" | "remove";
}) {
  return (
    <div className={twMerge(clsx("flex flex-col pb-3", shifts && "gap-2"))}>
      <div className="inline-flex items-center pr-4">
        <div className="mr-2 h-3 w-1.5 rounded-full bg-blue-200" />
        <p className="max-w-2xs flex-1 truncate">{name}</p>
        {!shifts && isEditing && <EditButton state={state!} />}
      </div>
      <div className="flex gap-2">
        {shifts &&
          shifts.map((shift) => (
            <ShiftTag
              key={shift}
              name={shift}
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
  isEditing,
  state,
}: {
  name: string;
  isEditing: boolean;
  state: "add" | "remove";
}) {
  return (
    <div
      className={twMerge(
        clsx(
          "bg-dark/5 inline-flex items-center gap-2.5 rounded-2xl py-1.5",
          isEditing ? "pr-1 pl-3" : "px-3",
        ),
      )}
    >
      <p>{name}</p>
      {isEditing && <EditButton state={state} />}
    </div>
  );
}

function DisplayCourses({
  isEditing = false,
  state,
}: {
  schedule?: boolean;
  isEditing?: boolean;
  state?: "add" | "remove";
}) {
  return (
    <div className="divide-dark/8 bg-light w-full space-y-2 divide-y rounded-lg pt-3 pl-4">
      {cadeirasTeste.map((course, index) => (
        <EventHeader
          key={`${course}-${index}`}
          name={course.name}
          shifts={course.shifts}
          isEditing={isEditing}
          state={state}
        />
      ))}
    </div>
  );
}

export default function CalendarOptions({
  schedule = false,
}: {
  schedule?: boolean;
}) {
  const context = useContext(CalendarContext);

  return (
    <AnimatedOptionsSection classNameOpenedSection="p-4">
      <section>
        <div className="text-primary-400 mb-8 inline-flex space-x-3.5 px-2">
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

        <div className="space-y-2.5">
          <div className="px-2">
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

          <DisplayCourses schedule />
        </div>
      </section>

      <section className="flex flex-col items-center">
        <TabsGroup
          defaultPanel="added"
          className="flex w-full flex-col items-center space-y-5"
        >
          <TabsContainer>
            <Tab name="Adicionados" icon="format_list_bulleted" refTo="added" />
            <Tab name="Adicionar" icon="add_circle" refTo="add" />
          </TabsContainer>

          <PanelContainer className="w-full self-start">
            <TabPanel id="added">
              <h3 className="text-dark/50">Adicionados</h3>
              <DisplayCourses isEditing state="remove" />
            </TabPanel>
            <TabPanel id="add">
              <h3 className="text-dark/50">Disponíveis para adicionar</h3>
              <DisplayCourses isEditing state="add" />
            </TabPanel>
          </PanelContainer>
        </TabsGroup>
      </section>
    </AnimatedOptionsSection>
  );
}
