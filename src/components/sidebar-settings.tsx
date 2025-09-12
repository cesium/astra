"use client";

import { usePathname } from "next/navigation";
import Sidebar, {
  SidebarHeader,
  SidebarItem,
  SidebarItemLabel,
  SidebarItemList,
} from "./sidebar";
import { twMerge } from "tailwind-merge";
import clsx from "clsx";
import { useGetUserInfo } from "@/lib/queries/session";

export default function SidebarSettings() {
  const path = usePathname();
  const user = useGetUserInfo();

  return (
    <div
      className={twMerge(
        clsx(
          "w-full shrink-0 flex-col md:w-60 lg:w-80",
          path === "/settings" ? "flex" : "hidden md:flex",
        ),
      )}
    >
      <h3 className="pl-3 text-4xl font-semibold">Settings</h3>
      <Sidebar>
        <SidebarHeader>Account</SidebarHeader>

        <SidebarItemList>
          <SidebarItem id="account" href="/settings/account">
            <SidebarItemLabel icon="account_circle" label="Your Account" />
          </SidebarItem>

          <SidebarItem id="preferences" href="/settings/preferences">
            <SidebarItemLabel icon="sync_alt" label="Preferences" />
          </SidebarItem>
        </SidebarItemList>

        {user.data && ["admin", "professor"].includes(user.data.type) && (
          <>
            <SidebarHeader>Backoffice</SidebarHeader>

            <SidebarItemList>
              <SidebarItem
                id="configurations"
                href="/settings/backoffice/configurations"
              >
                <SidebarItemLabel icon="settings" label="Configurations" />
              </SidebarItem>

              <SidebarItem id="imports" href="/settings/backoffice/imports">
                <SidebarItemLabel icon="upload" label="Import" />
              </SidebarItem>

              <SidebarItem id="exports" href="/settings/backoffice/exports">
                <SidebarItemLabel icon="download" label="Export" />
              </SidebarItem>

              <SidebarItem id="jobs" href="/settings/backoffice/jobs">
                <SidebarItemLabel icon="data_table" label="Jobs Monitor" />
              </SidebarItem>

              <SidebarItem id="generator" href="/settings/backoffice/generator">
                <SidebarItemLabel icon="sdk" label="Schedule Generetor" />
              </SidebarItem>
            </SidebarItemList>
          </>
        )}
      </Sidebar>
    </div>
  );
}
