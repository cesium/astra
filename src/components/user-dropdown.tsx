"use client";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import Avatar from "./avatar";
import Card from "./card";

const UserDropdown = () => {
  return (
    <Menu>
      <MenuButton className="flex items-center gap-2">
        <span className="text-dark/50">User Name</span>
        <Avatar name="User Name" />
      </MenuButton>
      <MenuItems
        as={Card}
        // className="max-w-96 gap-4 rounded-2xl border border-black/10 bg-[#F7F7F7]/50 p-5 shadow-[0px_0px_30px_0px] shadow-black/5 backdrop-blur-xl"
        className="border-dark/10 mt-2 max-w-80"
        anchor="bottom"
      >
        <MenuItem as="div" className="flex items-center gap-2">
          <Avatar className="size-10" name="User Name" />
          User Name
        </MenuItem>
        <div className="my-2 border-b border-black/10" />
        <div className="flex flex-col gap-2">
          <MenuItem as="div" className="flex items-center gap-2">
            <span className="material-symbols-outlined text-2xl">settings</span>
            Settings
          </MenuItem>
          <MenuItem as="div" className="text-danger flex items-center gap-2">
            <span className="material-symbols-outlined text-2xl">logout</span>
            Sign out
          </MenuItem>
        </div>
      </MenuItems>
    </Menu>
  );
};

export default UserDropdown;
