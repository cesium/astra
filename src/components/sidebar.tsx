"use client";

import Link from "next/link";
import { useState, createContext, useContext } from "react";

interface ParentProps {
  children: React.ReactNode;
  className?: string;
}

interface SideBarProps extends ParentProps {
  defaultSelected?: string;
}

interface SideBarContextType {
  selected: string | null;
  setSelected: React.Dispatch<React.SetStateAction<string | null>>;
}

interface ItemProps extends ParentProps {
  id: string;
  href: string;
}

// Compound Components

const SideBarContext = createContext<SideBarContextType | null>(null);

export function SibebarHeader({ children, className }: ParentProps) {
  return (
    <div
      className={`mx-3 mb-2.5 border-b border-gray-200 pt-5 pb-3 text-[#00000080] ${className}`}
    >
      {children}
    </div>
  );
}

export function SidebarItemList({ children, className }: ParentProps) {
  return <div className={`flex flex-col gap-2 ${className}`}>{children}</div>;
}

export function SidebarItem({ children, className, id, href }: ItemProps) {
  const context = useContext(SideBarContext);

  if (!context) {
    throw new Error("Item must be used within a Sidebar");
  }

  const { selected, setSelected } = context;

  const isSelected = selected === id;

  return (
    <Link
      href={href}
      onClick={() => setSelected(id)}
      className={`group inline-flex cursor-pointer items-center gap-2 rounded-lg px-3 py-2.5 text-[#00000080] transition-all duration-300 ease-in-out ${isSelected ? "bg-[#EE77491A] text-[#EE7749] ring-1 ring-[#ee784971]" : "hover:bg-gray-100"} ${className}`}
    >
      {children}
    </Link>
  );
}

// Main Sidebar component
export default function Sidebar({ children, defaultSelected }: SideBarProps) {
  const [selected, setSelected] = useState<string | null>(
    defaultSelected || null,
  );

  return (
    <div className="h-full px-0.5 py-2">
      <SideBarContext.Provider value={{ selected, setSelected }}>
        {children}
      </SideBarContext.Provider>
    </div>
  );
}
