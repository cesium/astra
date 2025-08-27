import type { Metadata } from "next";
import { Bai_Jamjuree } from "next/font/google";
import "./globals.css";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import ReactQueryProvider from "@/providers/react-query";
import clsx from "clsx";
import { DictionaryProvider } from "@/contexts/dictionary-provider";

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
    <html className="h-full" lang="en">
      <body className={clsx(jamjuree.variable, "font-jamjuree h-full")}>
        <ReactQueryProvider>
          <DictionaryProvider>
            {children}
            <ReactQueryDevtools initialIsOpen={false} />
          </DictionaryProvider>
        </ReactQueryProvider>
      </body>
    </html>
  );
}
