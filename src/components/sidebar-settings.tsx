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
import { useDictionary } from "@/providers/dictionary-provider";

export default function SidebarSettings() {
  const dict = useDictionary();
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
      <h3 className="pl-3 text-4xl font-semibold">{dict.settings.title}</h3>
      <Sidebar>
        <SidebarHeader>{dict.settings.sections.account.title}</SidebarHeader>

        <SidebarItemList>
          <SidebarItem id="account" href="/settings/account">
            <SidebarItemLabel
              icon="account_circle"
              label={dict.settings.sections.account.subtitle}
            />
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
                <SidebarItemLabel
                  icon="settings"
                  label={dict.settings.sections.backoffice.modules.configurations.title}
                />
              </SidebarItem>

              <SidebarItem id="exports" href="/settings/backoffice/exports">
                <SidebarItemLabel
                  icon="download"
                  label={dict.settings.sections.backoffice.modules.export.title}
                />
              </SidebarItem>

              <SidebarItem id="jobs" href="/settings/backoffice/jobs">
                <SidebarItemLabel
                  icon="data_table"
                  label={dict.settings.sections.backoffice.modules.jobs_monitor.title}
                />
              </SidebarItem>

              <SidebarItem
                id="statistics"
                href="/settings/backoffice/statistics"
              >
                <SidebarItemLabel
                  icon="insights"
                  label={dict.settings.sections.backoffice.modules.statistics.title}
                />
              </SidebarItem>

              {user.data && user.data.type === "admin" && (
                <>
                  <SidebarItem id="imports" href="/settings/backoffice/imports">
                    <SidebarItemLabel
                      icon="upload"
                      label={dict.settings.sections.backoffice.modules.import.title}
                      />
                  </SidebarItem>

                  <SidebarItem
                    id="generator"
                    href="/settings/backoffice/generator"
                  >
                    <SidebarItemLabel
                      icon="sdk"
                      label={dict.settings.sections.backoffice.modules.schedule_generator.title}
                      />
                  </SidebarItem>
                </>
              )}
            </SidebarItemList>
          </>
        )}
      </Sidebar>
    </div>
  );
}
