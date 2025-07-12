"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

interface ITabProps {
  id: string;
  name: string;
  icon: string;
  href: string;
}

export default function Navbar() {
  const tabs = [
    { id: "/", name: "Eventos", icon: "calendar_month", href: "/" },
    {
      id: "/calendar",
      name: "Calendário",
      icon: "schedule",
      href: "/calendar",
    },
    { id: "/swap", name: "SWAP", icon: "sync_alt", href: "/" },
  ];

  const currentPage = usePathname();

  function Tab({ id, name, icon, href }: ITabProps) {
    return (
      <Link
        className={`inline-flex items-center gap-2 rounded-full px-4 py-2.5 transition-all duration-200 ease-in-out ${
          id === currentPage
            ? "bg-primary text-white shadow-sm"
            : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
        }`}
        href={href}
        aria-current={id === currentPage ? "page" : undefined}
      >
        <span className="material-symbols-outlined">{icon}</span>
        <p>{name}</p>
      </Link>
    );
  }

  return (
    <nav className="flex w-full justify-between px-8 py-4">
      {/* Logo */}
      <div className="flex items-center justify-center px-4">LOGO</div>

      <menu className="bg-dark/5 flex h-13 items-center gap-0.5 rounded-full p-1">
        {tabs.map((tab) => (
          <Tab
            key={tab.id}
            id={tab.id}
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
