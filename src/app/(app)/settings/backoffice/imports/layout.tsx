import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Imports | Backoffice | Pombo",
};

export default function ImportsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
