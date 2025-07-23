import Sidebar from "@/components/sidebar";
import { SidebarHeader, SidebarItem, SidebarItemLabel, SidebarItemList } from "@/components/sidebar";

export default function SettingsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex">
        <div className="flex flex-col w-80">
            <h3 className="text-4xl font-semibold pl-3">Settings</h3>
            <Sidebar>
                <SidebarHeader>Account</SidebarHeader>
            
                <SidebarItemList>
                    <SidebarItem id="account" href="/settings">
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
            </Sidebar>
        </div>

        <div className="px-10">
            {children}
        </div>
    </div>
  );
}