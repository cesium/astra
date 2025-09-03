import Sidebar from "@/components/sidebar";
import {
  SidebarHeader,
  SidebarItem,
  SidebarItemLabel,
  SidebarItemList,
} from "@/components/sidebar";

export default function SettingsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex h-full min-h-0 w-full gap-5 lg:gap-10">
      <div className="hidden w-60 shrink-0 flex-col md:flex lg:w-80">
        <h3 className="pl-3 text-4xl font-semibold">Settings</h3>
        <Sidebar>
          <SidebarHeader>Account</SidebarHeader>

          <SidebarItemList>
            <SidebarItem id="account" href="/settings/account">
              <SidebarItemLabel icon="account_circle" label="Your Account" />
            </SidebarItem>

            <SidebarItem id="privacy" href="/settings/privacy">
              <SidebarItemLabel icon="back_hand" label="Privacy" />
            </SidebarItem>

            <SidebarItem id="preferences" href="/settings/preferences">
              <SidebarItemLabel icon="sync_alt" label="Preferences" />
            </SidebarItem>
          </SidebarItemList>

          <SidebarHeader>General</SidebarHeader>

          <SidebarItemList>
            <SidebarItem id="connections" href="/settings/connections">
              <SidebarItemLabel icon="handshake" label="Connections" />
            </SidebarItem>

            <SidebarItem id="notifications" href="/settings/notifications">
              <SidebarItemLabel icon="notifications" label="Notifications" />
            </SidebarItem>
          </SidebarItemList>

          {/* Backoffice Options */}
          <SidebarHeader>Backoffice</SidebarHeader>

          <SidebarItemList>
            <SidebarItem
              id="configurations"
              href="/settings/backoffice/configurations"
            >
              <SidebarItemLabel icon="settings" label="Configurations" />
            </SidebarItem>

            <SidebarItem id="imports" href="/settings/backoffice/imports">
              <SidebarItemLabel icon="move_to_inbox" label="Import" />
            </SidebarItem>

            <SidebarItem id="exports" href="/settings/backoffice/exports">
              <SidebarItemLabel icon="ios_share" label="Export" />
            </SidebarItem>
          </SidebarItemList>
        </Sidebar>
      </div>

      <div className="min-h-0 w-full min-w-0">{children}</div>
    </div>
  );
}
