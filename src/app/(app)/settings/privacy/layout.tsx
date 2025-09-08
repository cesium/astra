import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy | Settings | Pombo",
};

export default function PrivacyLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
