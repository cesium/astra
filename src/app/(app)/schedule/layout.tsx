import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Schedule | Pombo",
  description: "Keep track of your timetable and don't miss a single class",
  openGraph: {
    url: "/schedule",
    type: "website",
    title: "Schedule | Pombo",
    description: "Keep track of your timetable and don't miss a single class",
    images: [
      {
        url: "/images/og.png",
        width: 1200,
        height: 630,
        alt: process.env.PROD_DOMAIN,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Schedule | Pombo",
    description: "Keep track of your timetable and don't miss a single class",
    images: [
      {
        url: "/images/og.png",
        width: 1200,
        height: 630,
        alt: process.env.PROD_DOMAIN,
      },
    ],
  },
  robots: {
    index: false,
    follow: false,
  },
};

export default function ScheduleLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
