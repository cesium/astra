import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Preferences | Settings | Pombo",
};

export default function PreferencesLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
