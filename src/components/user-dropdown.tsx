"use client";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import Avatar from "./avatar";
import Card from "./card";
import { useEffect, useState } from "react";
import { User } from "@/lib/types";
import { api } from "@/lib/api";
import { set } from "zod";
import Link from "next/link";
import { useRouter } from "next/navigation";

const UserDropdown = () => {
  const [user, setUser] = useState<User>();
  const router = useRouter();

  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await api.get("/auth/me");
        setUser(res.data.user);
      } catch (error) {
        setUser(undefined);
        // console.error("Error fetching user:", error);
      }
    }

    fetchUser();
  }, []);

  async function signOut() {
    try {
      await api.post("/auth/sign_out");
      setUser(undefined);
      router.push("/");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  }

  return user ? (
    <Menu>
      <MenuButton className="flex items-center gap-2 focus:outline-none">
        <span className="text-dark/50">{user ? user.name : "Loading..."}</span>
        <Avatar name={user?.name} className="" />
      </MenuButton>
      <MenuItems
        as={Card}
        // className="max-w-96 gap-4 rounded-2xl border border-black/10 bg-[#F7F7F7]/50 p-5 shadow-[0px_0px_30px_0px] shadow-black/5 backdrop-blur-xl"
        className="border-dark/10 z-50 mx-6 mt-2 w-96 focus:outline-none"
        anchor="bottom end"
      >
        <MenuItem as="div" className="flex items-center gap-2">
          <Avatar className="size-14" name={user?.name} />
          {user?.name}
        </MenuItem>
        <div className="my-2 border-b border-black/10" />
        <div className="flex flex-col gap-2">
          <MenuItem
            as={Link}
            href="/settings"
            className="flex items-center gap-2"
          >
            <span className="material-symbols-outlined text-2xl">settings</span>
            Settings
          </MenuItem>
          <MenuItem
            as="button"
            onClick={signOut}
            className="text-danger flex items-center gap-2"
          >
            <span className="material-symbols-outlined text-2xl">logout</span>
            Sign out
          </MenuItem>
        </div>
      </MenuItems>
    </Menu>
  ) : (
    // <div>
    <Link href="/auth/sign_in" className="text-dark/50">
      Sign in
    </Link>
  );
  // </div>
};

export default UserDropdown;
