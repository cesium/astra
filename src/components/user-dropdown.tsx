import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import Avatar from "./avatar";

export const UserDropdown = () => {
  return (
    <Menu>
      <MenuButton className="flex items-center gap-2">
        <span className="text-sm font-semibold">User Name</span>
      </MenuButton>
      <MenuItems className="bg-muted border border-black/10 rounded-2xl max-w-96 p-6 gap-4">
        <MenuItem as="div" className="flex gap-2 items-center">
          <Avatar className="size-10" name="teste a" />
          Teste eee
        </MenuItem>
        <div className="border-b border-black/10 my-2" />
        <div className="flex flex-col gap-2">

        <MenuItem as="div" className="flex gap-2 items-center">
          <span className="material-symbols-outlined">settings</span>
          Settings
        </MenuItem>
        <MenuItem as="div" className="flex gap-2 items-center">
          <span className="material-symbols-outlined">logout</span>
          Logout
        </MenuItem>
        </div>
      </MenuItems>
    </Menu>
  );
};
