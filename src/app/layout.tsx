import type { Metadata } from "next";
import { Bai_Jamjuree } from "next/font/google";
import "./globals.css";

const jamjuree = Bai_Jamjuree({
  subsets: ["latin"],
  variable: "--font-jamjuree",
  weight: ["200", "300", "400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Pombo",
  description:
    "Exams, events and schedules. Your hub to everything for LEI and MEI!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${jamjuree.variable} font-jamjuree h-full`}>
        {children}
      </body>
    </html>
  );
}
