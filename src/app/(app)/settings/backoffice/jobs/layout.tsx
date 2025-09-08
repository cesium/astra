import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Jobs | Backoffice | Pombo",
};

export default function JobsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
