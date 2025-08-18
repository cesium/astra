"use client";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import Avatar from "./avatar";
import { use } from "react";
import { api } from "@/lib/api";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { UserContext } from "@/contexts/user-provider";
import { useAuthStore } from "@/stores/authStore";

const UserDropdown = () => {
  const router = useRouter();
  const { user } = use(UserContext);
  const { signedIn, clearToken } = useAuthStore();

  async function signOut() {
    try {
      await api.post("/auth/sign_out");

      clearToken();

      router.push("/");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  }

  if (signedIn === undefined || user === undefined) {
    return (
      <div className="flex items-center gap-3">
        <div className="bg-dark/10 h-4 w-24 animate-pulse rounded-md" />
        <div className="bg-dark/10 h-10 w-10 animate-pulse rounded-full" />
      </div>
    );
  }

  return signedIn ? (
    <Menu as="div">
      {({ open }) => (
        <>
          <MenuButton className="flex cursor-pointer items-center gap-2 focus:outline-none">
            <span className="text-dark/50">{user.name}</span>
            <Avatar name={user.name} />
          </MenuButton>
          <AnimatePresence>
            {open && (
              <MenuItems
                static
                as={motion.div}
                initial={{
                  opacity: 0,
                  y: -20,
                  scale: 0.95,
                  transition: {
                    type: "spring",
                    duration: 0.4,
                    bounce: 0.2,
                    ease: [0.4, 0, 0.2, 1],
                  },
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                  scale: 1,
                  transition: {
                    type: "spring",
                    duration: 0.4,
                    bounce: 0.2,
                    ease: [0.4, 0, 0.2, 1],
                  },
                }}
                exit={{
                  opacity: 0,
                  y: -20,
                  scale: 0.95,
                  transition: {
                    type: "spring",
                    duration: 0.4,
                    bounce: 0.2,
                    ease: [0.4, 0, 0.2, 1],
                  },
                }}
                className="bg-muted/50 drop-shadow-dark/5 border-dark/10 z-50 mx-6 mt-2 w-96 origin-top rounded-2xl border p-4 drop-shadow-2xl backdrop-blur-3xl focus:outline-0"
                anchor="bottom end"
              >
                <MenuItem as="div" className="flex items-center gap-2">
                  <Avatar className="size-14" name={user.name} />
                  <span className="text-dark/50">{user.name}</span>
                </MenuItem>
                <div className="my-3.5 border-b border-black/10" />
                <div className="flex flex-col gap-2">
                  <MenuItem
                    as={Link}
                    href="/settings"
                    className="text-dark flex items-center gap-2"
                  >
                    <span className="material-symbols-outlined text-2xl">
                      settings
                    </span>
                    Settings
                  </MenuItem>
                  <MenuItem
                    as="button"
                    onClick={signOut}
                    className="text-danger flex cursor-pointer items-center gap-2"
                  >
                    <span className="material-symbols-outlined text-2xl">
                      logout
                    </span>
                    Sign out
                  </MenuItem>
                </div>
              </MenuItems>
            )}
          </AnimatePresence>
        </>
      )}
    </Menu>
  ) : (
    <Link
      href="/auth/sign_in"
      className="text-primary-400 flex items-center gap-3"
    >
      Sign in
      <div className="bg-primary-400 flex items-center justify-center rounded-full p-0.5 text-center align-middle">
        <span className="material-symbols-outlined text-3xl text-white">
          add
        </span>
      </div>
    </Link>
  );
};

export default UserDropdown;
