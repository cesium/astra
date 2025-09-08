import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Exports | Backoffice | Pombo",
};

export default function ExportsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
