"use client";

import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { twMerge } from "tailwind-merge";
import clsx from "clsx";
import UserDropdown from "./user-dropdown";
import Avatar from "./avatar";
import { useRouter } from "next/navigation";
import { useGetSession, useGetUserInfo } from "@/lib/queries/session";
import { useSignOut } from "@/lib/mutations/session";
import Image from "next/image";
import { firstLastName } from "@/lib/utils";
import { useDictionary } from "@/providers/dictionary-provider";

const Logo = () => (
  <Link href="/" className="flex cursor-pointer items-center gap-2">
    <Image src="/images/logo.svg" alt="Pombo Logo" width={128} height={128} />
  </Link>
);

interface ITabProps {
  name: string;
  icon: string;
  href: string;
  currentPage: string;
  isMobile?: boolean;
  anyActive?: boolean;
  onAnimationEnd?: () => void;
  bgColor?: string;
}

const tabs = [
  { name: "Events", icon: "calendar_month", href: "/" },
  {
    name: "Schedule",
    icon: "schedule",
    href: "/schedule",
  },
  {
    name: "Exchange",
    icon: "sync_alt",
    href: "/exchange",
    bgColor: "bg-celeste",
  },
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
  anyActive,
  isMobile = false,
  bgColor,
  onAnimationEnd,
}: ITabProps) {
  const isActive = href === currentPage;
  return (
    <Link
      className={`relative z-10 inline-flex w-full items-center gap-2 rounded-2xl px-4 py-2 transition-colors duration-200 ease-in-out md:w-fit md:rounded-full ${
        isActive ? "text-white" : "text-gray-600 hover:text-gray-900"
      }`}
      href={href}
      aria-current={isActive ? "page" : undefined}
      onClick={() => !anyActive && onAnimationEnd && onAnimationEnd()}
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
          className={clsx(
            "absolute inset-0 z-10 rounded-2xl shadow-sm md:rounded-full",
            bgColor || "bg-primary-400",
          )}
        />
      )}
      <span className="material-symbols-outlined z-10 text-2xl">{icon}</span>
      <p className="z-10">{name}</p>
    </Link>
  );
}

function MobileDropdown({ currentPage }: { currentPage: string }) {
  const [active, setActive] = useState(false);
  const [currentMenu, setCurrentMenu] = useState<"tabs" | "user">("tabs");
  const session = useGetSession();
  const user = useGetUserInfo();
  const signOut = useSignOut();
  const router = useRouter();

  const openDropdown = () => {
    setCurrentMenu("tabs");
    setActive(true);
  };

  return (
    <div className="flex items-center md:hidden">
      <button
        onClick={() => openDropdown()}
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
              className="bg-muted/50 fixed inset-x-2.5 top-2 z-50 rounded-4xl border border-black/5 px-2.5 py-5 shadow-xl backdrop-blur-3xl"
            >
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ delay: 0.2, duration: 0.3 }}
              >
                <div className="flex justify-between px-3.5">
                  <AnimatePresence>
                    {currentMenu === "tabs" ? (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ delay: 0.15, duration: 0.3 }}
                      >
                        <Logo />
                      </motion.div>
                    ) : (
                      <motion.button
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setCurrentMenu("tabs")}
                        className="material-symbols-outlined h-8 cursor-pointer text-2xl"
                      >
                        arrow_back
                      </motion.button>
                    )}
                  </AnimatePresence>

                  <button
                    onClick={() => setActive(false)}
                    className="material-symbols-outlined cursor-pointer text-2xl transition-all duration-200 hover:rotate-90 hover:opacity-50"
                  >
                    close
                  </button>
                </div>

                {currentMenu === "tabs" && session.data && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    transition={{ delay: 0.2, duration: 0.2 }}
                    className="mt-6 space-y-3.5"
                  >
                    {session.data.signedIn && (
                      <TabsContainer currentPage={currentPage}>
                        {tabs.map((tab) => (
                          <Tab
                            key={tab.href}
                            name={tab.name}
                            icon={tab.icon}
                            href={tab.href}
                            currentPage={currentPage}
                            anyActive={tabs.some((t) => t.href === currentPage)}
                            isMobile={true}
                            onAnimationEnd={() => setActive(false)}
                            bgColor={tab.bgColor}
                          />
                        ))}
                      </TabsContainer>
                    )}
                    {session.data.signedIn ? (
                      user.data ? (
                        <button
                          onClick={() => setCurrentMenu("user")}
                          className="flex cursor-pointer items-center gap-2 pl-3.5 focus:outline-none"
                        >
                          <Avatar name={user.data.name} className="" />
                          <span className="text-dark/50">
                            {firstLastName(user.data.name)}
                          </span>
                        </button>
                      ) : (
                        <div className="flex items-center gap-3">
                          <div className="bg-dark/10 h-10 w-10 animate-pulse rounded-full" />
                          <div className="bg-dark/10 h-4 w-24 animate-pulse rounded-md" />
                        </div>
                      )
                    ) : (
                      <Link
                        href="/auth/sign_in"
                        className="text-primary-400 flex items-center gap-3 pl-3.5"
                      >
                        <div className="bg-primary-400 flex items-center justify-center rounded-full p-0.5 text-center align-middle">
                          <span className="material-symbols-outlined text-3xl text-white">
                            add
                          </span>
                        </div>
                        Sign in
                      </Link>
                    )}
                  </motion.div>
                )}

                {currentMenu === "user" && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.2 }}
                    className="p-2.5"
                  >
                    <div className="flex items-center gap-2">
                      <Avatar className="size-14" name={user.data?.name} />
                      <span className="text-dark/50">
                        {firstLastName(user.data?.name)}
                      </span>
                    </div>
                    <div className="my-3.5 border-b border-black/10" />
                    <div className="flex flex-col gap-2">
                      <Link
                        href="/settings/account"
                        className="text-dark flex items-center gap-2"
                        onClick={() => setActive(false)}
                      >
                        <span className="material-symbols-outlined text-2xl">
                          settings
                        </span>
                        Settings
                      </Link>
                      <button
                        onClick={() =>
                          signOut.mutate(undefined, {
                            onSuccess: () => {
                              router.push("/");
                              setActive(false);
                            },
                          })
                        }
                        className="text-danger flex cursor-pointer items-center gap-2"
                      >
                        <span className="material-symbols-outlined text-2xl">
                          logout
                        </span>
                        Sign out
                      </button>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function Navbar() {
  const d = useDictionary()
  const currentPage = usePathname();
  const session = useGetSession();
  const { data: user } = useGetUserInfo();
  const userHasPrivileges =
    user?.type === "admin" || user?.type === "professor";

  return (
    <nav
      className={`grid w-full ${!session.data?.signedIn || !user || ["admin", "professor"].includes(user.type) ? "grid-cols-2" : "grid-cols-3"} items-center px-5 py-4 md:h-20 md:px-10`}
    >
      <div className="flex items-center">
        <Logo />
      </div>

      {session.data?.signedIn && !userHasPrivileges && (
        <div className="flex justify-center">
          <TabsContainer currentPage={currentPage} className="hidden md:flex">
            {tabs.map((tab) => (
              <Tab
                key={tab.href}
                name={tab.name}
                icon={tab.icon}
                href={tab.href}
                bgColor={tab.bgColor}
                currentPage={currentPage}
                isMobile={false}
              />
            ))}
          </TabsContainer>
        </div>
      )}

      <div>
        {d.calendar.day}
      </div>

      <div className="flex items-center justify-end">
        {/* User dropdown */}
        <div className="hidden md:block">
          <UserDropdown />
        </div>

        <MobileDropdown currentPage={currentPage} />
      </div>
    </nav>
  );
}
