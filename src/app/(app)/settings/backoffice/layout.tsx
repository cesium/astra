import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Backoffice | Pombo",
};

export default function BackofficeLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
