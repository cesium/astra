"use client";

import Link from "next/link";
import { useState, createContext, useContext } from "react";

interface IParentProps {
  children: React.ReactNode;
  className?: string;
}

interface ISideBarProps extends IParentProps {
  defaultSelected?: string;
}

interface ISideBarContextType {
  selected: string | null;
  setSelected: React.Dispatch<React.SetStateAction<string | null>>;
}

interface IItemProps extends IParentProps {
  id: string;
  href?: string;
  onClick?: () => void;
}

// Compound Components

const SideBarContext = createContext<ISideBarContextType | null>(null);

export function SidebarHeader({ children, className }: IParentProps) {
  return (
    <div
      className={`mx-3 mb-2.5 border-b border-gray-200 pt-5 pb-3 text-[#00000080] ${className}`}
    >
      {children}
    </div>
  );
}

export function SidebarItemList({ children, className }: IParentProps) {
  return <div className={`flex flex-col gap-2 ${className}`}>{children}</div>;
}

export function SidebarItem({
  children,
  className,
  id,
  href,
  onClick,
}: IItemProps) {
  const context = useContext(SideBarContext);

  if (!context) {
    throw new Error("Item must be used within a Sidebar");
  }

  const { selected, setSelected } = context;
  const isSelected = selected === id;

  const commonClass = `flex group cursor-pointer items-center font-medium rounded-lg px-3 py-2.5 text-dark/50 transition-all duration-300 ease-in-out ${isSelected ? "bg-primary/10 text-primary ring-1 ring-primary/25" : "hover:bg-gray-100"} ${className}`;

  return href ? (
    <Link
      href={href}
      onClick={() => setSelected(id)}
      className={commonClass}
      aria-current={isSelected ? "page" : undefined}
    >
      {children}
    </Link>
  ) : (
    <button
      onClick={() => {
        setSelected(id);
        onClick?.();
      }}
      className={commonClass}
      aria-current={isSelected ? "true" : "false"}
    >
      {children}
    </button>
  );
}

export function SidebarItemLabel({
  icon,
  label,
}: {
  icon: string;
  label: string;
}) {
  return (
    <div className="inline-flex gap-2">
      <span className="material-symbols-outlined-filled origin-center transition-all duration-200 ease-in-out group-hover:scale-105 group-hover:-rotate-12">
        {icon}
      </span>
      <p className="transition-all duration-200 ease-in-out group-hover:translate-x-1">
        {label}
      </p>
    </div>
  );
}

// Main Sidebar component
export default function Sidebar({ children, defaultSelected }: ISideBarProps) {
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
