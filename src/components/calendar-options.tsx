"use client";

import { useContext } from "react";
import TabsGroup, {
  PanelContainer,
  Tab,
  TabPanel,
  TabsContainer,
} from "./tabs";
import { CalendarContext } from "@/contexts/calendar-provider";

function CourseTag({ name }: { name: string }) {
  return <div className="bg-dark/5 rounded-2xl px-3 py-1.5">{name}</div>;
}

function DisplayCourses() {
  return (
    <div className="divide-dark/8 space-y-2 divide-y rounded-lg bg-white pt-3 pl-4">
      <div className="flex flex-col gap-2 pb-3">
        <div className="inline-flex items-center">
          <div className="mr-2 ml-1 h-3 w-1.5 rounded-full bg-blue-200" />
          <p className="max-w-2xs truncate">Análise</p>
        </div>
        <div className="flex gap-2">
          <CourseTag name="TP1" />
          <CourseTag name="T2" />
        </div>
      </div>

      <div className="flex flex-col gap-2 pb-3">
        <div className="inline-flex items-center">
          <div className="mr-2 ml-1 h-3 w-1.5 rounded-full bg-blue-200" />
          <p className="max-w-2xs truncate">
            Elementos de Probabilidades e Teoria de Números
          </p>
        </div>
        <div className="flex gap-2">
          <CourseTag name="TP1" />
          <CourseTag name="T2" />
        </div>
      </div>

      <div className="flex flex-col gap-2 pb-3">
        <div className="inline-flex items-center">
          <div className="mr-2 ml-1 h-3 w-1.5 rounded-full bg-blue-200" />
          <p>Análise</p>
        </div>
        <div className="flex gap-2">
          <CourseTag name="TP1" />
          <CourseTag name="T2" />
        </div>
      </div>
    </div>
  );
}

export default function CalendarOptions() {
  const context = useContext(CalendarContext);

  const { isEditing, setIsEditing } = context;
  return (
    <section className="bg-muted/50 hidden w-lg flex-col px-4 pt-16.5 md:flex">
      <section>
        <div className="text-primary-400 mb-8 inline-flex space-x-3.5">
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
            <p>Export Schedule</p>
          </div>
        </div>

        <div className="space-y-2.5">
          <div className="flex items-center justify-between">
            <h3 className="text-2xl font-semibold">Schedule</h3>
            <p className="text-primary-400">Edit</p>
          </div>
          <p>Choose the courses and respective shifts you wish to attend.</p>

          <DisplayCourses />
        </div>
      </section>

      <section className="hidden">
        <TabsGroup defaultPanel="added" className="space-y-5">
          <TabsContainer>
            <Tab name="Adicionados" icon="format_list_bulleted" refTo="added" />
            <Tab name="Adicionar" icon="add_circle" refTo="add" />
          </TabsContainer>

          <PanelContainer>
            <TabPanel id="added">
              <h3 className="text-dark/50">Adicionados</h3>
              <button onClick={() => setIsEditing(!isEditing)}>EDit</button>
            </TabPanel>
            <TabPanel id="add">
              <h3 className="text-dark/50">Disponíveis para adicionar</h3>
            </TabPanel>
          </PanelContainer>
        </TabsGroup>
      </section>
    </section>
  );
}
