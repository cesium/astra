import { ToolbarProps, View } from "react-big-calendar";

import { motion } from "motion/react";
import { useDictionary } from "@/providers/dictionary-provider";

export type CustomView = View | "feed";

export default function CustomToolbar(toolbar: ToolbarProps) {
  const dict = useDictionary();
  const goToBack = () => toolbar.onNavigate("PREV");
  const goToNext = () => toolbar.onNavigate("NEXT");
  const goToToday = () => toolbar.onNavigate("TODAY");

  const label = toolbar.label;
  const currentView = toolbar.view as CustomView;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-center gap-4 lg:hidden">
        <button
          className="material-symbols-outlined text-dark/30 hover:text-dark/50 cursor-pointer text-2xl transition-all duration-200 ease-in-out hover:-translate-x-0.5"
          onClick={goToBack}
        >
          arrow_back
        </button>
        <span className="font-semibold select-none">{label}</span>
        <button
          className="material-symbols-outlined text-dark/30 hover:text-dark/50 cursor-pointer text-2xl transition-all duration-200 ease-in-out hover:translate-x-0.5"
          onClick={goToNext}
        >
          arrow_forward
        </button>
      </div>

      <div className="mb-4.5 flex items-center justify-center gap-4 p-0.5 lg:justify-between">
        <button
          className="text-primary-400 bg-primary-400/20 hover:ring-primary-400/40 shadow-primary-400/15 inline-flex cursor-pointer items-center gap-2 rounded-full px-4 py-1.5 transition-all duration-200 ease-in-out hover:shadow-md hover:ring-1 lg:mr-38.5"
          onClick={goToToday}
        >
          {dict.calendar.navigation.today}
        </button>

        <div className="hidden items-center justify-between lg:flex">
          <button
            className="material-symbols-outlined text-dark/30 hover:text-dark/50 cursor-pointer px-4 text-2xl transition-all duration-200 ease-in-out hover:-translate-x-0.5"
            onClick={goToBack}
          >
            arrow_back
          </button>
          <span className="font-semibold select-none">{label}</span>
          <button
            className="material-symbols-outlined text-dark/30 hover:text-dark/50 cursor-pointer px-4 text-2xl transition-all duration-200 ease-in-out hover:translate-x-0.5"
            onClick={goToNext}
          >
            arrow_forward
          </button>
        </div>

        <div className="flex h-8.5 items-center gap-0.5 rounded-full bg-gray-100">
          {[
            `${dict.calendar.views.month}`,
            `${dict.calendar.views.week}`,
            `${dict.calendar.views.feed}`,
            `${dict.calendar.views.day}`,
          ].map((viewName) => (
            <button
              key={viewName}
              onClick={() => toolbar.onView(viewName as View)}
              className={`relative ${viewName === "week" ? "hidden md:inline-flex" : "inline-flex"} ${viewName === "feed" ? "inline-flex md:hidden" : ""} cursor-pointer items-center gap-2 rounded-full px-4 py-1.5 transition-colors duration-200 ease-in-out ${
                currentView === viewName
                  ? "text-white"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              {currentView === viewName && (
                <motion.div
                  layoutId="activeTab"
                  transition={{
                    type: "spring",
                    bounce: 0.2,
                    duration: 0.6,
                  }}
                  className="bg-dark absolute inset-0 rounded-full shadow-sm"
                />
              )}
              <p className="relative z-10">
                {viewName.charAt(0).toUpperCase() + viewName.slice(1)}
              </p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
