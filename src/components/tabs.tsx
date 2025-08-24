"use client";

import clsx from "clsx";
import { motion } from "motion/react";
import React, { createContext, useContext, useState } from "react";
import { twMerge } from "tailwind-merge";

interface IBasicProps {
  children: React.ReactNode;
  className?: string;
}

interface ITabsContext {
  currentPanel: string;
  setCurrentPanel: (panel: string) => void;
}

interface ITabGroupProps extends IBasicProps {
  defaultPanel: string;
}

interface ITabProps {
  name: string;
  icon: string;
  refTo: string;
}

interface ITabPanelProps extends IBasicProps {
  id: string;
}

const TabsContext = createContext<ITabsContext | undefined>(undefined);

export function TabsContainer({ children, className }: IBasicProps) {
  return (
    <menu
      className={twMerge(
        clsx(
          "bg-dark/5 relative z-10 flex h-fit w-fit flex-row items-center gap-0.5 rounded-full p-1",
          className,
        ),
      )}
    >
      {children}
    </menu>
  );
}

export function Tab({ name, icon, refTo }: ITabProps) {
  const context = useContext(TabsContext);

  if (!context) {
    throw new Error("Tabs must be used within a TabGroup");
  }

  const { currentPanel, setCurrentPanel } = context;

  const isActive = refTo === currentPanel;

  return (
    <button
      className={`relative z-10 inline-flex w-fit cursor-pointer items-center gap-2 rounded-full px-4 py-2 transition-colors duration-200 ease-in-out ${
        isActive ? "text-white" : "text-gray-600 hover:text-gray-900"
      }`}
      onClick={() => setCurrentPanel(refTo)}
      aria-current={isActive ? "page" : undefined}
    >
      {isActive && (
        <motion.div
          layoutId="activeTabDesktop"
          transition={{
            type: "spring",
            bounce: 0.3,
            duration: 0.6,
          }}
          className="bg-primary-400 absolute inset-0 z-10 rounded-full shadow-sm"
        />
      )}
      <span className="material-symbols-outlined z-10 text-2xl">{icon}</span>
      <p className="z-10">{name}</p>
    </button>
  );
}

export function PanelContainer({ children, className }: IBasicProps) {
  return <div className={className}>{children}</div>;
}

export function TabPanel({ children, className, id }: ITabPanelProps) {
  const context = useContext(TabsContext);

  if (!context) {
    throw new Error("TabPanels must be used within a TabsGroup");
  }

  const { currentPanel } = context;

  if (currentPanel === id) {
    return <div className={className}>{children}</div>;
  }
}

export default function TabsGroup({
  children,
  className,
  defaultPanel,
}: ITabGroupProps) {
  const [currentPanel, setCurrentPanel] = useState<string>(defaultPanel);

  return (
    <div className={className}>
      <TabsContext.Provider value={{ currentPanel, setCurrentPanel }}>
        {children}
      </TabsContext.Provider>
    </div>
  );
}
