import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Configurations | Backoffice | Pombo",
};

export default function ConfigurationsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
