"use client";

import clsx from "clsx";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, createContext, useContext, useEffect } from "react";

interface IParentProps {
  children: React.ReactNode;
  className?: string;
}

interface ISideBarProps extends IParentProps {
  defaultSelected?: string;
}

interface ISideBarContextType {
  selected: string;
  setSelected: (selected: string) => void;
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
      className={`text-dark/50 mx-3 mb-2.5 border-b border-gray-200 pt-5 pb-3 ${className}`}
    >
      {children}
    </div>
  );
}

export function SidebarItemList({ children, className }: IParentProps) {
  return <div className={clsx(className, "flex flex-col gap-2")}>{children}</div>;
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
  const isSelected = selected === href;

  const commonClass = `flex group cursor-pointer items-center font-medium rounded-lg px-3 py-2.5 text-dark/50 transition-all duration-300 ease-in-out ${isSelected ? "bg-primary/10 text-primary ring-1 ring-primary/25" : "hover:bg-gray-100"} ${className || ""}`;

  return href ? (
    <Link
      id={id}
      href={href}
      onClick={() => setSelected(href)}
      className={commonClass}
      aria-current="page"
    >
      {children}
    </Link>
  ) : (
    <button
      id={id}
      onClick={() => {
        setSelected(id);
        onClick?.();
      }}
      className={commonClass}
      aria-pressed={isSelected}
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
  const currentPage = usePathname();

  const [selected, setSelected] = useState<string>(defaultSelected || "");

  useEffect(() => {
    if (!defaultSelected) setSelected(currentPage);
  }, [currentPage, defaultSelected]);

  return (
    <div className="h-full px-0.5 py-2">
      <SideBarContext.Provider value={{ selected, setSelected }}>
        {children}
      </SideBarContext.Provider>
    </div>
  );
}
