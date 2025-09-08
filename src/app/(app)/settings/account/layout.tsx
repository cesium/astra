import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Account | Settings | Pombo",
};

export default function AccountLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
