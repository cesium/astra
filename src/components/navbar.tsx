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
      href: "/schedule",
    },
    { name: "SWAP", icon: "sync_alt", href: "/swap" },
  ];

  const currentPage = usePathname();

  function Tab({ name, icon, href }: ITabProps) {
    const isActive = href === currentPage;

    return (
      <Link
        className={`relative inline-flex items-center gap-2 rounded-full px-2 sm:px-4 py-1.5 sm:py-2.5 text-sm sm:text-base transition-colors duration-200 ease-in-out ${
          isActive ? "text-white" : "text-gray-600 hover:text-gray-900"
        }`}
        href={href}
        aria-current={isActive ? "page" : undefined}
      >
        {isActive && (
          <motion.div
            key={`tab-${href}`}
            layoutId="activeTab"
            transition={{
              type: "spring",
              bounce: 0.2,
              duration: 0.6,
            }}
            className="bg-primary absolute inset-0 rounded-full shadow-sm"
          />
        )}
        <span className="material-symbols-outlined relative z-10">{icon}</span>
        <p className="relative z-10">{name}</p>
      </Link>
    );
  }

  return (
    <nav className="flex w-full justify-center md:justify-between px-8 py-4">
      {/* Logo */}
      <div className="hidden md:flex items-center gap-2">
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

      <menu
        key={currentPage}
        className="flex h-fit sm:h-13 items-center gap-0.5 rounded-full bg-gray-100 p-1"
      >
        {tabs.map((tab) => (
          <Tab key={tab.href} name={tab.name} icon={tab.icon} href={tab.href} />
        ))}
      </menu>

      {/* User dropdown */}
      <div className="hidden md:flex items-center justify-center px-4">Profile</div>
    </nav>
  );
}
