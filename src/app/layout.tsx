import type { Metadata } from "next";
import { Bai_Jamjuree } from "next/font/google";
import "./globals.css";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import ReactQueryProvider from "@/providers/react-query";
import clsx from "clsx";

const jamjuree = Bai_Jamjuree({
  subsets: ["latin"],
  variable: "--font-jamjuree",
  weight: ["200", "300", "400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://pombo.di.uminho.pt"),
  title: "Pombo",
  description: "Your hub for everything LEI and MEI",
  keywords: [
    "uminho",
    "university of minho",
    "universidade do minho",
    "lei",
    "mei",
    "informática",
    "engenharia informática",
    "software",
    "computer science",
    "software engineering",
    "students",
    "student",
    "hub",
    "portal",
    "schedule",
    "timetable",
    "calendar",
    "events",
    "schedule",
    "shifts",
    "exchange",
  ],
  robots: {
    index: true,
    follow: true,
    "max-image-preview": "large",
    "max-snippet": -1,
    "max-video-preview": -1,
    googleBot: "index, follow",
  },
  applicationName: "Pombo",
  appleWebApp: {
    title: "Pombo",
    statusBarStyle: "default",
    capable: true,
  },
  icons: {
    icon: [
      {
        url: "/icons/favicon-16x16.png",
        sizes: "16x16",
        type: "image/png",
      },
      {
        url: "/icons/favicon-32x32.png",
        sizes: "32x32",
        type: "image/png",
      },
      {
        url: "/icons/favicon-48x48.png",
        sizes: "48x48",
        type: "image/png",
      },
      {
        url: "/icons/favicon-64x64.png",
        sizes: "64x64",
        type: "image/png",
      },
      {
        url: "/icons/favicon-96x96.png",
        sizes: "96x96",
        type: "image/png",
      },
      {
        url: "/icons/android/android-launchericon-192-192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        url: "/icons/android/android-launchericon-512-512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
    apple: [
      {
        url: "/icons/ios/60.png",
        sizes: "60x60",
        type: "image/png",
      },
      {
        url: "/icons/ios/76.png",
        sizes: "76x76",
        type: "image/png",
      },
      {
        url: "/icons/ios/120.png",
        sizes: "120x120",
        type: "image/png",
      },
      {
        url: "/icons/ios/152.png",
        sizes: "152x152",
        type: "image/png",
      },
      {
        url: "/icons/ios/167.png",
        sizes: "167x167",
        type: "image/png",
      },
      {
        url: "/icons/ios/180.png",
        sizes: "180x180",
        type: "image/png",
      },
      {
        url: "/icons/ios/512.png",
      },
    ],
  },
  openGraph: {
    siteName: "Pombo",
    locale: "en",
    url: "/",
    type: "website",
    title: "Pombo",
    description: "Your hub for everything LEI and MEI",
    images: [
      {
        url: "/images/og.png",
        width: 1200,
        height: 630,
        alt: "pombo.di.uminho.pt",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Pombo",
    description: "Your hub for everything LEI and MEI",
    images: [
      {
        url: "/images/og.png",
        width: 1200,
        height: 630,
        alt: "pombo.di.uminho.pt",
      },
    ],
  },
  alternates: {
    canonical: "/",
  },
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
          {children}
          <ReactQueryDevtools initialIsOpen={false} />
        </ReactQueryProvider>
      </body>
    </html>
  );
}
