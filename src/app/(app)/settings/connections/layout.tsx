import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Connections | Settings | Pombo",
};

export default function ConnectionsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
