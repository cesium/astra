import type { Metadata } from "next";
import { Bai_Jamjuree } from "next/font/google";
import "./globals.css";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import ReactQueryProvider from "@/providers/react-query";
import clsx from "clsx";
import { DictionaryProvider } from "@/providers/dictionary-provider";
import UmamiAnalytics from "@/components/umami-analytics";

const jamjuree = Bai_Jamjuree({
  subsets: ["latin"],
  variable: "--font-jamjuree",
  weight: ["200", "300", "400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  description:
    "Exams, events and schedules. Your hub to everything for LEI and MEI!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html className="h-dvh" lang="en">
      <body className={clsx(jamjuree.variable, "font-jamjuree h-full")}>
        <ReactQueryProvider>
          <DictionaryProvider>{children}</DictionaryProvider>
          <ReactQueryDevtools initialIsOpen={false} />
        </ReactQueryProvider>
        <UmamiAnalytics />
      </body>
    </html>
  );
}
