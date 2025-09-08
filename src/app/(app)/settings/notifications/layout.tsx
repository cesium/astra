import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Notifications | Settings | Pombo",
};

export default function NotificationsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
