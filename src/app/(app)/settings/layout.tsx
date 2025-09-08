import SidebarSettings from "@/components/sidebar-settings";

export default function SettingsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex h-full min-h-0 w-full gap-5 lg:gap-10">
      <SidebarSettings />
      <div className="min-h-0 w-full min-w-0">{children}</div>
    </div>
  );
}
