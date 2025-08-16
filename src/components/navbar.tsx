"use client";

import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import { usePathname } from "next/navigation";
import { use, useState } from "react";
import { twMerge } from "tailwind-merge";
import clsx from "clsx";
import UserDropdown from "./user-dropdown";
import Avatar from "./avatar";
import { UserContext } from "@/contexts/user-provider";

const Logo = () => (
  <div className="flex items-center gap-2">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="32"
      height="32"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="lucide lucide-bird-icon lucide-bird stroke-primary-400 size-8"
    >
      <path d="M16 7h.01" />
      <path d="M3.4 18H12a8 8 0 0 0 8-8V7a4 4 0 0 0-7.28-2.3L2 20" />
      <path d="m20 7 2 .5-2 .5" />
      <path d="M10 18v3" />
      <path d="M14 17.75V21" />
      <path d="M7 18a6 6 0 0 0 3.84-10.61" />
    </svg>
    <span className="text-xl font-bold select-none">pombo</span>
  </div>
);

interface ITabProps {
  name: string;
  icon: string;
  href: string;
  currentPage: string;
  isMobile?: boolean;
  onAnimationEnd?: () => void;
}

const tabs = [
  { name: "Events", icon: "calendar_month", href: "/" },
  {
    name: "Schedule",
    icon: "schedule",
    href: "/schedule",
  },
  { name: "Exchange", icon: "sync_alt", href: "/exchange" },
];

function TabsContainer({
  currentPage,
  children,
  className,
}: {
  currentPage: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <menu
      key={currentPage}
      className={twMerge(
        clsx(
          "bg-dark/5 relative z-10 flex h-fit flex-col items-center gap-0.5 rounded-2xl p-1 md:flex-row md:rounded-full",
          className,
        ),
      )}
    >
      {children}
    </menu>
  );
}

function Tab({
  name,
  icon,
  href,
  currentPage,
  isMobile = false,
  onAnimationEnd,
}: ITabProps & {}) {
  const isActive = href === currentPage;

  return (
    <Link
      className={`relative z-10 inline-flex w-full items-center gap-2 rounded-2xl px-4 py-2 transition-colors duration-200 ease-in-out md:w-fit md:rounded-full ${
        isActive ? "text-white" : "text-gray-600 hover:text-gray-900"
      }`}
      href={href}
      aria-current={isActive ? "page" : undefined}
    >
      {isActive && (
        <motion.div
          key={`tab-${href}-${isMobile ? "mobile" : "desktop"}`}
          layoutId={isMobile ? "activeTabMobile" : "activeTabDesktop"}
          transition={{
            type: "spring",
            bounce: 0.3,
            duration: 0.6,
          }}
          onLayoutAnimationComplete={onAnimationEnd}
          className="bg-primary-400 absolute inset-0 z-10 rounded-2xl shadow-sm md:rounded-full"
        />
      )}
      <span className="material-symbols-outlined z-10 text-2xl">{icon}</span>
      <p className="z-10">{name}</p>
    </Link>
  );
}

function MobileDropdown({ currentPage }: { currentPage: string }) {
  const [active, setActive] = useState(false);
  const { user } = use(UserContext);

  return (
    <div className="flex items-center md:hidden">
      <button
        onClick={() => setActive(true)}
        className="material-symbols-outlined cursor-pointer text-2xl hover:opacity-50"
      >
        menu
      </button>

      <AnimatePresence>
        {active && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="bg-light/30 fixed inset-0 z-30 backdrop-blur-md"
              onClick={() => setActive(false)}
            />

            <motion.div
              initial={{
                opacity: 0,
                y: -20,
                scale: 0.95,
              }}
              animate={{
                opacity: 1,
                y: 0,
                scale: 1,
              }}
              exit={{
                opacity: 0,
                y: -20,
                scale: 0.95,
              }}
              transition={{
                type: "spring",
                duration: 0.4,
                bounce: 0.2,
                ease: [0.4, 0, 0.2, 1],
              }}
              className="bg-muted/50 fixed inset-x-2.5 top-2 z-50 h-72 rounded-4xl border border-black/5 px-2.5 py-5 shadow-xl backdrop-blur-3xl"
            >
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ delay: 0.2, duration: 0.3 }}
              >
                <div className="flex justify-between px-3.5">
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.15, duration: 0.3 }}
                  >
                    <Logo />
                  </motion.div>

                  <button
                    onClick={() => setActive(false)}
                    className="material-symbols-outlined cursor-pointer text-2xl transition-all duration-200 hover:rotate-90 hover:opacity-50"
                  >
                    close
                  </button>
                </div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.4 }}
                  className="mt-6 space-y-2"
                >
                  <TabsContainer currentPage={currentPage}>
                    {tabs.map((tab) => (
                      <Tab
                        key={tab.href}
                        name={tab.name}
                        icon={tab.icon}
                        href={tab.href}
                        currentPage={currentPage}
                        isMobile={true}
                        onAnimationEnd={() => setActive(false)}
                      />
                    ))}
                  </TabsContainer>
                </motion.div>
              </motion.div>
              <div className="flex cursor-pointer items-center gap-2 focus:outline-none">
                <span className="text-dark/50">
                  {user ? user.name : "Loading..."}
                </span>
                <Avatar name={user?.name} className="" />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function Navbar() {
  const currentPage = usePathname();

  return (
    <nav className="flex w-full items-center justify-between px-5 py-4 md:px-10">
      <Logo />

      <TabsContainer currentPage={currentPage} className="hidden md:flex">
        {tabs.map((tab) => (
          <Tab
            key={tab.href}
            name={tab.name}
            icon={tab.icon}
            href={tab.href}
            currentPage={currentPage}
            isMobile={false}
          />
        ))}
      </TabsContainer>

      {/* User dropdown */}
      <div className="hidden md:block">
        <UserDropdown />
      </div>

      <MobileDropdown currentPage={currentPage} />
    </nav>
  );
}
