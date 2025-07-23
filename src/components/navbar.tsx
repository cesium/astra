"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { usePathname } from "next/navigation";

interface ITabProps {
  name: string;
  icon: string;
  href: string;
}

export default function Navbar() {
  const tabs = [
    { name: "Eventos", icon: "calendar_month", href: "/" },
    {
      name: "Calendário",
      icon: "schedule",
      href: "/calendar",
    },
    { name: "SWAP", icon: "sync_alt", href: "/swap" },
  ];

  const currentPage = usePathname();

  function Tab({ name, icon, href }: ITabProps) {
    return (
      <Link
        className={`inline-flex items-center gap-2 rounded-full px-4 py-2.5 transition-all duration-200 ease-in-out ${
          href === currentPage
            ? "bg-primary text-white shadow-sm"
            : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
        }`}
        href={href}
        aria-current={href === currentPage ? "page" : undefined}
      >
        <span className="material-symbols-outlined">{icon}</span>
        <p>{name}</p>
      </Link>
    );
  }

  return (
    <nav className="flex w-full justify-between px-8 py-4">
      {/* Logo */}
                <div className="flex items-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lucide lucide-bird-icon lucide-bird stroke-primary size-10"
            >
              <path d="M16 7h.01" />
              <path d="M3.4 18H12a8 8 0 0 0 8-8V7a4 4 0 0 0-7.28-2.3L2 20" />
              <path d="m20 7 2 .5-2 .5" />
              <path d="M10 18v3" />
              <path d="M14 17.75V21" />
              <path d="M7 18a6 6 0 0 0 3.84-10.61" />
            </svg>
            <span className="text-2xl font-bold">pombo</span>
          </div>

      <menu className="bg-dark/5 flex h-13 items-center gap-0.5 rounded-full p-1">
        {tabs.map((tab) => (
          <Tab
            key={`Tab-${tab.name}`}
            name={tab.name}
            icon={tab.icon}
            href={tab.href}
          />
        ))}
      </menu>

      {/* User dropdown */}
      <div className="flex items-center justify-center px-4">Profile</div>
    </nav>
  );
}
